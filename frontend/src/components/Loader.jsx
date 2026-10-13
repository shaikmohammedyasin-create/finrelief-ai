import React from "react";

export function Spinner({ size = "h-5 w-5" }) {
  return (
    <svg className={`${size} animate-spin text-accent-mint`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
    </svg>
  );
}

export function SkeletonBlock({ className = "h-4 w-full" }) {
  return <div className={`skeleton ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="glass-card space-y-3 p-5">
      <SkeletonBlock className="h-3 w-24" />
      <SkeletonBlock className="h-7 w-32" />
      <SkeletonBlock className="h-3 w-16" />
    </div>
  );
}

export function FullPageLoader({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-ink-secondary">
      <Spinner size="h-8 w-8" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export default Spinner;
