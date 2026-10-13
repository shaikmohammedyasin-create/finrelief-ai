import uuid
from datetime import datetime

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # --- Relationships ---
    loans = relationship("Loan", back_populates="owner", cascade="all, delete-orphan")
    financial_profile = relationship(
        "FinancialProfile", back_populates="owner", uselist=False, cascade="all, delete-orphan"
    )
    settlement_records = relationship("SettlementRecord", back_populates="owner", cascade="all, delete-orphan")
    ai_history = relationship("AIHistory", back_populates="owner", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email}>"
