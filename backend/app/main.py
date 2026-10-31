"""
FinRelief AI - backend entrypoint.

Run locally with:
    uvicorn app.main:app --reload

This module wires together configuration, database initialization,
middleware (CORS, rate limiting, global error handling), and API
routers. Route handlers themselves stay in app/api/*, business logic
in app/services/*, and data access via SQLAlchemy models in app/models/*.
"""
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.dashboard import router as dashboard_router
from app.api.financial import router as financial_router
from app.api.history import router as history_router
from app.api.loans import router as loans_router
from app.api.negotiation import router as negotiation_router
from app.api.settlement import router as settlement_router
from app.api.user import router as user_router
from app.config import settings
from app.database.session import Base, SessionLocal, engine
from app.models.user import User
from app.middleware.error_handler import register_exception_handlers
from app.middleware.rate_limiter import RateLimiterMiddleware

# Import all models so they're registered on Base.metadata before create_all runs.
from app import models  # noqa: F401

logging.basicConfig(level=logging.INFO if not settings.DEBUG else logging.DEBUG)
logger = logging.getLogger("finrelief")


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        description="AI-powered debt relief and financial recovery platform API.",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # --- CORS ---
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # --- Rate limiting ---
    app.add_middleware(RateLimiterMiddleware, requests_per_minute=settings.RATE_LIMIT_PER_MINUTE)

    # --- Global exception handling ---
    register_exception_handlers(app)

    # --- Routers ---
    app.include_router(auth_router)
    app.include_router(user_router)
    app.include_router(loans_router)
    app.include_router(financial_router)
    app.include_router(settlement_router)
    app.include_router(negotiation_router)
    app.include_router(history_router)
    app.include_router(dashboard_router)

    @app.get("/health", tags=["System"])
    def health_check():
        return {"status": "ok", "app": settings.APP_NAME, "environment": settings.ENVIRONMENT}

    # Demo user credentials (bcrypt hash of "Demo1234")
    DEFAULT_DEMO_HASH = "$2b$12$OxoCwLBkl1YAJ3S9q295bOKMxUfLHgx2lYn8CZGIDPyNmx4mVbwFm"

    @app.on_event("startup")
    def on_startup():
        # For SQLite/dev convenience only. In production, use Alembic
        # migrations instead of create_all (see README "Database Migration").
        if settings.DATABASE_URL.startswith("sqlite"):
            Base.metadata.create_all(bind=engine)
            logger.info("SQLite tables ensured via create_all().")
        else:
            logger.info("Non-SQLite database detected - run Alembic migrations before serving traffic.")
        # Seed demo user if not present
        from datetime import datetime
        import uuid
        with SessionLocal() as db:
            if not db.query(User).filter(User.email == "demo@finrelief.ai").first():
                db.add(User(id=str(uuid.uuid4()), name="Demo User", email="demo@finrelief.ai",
                           hashed_password=DEFAULT_DEMO_HASH, created_at=datetime.utcnow()))
                db.commit()
                logger.info("Demo user seeded into production database.")

    return app


app = create_app()
