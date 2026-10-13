from pydantic import BaseModel, ConfigDict, Field


class FinancialAnalysisRequest(BaseModel):
    monthly_income: float = Field(..., gt=0)
    monthly_expenses: float = Field(..., ge=0)
    savings: float = Field(0, ge=0)


class FinancialProfileOut(BaseModel):
    id: str
    user_id: str
    monthly_income: float
    monthly_expenses: float
    existing_debt: float
    savings: float
    financial_health_score: float

    model_config = ConfigDict(from_attributes=True)


class FinancialAnalysisResponse(BaseModel):
    profile: FinancialProfileOut
    emi_ratio: float
    debt_to_income_ratio: float
    monthly_surplus: float
    debt_stress_score: float
    stress_category: str
    financial_health_score: float
    recommendation: str
