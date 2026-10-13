import csv
import io
from datetime import date

from fastapi import HTTPException, status
from sqlalchemy import asc, desc
from sqlalchemy.orm import Session

from app.models.loan import Loan
from app.schemas.loan import LoanCreate, LoanUpdate

SORTABLE_FIELDS = {
    "lender_name": Loan.lender_name,
    "outstanding_amount": Loan.outstanding_amount,
    "emi": Loan.emi,
    "interest_rate": Loan.interest_rate,
    "overdue_months": Loan.overdue_months,
    "due_date": Loan.due_date,
}


def create_loan(db: Session, user_id: str, payload: LoanCreate) -> Loan:
    loan = Loan(user_id=user_id, **payload.model_dump())
    db.add(loan)
    db.commit()
    db.refresh(loan)
    return loan


def get_loan_or_404(db: Session, user_id: str, loan_id: str) -> Loan:
    loan = db.query(Loan).filter(Loan.id == loan_id, Loan.user_id == user_id).first()
    if loan is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Loan not found")
    return loan


def list_loans(
    db: Session,
    user_id: str,
    search: str | None = None,
    loan_type: str | None = None,
    sort_by: str = "due_date",
    sort_order: str = "asc",
    page: int = 1,
    page_size: int = 10,
) -> tuple[list[Loan], int]:
    query = db.query(Loan).filter(Loan.user_id == user_id)

    if search:
        like_pattern = f"%{search}%"
        query = query.filter(Loan.lender_name.ilike(like_pattern))

    if loan_type:
        query = query.filter(Loan.loan_type == loan_type)

    sort_column = SORTABLE_FIELDS.get(sort_by, Loan.due_date)
    query = query.order_by(desc(sort_column) if sort_order == "desc" else asc(sort_column))

    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    return items, total


def update_loan(db: Session, user_id: str, loan_id: str, payload: LoanUpdate) -> Loan:
    loan = get_loan_or_404(db, user_id, loan_id)
    updates = payload.model_dump(exclude_unset=True)

    # Guard cross-field invariant on partial updates too.
    new_total = updates.get("total_amount", loan.total_amount)
    new_outstanding = updates.get("outstanding_amount", loan.outstanding_amount)
    if new_outstanding > new_total:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="outstanding_amount cannot exceed total_amount",
        )

    for field, value in updates.items():
        setattr(loan, field, value)

    db.commit()
    db.refresh(loan)
    return loan


def delete_loan(db: Session, user_id: str, loan_id: str) -> None:
    loan = get_loan_or_404(db, user_id, loan_id)
    db.delete(loan)
    db.commit()


def export_loans_csv(db: Session, user_id: str) -> str:
    loans = db.query(Loan).filter(Loan.user_id == user_id).all()

    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow([
        "id", "lender_name", "loan_type", "total_amount", "outstanding_amount",
        "emi", "interest_rate", "overdue_months", "due_date",
    ])
    for loan in loans:
        writer.writerow([
            loan.id, loan.lender_name, loan.loan_type, loan.total_amount, loan.outstanding_amount,
            loan.emi, loan.interest_rate, loan.overdue_months,
            loan.due_date.isoformat() if isinstance(loan.due_date, date) else "",
        ])
    return buffer.getvalue()
