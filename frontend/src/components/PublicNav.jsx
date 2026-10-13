import React from "react";
import { Link } from "react-router-dom";

export default function PublicNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-base/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg bg-brand-gradient" />
          <span className="font-display text-lg font-bold text-ink-primary">FinRelief AI</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-secondary md:flex">
          <Link to="/about" className="transition-colors hover:text-ink-primary">About</Link>
          <Link to="/features" className="transition-colors hover:text-ink-primary">Features</Link>
          <Link to="/pricing" className="transition-colors hover:text-ink-primary">Pricing</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-ink-secondary hover:text-ink-primary">Log In</Link>
          <Link to="/register" className="btn-primary !px-4 !py-2 text-sm">Get Started</Link>
        </div>
      </div>
    </header>
  );
}
