"""
Database engine and session management.

Works with SQLite out of the box for local development and switches
cleanly to PostgreSQL in production by changing DATABASE_URL only -
no code changes required.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import settings

# SQLite requires this connect_arg when used with multiple threads
# (FastAPI/Uvicorn workers). Postgres/MySQL do not need it.
connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Shared declarative base for all ORM models."""
    pass


def get_db():
    """FastAPI dependency that yields a DB session and guarantees closure."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
