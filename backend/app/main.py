import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import devices, drones
from app.services.presence import run_presence_sweep
from app.ws.browser_hub import browser_hub
from app.ws.device_hub import device_hub

device_hub.set_broadcaster(browser_hub.broadcast)


@asynccontextmanager
async def lifespan(app: FastAPI):
    sweep_task = asyncio.create_task(run_presence_sweep())
    yield
    sweep_task.cancel()


app = FastAPI(title="DronAI Backend", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.cors_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(devices.router)
app.include_router(drones.router)


@app.get("/healthz")
def healthz():
    return {"status": "ok"}


@app.websocket("/ws/device")
async def ws_device(websocket: WebSocket):
    await device_hub.handle_connection(websocket)


@app.websocket("/ws/drones/{drone_id}")
async def ws_drone(websocket: WebSocket, drone_id: str, token: str):
    await browser_hub.handle_connection(websocket, drone_id, token)
