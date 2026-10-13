import React from "react";
import { useForm } from "react-hook-form";

import { LOAN_TYPES } from "../services/loanService.js";

export default function LoanForm({ defaultValues, onSubmit, onCancel, isSubmitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues || {
      lender_name: "",
      loan_type: "Personal",
      total_amount: "",
      outstanding_amount: "",
      emi: "",
      interest_rate: "",
      overdue_months: 0,
      due_date: "",
    },
  });

  function submit(values) {
    onSubmit({
      ...values,
      total_amount: Number(values.total_amount),
      outstanding_amount: Number(values.outstanding_amount),
      emi: Number(values.emi),
      interest_rate: Number(values.interest_rate),
      overdue_months: Number(values.overdue_months),
      due_date: values.due_date || null,
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div>
        <label className="field-label" htmlFor="lender_name">Lender Name</label>
        <input
          id="lender_name"
          className="input-field"
          placeholder="e.g. HDFC Bank"
          {...register("lender_name", { required: "Lender name is required" })}
        />
        {errors.lender_name && <p className="field-error">{errors.lender_name.message}</p>}
      </div>

      <div>
        <label className="field-label" htmlFor="loan_type">Loan Type</label>
        <select id="loan_type" className="input-field" {...register("loan_type", { required: true })}>
          {LOAN_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="field-label" htmlFor="total_amount">Total Amount</label>
          <input
            id="total_amount"
            type="number"
            step="0.01"
            className="input-field"
            {...register("total_amount", { required: "Required", min: { value: 0.01, message: "Must be positive" } })}
          />
          {errors.total_amount && <p className="field-error">{errors.total_amount.message}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor="outstanding_amount">Outstanding Amount</label>
          <input
            id="outstanding_amount"
            type="number"
            step="0.01"
            className="input-field"
            {...register("outstanding_amount", { required: "Required", min: { value: 0, message: "Cannot be negative" } })}
          />
          {errors.outstanding_amount && <p className="field-error">{errors.outstanding_amount.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="field-label" htmlFor="emi">Monthly EMI</label>
          <input
            id="emi"
            type="number"
            step="0.01"
            className="input-field"
            {...register("emi", { required: "Required", min: { value: 0, message: "Cannot be negative" } })}
          />
          {errors.emi && <p className="field-error">{errors.emi.message}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor="interest_rate">Interest Rate (%)</label>
          <input
            id="interest_rate"
            type="number"
            step="0.01"
            className="input-field"
            {...register("interest_rate", { required: "Required", min: 0, max: 100 })}
          />
          {errors.interest_rate && <p className="field-error">Enter a rate between 0-100</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="field-label" htmlFor="overdue_months">Overdue Months</label>
          <input id="overdue_months" type="number" className="input-field" {...register("overdue_months", { min: 0 })} />
        </div>
        <div>
          <label className="field-label" htmlFor="due_date">Next Due Date</label>
          <input id="due_date" type="date" className="input-field" {...register("due_date")} />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Loan"}
        </button>
      </div>
    </form>
  );
}
