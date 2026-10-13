import React, { createContext, useCallback, useContext, useState } from "react";
import { FiAlertTriangle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";

const ToastContext = createContext(null);
let idCounter = 0;

const ICONS = {
  success: <FiCheckCircle className="h-5 w-5 text-accent-mint" />,
  error: <FiAlertTriangle className="h-5 w-5 text-accent-rose" />,
  info: <FiInfo className="h-5 w-5 text-accent-indigo" />,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "info", duration = 4000) => {
      const id = ++idCounter;
      setToasts((current) => [...current, { id, message, type }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss]
  );

  const toast = {
    success: (message) => showToast(message, "success"),
    error: (message) => showToast(message, "error"),
    info: (message) => showToast(message, "info"),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="glass-card pointer-events-auto flex w-80 items-start gap-3 px-4 py-3 animate-fade-in"
          >
            {ICONS[t.type]}
            <p className="flex-1 text-sm text-ink-primary">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="text-ink-muted transition-colors hover:text-ink-primary"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
