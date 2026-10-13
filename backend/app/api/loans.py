from fastapi import APIRouter, Depends, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.loan import LoanCreate, LoanOut, LoanUpdate, PaginatedLoans
from app.services.loan_service import (
    create_loan,
    delete_loan,
    export_loans_csv,
    get_loan_or_404,
    list_loans,
    update_loan,
)

router = APIRouter(prefix="/api", tags=["Loans"])


@router.post("/loan", response_model=LoanOut, status_code=status.HTTP_201_CREATED)
def add_loan(payload: LoanCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return create_loan(db, current_user.id, payload)


@router.get("/loans", response_model=PaginatedLoans)
def get_loans(
    search: str | None = Query(None, description="Search by lender name"),
    loan_type: str | None = Query(None),
    sort_by: str = Query("due_date"),
    sort_order: str = Query("asc", pattern="^(asc|desc)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    items, total = list_loans(db, current_user.id, search, loan_type, sort_by, sort_order, page, page_size)
    total_pages = max(1, (total + page_size - 1) // page_size)
    return PaginatedLoans(items=items, total=total, page=page, page_size=page_size, total_pages=total_pages)


@router.get("/loans/export", response_class=StreamingResponse)
def export_loans(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    csv_content = export_loans_csv(db, current_user.id)
    return StreamingResponse(
        iter([csv_content]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=loans_export.csv"},
    )


@router.get("/loan/{loan_id}", response_model=LoanOut)
def get_loan(loan_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_loan_or_404(db, current_user.id, loan_id)


@router.put("/loan/{loan_id}", response_model=LoanOut)
def edit_loan(loan_id: str, payload: LoanUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return update_loan(db, current_user.id, loan_id, payload)


@router.delete("/loan/{loan_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_loan(loan_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    delete_loan(db, current_user.id, loan_id)
    return None
