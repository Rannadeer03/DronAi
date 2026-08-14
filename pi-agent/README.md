# DronAI Pi Agent

Bridges a Pixhawk (via MAVLink) to the DronAI backend over a signed
WebSocket connection. Runs on the Raspberry Pi; never talks to Postgres
directly.

## First-time setup on the Pi

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

export DRONAI_PROVISION_API_KEY=<the PROVISION_API_KEY from backend/.env>
python3 provision.py --device-uid DRA-000001 --backend-url https://your-backend
```

This generates an Ed25519 keypair, writes the private key to
`/etc/dronai/device.key` (0600, never leaves this device), and registers
the public key + device UID with the backend. Re-running it refuses to
overwrite an existing key.

## Running

```bash
export DRONAI_DEVICE_UID=DRA-000001
export DRONAI_BACKEND_WS_URL=wss://your-backend/ws/device
export MAVLINK_CONNECTION=/dev/serial0   # or udp:127.0.0.1:14550 for SITL
python3 main.py
```

Install `systemd/dronai-agent.service` (adjust paths/user) and enable it
so the agent starts on boot and restarts on crash. Environment variables
go in `/etc/dronai/agent.env`.

## Testing without real hardware

Point `MAVLINK_CONNECTION` at ArduPilot SITL instead of a serial Pixhawk —
the agent code is identical either way:

```bash
cd ~/ardupilot
Tools/autotest/sim_vehicle.py -v ArduCopter --no-mavproxy -w
# in another terminal:
MAVLINK_CONNECTION=udp:127.0.0.1:14550 python3 main.py
```

SITL runs real ArduCopter arming logic (EKF, GPS, prearm checks) — a
genuine test of the ARM/DISARM safety path, not a mock. It is **not** a
substitute for testing against real hardware: the safety switch, real
battery failsafes, real RC failsafe, and real vibration/EKF behavior can
only be validated on an actual Pixhawk before this ever controls a flying
drone. That field test is a separate step outside this repo.
