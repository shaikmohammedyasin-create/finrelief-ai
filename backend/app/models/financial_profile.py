import uuid

from sqlalchemy import Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base


class FinancialProfile(Base):
    __tablename__ = "financial_profiles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True
    )

    monthly_income: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    monthly_expenses: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    existing_debt: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    savings: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    financial_health_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)

    # --- Relationships ---
    owner = relationship("User", back_populates="financial_profile")

    def __repr__(self) -> str:
        return f"<FinancialProfile user_id={self.user_id} score={self.financial_health_score}>"
