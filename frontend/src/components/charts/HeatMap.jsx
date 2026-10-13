import React from "react";

const PRIORITY_STYLES = {
  High: "bg-accent-rose/20 border-accent-rose/40 text-accent-rose",
  Medium: "bg-accent-amber/20 border-accent-amber/40 text-accent-amber",
  Low: "bg-accent-mint/20 border-accent-mint/40 text-accent-mint",
};

export default function LoanPriorityHeatmap({ data }) {
  if (!data || data.length === 0) {
    return <p className="py-8 text-center text-sm text-ink-muted">Add loans to see which ones need attention first.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {data.map((entry) => (
        <div
          key={entry.lender_name}
          className={`rounded-xl border p-3.5 transition-transform hover:scale-[1.03] ${PRIORITY_STYLES[entry.priority] || PRIORITY_STYLES.Low}`}
        >
          <p className="truncate text-sm font-medium text-ink-primary">{entry.lender_name}</p>
          <p className="mt-1 text-xs opacity-90">{entry.priority} priority</p>
          <p className="money mt-2 text-xs opacity-75">Index: {entry.priority_index.toFixed(0)}</p>
        </div>
      ))}
    </div>
  );
}
