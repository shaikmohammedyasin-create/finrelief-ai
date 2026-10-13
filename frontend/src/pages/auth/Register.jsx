import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FiLock, FiMail, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

import { useToast } from "../../context/ToastContext.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { extractErrorMessage } from "../../services/api.js";

export default function Register() {
  const { register: registerUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  async function onSubmit(values) {
    setIsSubmitting(true);
    try {
      await registerUser({ name: values.name, email: values.email, password: values.password });
      toast.success("Account created! Welcome to FinRelief AI.");
      navigate("/app/dashboard", { replace: true });
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="h-9 w-9 rounded-lg bg-brand-gradient" />
            <span className="font-display text-xl font-bold text-ink-primary">FinRelief AI</span>
          </Link>
          <h1 className="mt-6 text-2xl font-semibold">Create your account</h1>
          <p className="mt-1 text-sm text-ink-secondary">Start your path to financial recovery today.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glass-card space-y-4 p-6">
          <div>
            <label className="field-label" htmlFor="name">Full Name</label>
            <div className="relative">
              <FiUser className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input
                id="name"
                className="input-field pl-9"
                placeholder="Jane Doe"
                {...register("name", { required: "Name is required", minLength: { value: 2, message: "Too short" } })}
              />
            </div>
            {errors.name && <p className="field-error">{errors.name.message}</p>}
          </div>

          <div>
            <label className="field-label" htmlFor="email">Email</label>
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input
                id="email"
                type="email"
                className="input-field pl-9"
                placeholder="you@example.com"
                {...register("email", { required: "Email is required" })}
              />
            </div>
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>

          <div>
            <label className="field-label" htmlFor="password">Password</label>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input
                id="password"
                type="password"
                className="input-field pl-9"
                placeholder="At least 8 characters"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "At least 8 characters" },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                    message: "Include an uppercase letter, lowercase letter, and a digit",
                  },
                })}
              />
            </div>
            {errors.password && <p className="field-error">{errors.password.message}</p>}
          </div>

          <div>
            <label className="field-label" htmlFor="confirm_password">Confirm Password</label>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input
                id="confirm_password"
                type="password"
                className="input-field pl-9"
                placeholder="Re-enter your password"
                {...register("confirm_password", {
                  required: "Please confirm your password",
                  validate: (value) => value === password || "Passwords do not match",
                })}
              />
            </div>
            {errors.confirm_password && <p className="field-error">{errors.confirm_password.message}</p>}
          </div>

          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-secondary">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-accent-mint hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
