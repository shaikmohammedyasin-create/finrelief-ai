import React from "react";
import { FiActivity, FiCreditCard, FiHeart, FiPieChart, FiTrendingDown, FiTrendingUp } from "react-icons/fi";

const STRESS_BADGE = {
  Low: "badge-low",
  Medium: "badge-medium",
  High: "badge-high",
};

function Card({ icon: Icon, label, value, accent }) {
  return (
    <div className="glass-card flex items-start justify-between p-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">{label}</p>
        <p className="money mt-2 text-2xl font-semibold text-ink-primary">{value}</p>
      </div>
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accent}`}>
        <Icon className="h-5 w-5" />
      </span>
    </div>
  );
}

export default function DashboardCards({ cards }) {
  if (!cards) return null;

  const formatCurrency = (value) => `₹${Number(value).toLocaleString()}`;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <Card icon={FiCreditCard} label="Total Loans" value={cards.total_loans} accent="bg-accent-indigo/15 text-accent-indigo" />
      <Card icon={FiTrendingDown} label="Outstanding Debt" value={formatCurrency(cards.outstanding_debt)} accent="bg-accent-rose/15 text-accent-rose" />
      <Card icon={FiCreditCard} label="Monthly EMI" value={formatCurrency(cards.monthly_emi)} accent="bg-accent-amber/15 text-accent-amber" />
      <Card
        icon={cards.monthly_surplus >= 0 ? FiTrendingUp : FiTrendingDown}
        label="Monthly Surplus"
        value={formatCurrency(cards.monthly_surplus)}
        accent={cards.monthly_surplus >= 0 ? "bg-accent-mint/15 text-accent-mint" : "bg-accent-rose/15 text-accent-rose"}
      />
      <Card icon={FiHeart} label="Financial Score" value={`${cards.financial_score.toFixed(0)} / 100`} accent="bg-accent-mint/15 text-accent-mint" />

      <div className="glass-card flex items-start justify-between p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Debt Stress</p>
          <span className={`badge mt-2 ${STRESS_BADGE[cards.debt_stress] || "badge-low"}`}>{cards.debt_stress}</span>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-indigo/15 text-accent-indigo">
          <FiActivity className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}
