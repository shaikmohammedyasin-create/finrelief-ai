"""
Builds the structured prompt sent to Gemini (and the borrower-detail context
the rule-based fallback also uses), so both code paths stay consistent.
"""
from dataclasses import dataclass


@dataclass
class NegotiationContext:
    borrower_name: str
    monthly_income: float
    monthly_expenses: float
    lender_name: str
    loan_type: str
    outstanding_amount: float
    overdue_months: int
    interest_rate: float
    settlement_amount: float
    settlement_percentage: float


def build_negotiation_prompt(ctx: NegotiationContext) -> str:
    return f"""You are an expert financial hardship negotiator writing on behalf of a borrower.

Write a professional, polite, and firm settlement negotiation email to a lender, using the details below.

Borrower details:
- Name: {ctx.borrower_name}
- Monthly income: {ctx.monthly_income:.2f}
- Monthly expenses: {ctx.monthly_expenses:.2f}

Loan details:
- Lender: {ctx.lender_name}
- Loan type: {ctx.loan_type}
- Outstanding amount: {ctx.outstanding_amount:.2f}
- Overdue period: {ctx.overdue_months} months
- Interest rate: {ctx.interest_rate:.2f}%

Proposed settlement:
- Settlement amount: {ctx.settlement_amount:.2f} ({ctx.settlement_percentage:.1f}% of outstanding balance)

Requirements:
- Address the letter to the lender's collections/settlements department.
- Briefly and honestly explain the financial hardship without oversharing personal details.
- Clearly propose the settlement amount as a full-and-final settlement offer.
- Request written confirmation of any agreement before payment.
- Keep a respectful, non-confrontational, professional tone throughout.
- Sign off with the borrower's name.
- Output only the email body - no subject line, no commentary, no markdown formatting.
"""
