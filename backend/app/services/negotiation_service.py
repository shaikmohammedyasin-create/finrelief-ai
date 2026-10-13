from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.ai_history import AIHistory
from app.models.loan import Loan
from app.models.user import User
from app.schemas.negotiation import NegotiationLetterRequest, NegotiationLetterResponse
from app.services.ai.negotiation_engine import generate_negotiation_letter
from app.services.ai.prompt_builder import NegotiationContext
from app.services.financial_engine import LoanInput, calculate_monthly_surplus, recommend_settlement
from app.services.financial_service import get_or_none_profile


def generate_letter_for_loan(db: Session, user: User, payload: NegotiationLetterRequest) -> NegotiationLetterResponse:
    loan = db.query(Loan).filter(Loan.id == payload.loan_id, Loan.user_id == user.id).first()
    if loan is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan not found")

    profile = get_or_none_profile(db, user.id)
    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Complete your financial profile before generating a negotiation letter.",
        )

    if payload.settlement_percentage is not None:
        settlement_percentage = payload.settlement_percentage
    else:
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
        monthly_surplus = calculate_monthly_surplus(profile.monthly_income, profile.monthly_expenses, loan.emi)
        result = recommend_settlement(loan_input, profile.monthly_income, monthly_surplus)
        settlement_percentage = result.settlement_percentage

    settlement_amount = round(loan.outstanding_amount * settlement_percentage / 100, 2)

    ctx = NegotiationContext(
        borrower_name=user.name,
        monthly_income=profile.monthly_income,
        monthly_expenses=profile.monthly_expenses,
        lender_name=loan.lender_name,
        loan_type=loan.loan_type,
        outstanding_amount=loan.outstanding_amount,
        overdue_months=loan.overdue_months,
        interest_rate=loan.interest_rate,
        settlement_amount=settlement_amount,
        settlement_percentage=settlement_percentage,
    )

    result = generate_negotiation_letter(ctx)

    history_entry = AIHistory(
        user_id=user.id,
        negotiation_prompt=result.prompt,
        negotiation_letter=result.letter,
        ai_response=result.source,
    )
    db.add(history_entry)
    db.commit()

    return NegotiationLetterResponse(
        loan_id=loan.id,
        lender_name=loan.lender_name,
        settlement_amount=settlement_amount,
        settlement_percentage=settlement_percentage,
        letter=result.letter,
        source=result.source,
    )
