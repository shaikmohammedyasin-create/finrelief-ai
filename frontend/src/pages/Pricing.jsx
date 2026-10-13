import React from "react";
import { FiCheck } from "react-icons/fi";
import { Link } from "react-router-dom";

import PublicNav from "../components/PublicNav.jsx";

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    features: ["Unlimited loan tracking", "Financial health analysis", "Settlement predictions", "5 AI negotiation letters / month"],
    cta: "Get Started",
    to: "/register",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "Coming soon",
    period: "",
    features: ["Everything in Free", "Unlimited AI negotiation letters", "Priority Gemini access", "Exportable recovery reports"],
    cta: "Join Waitlist",
    to: "/register",
    highlighted: true,
  },
];

export default function Pricing() {
  return (
    <div>
      <PublicNav />
      <section className="mx-auto max-w-4xl px-5 py-20 text-center">
        <h1 className="text-3xl font-semibold">Simple, honest pricing</h1>
        <p className="mt-3 text-ink-secondary">Start free. Upgrade only if you need more AI-generated letters.</p>

        <div className="mt-10 grid grid-cols-1 gap-6 text-left sm:grid-cols-2">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`glass-card p-7 ${plan.highlighted ? "shadow-glow" : ""}`}
            >
              <h3 className="font-display text-lg font-semibold">{plan.name}</h3>
              <p className="mt-2">
                <span className="text-3xl font-bold">{plan.price}</span>{" "}
                {plan.period && <span className="text-sm text-ink-muted">/ {plan.period}</span>}
              </p>
              <ul className="mt-5 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-ink-secondary">
                    <FiCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-mint" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to={plan.to} className={plan.highlighted ? "btn-primary mt-6 w-full" : "btn-secondary mt-6 w-full"}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
