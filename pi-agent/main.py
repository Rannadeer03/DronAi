import asyncio
import logging

import config
import identity
from backend_client import BackendClient
from local_log import LocalLog
from mavlink_client import MavlinkClient

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("dronai.agent")


class Agent:
    def __init__(self) -> None:
        self.mavlink = MavlinkClient(config.MAVLINK_CONNECTION)
        self.local_log = LocalLog(config.LOCAL_DB_PATH)
        private_key = identity.load(config.KEY_PATH)
        self.backend = BackendClient(config.BACKEND_WS_URL, config.DEVICE_UID, private_key)
        self._prev_armed: bool | None = None
        self._prev_connected: bool | None = None
        self._prev_gps_fix = None

    async def log_event(self, event_type: str, level: str = "info", message: str | None = None, metadata: dict | None = None) -> None:
        sent = False
        if self.backend.connected:
            try:
                sent = await self.backend.send_log_event(event_type, level, message, metadata)
            except Exception:
                sent = False
        if not sent:
            self.local_log.buffer(event_type, level, message, metadata)

    async def flush_local_log(self) -> None:
        pending = self.local_log.unsynced()
        synced_ids = []
        for row in pending:
            try:
                await self.backend.send_log_event(row["event_type"], row["level"], row["message"], row["metadata"])
                synced_ids.append(row["id"])
            except Exception:
                break
        self.local_log.mark_synced(synced_ids)

    async def on_connected(self) -> None:
        logger.info("connected to backend, flushing buffered logs")
        await self.flush_local_log()

    async def on_command(self, command: str) -> tuple[bool, str | None]:
        await self.log_event(f"{command}_REQUEST")
        loop = asyncio.get_event_loop()
        action = self.mavlink.arm if command == "ARM" else self.mavlink.disarm
        success, reason = await loop.run_in_executor(None, action)
        if success:
            await self.log_event(f"{command}_SUCCESS")
        else:
            await self.log_event(f"{command}_FAILED", level="warning", message=reason)
        return success, reason

    async def telemetry_loop(self) -> None:
        while True:
            await asyncio.sleep(config.TELEMETRY_INTERVAL_SECONDS)
            snapshot = self.mavlink.snapshot()
            await self._detect_transitions(snapshot)
            if self.backend.connected:
                try:
                    await self.backend.send_telemetry(snapshot)
                except Exception:
                    logger.exception("failed to send telemetry")

    async def _detect_transitions(self, snapshot: dict) -> None:
        armed = snapshot.get("armed")
        connected = snapshot.get("connected")
        gps_fix = snapshot.get("gps_fix")

        if connected != self._prev_connected:
            if connected:
                await self.log_event("PIXHAWK_CONNECTED")
            elif self._prev_connected is not None:
                await self.log_event("PIXHAWK_DISCONNECTED", level="warning")
            self._prev_connected = connected

        if gps_fix != self._prev_gps_fix and self._prev_gps_fix is not None:
            await self.log_event("GPS_STATUS_CHANGED", message=f"fix_type={gps_fix}")
        self._prev_gps_fix = gps_fix

        if armed != self._prev_armed and self._prev_armed is not None:
            # Catches armed-state changes we didn't command ourselves — RC
            # transmitter arm switch, ArduCopter's own ground-idle
            # auto-disarm, failsafe disarm. Logging unconditionally on every
            # observed transition (rather than only inside on_command) means
            # the log reflects what the flight controller actually did, not
            # just what we asked it to do. Harmless if it duplicates an
            # ARM_SUCCESS/DISARM_SUCCESS from a command we just issued.
            await self.log_event("ARMED" if armed else "DISARMED", message="Observed via telemetry")
        self._prev_armed = armed

    async def run(self) -> None:
        await self.log_event("DEVICE_STARTED")
        self.mavlink.connect()
        self.mavlink.start()
        # PIXHAWK_CONNECTED itself is logged by _detect_transitions on the
        # first telemetry tick (prev_connected starts at None) — no need to
        # log it again here too.

        await asyncio.gather(
            self.backend.run_forever(self.on_connected, self.on_command),
            self.telemetry_loop(),
        )


if __name__ == "__main__":
    asyncio.run(Agent().run())
