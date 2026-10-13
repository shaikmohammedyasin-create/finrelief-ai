import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base


class AIHistory(Base):
    __tablename__ = "ai_history"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    negotiation_prompt: Mapped[str] = mapped_column(Text, nullable=False)
    negotiation_letter: Mapped[str] = mapped_column(Text, nullable=False)
    ai_response: Mapped[str] = mapped_column(Text, nullable=True)  # raw model response / metadata (e.g. "gemini" or "fallback")
    generated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # --- Relationships ---
    owner = relationship("User", back_populates="ai_history")

    def __repr__(self) -> str:
        return f"<AIHistory id={self.id} user_id={self.user_id}>"
