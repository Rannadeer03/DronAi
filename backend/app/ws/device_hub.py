import asyncio
import secrets
import time
from dataclasses import dataclass, field
from typing import Callable, Optional

from fastapi import WebSocket, WebSocketDisconnect

from app import db
from app.config import settings
from app.crypto import verify_signature


class DeviceOfflineError(Exception):
    pass


class CommandInProgressError(Exception):
    pass


@dataclass
class PendingCommand:
    request_id: str
    future: "asyncio.Future[dict]"


@dataclass
class _Nonce:
    value: str
    expires_at: float


@dataclass
class DeviceConnection:
    device_uid: str
    websocket: WebSocket
    drone_id: Optional[str]
    last_seen: float = field(default_factory=time.monotonic)


class DeviceHub:
    """Owns every live Pi<->backend WebSocket connection, the auth handshake,
    and ARM/DISARM command/ack correlation. Keyed by device_uid (the Pi's
    stable identity) rather than drone_id, since an unclaimed device can
    connect before it has a drone row at all.
    """

    def __init__(self) -> None:
        self._connections: dict[str, DeviceConnection] = {}
        self._nonces: dict[str, _Nonce] = {}
        self._pending: dict[str, PendingCommand] = {}
        self._locks: dict[str, asyncio.Lock] = {}
        self._broadcaster: Optional[Callable[[str, dict], None]] = None

    def set_broadcaster(self, broadcaster: Callable[[str, dict], None]) -> None:
        self._broadcaster = broadcaster

    def _broadcast(self, drone_id: str, message: dict) -> None:
        if self._broadcaster:
            self._broadcaster(drone_id, message)

    def is_connected(self, device_uid: str) -> bool:
        return device_uid in self._connections

    def link_claimed_drone(self, device_uid: str, drone_id: str) -> None:
        """Called right after a claim succeeds. If the device is already
        connected — the common case, since a Pi is usually running before
        anyone visits the dashboard to claim it — the live connection was
        registered with drone_id=None at auth time and would otherwise stay
        orphaned (no online status, no telemetry routing) until it happens
        to reconnect. Retroactively attach it instead of waiting for that.
        """
        conn = self._connections.get(device_uid)
        if not conn or conn.drone_id:
            return
        conn.drone_id = drone_id
        db.set_drone_status(drone_id, "online")
        db.insert_drone_log(drone_id, "CONNECTION_RESTORED", message="Device linked after claim")
        self._broadcast(drone_id, {"type": "STATE", "status": "online"})

    def connected_device_uids(self) -> set[str]:
        return set(self._connections.keys())

    def touch(self, device_uid: str) -> None:
        conn = self._connections.get(device_uid)
        if conn:
            conn.last_seen = time.monotonic()

    def seconds_since_seen(self, device_uid: str) -> Optional[float]:
        conn = self._connections.get(device_uid)
        if not conn:
            return None
        return time.monotonic() - conn.last_seen

    async def handle_connection(self, websocket: WebSocket) -> None:
        await websocket.accept()
        device_uid: Optional[str] = None
        conn: Optional[DeviceConnection] = None
        try:
            device_uid = await self._authenticate(websocket)
            if device_uid is None:
                return
            conn = self._connections.get(device_uid)
            await self._receive_loop(websocket, device_uid)
        except WebSocketDisconnect:
            pass
        finally:
            if device_uid and conn:
                await self._on_disconnect(device_uid, conn)

    async def _authenticate(self, websocket: WebSocket) -> Optional[str]:
        hello = await websocket.receive_json()
        if hello.get("type") != "AUTH_HELLO":
            await websocket.close(code=4400)
            return None

        device_uid = hello.get("device_uid")
        device = db.get_device_by_uid(device_uid) if device_uid else None
        if not device:
            await websocket.send_json({"type": "AUTH_FAILED", "reason": "unknown device_uid"})
            await websocket.close(code=4404)
            return None

        nonce = secrets.token_hex(16)
        self._nonces[device_uid] = _Nonce(
            value=nonce, expires_at=time.monotonic() + settings.nonce_ttl_seconds
        )
        await websocket.send_json(
            {"type": "AUTH_CHALLENGE", "nonce": nonce, "ts": int(time.time())}
        )

        response = await websocket.receive_json()
        if response.get("type") != "AUTH_RESPONSE":
            await websocket.close(code=4401)
            return None

        stored = self._nonces.pop(device_uid, None)
        resp_nonce = response.get("nonce")
        resp_ts = response.get("ts")
        signature = response.get("signature")

        valid_nonce = bool(stored) and stored.value == resp_nonce and stored.expires_at > time.monotonic()
        valid_ts = isinstance(resp_ts, int) and abs(int(time.time()) - resp_ts) < settings.nonce_ttl_seconds

        if not (valid_nonce and valid_ts and signature):
            await websocket.send_json({"type": "AUTH_FAILED", "reason": "challenge expired or invalid"})
            await websocket.close(code=4401)
            return None

        message = f"{resp_nonce}|{device_uid}|{resp_ts}".encode()
        if not verify_signature(device["public_key"], message, signature):
            await websocket.send_json({"type": "AUTH_FAILED", "reason": "signature verification failed"})
            await websocket.close(code=4401)
            return None

        db.mark_device_seen(device_uid)
        drone = db.get_drone_by_device_id(device["id"])
        drone_id = drone["id"] if drone else None

        # A live connection for this device_uid may already be registered —
        # a reconnect racing its own stale predecessor, or (misconfigured)
        # cloned credentials. Close it explicitly rather than silently
        # overwriting the dict entry, so its own handle_connection() notices
        # the close and tears down cleanly instead of lingering as a zombie
        # that the presence sweep would otherwise keep re-flagging forever.
        stale = self._connections.get(device_uid)
        if stale:
            try:
                await stale.websocket.close(code=4409)
            except Exception:
                pass

        self._connections[device_uid] = DeviceConnection(
            device_uid=device_uid, websocket=websocket, drone_id=drone_id
        )

        if drone_id:
            db.set_drone_status(drone_id, "online")
            db.insert_drone_log(drone_id, "CONNECTION_RESTORED", message="Device connected")
            self._broadcast(drone_id, {"type": "STATE", "status": "online"})

        await websocket.send_json(
            {"type": "AUTH_OK", "drone_id": drone_id, "claimed": drone_id is not None}
        )
        return device_uid

    async def _receive_loop(self, websocket: WebSocket, device_uid: str) -> None:
        while True:
            message = await websocket.receive_json()
            self.touch(device_uid)
            msg_type = message.get("type")

            if msg_type == "TELEMETRY":
                await self._handle_telemetry(device_uid, message)
            elif msg_type == "LOG_EVENT":
                await self._handle_log_event(device_uid, message)
            elif msg_type == "COMMAND_RESULT":
                self._resolve_command(device_uid, message)

    async def _handle_telemetry(self, device_uid: str, message: dict) -> None:
        conn = self._connections.get(device_uid)
        if not conn or not conn.drone_id:
            return
        payload = {k: v for k, v in message.items() if k != "type"}
        db.upsert_drone_telemetry(conn.drone_id, payload)
        db.set_drone_armed(conn.drone_id, bool(payload.get("armed", False)))
        self._broadcast(
            conn.drone_id,
            {"type": "STATE", "status": "online", "armed": payload.get("armed", False), "telemetry": payload},
        )

    async def _handle_log_event(self, device_uid: str, message: dict) -> None:
        conn = self._connections.get(device_uid)
        if not conn or not conn.drone_id:
            return
        db.insert_drone_log(
            conn.drone_id,
            event_type=message.get("event_type", "UNKNOWN"),
            level=message.get("level", "info"),
            message=message.get("message"),
            metadata=message.get("metadata"),
        )

    def _resolve_command(self, device_uid: str, message: dict) -> None:
        pending = self._pending.get(device_uid)
        if not pending or pending.request_id != message.get("request_id"):
            return
        if not pending.future.done():
            pending.future.set_result(
                {"success": bool(message.get("success")), "reason": message.get("reason")}
            )

    async def _on_disconnect(self, device_uid: str, conn: DeviceConnection) -> None:
        # Only the connection currently registered for this device_uid may
        # clear it. A stale connection's own disconnect firing after a
        # newer one has already taken over must not mark the (still live,
        # still online) replacement offline or resolve its pending command.
        if self._connections.get(device_uid) is not conn:
            return
        self._connections.pop(device_uid, None)

        pending = self._pending.pop(device_uid, None)
        if pending and not pending.future.done():
            pending.future.set_result(
                {"success": False, "reason": "device disconnected before acknowledgment"}
            )
        if conn.drone_id:
            db.set_drone_status(conn.drone_id, "offline")
            db.insert_drone_log(conn.drone_id, "CONNECTION_LOST", level="warning")
            self._broadcast(conn.drone_id, {"type": "STATE", "status": "offline"})

    async def force_disconnect(self, device_uid: str) -> None:
        """Used by the presence sweep to evict a connection that's gone
        quiet (no clean close frame ever arrived — dead network, killed
        process). Closing the socket makes handle_connection's own
        finally-block run the normal, single, idempotent disconnect path
        above instead of the sweep re-detecting and re-logging the same
        stale entry every cycle forever.
        """
        conn = self._connections.get(device_uid)
        if not conn:
            return
        try:
            await conn.websocket.close(code=4408)
        except Exception:
            pass
        await self._on_disconnect(device_uid, conn)

    async def send_command(self, device_uid: str, command: str) -> dict:
        conn = self._connections.get(device_uid)
        if not conn:
            raise DeviceOfflineError

        lock = self._locks.setdefault(device_uid, asyncio.Lock())
        if lock.locked():
            raise CommandInProgressError

        async with lock:
            request_id = secrets.token_hex(8)
            future: "asyncio.Future[dict]" = asyncio.get_event_loop().create_future()
            self._pending[device_uid] = PendingCommand(request_id=request_id, future=future)

            if conn.drone_id:
                self._broadcast(conn.drone_id, {"type": "ARM_PENDING", "request_id": request_id, "command": command})

            await conn.websocket.send_json({"type": "COMMAND", "request_id": request_id, "command": command})

            try:
                result = await asyncio.wait_for(future, timeout=settings.arm_timeout_seconds)
            except asyncio.TimeoutError:
                result = {"success": False, "reason": "timed out waiting for device response"}
            finally:
                self._pending.pop(device_uid, None)

            if conn.drone_id:
                self._broadcast(
                    conn.drone_id,
                    {"type": "ARM_RESULT", "request_id": request_id, **result},
                )
            return result


device_hub = DeviceHub()
