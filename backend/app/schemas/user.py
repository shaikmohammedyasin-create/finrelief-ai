import re
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, field_validator

PASSWORD_MIN_LENGTH = 8
_PASSWORD_UPPER_RE = re.compile(r"[A-Z]")
_PASSWORD_LOWER_RE = re.compile(r"[a-z]")
_PASSWORD_DIGIT_RE = re.compile(r"\d")


def validate_password_strength(value: str) -> str:
    if len(value) < PASSWORD_MIN_LENGTH:
        raise ValueError(f"Password must be at least {PASSWORD_MIN_LENGTH} characters long")
    if not _PASSWORD_UPPER_RE.search(value):
        raise ValueError("Password must contain at least one uppercase letter")
    if not _PASSWORD_LOWER_RE.search(value):
        raise ValueError("Password must contain at least one lowercase letter")
    if not _PASSWORD_DIGIT_RE.search(value):
        raise ValueError("Password must contain at least one digit")
    if len(value.encode("utf-8")) > 72:
        raise ValueError("Password is too long")
    return value


class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

    @field_validator("name")
    @classmethod
    def name_not_blank(cls, value: str) -> str:
        value = value.strip()
        if len(value) < 2:
            raise ValueError("Name must be at least 2 characters long")
        return value

    @field_validator("password")
    @classmethod
    def password_strength(cls, value: str) -> str:
        return validate_password_strength(value)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserProfileUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None

    @field_validator("name")
    @classmethod
    def name_not_blank(cls, value: str | None) -> str | None:
        if value is None:
            return value
        value = value.strip()
        if len(value) < 2:
            raise ValueError("Name must be at least 2 characters long")
        return value
