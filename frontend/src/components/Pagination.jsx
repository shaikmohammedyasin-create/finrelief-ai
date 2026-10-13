import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-1.5 pt-4">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Previous page"
        className="rounded-lg p-2 text-ink-secondary transition-colors hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none"
      >
        <FiChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, idx) => {
        const prev = pages[idx - 1];
        const showEllipsis = prev && p - prev > 1;
        return (
          <React.Fragment key={p}>
            {showEllipsis && <span className="px-1 text-ink-muted">…</span>}
            <button
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                p === page ? "bg-brand-gradient text-[#0B0F1A]" : "text-ink-secondary hover:bg-white/5"
              }`}
            >
              {p}
            </button>
          </React.Fragment>
        );
      })}

      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Next page"
        className="rounded-lg p-2 text-ink-secondary transition-colors hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none"
      >
        <FiChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
