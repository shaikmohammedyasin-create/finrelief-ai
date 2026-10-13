"""
Deterministic, template-based negotiation letter.

This is the guaranteed fallback: no external dependency, no network call,
always produces a complete, professional letter from the same context
object used to build the Gemini prompt.
"""
from app.services.ai.prompt_builder import NegotiationContext


def generate_rule_based_letter(ctx: NegotiationContext) -> str:
    hardship_line = (
        "Due to a combination of rising monthly expenses and constrained income, I am currently unable "
        "to continue servicing this debt under its existing terms."
        if ctx.monthly_expenses >= ctx.monthly_income
        else "Due to ongoing financial constraints, continuing to service this debt under its existing terms "
        "has become increasingly difficult."
    )

    return f"""Dear {ctx.lender_name} Settlements Department,

I am writing regarding my {ctx.loan_type} account, currently showing an outstanding balance of {ctx.outstanding_amount:.2f} and {ctx.overdue_months} month(s) overdue.

{hardship_line} Rather than allow this account to fall further into arrears, I want to proactively resolve it in good faith.

I am proposing a full-and-final settlement of {ctx.settlement_amount:.2f} ({ctx.settlement_percentage:.1f}% of the outstanding balance), payable promptly upon your written acceptance of this offer. I believe this reflects a fair outcome for both parties given my current financial circumstances and allows {ctx.lender_name} to recover a meaningful portion of the balance without further collection costs or delay.

Should you be able to accept this proposal, I kindly request written confirmation of the settlement terms - including that the account will be reported as "settled" and that no further amounts will be owed - before I proceed with payment.

I appreciate your consideration and look forward to resolving this matter amicably.

Sincerely,
{ctx.borrower_name}
"""
