from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class SettlementRequest(BaseModel):
    loan_id: str | None = Field(None, description="If omitted, generates recommendations for all of the user's loans")


class SettlementRecordOut(BaseModel):
    id: str
    loan_id: str
    settlement_percentage: float
    recommended_amount: float
    priority: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SettlementRecommendation(BaseModel):
    loan_id: str
    lender_name: str
    priority_index: float
    priority: str
    settlement_percentage: float
    recommended_amount: float
    outstanding_amount: float
    debt_risk: str
    advice: str


class SettlementResponse(BaseModel):
    recommendations: list[SettlementRecommendation]
