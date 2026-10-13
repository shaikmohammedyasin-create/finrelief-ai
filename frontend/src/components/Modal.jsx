import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function Modal({ isOpen, onClose, title, children, footer }) {
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") onClose();
    }
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="glass-card relative z-10 w-full max-w-lg animate-fade-in p-6">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="font-display text-lg font-semibold text-ink-primary">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-md p-1 text-ink-muted transition-colors hover:bg-white/5 hover:text-ink-primary"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
        <div>{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}
