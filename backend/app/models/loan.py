import uuid
from datetime import date

from sqlalchemy import Date, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base


class Loan(Base):
    __tablename__ = "loans"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    lender_name: Mapped[str] = mapped_column(String(150), nullable=False)
    loan_type: Mapped[str] = mapped_column(String(50), nullable=False)  # e.g. Personal, Credit Card, Auto, Home
    total_amount: Mapped[float] = mapped_column(Float, nullable=False)
    outstanding_amount: Mapped[float] = mapped_column(Float, nullable=False)
    emi: Mapped[float] = mapped_column(Float, nullable=False)
    interest_rate: Mapped[float] = mapped_column(Float, nullable=False)
    overdue_months: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    due_date: Mapped[date] = mapped_column(Date, nullable=True)

    # --- Relationships ---
    owner = relationship("User", back_populates="loans")
    settlement_records = relationship("SettlementRecord", back_populates="loan", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Loan id={self.id} lender={self.lender_name} outstanding={self.outstanding_amount}>"
