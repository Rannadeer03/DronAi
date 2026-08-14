from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel

from app import db
from app.config import settings

router = APIRouter(prefix="/api/devices", tags=["devices"])


class RegisterDeviceRequest(BaseModel):
    device_uid: str
    public_key: str


@router.post("/register")
def register_device(
    body: RegisterDeviceRequest,
    authorization: str = Header(default=""),
):
    token = authorization.removeprefix("Bearer ").strip()
    if token != settings.provision_api_key:
        raise HTTPException(status_code=401, detail="Invalid provisioning credential")

    if db.get_device_by_uid(body.device_uid):
        raise HTTPException(status_code=409, detail="Device UID already registered")

    db.service_client().table("devices").insert(
        {"device_uid": body.device_uid, "public_key": body.public_key}
    ).execute()

    return {"device_uid": body.device_uid, "status": "registered"}
