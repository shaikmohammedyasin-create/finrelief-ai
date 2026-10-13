"""
Application configuration.

All runtime configuration is sourced from environment variables (see
.env.example for the full list). Using pydantic-settings gives us
validation and sane defaults for local development while still allowing
every value to be overridden in production (e.g. on Render).
"""
from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # --- App ---
    APP_NAME: str = "FinRelief AI"
    ENVIRONMENT: str = "development"  # development | production
    DEBUG: bool = True

    # --- Security / JWT ---
    SECRET_KEY: str = "CHANGE_ME_IN_PRODUCTION"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # --- Database ---
    # Defaults to a local SQLite file. For production, set e.g.
    # postgresql+psycopg2://user:password@host:5432/finrelief
    DATABASE_URL: str = "sqlite:///./finrelief.db"

    # --- CORS ---
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    # --- Rate limiting ---
    RATE_LIMIT_PER_MINUTE: int = 60

    # --- AI (Google Gemini) ---
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-1.5-flash"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """Cached settings instance so we parse the environment only once."""
    return Settings()


settings = get_settings()
