"""
Global exception handlers.

Ensures every error the API returns - validation, auth, not-found,
database, or truly unexpected - comes back as a consistent JSON shape:

    { "success": false, "error": { "code": ..., "message": ..., "details": ... } }

This makes the frontend's centralized Axios error handling trivial:
one shape to parse, everywhere.
"""
import logging

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger("finrelief")


def _error_body(code: str, message: str, details=None):
    return {"success": False, "error": {"code": code, "message": message, "details": details}}


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=_error_body("VALIDATION_ERROR", "One or more fields are invalid.", exc.errors()),
        )

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        code_map = {
            401: "UNAUTHORIZED",
            403: "FORBIDDEN",
            404: "NOT_FOUND",
            409: "CONFLICT",
            400: "BAD_REQUEST",
        }
        code = code_map.get(exc.status_code, "HTTP_ERROR")
        return JSONResponse(status_code=exc.status_code, content=_error_body(code, str(exc.detail)))

    @app.exception_handler(SQLAlchemyError)
    async def db_exception_handler(request: Request, exc: SQLAlchemyError):
        logger.exception("Database error on %s %s", request.method, request.url)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=_error_body("DATABASE_ERROR", "A database error occurred. Please try again."),
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        logger.exception("Unhandled error on %s %s", request.method, request.url)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=_error_body("INTERNAL_SERVER_ERROR", "An unexpected error occurred."),
        )
