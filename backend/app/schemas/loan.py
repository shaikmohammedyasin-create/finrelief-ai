from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

VALID_LOAN_TYPES = {"Personal", "Credit Card", "Auto", "Home", "Education", "Business", "Other"}


class LoanBase(BaseModel):
    lender_name: str = Field(..., min_length=1, max_length=150)
    loan_type: str
    total_amount: float = Field(..., gt=0)
    outstanding_amount: float = Field(..., ge=0)
    emi: float = Field(..., ge=0)
    interest_rate: float = Field(..., ge=0, le=100)
    overdue_months: int = Field(0, ge=0)
    due_date: date | None = None

    @field_validator("loan_type")
    @classmethod
    def validate_loan_type(cls, value: str) -> str:
        if value not in VALID_LOAN_TYPES:
            raise ValueError(f"loan_type must be one of {sorted(VALID_LOAN_TYPES)}")
        return value

    @field_validator("outstanding_amount")
    @classmethod
    def outstanding_not_greater_than_total(cls, value: float, info) -> float:
        total = info.data.get("total_amount")
        if total is not None and value > total:
            raise ValueError("outstanding_amount cannot exceed total_amount")
        return value


class LoanCreate(LoanBase):
    pass


class LoanUpdate(BaseModel):
    lender_name: str | None = Field(None, min_length=1, max_length=150)
    loan_type: str | None = None
    total_amount: float | None = Field(None, gt=0)
    outstanding_amount: float | None = Field(None, ge=0)
    emi: float | None = Field(None, ge=0)
    interest_rate: float | None = Field(None, ge=0, le=100)
    overdue_months: int | None = Field(None, ge=0)
    due_date: date | None = None

    @field_validator("loan_type")
    @classmethod
    def validate_loan_type(cls, value: str | None) -> str | None:
        if value is not None and value not in VALID_LOAN_TYPES:
            raise ValueError(f"loan_type must be one of {sorted(VALID_LOAN_TYPES)}")
        return value


class LoanOut(LoanBase):
    id: str
    user_id: str

    model_config = ConfigDict(from_attributes=True)


class PaginatedLoans(BaseModel):
    items: list[LoanOut]
    total: int
    page: int
    page_size: int
    total_pages: int
