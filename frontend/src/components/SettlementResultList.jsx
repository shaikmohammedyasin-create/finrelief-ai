import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const PRIORITY_BADGE = { High: "badge-high", Medium: "badge-medium", Low: "badge-low" };

export default function SettlementResultList({ recommendations }) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="glass-card p-10 text-center">
        <p className="text-ink-secondary">No recommendations yet. Generate settlement predictions to see them here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations.map((rec) => (
        <div key={rec.loan_id} className="glass-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-display font-semibold text-ink-primary">{rec.lender_name}</p>
              <p className="mt-1 text-sm text-ink-secondary">{rec.debt_risk}</p>
            </div>
            <span className={`badge ${PRIORITY_BADGE[rec.priority] || "badge-low"}`}>{rec.priority} Priority</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-ink-muted">Outstanding</p>
              <p className="money mt-1 font-medium text-ink-primary">₹{rec.outstanding_amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-ink-muted">Settlement %</p>
              <p className="money mt-1 font-medium text-accent-mint">{rec.settlement_percentage}%</p>
            </div>
            <div>
              <p className="text-xs text-ink-muted">Recommended Amount</p>
              <p className="money mt-1 font-medium text-ink-primary">₹{rec.recommended_amount.toLocaleString()}</p>
            </div>
            <div className="flex items-end">
              <Link
                to={`/app/negotiation?loanId=${rec.loan_id}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-indigo hover:underline"
              >
                Generate letter <FiArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <p className="mt-3 text-sm text-ink-secondary">{rec.advice}</p>
        </div>
      ))}
    </div>
  );
}
