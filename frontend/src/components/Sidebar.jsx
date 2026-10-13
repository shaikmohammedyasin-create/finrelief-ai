import React from "react";
import {
  FiCreditCard,
  FiFileText,
  FiGrid,
  FiMessageSquare,
  FiPieChart,
  FiSettings,
  FiShield,
  FiTrendingUp,
  FiX,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/app/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/app/loans", label: "Loan Management", icon: FiCreditCard },
  { to: "/app/financial-profile", label: "Financial Profile", icon: FiPieChart },
  { to: "/app/settlement", label: "Settlement Prediction", icon: FiTrendingUp },
  { to: "/app/negotiation", label: "Negotiation Letters", icon: FiMessageSquare },
  { to: "/app/history", label: "AI History", icon: FiFileText },
  { to: "/app/rights", label: "Know Your Rights", icon: FiShield },
  { to: "/app/settings", label: "Settings", icon: FiSettings },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/[0.06] bg-base-panel/80
          backdrop-blur-xl transition-transform duration-200 md:sticky md:top-0 md:h-screen md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 py-6">
          <a href="/" className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-brand-gradient" />
            <span className="font-display text-lg font-bold text-ink-primary">FinRelief AI</span>
          </a>
          <button onClick={onClose} className="text-ink-muted md:hidden" aria-label="Close menu">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/[0.06] p-4">
          <p className="text-xs text-ink-muted">FinRelief AI v1.0 · Your data stays yours.</p>
        </div>
      </aside>
    </>
  );
}
