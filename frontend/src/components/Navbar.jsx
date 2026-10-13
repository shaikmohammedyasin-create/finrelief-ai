import React, { useState } from "react";
import { FiChevronDown, FiLogOut, FiMenu, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.js";
import { useToast } from "../context/ToastContext.jsx";

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    try {
      await logout();
      toast.success("Logged out successfully.");
      navigate("/login");
    } catch {
      toast.error("Could not log out cleanly, but your session has been cleared locally.");
      navigate("/login");
    }
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.06] bg-base/80 px-5 py-4 backdrop-blur-xl">
      <button onClick={onMenuClick} className="text-ink-secondary md:hidden" aria-label="Open menu">
        <FiMenu className="h-6 w-6" />
      </button>

      <div className="hidden md:block" />

      <div className="relative">
        <button
          onClick={() => setMenuOpen((open) => !open)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/5"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-[#0B0F1A]">
            {user?.name?.[0]?.toUpperCase() || <FiUser />}
          </span>
          <span className="hidden text-sm font-medium text-ink-primary sm:inline">{user?.name}</span>
          <FiChevronDown className="h-4 w-4 text-ink-muted" />
        </button>

        {menuOpen && (
          <div className="glass-card absolute right-0 mt-2 w-48 overflow-hidden p-1.5 animate-fade-in">
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/app/profile");
              }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-ink-secondary transition-colors hover:bg-white/5 hover:text-ink-primary"
            >
              <FiUser className="h-4 w-4" /> Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-accent-rose transition-colors hover:bg-accent-rose/10"
            >
              <FiLogOut className="h-4 w-4" /> Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
