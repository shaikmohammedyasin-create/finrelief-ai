import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base


class SettlementRecord(Base):
    __tablename__ = "settlement_records"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    loan_id: Mapped[str] = mapped_column(String(36), ForeignKey("loans.id", ondelete="CASCADE"), nullable=False, index=True)

    settlement_percentage: Mapped[float] = mapped_column(Float, nullable=False)
    recommended_amount: Mapped[float] = mapped_column(Float, nullable=False)
    priority: Mapped[str] = mapped_column(String(20), nullable=False)  # Low | Medium | High
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # --- Relationships ---
    owner = relationship("User", back_populates="settlement_records")
    loan = relationship("Loan", back_populates="settlement_records")

    def __repr__(self) -> str:
        return f"<SettlementRecord id={self.id} loan_id={self.loan_id} pct={self.settlement_percentage}>"
