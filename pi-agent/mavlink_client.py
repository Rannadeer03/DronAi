"""Owns the single MAVLink connection to Pixhawk (or SITL).

Only one thread ever calls `recv_match` on the underlying connection —
pymavlink connections are not safe for concurrent reads from multiple
threads. Everything else (telemetry snapshot, ARM/DISARM ack waiting) goes
through a per-message "waiter queue" registered against this one reader
thread, so a protocol exchange (waiting for a COMMAND_ACK) can never steal
a message the telemetry loop needed, or vice versa.
"""

import math
import queue
import threading
import time
from dataclasses import dataclass, field
from typing import Callable, Optional

from pymavlink import mavutil

ARM_COMMAND = mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM
ARMED_BIT = mavutil.mavlink.MAV_MODE_FLAG_SAFETY_ARMED


@dataclass
class _Waiter:
    predicate: Optional[Callable[[object], bool]]
    q: "queue.Queue[object]" = field(default_factory=lambda: queue.Queue(maxsize=1))


class MavlinkClient:
    def __init__(self, connection_string: str, baud: int = 57600) -> None:
        self.connection_string = connection_string
        self.baud = baud
        self.master = None
        self._state: dict = {"connected": False, "armed": False}
        self._state_lock = threading.Lock()
        self._waiters: dict[str, list[_Waiter]] = {}
        self._waiters_lock = threading.Lock()
        self._last_statustext: Optional[str] = None
        self._running = False
        self._thread: Optional[threading.Thread] = None

    def connect(self, heartbeat_timeout: float = 30.0) -> None:
        # baud is ignored by pymavlink for udp:/tcp: connection strings and
        # only consumed for real serial devices, so passing it unconditionally
        # is safe for both SITL/network and hardware connections.
        self.master = mavutil.mavlink_connection(self.connection_string, baud=self.baud)
        # wait_heartbeat() returns None on timeout instead of raising, so a
        # dead/unwired link would otherwise fall through and get marked
        # connected — main.py has no try/except around connect(), and relies
        # on this raising to trigger the systemd crash-restart loop.
        heartbeat = self.master.wait_heartbeat(timeout=heartbeat_timeout)
        if heartbeat is None:
            raise TimeoutError(
                f"no MAVLink heartbeat received within {heartbeat_timeout}s "
                f"on {self.connection_string!r}"
            )
        with self._state_lock:
            self._state["connected"] = True

    def start(self) -> None:
        self._running = True
        self._thread = threading.Thread(target=self._read_loop, daemon=True)
        self._thread.start()

    def stop(self) -> None:
        self._running = False

    def _read_loop(self) -> None:
        while self._running:
            msg = self.master.recv_match(blocking=True, timeout=1)
            if msg is None:
                continue
            self._update_state(msg)
            self._dispatch_waiters(msg)

    def _update_state(self, msg) -> None:
        msg_type = msg.get_type()
        with self._state_lock:
            self._state["connected"] = True
            if msg_type == "HEARTBEAT":
                self._state["armed"] = bool(msg.base_mode & ARMED_BIT)
            elif msg_type == "GLOBAL_POSITION_INT":
                self._state["lat"] = msg.lat / 1e7
                self._state["lon"] = msg.lon / 1e7
                self._state["alt_m"] = msg.relative_alt / 1000.0
                if msg.hdg != 65535:
                    self._state["heading_deg"] = msg.hdg / 100.0
            elif msg_type == "VFR_HUD":
                self._state["ground_speed_ms"] = msg.groundspeed
                self._state["heading_deg"] = msg.heading
            elif msg_type == "GPS_RAW_INT":
                self._state["gps_fix"] = msg.fix_type
                self._state["satellites"] = msg.satellites_visible
            elif msg_type == "ATTITUDE":
                self._state["roll_deg"] = math.degrees(msg.roll)
                self._state["pitch_deg"] = math.degrees(msg.pitch)
                self._state["yaw_deg"] = math.degrees(msg.yaw)
            elif msg_type == "SYS_STATUS":
                self._state["battery_voltage"] = msg.voltage_battery / 1000.0
                if msg.battery_remaining != -1:
                    self._state["battery_pct"] = msg.battery_remaining
            elif msg_type == "STATUSTEXT":
                if msg.severity <= mavutil.mavlink.MAV_SEVERITY_WARNING:
                    self._last_statustext = msg.text

    def _dispatch_waiters(self, msg) -> None:
        msg_type = msg.get_type()
        with self._waiters_lock:
            waiters = self._waiters.get(msg_type, [])
            for waiter in waiters:
                if waiter.predicate is None or waiter.predicate(msg):
                    try:
                        waiter.q.put_nowait(msg)
                    except queue.Full:
                        pass

    def _wait_for(self, msg_type: str, predicate=None, timeout: float = 2.0):
        waiter = _Waiter(predicate=predicate)
        with self._waiters_lock:
            self._waiters.setdefault(msg_type, []).append(waiter)
        try:
            return waiter.q.get(timeout=timeout)
        except queue.Empty:
            return None
        finally:
            with self._waiters_lock:
                self._waiters[msg_type].remove(waiter)

    def snapshot(self) -> dict:
        with self._state_lock:
            return dict(self._state)

    def last_statustext(self) -> Optional[str]:
        return self._last_statustext

    def _arm_disarm(self, arm: bool) -> tuple[bool, Optional[str]]:
        self._last_statustext = None
        self.master.mav.command_long_send(
            self.master.target_system,
            self.master.target_component,
            ARM_COMMAND,
            0,
            1 if arm else 0,
            0, 0, 0, 0, 0, 0,
        )

        ack = self._wait_for(
            "COMMAND_ACK", predicate=lambda m: m.command == ARM_COMMAND, timeout=2.0
        )
        if ack is None:
            return False, "no COMMAND_ACK received from flight controller"
        if ack.result != mavutil.mavlink.MAV_RESULT_ACCEPTED:
            result_name = mavutil.mavlink.enums["MAV_RESULT"].get(ack.result)
            reason = self.last_statustext() or (result_name.name if result_name else f"MAV_RESULT={ack.result}")
            return False, reason

        confirmed = self._wait_for(
            "HEARTBEAT",
            predicate=lambda m: bool(m.base_mode & ARMED_BIT) == arm,
            timeout=3.0,
        )
        if confirmed is None:
            reason = self.last_statustext() or "flight controller did not report the expected armed state"
            return False, reason

        return True, None

    def arm(self) -> tuple[bool, Optional[str]]:
        return self._arm_disarm(True)

    def disarm(self) -> tuple[bool, Optional[str]]:
        return self._arm_disarm(False)
