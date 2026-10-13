import React, { useState } from "react";

import FinancialForm from "../components/FinancialForm.jsx";
import StressMeter from "../components/StressMeter.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { extractErrorMessage } from "../services/api.js";
import { analyzeFinancialProfile } from "../services/financialService.js";

function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.04] py-3 last:border-0">
      <span className="text-sm text-ink-secondary">{label}</span>
      <span className="money text-sm font-medium text-ink-primary">{value}</span>
    </div>
  );
}

export default function FinancialProfile() {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  async function handleSubmit(values) {
    setIsSubmitting(true);
    try {
      const data = await analyzeFinancialProfile(values);
      setResult(data);
      toast.success("Financial analysis complete.");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Financial Profile</h1>
        <p className="mt-1 text-sm text-ink-secondary">Understand your financial health at a glance.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FinancialForm
          defaultValues={
            result
              ? {
                  monthly_income: result.profile.monthly_income,
                  monthly_expenses: result.profile.monthly_expenses,
                  savings: result.profile.savings,
                }
              : null
          }
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />

        {result ? (
          <div className="glass-card animate-fade-in p-6">
            <div className="flex flex-col items-center gap-4 border-b border-white/[0.04] pb-6">
              <StressMeter score={result.debt_stress_score} category={result.stress_category} />
            </div>
            <div className="mt-4">
              <StatRow label="EMI Ratio" value={`${result.emi_ratio}%`} />
              <StatRow label="Debt-to-Income Ratio" value={`${result.debt_to_income_ratio}%`} />
              <StatRow
                label="Monthly Surplus"
                value={`₹${result.monthly_surplus.toLocaleString()}`}
              />
              <StatRow label="Financial Health Score" value={`${result.financial_health_score} / 100`} />
              <StatRow label="Total Existing Debt" value={`₹${result.profile.existing_debt.toLocaleString()}`} />
            </div>
            <div className="mt-4 rounded-lg bg-brand-gradient-soft p-4">
              <p className="text-sm text-ink-primary">{result.recommendation}</p>
            </div>
          </div>
        ) : (
          <div className="glass-card flex items-center justify-center p-6 text-center text-sm text-ink-muted">
            Fill in your income and expenses to see your financial health analysis.
          </div>
        )}
      </div>
    </div>
  );
}
