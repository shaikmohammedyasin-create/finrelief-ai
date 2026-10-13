from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.negotiation import NegotiationLetterRequest, NegotiationLetterResponse
from app.services.negotiation_service import generate_letter_for_loan

router = APIRouter(prefix="/api", tags=["Negotiation"])


@router.post("/generate-letter", response_model=NegotiationLetterResponse)
def generate_letter(
    payload: NegotiationLetterRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return generate_letter_for_loan(db, current_user, payload)
