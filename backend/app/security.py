import os
from datetime import datetime, timedelta, timezone
from typing import Any

import bcrypt
import jwt

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
JWT_ALGORITHM = "HS256"
TOKEN_TTL_MINUTES = 60 * 24

if os.getenv("APP_ENV", "development").lower() == "production" and (
    len(JWT_SECRET) < 32
    or JWT_SECRET in {"dev-secret-change-me", "replace-with-a-long-random-secret"}
):
    raise RuntimeError("JWT_SECRET must be set to a random value of at least 32 characters in production")


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


def create_access_token(subject: str | int) -> str:
    expires = datetime.now(timezone.utc) + timedelta(minutes=TOKEN_TTL_MINUTES)
    payload = {"sub": str(subject), "exp": expires}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> dict[str, Any]:
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
