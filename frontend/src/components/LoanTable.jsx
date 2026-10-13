import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const LOAN_TYPE_BADGE = "bg-accent-indigo/15 text-accent-indigo";

function overdueBadge(months) {
  if (months >= 6) return "badge-high";
  if (months >= 1) return "badge-medium";
  return "badge-low";
}

export default function LoanTable({ loans, onEdit, onDelete }) {
  if (!loans || loans.length === 0) {
    return (
      <div className="glass-card p-10 text-center">
        <p className="text-ink-secondary">No loans found. Add your first loan to get started.</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wide text-ink-muted">
            <th className="px-5 py-3.5 font-medium">Lender</th>
            <th className="px-5 py-3.5 font-medium">Type</th>
            <th className="px-5 py-3.5 font-medium">Outstanding</th>
            <th className="px-5 py-3.5 font-medium">EMI</th>
            <th className="px-5 py-3.5 font-medium">Interest</th>
            <th className="px-5 py-3.5 font-medium">Overdue</th>
            <th className="px-5 py-3.5 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id} className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]">
              <td className="px-5 py-4 font-medium text-ink-primary">{loan.lender_name}</td>
              <td className="px-5 py-4">
                <span className={`badge ${LOAN_TYPE_BADGE}`}>{loan.loan_type}</span>
              </td>
              <td className="money px-5 py-4 text-ink-primary">₹{loan.outstanding_amount.toLocaleString()}</td>
              <td className="money px-5 py-4 text-ink-secondary">₹{loan.emi.toLocaleString()}</td>
              <td className="money px-5 py-4 text-ink-secondary">{loan.interest_rate}%</td>
              <td className="px-5 py-4">
                <span className={`badge ${overdueBadge(loan.overdue_months)}`}>
                  {loan.overdue_months === 0 ? "Current" : `${loan.overdue_months} mo`}
                </span>
              </td>
              <td className="px-5 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(loan)}
                    aria-label={`Edit ${loan.lender_name}`}
                    className="rounded-md p-2 text-ink-secondary transition-colors hover:bg-white/5 hover:text-accent-indigo"
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(loan)}
                    aria-label={`Delete ${loan.lender_name}`}
                    className="rounded-md p-2 text-ink-secondary transition-colors hover:bg-accent-rose/10 hover:text-accent-rose"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
