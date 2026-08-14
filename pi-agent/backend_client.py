import asyncio
import json
import logging
import time
from typing import Awaitable, Callable

import websockets

import identity

logger = logging.getLogger("dronai.agent.backend")


class BackendClient:
    def __init__(self, ws_url: str, device_uid: str, private_key) -> None:
        self.ws_url = ws_url
        self.device_uid = device_uid
        self.private_key = private_key
        self.connected = False
        self._ws = None

    async def run_forever(
        self,
        on_connected: Callable[[], Awaitable[None]],
        on_command: Callable[[str], Awaitable[tuple[bool, str | None]]],
    ) -> None:
        backoff = 1.0
        while True:
            try:
                async with websockets.connect(self.ws_url) as ws:
                    self._ws = ws
                    await self._handshake(ws)
                    self.connected = True
                    backoff = 1.0
                    await on_connected()
                    await self._receive_loop(ws, on_command)
            except Exception:
                logger.exception("backend connection lost, retrying in %.1fs", backoff)
            finally:
                self.connected = False
                self._ws = None
            await asyncio.sleep(backoff)
            backoff = min(backoff * 2, 30.0)

    async def _handshake(self, ws) -> None:
        await ws.send(json.dumps({"type": "AUTH_HELLO", "device_uid": self.device_uid}))
        challenge = json.loads(await ws.recv())
        if challenge.get("type") != "AUTH_CHALLENGE":
            raise RuntimeError(f"unexpected handshake response: {challenge}")

        nonce = challenge["nonce"]
        ts = challenge["ts"]
        message = f"{nonce}|{self.device_uid}|{ts}".encode()
        signature = identity.sign_b64(self.private_key, message)

        await ws.send(
            json.dumps(
                {
                    "type": "AUTH_RESPONSE",
                    "device_uid": self.device_uid,
                    "nonce": nonce,
                    "ts": ts,
                    "signature": signature,
                }
            )
        )
        result = json.loads(await ws.recv())
        if result.get("type") != "AUTH_OK":
            raise RuntimeError(f"authentication rejected: {result}")
        logger.info("authenticated (drone_id=%s, claimed=%s)", result.get("drone_id"), result.get("claimed"))

    async def _receive_loop(self, ws, on_command) -> None:
        async for raw in ws:
            message = json.loads(raw)
            if message.get("type") != "COMMAND":
                continue
            request_id = message["request_id"]
            command = message["command"]
            success, reason = await on_command(command)
            await ws.send(
                json.dumps(
                    {
                        "type": "COMMAND_RESULT",
                        "request_id": request_id,
                        "command": command,
                        "success": success,
                        "reason": reason,
                    }
                )
            )

    async def send_telemetry(self, snapshot: dict) -> None:
        if not self._ws:
            return
        await self._ws.send(json.dumps({"type": "TELEMETRY", "ts": time.time(), **snapshot}))

    async def send_log_event(self, event_type: str, level: str = "info", message: str | None = None, metadata: dict | None = None) -> bool:
        if not self._ws:
            return False
        await self._ws.send(
            json.dumps(
                {
                    "type": "LOG_EVENT",
                    "event_type": event_type,
                    "level": level,
                    "message": message,
                    "metadata": metadata or {},
                }
            )
        )
        return True
