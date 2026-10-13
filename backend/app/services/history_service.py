from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.ai_history import AIHistory


def list_history(db: Session, user_id: str, search: str | None, page: int, page_size: int) -> tuple[list[AIHistory], int]:
    query = db.query(AIHistory).filter(AIHistory.user_id == user_id)

    if search:
        like_pattern = f"%{search}%"
        query = query.filter(AIHistory.negotiation_letter.ilike(like_pattern))

    query = query.order_by(AIHistory.generated_at.desc())
    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    return items, total


def delete_history_entry(db: Session, user_id: str, history_id: str) -> None:
    entry = db.query(AIHistory).filter(AIHistory.id == history_id, AIHistory.user_id == user_id).first()
    if entry is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="History entry not found")
    db.delete(entry)
    db.commit()
