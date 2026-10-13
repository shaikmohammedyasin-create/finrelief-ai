from collections import defaultdict

from sqlalchemy.orm import Session

from app.models.loan import Loan
from app.models.settlement import SettlementRecord
from app.schemas.dashboard import (
    DashboardCards,
    DashboardResponse,
    DebtTrendPoint,
    ExpenseBar,
    LoanDistributionSlice,
    PriorityHeatEntry,
)
from app.services.financial_engine import (
    LoanInput,
    calculate_debt_stress_score,
    calculate_debt_to_income_ratio,
    calculate_emi_ratio,
    calculate_monthly_surplus,
    calculate_priority_index,
    classify_stress,
    simulate_debt_repayment,
)
from app.services.financial_service import get_or_none_profile

MONTH_LABELS = [
    "Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6",
    "Month 7", "Month 8", "Month 9", "Month 10", "Month 11", "Month 12",
]


def build_dashboard(db: Session, user_id: str) -> DashboardResponse:
    loans = db.query(Loan).filter(Loan.user_id == user_id).all()
    profile = get_or_none_profile(db, user_id)

    total_outstanding = sum(l.outstanding_amount for l in loans)
    total_emi = sum(l.emi for l in loans)
    monthly_income = profile.monthly_income if profile else 0.0
    monthly_expenses = profile.monthly_expenses if profile else 0.0
    savings = profile.savings if profile else 0.0

    monthly_surplus = calculate_monthly_surplus(monthly_income, monthly_expenses, total_emi)
    emi_ratio = calculate_emi_ratio(total_emi, monthly_income)
    dti_ratio = calculate_debt_to_income_ratio(total_outstanding, monthly_income)
    max_overdue = max((l.overdue_months for l in loans), default=0)
    stress_score = calculate_debt_stress_score(emi_ratio, dti_ratio, max_overdue, monthly_surplus)
    stress_category = classify_stress(stress_score).value
    financial_score = profile.financial_health_score if profile else 0.0

    cards = DashboardCards(
        total_loans=len(loans),
        outstanding_debt=round(total_outstanding, 2),
        monthly_emi=round(total_emi, 2),
        monthly_surplus=monthly_surplus,
        financial_score=financial_score,
        debt_stress=stress_category,
    )

    # --- Loan distribution (pie) ---
    distribution: dict[str, float] = defaultdict(float)
    for loan in loans:
        distribution[loan.loan_type] += loan.outstanding_amount
    loan_distribution = [
        LoanDistributionSlice(loan_type=loan_type, outstanding_amount=round(amount, 2))
        for loan_type, amount in distribution.items()
    ]

    # --- Monthly expenses breakdown (bar) ---
    monthly_expenses_breakdown = [
        ExpenseBar(label="EMI Payments", amount=round(total_emi, 2)),
        ExpenseBar(label="Living Expenses", amount=round(monthly_expenses, 2)),
        ExpenseBar(label="Savings Contribution", amount=round(max(monthly_surplus, 0), 2)),
    ]

    # --- Debt trend (line) - 12-month combined amortization projection ---
    debt_trend: list[DebtTrendPoint] = []
    if total_outstanding > 0 and total_emi > 0:
        weighted_rate = sum(l.interest_rate * l.outstanding_amount for l in loans) / total_outstanding
        schedule = simulate_debt_repayment(total_outstanding, weighted_rate, total_emi, max_months=12)
        for point in schedule:
            label = MONTH_LABELS[point.month - 1] if point.month <= 12 else f"Month {point.month}"
            debt_trend.append(DebtTrendPoint(month=label, projected_balance=point.remaining_balance))

    # --- Settlement progress (progress bar) ---
    loans_with_settlement = db.query(SettlementRecord.loan_id).filter(SettlementRecord.user_id == user_id).distinct().count()
    settlement_progress_percentage = round((loans_with_settlement / len(loans)) * 100, 2) if loans else 0.0

    # --- Loan priority heatmap ---
    heatmap: list[PriorityHeatEntry] = []
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
        index = calculate_priority_index(loan_input, monthly_income)
        priority = "High" if index >= 60 else "Medium" if index >= 30 else "Low"
        heatmap.append(PriorityHeatEntry(lender_name=loan.lender_name, priority_index=index, priority=priority))

    heatmap.sort(key=lambda entry: entry.priority_index, reverse=True)

    return DashboardResponse(
        cards=cards,
        loan_distribution=loan_distribution,
        monthly_expenses_breakdown=monthly_expenses_breakdown,
        debt_trend=debt_trend,
        settlement_progress_percentage=settlement_progress_percentage,
        loan_priority_heatmap=heatmap,
    )
