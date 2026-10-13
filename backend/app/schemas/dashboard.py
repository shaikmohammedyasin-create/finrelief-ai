from pydantic import BaseModel


class DashboardCards(BaseModel):
    total_loans: int
    outstanding_debt: float
    monthly_emi: float
    monthly_surplus: float
    financial_score: float
    debt_stress: str


class LoanDistributionSlice(BaseModel):
    loan_type: str
    outstanding_amount: float


class ExpenseBar(BaseModel):
    label: str
    amount: float


class DebtTrendPoint(BaseModel):
    month: str
    projected_balance: float


class PriorityHeatEntry(BaseModel):
    lender_name: str
    priority_index: float
    priority: str


class DashboardResponse(BaseModel):
    cards: DashboardCards
    loan_distribution: list[LoanDistributionSlice]
    monthly_expenses_breakdown: list[ExpenseBar]
    debt_trend: list[DebtTrendPoint]
    settlement_progress_percentage: float
    loan_priority_heatmap: list[PriorityHeatEntry]
