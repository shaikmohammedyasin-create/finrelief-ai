import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FiLock, FiMail } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useToast } from "../../context/ToastContext.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { extractErrorMessage } from "../../services/api.js";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(values) {
    setIsSubmitting(true);
    try {
      await login(values);
      toast.success("Welcome back!");
      navigate(location.state?.from?.pathname || "/app/dashboard", { replace: true });
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="h-9 w-9 rounded-lg bg-brand-gradient" />
            <span className="font-display text-xl font-bold text-ink-primary">FinRelief AI</span>
          </Link>
          <h1 className="mt-6 text-2xl font-semibold">Welcome back</h1>
          <p className="mt-1 text-sm text-ink-secondary">Log in to manage your debt recovery plan.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glass-card space-y-4 p-6">
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
                placeholder="••••••••"
                {...register("password", { required: "Password is required" })}
              />
            </div>
            {errors.password && <p className="field-error">{errors.password.message}</p>}
          </div>

          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-secondary">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-accent-mint hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
