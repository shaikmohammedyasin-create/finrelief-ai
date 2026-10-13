"""
Revoked (blacklisted) refresh tokens.

JWTs are stateless by design, which makes "logout" tricky: a token is
valid until it expires no matter what the server does. To support a
real logout, we record the jti (JWT ID) of any refresh token that has
been explicitly revoked. The refresh endpoint checks this table before
issuing a new access token.
"""
from datetime import datetime

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.session import Base


class RevokedToken(Base):
    __tablename__ = "revoked_tokens"

    jti: Mapped[str] = mapped_column(String(36), primary_key=True)
    revoked_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
