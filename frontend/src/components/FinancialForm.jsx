import React from "react";
import { useForm } from "react-hook-form";

export default function FinancialForm({ defaultValues, onSubmit, isSubmitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues || { monthly_income: "", monthly_expenses: "", savings: "" },
  });

  function submit(values) {
    onSubmit({
      monthly_income: Number(values.monthly_income),
      monthly_expenses: Number(values.monthly_expenses),
      savings: Number(values.savings || 0),
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="glass-card space-y-4 p-6">
      <div>
        <label className="field-label" htmlFor="monthly_income">Monthly Income</label>
        <input
          id="monthly_income"
          type="number"
          step="0.01"
          className="input-field"
          placeholder="e.g. 75000"
          {...register("monthly_income", { required: "Required", min: { value: 0.01, message: "Must be greater than 0" } })}
        />
        {errors.monthly_income && <p className="field-error">{errors.monthly_income.message}</p>}
      </div>

      <div>
        <label className="field-label" htmlFor="monthly_expenses">Monthly Expenses</label>
        <input
          id="monthly_expenses"
          type="number"
          step="0.01"
          className="input-field"
          placeholder="e.g. 40000"
          {...register("monthly_expenses", { required: "Required", min: { value: 0, message: "Cannot be negative" } })}
        />
        {errors.monthly_expenses && <p className="field-error">{errors.monthly_expenses.message}</p>}
      </div>

      <div>
        <label className="field-label" htmlFor="savings">Current Savings</label>
        <input id="savings" type="number" step="0.01" className="input-field" placeholder="e.g. 50000" {...register("savings", { min: 0 })} />
      </div>

      <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
        {isSubmitting ? "Analyzing..." : "Analyze Financial Health"}
      </button>
    </form>
  );
}
