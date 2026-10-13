"""
Financial engine.

Pure, deterministic calculation functions with no DB or I/O dependencies,
so they're trivially unit-testable and reusable from any service (financial
analysis, settlement recommendation, dashboard aggregation, AI prompt
construction). Every function takes plain numbers/dicts in and returns
plain numbers/dicts out.
"""
import math
from dataclasses import dataclass, field
from enum import Enum
from typing import Iterable


class StressCategory(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class Priority(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


# ---------------------------------------------------------------------------
# Core ratios
# ---------------------------------------------------------------------------

def calculate_emi_ratio(total_monthly_emi: float, monthly_income: float) -> float:
    """EMI as a percentage of monthly income. Returns 0-100+ (can exceed 100 if over-leveraged)."""
    if monthly_income <= 0:
        return 100.0
    return round((total_monthly_emi / monthly_income) * 100, 2)


def calculate_debt_to_income_ratio(total_outstanding_debt: float, monthly_income: float) -> float:
    """
    Debt-to-income expressed as outstanding debt divided by ANNUAL income (%),
    the conventional way lenders express DTI for total debt load.
    """
    annual_income = monthly_income * 12
    if annual_income <= 0:
        return 100.0
    return round((total_outstanding_debt / annual_income) * 100, 2)


def calculate_monthly_surplus(monthly_income: float, monthly_expenses: float, total_monthly_emi: float = 0.0) -> float:
    """Cash left over after living expenses and EMI obligations. Can be negative."""
    return round(monthly_income - monthly_expenses - total_monthly_emi, 2)


def calculate_debt_stress_score(emi_ratio: float, dti_ratio: float, overdue_months: int, monthly_surplus: float) -> float:
    """
    Composite 0-100 stress score (higher = more distressed).

    Weighting rationale:
      - EMI ratio (35%): the most immediate cash-flow pressure signal.
      - DTI ratio (25%): overall leverage relative to earning power.
      - Overdue months (25%): a direct, hard signal of active default risk,
        capped at 24 months so a very old default doesn't dominate the score.
      - Negative surplus (15%): a household already running a deficit is in
        acute distress regardless of ratios.
    """
    emi_component = min(emi_ratio, 150) / 150 * 35
    dti_component = min(dti_ratio, 100) / 100 * 25
    overdue_component = min(overdue_months, 24) / 24 * 25
    surplus_component = 15 if monthly_surplus < 0 else max(0, 15 - (monthly_surplus / 100))
    surplus_component = min(surplus_component, 15)

    score = emi_component + dti_component + overdue_component + surplus_component
    return round(min(max(score, 0), 100), 2)


def classify_stress(score: float) -> StressCategory:
    if score >= 66:
        return StressCategory.HIGH
    if score >= 33:
        return StressCategory.MEDIUM
    return StressCategory.LOW


def calculate_financial_health_score(emi_ratio: float, dti_ratio: float, savings: float, monthly_income: float, monthly_surplus: float) -> float:
    """
    Composite 0-100 health score (higher = healthier), the inverse framing
    of stress: rewards low leverage, positive surplus, and a savings buffer
    relative to income.
    """
    emi_health = max(0, 100 - min(emi_ratio, 100)) * 0.35
    dti_health = max(0, 100 - min(dti_ratio, 100)) * 0.25
    surplus_health = (min(max(monthly_surplus, -monthly_income), monthly_income) / monthly_income * 50 + 50) * 0.25 if monthly_income > 0 else 0
    savings_months = savings / monthly_income if monthly_income > 0 else 0
    savings_health = min(savings_months / 6, 1) * 100 * 0.15  # 6 months' income = full marks

    score = emi_health + dti_health + surplus_health + savings_health
    return round(min(max(score, 0), 100), 2)


# ---------------------------------------------------------------------------
# Per-loan priority / settlement recommendation
# ---------------------------------------------------------------------------

@dataclass
class LoanInput:
    id: str
    lender_name: str
    loan_type: str
    total_amount: float
    outstanding_amount: float
    emi: float
    interest_rate: float
    overdue_months: int


@dataclass
class SettlementResult:
    loan_id: str
    priority_index: float
    priority: Priority
    settlement_percentage: float
    recommended_amount: float
    debt_risk: str
    advice: str


def calculate_priority_index(loan: LoanInput, monthly_income: float) -> float:
    """
    Higher index = more urgent to address. Blends overdue severity, interest
    cost, and the loan's share of income - unsecured/high-interest, badly
    overdue loans naturally bubble to the top.
    """
    overdue_weight = min(loan.overdue_months, 24) / 24 * 40
    interest_weight = min(loan.interest_rate, 40) / 40 * 30
    income_share = (loan.emi / monthly_income * 100) if monthly_income > 0 else 100
    income_weight = min(income_share, 100) / 100 * 30
    return round(overdue_weight + interest_weight + income_weight, 2)


def _priority_from_index(index: float) -> Priority:
    if index >= 60:
        return Priority.HIGH
    if index >= 30:
        return Priority.MEDIUM
    return Priority.LOW


def rank_loans(loans: Iterable[LoanInput], monthly_income: float) -> list[tuple[LoanInput, float]]:
    """Returns loans paired with their priority index, sorted most-urgent first."""
    scored = [(loan, calculate_priority_index(loan, monthly_income)) for loan in loans]
    return sorted(scored, key=lambda pair: pair[1], reverse=True)


def recommend_settlement(loan: LoanInput, monthly_income: float, monthly_surplus: float) -> SettlementResult:
    """
    Settlement percentage logic (of outstanding_amount that a lender might
    reasonably accept as full-and-final settlement):

      - Base settlement offer starts at 40% of outstanding balance.
      - +2% per overdue month (older defaults = lower recovery expectation
        for the lender, so they're typically more willing to settle low),
        capped at +30%.
      - +10% if the borrower's surplus is negative (acute inability to pay
        signals urgency, supporting a lower settlement ask).
      - -10% if interest rate is high (>24%) since high-interest unsecured
        lenders often have more room to negotiate; kept as a discount off
        the *ask*, i.e. borrower can push for more reduction.
      - Clamped to a realistic 20%-70% settlement band.
    """
    priority_index = calculate_priority_index(loan, monthly_income)
    priority = _priority_from_index(priority_index)

    reduction = 30 + min(loan.overdue_months, 15) * 2
    if monthly_surplus < 0:
        reduction += 10
    if loan.interest_rate > 24:
        reduction += 10

    settlement_percentage = max(20.0, min(70.0, 100 - reduction))
    recommended_amount = round(loan.outstanding_amount * settlement_percentage / 100, 2)

    if priority_index >= 60:
        debt_risk = "High - active default risk, prioritize negotiation immediately"
    elif priority_index >= 30:
        debt_risk = "Medium - manageable now but trending toward default if unaddressed"
    else:
        debt_risk = "Low - current risk is limited, monitor and pay down opportunistically"

    if monthly_surplus < 0:
        advice = (
            "Your expenses currently exceed your income after EMIs. Prioritize this loan "
            "for settlement to reduce monthly obligations before pursuing others."
        )
    elif priority == Priority.HIGH:
        advice = "This loan carries the highest urgency - initiate settlement negotiation with the lender first."
    else:
        advice = "This loan is stable for now. Continue regular payments and revisit settlement if circumstances change."

    return SettlementResult(
        loan_id=loan.id,
        priority_index=priority_index,
        priority=priority,
        settlement_percentage=round(settlement_percentage, 2),
        recommended_amount=recommended_amount,
        debt_risk=debt_risk,
        advice=advice,
    )


# ---------------------------------------------------------------------------
# Repayment simulation
# ---------------------------------------------------------------------------

@dataclass
class RepaymentMonth:
    month: int
    remaining_balance: float
    principal_paid: float
    interest_paid: float


def simulate_debt_repayment(outstanding_amount: float, annual_interest_rate: float, monthly_payment: float, max_months: int = 360) -> list[RepaymentMonth]:
    """
    Amortization simulation: given a fixed monthly payment, project the
    month-by-month payoff schedule. Stops early if the payment can never
    cover accruing interest (returns as many months as computed, capped
    at max_months, to avoid an infinite loop).
    """
    monthly_rate = annual_interest_rate / 100 / 12
    balance = outstanding_amount
    schedule: list[RepaymentMonth] = []

    for month in range(1, max_months + 1):
        if balance <= 0:
            break

        interest = balance * monthly_rate
        principal = monthly_payment - interest

        if principal <= 0:
            # Payment doesn't even cover interest - debt will never be paid off this way.
            schedule.append(RepaymentMonth(month=month, remaining_balance=round(balance, 2), principal_paid=0.0, interest_paid=round(interest, 2)))
            break

        principal = min(principal, balance)
        balance = round(balance - principal, 2)
        schedule.append(RepaymentMonth(month=month, remaining_balance=max(balance, 0.0), principal_paid=round(principal, 2), interest_paid=round(interest, 2)))

    return schedule
