"""
Auth service layer.

Keeps business logic (DB queries, token issuance, validation) out of the
route handlers in app/api/auth.py, per clean-architecture separation of
concerns: routes stay thin, services own the logic, models own the data.
"""
from fastapi import HTTPException, status
from jose import jwt
from sqlalchemy.orm import Session

from app.auth.jwt_handler import (
    TokenError,
    create_access_token,
    create_refresh_token,
    decode_token_payload,
)
from app.config import settings
from app.models.revoked_token import RevokedToken
from app.models.user import User
from app.schemas.auth import TokenPair
from app.schemas.user import UserRegister
from app.utils.security import hash_password, verify_password


def register_user(db: Session, payload: UserRegister) -> User:
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists")

    user = User(
        name=payload.name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User:
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    return user


def issue_token_pair(user_id: str) -> TokenPair:
    return TokenPair(
        access_token=create_access_token(user_id),
        refresh_token=create_refresh_token(user_id),
    )


def refresh_access_token(db: Session, refresh_token: str) -> TokenPair:
    try:
        payload = decode_token_payload(refresh_token, expected_type="refresh")
    except TokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")

    jti = payload["jti"]
    if db.query(RevokedToken).filter(RevokedToken.jti == jti).first():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token has been revoked")

    user_id = payload["sub"]
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User no longer exists")

    # Rotate: revoke the used refresh token and issue a brand new pair.
    db.add(RevokedToken(jti=jti))
    db.commit()

    return issue_token_pair(user.id)


def logout_user(db: Session, refresh_token: str) -> None:
    """Revoke a refresh token so it can no longer be used to mint access tokens."""
    try:
        # We don't require the token to be unexpired to log out with it -
        # only that it is well-formed and correctly signed. This lets a
        # client log out even with a refresh token that expired while idle.
        payload = jwt.decode(
            refresh_token,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
            options={"verify_exp": False},
        )
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid refresh token")

    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not a refresh token")

    jti = payload.get("jti")
    if not jti:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Malformed refresh token")

    if not db.query(RevokedToken).filter(RevokedToken.jti == jti).first():
        db.add(RevokedToken(jti=jti))
        db.commit()
