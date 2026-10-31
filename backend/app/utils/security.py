"""
Password hashing utilities.

Uses direct bcrypt to avoid passlib 1.7.4 incompatibility with bcrypt >= 4.1.0
(where passlib's internal wrap-bug detection throws ValueError on 72+ byte checks).
"""
import bcrypt


def hash_password(plain_password: str) -> str:
    pwd_bytes = plain_password[:72].encode("utf-8")
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        pwd_bytes = plain_password[:72].encode("utf-8")
        hash_bytes = hashed_password.encode("utf-8")
        return bcrypt.checkpw(pwd_bytes, hash_bytes)
    except Exception:
        return False

