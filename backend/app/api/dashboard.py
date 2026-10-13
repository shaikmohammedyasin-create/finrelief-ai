from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.dashboard import DashboardResponse
from app.services.dashboard_service import build_dashboard

router = APIRouter(prefix="/api", tags=["Dashboard"])


@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return build_dashboard(db, current_user.id)
