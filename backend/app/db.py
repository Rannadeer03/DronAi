from datetime import datetime, timezone
from functools import lru_cache
from typing import Any, Optional

from supabase import Client, create_client

from app.config import settings


@lru_cache
def service_client() -> Client:
    return create_client(settings.supabase_url, settings.supabase_service_role_key)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class AuthError(Exception):
    pass


def verify_user_token(access_token: str) -> dict:
    try:
        resp = service_client().auth.get_user(access_token)
    except Exception as exc:
        raise AuthError("Invalid or expired session") from exc
    if not resp or not resp.user:
        raise AuthError("Invalid or expired session")
    return {"id": resp.user.id, "email": resp.user.email}


def get_profile(user_id: str) -> Optional[dict]:
    res = service_client().table("profiles").select("*").eq("id", user_id).single().execute()
    return res.data


def get_device_by_uid(device_uid: str) -> Optional[dict]:
    res = (
        service_client()
        .table("devices")
        .select("*")
        .eq("device_uid", device_uid)
        .maybe_single()
        .execute()
    )
    return res.data if res else None


def get_drone_by_id(drone_id: str) -> Optional[dict]:
    res = service_client().table("drones").select("*").eq("id", drone_id).maybe_single().execute()
    return res.data if res else None


def get_drone_by_device_id(device_id: str) -> Optional[dict]:
    res = (
        service_client()
        .table("drones")
        .select("*")
        .eq("device_id", device_id)
        .maybe_single()
        .execute()
    )
    return res.data if res else None


def mark_device_seen(device_uid: str) -> None:
    service_client().table("devices").update({"last_seen": now_iso()}).eq(
        "device_uid", device_uid
    ).execute()


def set_drone_status(drone_id: str, status: str) -> None:
    service_client().table("drones").update(
        {"status": status, "updated_at": now_iso()}
    ).eq("id", drone_id).execute()


def set_drone_armed(drone_id: str, armed: bool) -> None:
    service_client().table("drones").update(
        {"armed": armed, "updated_at": now_iso()}
    ).eq("id", drone_id).execute()


def upsert_drone_telemetry(drone_id: str, telemetry: dict[str, Any]) -> None:
    service_client().table("drones").update(
        {
            "last_telemetry": telemetry,
            "last_seen": now_iso(),
            "status": "online",
            "updated_at": now_iso(),
        }
    ).eq("id", drone_id).execute()


def insert_drone_log(
    drone_id: str,
    event_type: str,
    level: str = "info",
    message: Optional[str] = None,
    metadata: Optional[dict] = None,
) -> None:
    service_client().table("drone_logs").insert(
        {
            "drone_id": drone_id,
            "level": level,
            "event_type": event_type,
            "message": message,
            "metadata": metadata or {},
        }
    ).execute()
