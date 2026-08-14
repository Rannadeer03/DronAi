import base64
import os
import stat

from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from cryptography.hazmat.primitives.serialization import (
    Encoding,
    NoEncryption,
    PrivateFormat,
    PublicFormat,
    load_pem_private_key,
)


def generate_and_save(key_path: str) -> Ed25519PrivateKey:
    private_key = Ed25519PrivateKey.generate()
    pem = private_key.private_bytes(Encoding.PEM, PrivateFormat.PKCS8, NoEncryption())

    os.makedirs(os.path.dirname(key_path), exist_ok=True)
    fd = os.open(key_path, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, stat.S_IRUSR | stat.S_IWUSR)
    try:
        os.write(fd, pem)
    finally:
        os.close(fd)

    return private_key


def load(key_path: str) -> Ed25519PrivateKey:
    with open(key_path, "rb") as f:
        return load_pem_private_key(f.read(), password=None)


def public_key_b64(private_key: Ed25519PrivateKey) -> str:
    raw = private_key.public_key().public_bytes(Encoding.Raw, PublicFormat.Raw)
    return base64.b64encode(raw).decode()


def sign_b64(private_key: Ed25519PrivateKey, message: bytes) -> str:
    return base64.b64encode(private_key.sign(message)).decode()
