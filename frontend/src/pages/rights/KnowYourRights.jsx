import React from "react";
import { FiAlertCircle, FiFileText, FiPhoneOff, FiShield } from "react-icons/fi";

const RIGHTS = [
  {
    icon: FiPhoneOff,
    title: "Freedom from harassment",
    body: "Collectors cannot call you repeatedly to annoy you, use abusive language, or contact you at unreasonable hours. You can request all communication in writing.",
  },
  {
    icon: FiFileText,
    title: "Right to written validation",
    body: "You can request a written statement of the debt, including the amount owed and the original creditor, before making any payment.",
  },
  {
    icon: FiShield,
    title: "Right to dispute",
    body: "If you believe a debt is inaccurate or not yours, you have the right to formally dispute it in writing within the applicable timeframe.",
  },
  {
    icon: FiAlertCircle,
    title: "Settlement agreements in writing",
    body: "Always get any settlement offer confirmed in writing before paying. A verbal promise from a collector is not enforceable.",
  },
];

export default function KnowYourRights() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Know Your Rights</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          General educational information for borrowers. This is not legal advice - consult a licensed professional for guidance specific to your situation.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {RIGHTS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="glass-card p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-indigo/15 text-accent-indigo">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display font-semibold text-ink-primary">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{body}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-6">
        <h3 className="font-display font-semibold text-ink-primary">Before you negotiate</h3>
        <ul className="mt-3 space-y-2 text-sm text-ink-secondary">
          <li>• Review your Financial Profile and Settlement Prediction before contacting any lender.</li>
          <li>• Never share more personal or financial detail than necessary to support your settlement request.</li>
          <li>• Keep a copy of every letter you send using the AI History page.</li>
          <li>• Get any agreed settlement terms confirmed in writing before making a payment.</li>
        </ul>
      </div>
    </div>
  );
}
