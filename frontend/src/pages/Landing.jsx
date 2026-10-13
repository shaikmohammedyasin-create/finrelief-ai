import React from "react";
import { FiCheckCircle, FiMessageSquare, FiPieChart, FiShield, FiTrendingUp } from "react-icons/fi";
import { Link } from "react-router-dom";

import PublicNav from "../components/PublicNav.jsx";

const FEATURES = [
  { icon: FiPieChart, title: "Financial Health Analysis", body: "Understand your EMI ratio, debt-to-income, and stress score at a glance." },
  { icon: FiTrendingUp, title: "AI Settlement Predictions", body: "Get a ranked, data-driven settlement percentage for every loan you carry." },
  { icon: FiMessageSquare, title: "AI Negotiation Letters", body: "Generate professional, lender-ready settlement emails in seconds." },
  { icon: FiShield, title: "Know Your Rights", body: "Understand borrower protections before you pick up the phone." },
];

export default function Landing() {
  return (
    <div>
      <PublicNav />

      <section className="mx-auto max-w-5xl px-5 py-24 text-center">
        <span className="badge bg-accent-mint/15 text-accent-mint">AI-Powered Debt Relief</span>
        <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">
          Take control of your debt with <span className="gradient-text">AI-guided recovery</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-secondary">
          Track every loan, understand your financial health, and generate lender-ready negotiation letters -
          all backed by an AI settlement engine built for real financial recovery.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link to="/register" className="btn-primary">Start Your Recovery Plan</Link>
          <Link to="/features" className="btn-secondary">See how it works</Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="glass-card p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-gradient-soft text-accent-mint">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-ink-secondary">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-24">
        <div className="glass-card flex flex-col items-center gap-4 p-10 text-center">
          <FiCheckCircle className="h-8 w-8 text-accent-mint" />
          <h2 className="text-2xl font-semibold">Ready to see where you stand?</h2>
          <p className="max-w-md text-sm text-ink-secondary">
            Create a free account and get your first financial health analysis in under two minutes.
          </p>
          <Link to="/register" className="btn-primary">Get Started Free</Link>
        </div>
      </section>
    </div>
  );
}
