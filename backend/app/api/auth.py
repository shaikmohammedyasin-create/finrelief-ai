from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.auth import AuthResponse, LogoutRequest, RefreshRequest, TokenPair
from app.schemas.user import UserLogin, UserOut, UserRegister
from app.services.auth_service import (
    authenticate_user,
    issue_token_pair,
    logout_user,
    refresh_access_token,
    register_user,
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    user = register_user(db, payload)
    tokens = issue_token_pair(user.id)
    return AuthResponse(user=UserOut.model_validate(user), tokens=tokens)


@router.post("/login", response_model=AuthResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, payload.email, payload.password)
    tokens = issue_token_pair(user.id)
    return AuthResponse(user=UserOut.model_validate(user), tokens=tokens)


@router.post("/refresh", response_model=TokenPair)
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
    """
    Issues a new access + refresh token pair. The previous refresh token is
    revoked (rotation), so the client MUST store the new refresh_token
    returned here and discard the old one.
    """
    return refresh_access_token(db, payload.refresh_token)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(payload: LogoutRequest, db: Session = Depends(get_db)):
    logout_user(db, payload.refresh_token)
    return None


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    """Handy endpoint for the frontend to verify a token / hydrate auth state on load."""
    return current_user
