import os


def _env(name: str, default: str | None = None, required: bool = False) -> str:
    value = os.environ.get(name, default)
    if required and not value:
        raise RuntimeError(f"missing required env var {name}")
    return value or ""


DEVICE_UID = _env("DRONAI_DEVICE_UID", required=True)
KEY_PATH = _env("DRONAI_KEY_PATH", "/etc/dronai/device.key")
BACKEND_HTTP_URL = _env("DRONAI_BACKEND_HTTP_URL", "http://localhost:8000")
BACKEND_WS_URL = _env("DRONAI_BACKEND_WS_URL", "ws://localhost:8000/ws/device")
PROVISION_API_KEY = _env("DRONAI_PROVISION_API_KEY")
MAVLINK_CONNECTION = _env("MAVLINK_CONNECTION", "udp:127.0.0.1:14550")
LOCAL_DB_PATH = _env("DRONAI_LOCAL_DB_PATH", "/var/lib/dronai/agent.sqlite3")
TELEMETRY_INTERVAL_SECONDS = float(_env("DRONAI_TELEMETRY_INTERVAL_SECONDS", "1.0"))
