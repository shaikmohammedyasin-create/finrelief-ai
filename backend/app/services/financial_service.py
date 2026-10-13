from sqlalchemy.orm import Session

from app.models.financial_profile import FinancialProfile
from app.models.loan import Loan
from app.schemas.financial import FinancialAnalysisRequest, FinancialAnalysisResponse, FinancialProfileOut
from app.services.financial_engine import (
    calculate_debt_stress_score,
    calculate_debt_to_income_ratio,
    calculate_emi_ratio,
    calculate_financial_health_score,
    calculate_monthly_surplus,
    classify_stress,
)


def _build_recommendation(stress_category: str, monthly_surplus: float) -> str:
    if stress_category == "High":
        return (
            "Your debt stress is high. Prioritize settlement negotiations on your highest-interest "
            "or most overdue loans, and avoid taking on any new credit until your EMI burden decreases."
        )
    if stress_category == "Medium":
        if monthly_surplus < 0:
            return "Your expenses currently exceed your income after EMIs - trim discretionary spending and consider settlement on at least one loan."
        return "Your debt load is manageable but worth monitoring. Consider settling your highest-priority loan to build a cushion."
    return "Your financial position is stable. Continue regular payments and keep building your savings buffer."


def analyze_financial_profile(db: Session, user_id: str, payload: FinancialAnalysisRequest) -> FinancialAnalysisResponse:
    loans = db.query(Loan).filter(Loan.user_id == user_id).all()
    total_monthly_emi = sum(loan.emi for loan in loans)
    total_outstanding_debt = sum(loan.outstanding_amount for loan in loans)
    max_overdue_months = max((loan.overdue_months for loan in loans), default=0)

    emi_ratio = calculate_emi_ratio(total_monthly_emi, payload.monthly_income)
    dti_ratio = calculate_debt_to_income_ratio(total_outstanding_debt, payload.monthly_income)
    monthly_surplus = calculate_monthly_surplus(payload.monthly_income, payload.monthly_expenses, total_monthly_emi)
    stress_score = calculate_debt_stress_score(emi_ratio, dti_ratio, max_overdue_months, monthly_surplus)
    stress_category = classify_stress(stress_score).value
    health_score = calculate_financial_health_score(
        emi_ratio, dti_ratio, payload.savings, payload.monthly_income, monthly_surplus
    )

    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()
    if profile is None:
        profile = FinancialProfile(user_id=user_id)
        db.add(profile)

    profile.monthly_income = payload.monthly_income
    profile.monthly_expenses = payload.monthly_expenses
    profile.existing_debt = total_outstanding_debt
    profile.savings = payload.savings
    profile.financial_health_score = health_score

    db.commit()
    db.refresh(profile)

    return FinancialAnalysisResponse(
        profile=FinancialProfileOut.model_validate(profile),
        emi_ratio=emi_ratio,
        debt_to_income_ratio=dti_ratio,
        monthly_surplus=monthly_surplus,
        debt_stress_score=stress_score,
        stress_category=stress_category,
        financial_health_score=health_score,
        recommendation=_build_recommendation(stress_category, monthly_surplus),
    )


def get_or_none_profile(db: Session, user_id: str) -> FinancialProfile | None:
    return db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()
