from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel

from app import db
from app.ws.device_hub import CommandInProgressError, DeviceOfflineError, device_hub

router = APIRouter(prefix="/api/drones", tags=["drones"])


def _current_user(authorization: str) -> dict:
    token = authorization.removeprefix("Bearer ").strip()
    if not token:
        raise HTTPException(status_code=401, detail="Missing bearer token")
    try:
        return db.verify_user_token(token)
    except db.AuthError as exc:
        raise HTTPException(status_code=401, detail=str(exc)) from exc


def _current_role(user_id: str) -> str:
    profile = db.get_profile(user_id)
    if not profile:
        raise HTTPException(status_code=403, detail="No profile found for this account")
    return profile["role"]


class ClaimDroneRequest(BaseModel):
    device_uid: str
    name: str | None = None


@router.post("/claim")
def claim_drone(body: ClaimDroneRequest, authorization: str = Header(default="")):
    user = _current_user(authorization)

    device = db.get_device_by_uid(body.device_uid)
    if not device:
        raise HTTPException(status_code=404, detail="No device found with that ID")
    if not device["last_seen"]:
        raise HTTPException(
            status_code=409,
            detail="Device found but has never connected — power it on and connect it to the network, then try again",
        )
    if device["status"] == "claimed":
        raise HTTPException(status_code=409, detail="Device already claimed")

    inserted = (
        db.service_client()
        .table("drones")
        .insert(
            {
                "drone_uid": body.device_uid,
                "device_id": device["id"],
                "owner_id": user["id"],
                "name": body.name or "My Drone",
            }
        )
        .execute()
    )
    drone = inserted.data[0]

    db.service_client().table("devices").update(
        {"status": "claimed", "claimed_by": user["id"]}
    ).eq("id", device["id"]).execute()

    device_hub.link_claimed_drone(body.device_uid, drone["id"])

    return drone


def _authorize_drone_action(authorization: str, drone_id: str, *, require_control: bool) -> dict:
    user = _current_user(authorization)
    role = _current_role(user["id"])

    drone = db.get_drone_by_id(drone_id)
    if not drone:
        raise HTTPException(status_code=404, detail="Drone not found")

    is_admin = role == "admin"
    is_owner = drone["owner_id"] == user["id"]
    if not (is_admin or is_owner):
        raise HTTPException(status_code=403, detail="You do not have access to this drone")

    if require_control and role == "user":
        raise HTTPException(status_code=403, detail="Your role does not permit arm/disarm")

    return drone


async def _issue_command(drone: dict, command: str) -> dict:
    device = db.service_client().table("devices").select("device_uid").eq(
        "id", drone["device_id"]
    ).single().execute().data
    device_uid = device["device_uid"]

    try:
        result = await device_hub.send_command(device_uid, command)
    except DeviceOfflineError as exc:
        raise HTTPException(status_code=409, detail="Drone is offline, cannot send command") from exc
    except CommandInProgressError as exc:
        raise HTTPException(status_code=409, detail="A command is already in progress for this drone") from exc

    if not result["success"]:
        raise HTTPException(status_code=422, detail=result.get("reason") or f"{command} failed")
    return result


@router.post("/{drone_id}/arm")
async def arm_drone(drone_id: str, authorization: str = Header(default="")):
    drone = _authorize_drone_action(authorization, drone_id, require_control=True)
    result = await _issue_command(drone, "ARM")
    return {"armed": True, **result}


@router.post("/{drone_id}/disarm")
async def disarm_drone(drone_id: str, authorization: str = Header(default="")):
    drone = _authorize_drone_action(authorization, drone_id, require_control=True)
    result = await _issue_command(drone, "DISARM")
    return {"armed": False, **result}
