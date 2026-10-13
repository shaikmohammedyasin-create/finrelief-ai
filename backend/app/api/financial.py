from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.financial import FinancialAnalysisRequest, FinancialAnalysisResponse
from app.services.financial_service import analyze_financial_profile

router = APIRouter(prefix="/api", tags=["Financial"])


@router.post("/financial-analysis", response_model=FinancialAnalysisResponse)
def run_financial_analysis(
    payload: FinancialAnalysisRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return analyze_financial_profile(db, current_user.id, payload)
