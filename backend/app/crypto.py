import base64

from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey


def verify_signature(public_key_b64: str, message: bytes, signature_b64: str) -> bool:
    try:
        public_key = Ed25519PublicKey.from_public_bytes(base64.b64decode(public_key_b64))
        public_key.verify(base64.b64decode(signature_b64), message)
        return True
    except (InvalidSignature, ValueError):
        return False
