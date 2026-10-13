import React from "react";

const CATEGORY_COLOR = {
  Low: "#34D399",
  Medium: "#F59E0B",
  High: "#F43F5E",
};

export default function StressMeter({ score, category }) {
  const clamped = Math.min(100, Math.max(0, score));
  const color = CATEGORY_COLOR[category] || CATEGORY_COLOR.Low;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(clamped / 100) * 326.7} 326.7`}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="money text-2xl font-semibold text-ink-primary">{clamped.toFixed(0)}</span>
          <span className="text-[10px] uppercase tracking-wide text-ink-muted">/ 100</span>
        </div>
      </div>
      <span className="badge" style={{ backgroundColor: `${color}26`, color }}>
        {category} Stress
      </span>
    </div>
  );
}
