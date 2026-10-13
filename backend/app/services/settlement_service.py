from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.loan import Loan
from app.models.settlement import SettlementRecord
from app.schemas.settlement import SettlementRecommendation, SettlementResponse
from app.services.financial_engine import LoanInput, calculate_monthly_surplus, recommend_settlement
from app.services.financial_service import get_or_none_profile


def generate_settlement_recommendations(db: Session, user_id: str, loan_id: str | None = None) -> SettlementResponse:
    profile = get_or_none_profile(db, user_id)
    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Complete your financial profile (POST /api/financial-analysis) before requesting settlement recommendations.",
        )

    query = db.query(Loan).filter(Loan.user_id == user_id)
    if loan_id:
        query = query.filter(Loan.id == loan_id)
    loans = query.all()

    if not loans:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No matching loans found")

    total_emi = sum(l.emi for l in loans)
    monthly_surplus = calculate_monthly_surplus(profile.monthly_income, profile.monthly_expenses, total_emi)

    recommendations: list[SettlementRecommendation] = []
    for loan in loans:
        loan_input = LoanInput(
            id=loan.id,
            lender_name=loan.lender_name,
            loan_type=loan.loan_type,
            total_amount=loan.total_amount,
            outstanding_amount=loan.outstanding_amount,
            emi=loan.emi,
            interest_rate=loan.interest_rate,
            overdue_months=loan.overdue_months,
        )
        result = recommend_settlement(loan_input, profile.monthly_income, monthly_surplus)

        record = SettlementRecord(
            user_id=user_id,
            loan_id=loan.id,
            settlement_percentage=result.settlement_percentage,
            recommended_amount=result.recommended_amount,
            priority=result.priority.value,
        )
        db.add(record)

        recommendations.append(
            SettlementRecommendation(
                loan_id=loan.id,
                lender_name=loan.lender_name,
                priority_index=result.priority_index,
                priority=result.priority.value,
                settlement_percentage=result.settlement_percentage,
                recommended_amount=result.recommended_amount,
                outstanding_amount=loan.outstanding_amount,
                debt_risk=result.debt_risk,
                advice=result.advice,
            )
        )

    db.commit()

    recommendations.sort(key=lambda r: r.priority_index, reverse=True)
    return SettlementResponse(recommendations=recommendations)
