from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.settlement import SettlementRequest, SettlementResponse
from app.services.settlement_service import generate_settlement_recommendations

router = APIRouter(prefix="/api", tags=["Settlement"])


@router.post("/settlement", response_model=SettlementResponse)
def get_settlement_recommendations(
    payload: SettlementRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return generate_settlement_recommendations(db, current_user.id, payload.loan_id)
