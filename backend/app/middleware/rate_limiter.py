"""
Simple in-memory rate limiter.

Good enough for a single-process deployment (e.g. one Render web
service). If you scale to multiple workers/instances, swap this for a
shared store such as Redis - the interface below is intentionally
minimal so that swap is a one-file change.
"""
import time
from collections import defaultdict, deque

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from app.config import settings


class RateLimiterMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, requests_per_minute: int | None = None):
        super().__init__(app)
        self.limit = requests_per_minute or settings.RATE_LIMIT_PER_MINUTE
        self.window_seconds = 60
        self._hits: dict[str, deque] = defaultdict(deque)

    async def dispatch(self, request: Request, call_next):
        # Never rate-limit docs/health so local dev and monitoring aren't affected.
        if request.url.path in ("/health", "/docs", "/openapi.json", "/redoc"):
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        now = time.monotonic()
        hits = self._hits[client_ip]

        while hits and now - hits[0] > self.window_seconds:
            hits.popleft()

        if len(hits) >= self.limit:
            return JSONResponse(
                status_code=429,
                content={
                    "success": False,
                    "error": {
                        "code": "RATE_LIMITED",
                        "message": "Too many requests. Please slow down and try again shortly.",
                    },
                },
            )

        hits.append(now)
        return await call_next(request)
