import asyncio

from fastapi import WebSocket, WebSocketDisconnect

from app import db


class BrowserHub:
    """Fans out drone state to every open browser tab watching a given
    drone. Receive-only from the browser's perspective — ARM/DISARM always
    go through the REST endpoints, never over this socket.
    """

    def __init__(self) -> None:
        self._connections: dict[str, set[WebSocket]] = {}

    async def handle_connection(self, websocket: WebSocket, drone_id: str, token: str) -> None:
        try:
            user = db.verify_user_token(token)
        except db.AuthError:
            await websocket.close(code=4401)
            return

        drone = db.get_drone_by_id(drone_id)
        if not drone:
            await websocket.close(code=4404)
            return

        profile = db.get_profile(user["id"])
        is_admin = bool(profile and profile.get("role") == "admin")
        if drone["owner_id"] != user["id"] and not is_admin:
            await websocket.close(code=4403)
            return

        await websocket.accept()
        self._connections.setdefault(drone_id, set()).add(websocket)

        try:
            await websocket.send_json(
                {
                    "type": "STATE",
                    "status": drone["status"],
                    "armed": drone["armed"],
                    "telemetry": drone["last_telemetry"],
                    "last_seen": drone["last_seen"],
                }
            )
            while True:
                await websocket.receive_text()
        except WebSocketDisconnect:
            pass
        finally:
            self._connections.get(drone_id, set()).discard(websocket)

    def broadcast(self, drone_id: str, message: dict) -> None:
        sockets = self._connections.get(drone_id)
        if not sockets:
            return

        async def _send(ws: WebSocket) -> None:
            try:
                await ws.send_json(message)
            except Exception:
                pass

        for ws in list(sockets):
            asyncio.create_task(_send(ws))


browser_hub = BrowserHub()
