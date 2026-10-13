import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { useAuth } from "../hooks/useAuth.js";
import { useToast } from "../context/ToastContext.jsx";
import { extractErrorMessage } from "../services/api.js";
import { updateProfile } from "../services/authService.js";

export default function Profile() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { name: user?.name, email: user?.email } });

  async function onSubmit(values) {
    setIsSubmitting(true);
    try {
      const updated = await updateProfile(values);
      setUser(updated);
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="mt-1 text-sm text-ink-secondary">Manage your account details.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="glass-card space-y-4 p-6">
        <div className="flex items-center gap-4 border-b border-white/[0.06] pb-5">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient text-xl font-semibold text-[#0B0F1A]">
            {user?.name?.[0]?.toUpperCase()}
          </span>
          <div>
            <p className="font-display font-semibold text-ink-primary">{user?.name}</p>
            <p className="text-sm text-ink-muted">
              Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
            </p>
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="name">Full Name</label>
          <input id="name" className="input-field" {...register("name", { required: "Name is required", minLength: 2 })} />
          {errors.name && <p className="field-error">{errors.name.message}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor="email">Email</label>
          <input id="email" type="email" className="input-field" {...register("email", { required: "Email is required" })} />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>

        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
