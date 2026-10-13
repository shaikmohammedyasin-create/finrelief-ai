import React, { useState } from "react";

import { useToast } from "../context/ToastContext.jsx";

export default function Settings() {
  const toast = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [reminderDays, setReminderDays] = useState(3);

  function handleSave() {
    // Preferences are UI-only for now; wire to a real backend endpoint when
    // notification delivery is implemented.
    toast.success("Preferences saved locally.");
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-ink-secondary">Configure how FinRelief AI works for you.</p>
      </div>

      <div className="glass-card space-y-5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-ink-primary">Payment due reminders</p>
            <p className="text-sm text-ink-secondary">Get notified before a loan payment is due.</p>
          </div>
          <button
            onClick={() => setEmailNotifications((v) => !v)}
            aria-pressed={emailNotifications}
            className={`h-6 w-11 shrink-0 rounded-full transition-colors ${emailNotifications ? "bg-brand-gradient" : "bg-white/10"}`}
          >
            <span
              className={`block h-5 w-5 translate-y-0.5 rounded-full bg-white transition-transform ${
                emailNotifications ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        <div>
          <label className="field-label" htmlFor="reminder_days">Remind me this many days before due date</label>
          <input
            id="reminder_days"
            type="number"
            min={1}
            max={14}
            className="input-field"
            value={reminderDays}
            onChange={(e) => setReminderDays(Number(e.target.value))}
          />
        </div>

        <button onClick={handleSave} className="btn-primary">Save Preferences</button>
      </div>

      <div className="glass-card border-accent-rose/20 p-6">
        <p className="font-medium text-accent-rose">Danger Zone</p>
        <p className="mt-1 text-sm text-ink-secondary">
          Account deletion isn't available yet. Contact support if you need your data removed.
        </p>
      </div>
    </div>
  );
}
