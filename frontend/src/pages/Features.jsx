import React from "react";
import { FiBarChart2, FiCreditCard, FiFileText, FiMessageSquare, FiPieChart, FiShield } from "react-icons/fi";

import PublicNav from "../components/PublicNav.jsx";

const FEATURES = [
  { icon: FiCreditCard, title: "Loan Management", body: "Add, edit, search, filter, and sort every loan you carry. Export your full loan list to CSV anytime." },
  { icon: FiPieChart, title: "Financial Health Engine", body: "See your EMI ratio, debt-to-income ratio, monthly surplus, and a composite financial health score." },
  { icon: FiBarChart2, title: "Visual Dashboard", body: "Loan distribution, expense breakdown, 12-month debt trend projection, and a loan priority heatmap." },
  { icon: FiMessageSquare, title: "AI Negotiation Letters", body: "Google Gemini drafts a professional settlement email for any loan, with an automatic rule-based fallback if AI is unavailable." },
  { icon: FiFileText, title: "Searchable AI History", body: "Every letter you generate is saved, searchable, and exportable for your records." },
  { icon: FiShield, title: "Know Your Rights", body: "Plain-language borrower protections to read before you contact a lender." },
];

export default function Features() {
  return (
    <div>
      <PublicNav />
      <section className="mx-auto max-w-6xl px-5 py-20">
        <h1 className="text-3xl font-semibold">Everything you need to negotiate with confidence</h1>
        <p className="mt-3 max-w-2xl text-ink-secondary">
          FinRelief AI combines a transparent financial engine with generative AI to give you a complete debt
          recovery toolkit.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
}
