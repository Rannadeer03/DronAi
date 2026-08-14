import asyncio
import logging

from app.config import settings
from app.ws.device_hub import device_hub

logger = logging.getLogger("dronai.presence")

SWEEP_INTERVAL_SECONDS = 5


async def run_presence_sweep() -> None:
    """Backstop for connections that die without a clean WebSocket close
    frame (dead network, killed process). The device hub already flips a
    drone offline synchronously on clean disconnect — this catches the rest
    by evicting the stale entry via device_hub.force_disconnect(), which
    routes through the same single offline-marking/logging path rather than
    writing its own duplicate copy here. Without the eviction, a Pi that
    silently drops offline gets re-detected as stale on every 5s sweep tick
    forever, writing a fresh CONNECTION_LOST row each time.
    """
    while True:
        await asyncio.sleep(SWEEP_INTERVAL_SECONDS)
        try:
            await _sweep_once()
        except Exception:
            logger.exception("presence sweep failed")


async def _sweep_once() -> None:
    stale_device_uids = [
        device_uid
        for device_uid in device_hub.connected_device_uids()
        if (device_hub.seconds_since_seen(device_uid) or 0) > settings.offline_timeout_seconds
    ]
    for device_uid in stale_device_uids:
        await device_hub.force_disconnect(device_uid)
