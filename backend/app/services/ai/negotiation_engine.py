from dataclasses import dataclass

from app.services.ai.fallback_generator import generate_rule_based_letter
from app.services.ai.gemini_client import GeminiUnavailableError, generate_with_gemini
from app.services.ai.prompt_builder import NegotiationContext, build_negotiation_prompt


@dataclass
class NegotiationResult:
    letter: str
    prompt: str
    source: str  # "gemini" | "fallback"


def generate_negotiation_letter(ctx: NegotiationContext) -> NegotiationResult:
    prompt = build_negotiation_prompt(ctx)

    try:
        letter = generate_with_gemini(prompt)
        return NegotiationResult(letter=letter, prompt=prompt, source="gemini")
    except GeminiUnavailableError:
        letter = generate_rule_based_letter(ctx)
        return NegotiationResult(letter=letter, prompt=prompt, source="fallback")
