import React from "react";

export default function ProgressBar({ percentage = 0, label }) {
  const clamped = Math.min(100, Math.max(0, percentage));

  return (
    <div>
      {label && (
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-ink-secondary">{label}</span>
          <span className="money font-medium text-ink-primary">{clamped.toFixed(0)}%</span>
        </div>
      )}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-brand-gradient transition-all duration-500 ease-out"
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
