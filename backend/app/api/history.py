from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.negotiation import PaginatedAIHistory
from app.services.history_service import delete_history_entry, list_history

router = APIRouter(prefix="/api", tags=["AI History"])


@router.get("/history", response_model=PaginatedAIHistory)
def get_history(
    search: str | None = Query(None, description="Search within generated letters"),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    items, total = list_history(db, current_user.id, search, page, page_size)
    total_pages = max(1, (total + page_size - 1) // page_size)
    return PaginatedAIHistory(items=items, total=total, page=page, page_size=page_size, total_pages=total_pages)


@router.delete("/history/{history_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_history_entry(history_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    delete_history_entry(db, current_user.id, history_id)
    return None
