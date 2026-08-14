"""Run once, on the Pi, to give it a permanent DronAI identity.

Generates an Ed25519 keypair locally (the private key never leaves this
machine) and registers the device_uid + public key with the backend.

Usage:
    DRONAI_PROVISION_API_KEY=... python3 provision.py \
        --device-uid DRA-000001 \
        --backend-url http://your-backend:8000 \
        --key-path /etc/dronai/device.key
"""

import argparse
import os
import sys

import identity
import urllib.request
import json


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--device-uid", required=True)
    parser.add_argument("--backend-url", default=os.environ.get("DRONAI_BACKEND_HTTP_URL", "http://localhost:8000"))
    parser.add_argument("--key-path", default=os.environ.get("DRONAI_KEY_PATH", "/etc/dronai/device.key"))
    args = parser.parse_args()

    provision_api_key = os.environ.get("DRONAI_PROVISION_API_KEY")
    if not provision_api_key:
        print("DRONAI_PROVISION_API_KEY must be set", file=sys.stderr)
        raise SystemExit(1)

    if os.path.exists(args.key_path):
        print(f"Key already exists at {args.key_path} — refusing to overwrite. Delete it first if you mean to re-provision.")
        raise SystemExit(1)

    private_key = identity.generate_and_save(args.key_path)
    public_key = identity.public_key_b64(private_key)

    body = json.dumps({"device_uid": args.device_uid, "public_key": public_key}).encode()
    req = urllib.request.Request(
        f"{args.backend_url}/api/devices/register",
        data=body,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {provision_api_key}",
        },
    )
    try:
        with urllib.request.urlopen(req) as resp:
            print(resp.read().decode())
    except urllib.error.HTTPError as exc:
        print(f"registration failed: {exc.code} {exc.read().decode()}", file=sys.stderr)
        raise SystemExit(1)

    print(f"\nProvisioned. Set DRONAI_DEVICE_UID={args.device_uid} and DRONAI_KEY_PATH={args.key_path} for the agent.")


if __name__ == "__main__":
    main()
