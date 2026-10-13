from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class NegotiationLetterRequest(BaseModel):
    loan_id: str = Field(..., description="The loan to negotiate a settlement for")
    settlement_percentage: float | None = Field(
        None, ge=1, le=100, description="Override the recommended settlement percentage if desired"
    )


class NegotiationLetterResponse(BaseModel):
    loan_id: str
    lender_name: str
    settlement_amount: float
    settlement_percentage: float
    letter: str
    source: str  # "gemini" | "fallback"


class AIHistoryOut(BaseModel):
    id: str
    negotiation_prompt: str
    negotiation_letter: str
    ai_response: str | None
    generated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PaginatedAIHistory(BaseModel):
    items: list[AIHistoryOut]
    total: int
    page: int
    page_size: int
    total_pages: int
