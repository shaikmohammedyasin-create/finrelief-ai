"""
Thin wrapper around the Google Gemini API.

Isolated in its own module so app.services.ai.negotiation_engine can call
it inside a single try/except and cleanly fall back to the rule-based
generator on ANY failure - missing key, network error, quota, malformed
response, etc.
"""
import logging

from app.config import settings

logger = logging.getLogger("finrelief.ai.gemini")


class GeminiUnavailableError(Exception):
    """Raised whenever Gemini cannot be used - missing key, API error, or empty response."""


def generate_with_gemini(prompt: str) -> str:
    if not settings.GEMINI_API_KEY:
        raise GeminiUnavailableError("GEMINI_API_KEY is not configured")

    try:
        import google.generativeai as genai
    except ImportError as exc:
        raise GeminiUnavailableError("google-generativeai package is not installed") from exc

    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel(settings.GEMINI_MODEL)
        response = model.generate_content(prompt)
        text = (response.text or "").strip()
        if not text:
            raise GeminiUnavailableError("Gemini returned an empty response")
        return text
    except GeminiUnavailableError:
        raise
    except Exception as exc:  # noqa: BLE001 - any Gemini/SDK failure should trigger fallback
        logger.warning("Gemini generation failed, will fall back to rule-based letter: %s", exc)
        raise GeminiUnavailableError(str(exc)) from exc
