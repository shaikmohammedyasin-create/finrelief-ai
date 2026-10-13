from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.user import UserOut, UserProfileUpdate

router = APIRouter(prefix="/api", tags=["User"])


@router.get("/profile", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/profile", response_model=UserOut)
def update_profile(
    payload: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updates = payload.model_dump(exclude_unset=True)

    if "email" in updates and updates["email"] != current_user.email:
        existing = db.query(User).filter(User.email == updates["email"]).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists")

    for field, value in updates.items():
        setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)
    return current_user
