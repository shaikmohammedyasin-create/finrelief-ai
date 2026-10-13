"""
JWT creation and verification.

Two token types are issued:
  - "access"  : short-lived, sent with every request (Authorization: Bearer <token>)
  - "refresh" : long-lived, used only to mint new access tokens via /refresh

Both are signed with the same SECRET_KEY but carry a "type" claim so one
cannot be used in place of the other (e.g. a stolen access token cannot
be replayed against the refresh endpoint).
"""
import uuid
from datetime import datetime, timedelta, timezone
from typing import Literal

from jose import JWTError, jwt

from app.config import settings

TokenType = Literal["access", "refresh"]


class TokenError(Exception):
    """Raised for any invalid, expired, or malformed token."""


def _create_token(subject: str, token_type: TokenType, expires_delta: timedelta) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": subject,
        "type": token_type,
        "iat": now,
        "exp": now + expires_delta,
        "jti": str(uuid.uuid4()),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_access_token(user_id: str) -> str:
    return _create_token(
        subject=user_id,
        token_type="access",
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )


def create_refresh_token(user_id: str) -> str:
    return _create_token(
        subject=user_id,
        token_type="refresh",
        expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )


def decode_token_payload(token: str, expected_type: TokenType) -> dict:
    """
    Decode and validate a JWT, returning the full payload on success.
    Raises TokenError on any failure (invalid signature, expired, wrong type).
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    except JWTError as exc:
        raise TokenError("Invalid or expired token") from exc

    if payload.get("type") != expected_type:
        raise TokenError(f"Expected a {expected_type} token")

    if not payload.get("sub") or not payload.get("jti"):
        raise TokenError("Token missing required claims")

    return payload


def decode_token(token: str, expected_type: TokenType) -> str:
    """Convenience wrapper that returns only the subject (user_id)."""
    return decode_token_payload(token, expected_type)["sub"]
