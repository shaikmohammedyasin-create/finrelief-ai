"""
Password hashing utilities.

Uses passlib's bcrypt backend. bcrypt has a 72-byte input limit;
passlib handles truncation-related errors for us, but we still guard
against absurdly long inputs at the schema validation layer.
"""
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
