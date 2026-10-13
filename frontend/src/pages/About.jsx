import React from "react";

import PublicNav from "../components/PublicNav.jsx";

export default function About() {
  return (
    <div>
      <PublicNav />
      <section className="mx-auto max-w-3xl px-5 py-20">
        <h1 className="text-3xl font-semibold">About FinRelief AI</h1>
        <p className="mt-5 text-ink-secondary leading-relaxed">
          FinRelief AI was built on a simple premise: navigating debt shouldn't require a finance degree or an
          expensive advisor. We combine a transparent financial engine with AI-assisted negotiation tools to give
          borrowers the same kind of structured, data-driven approach that collections agencies use - just pointed
          in the other direction.
        </p>
        <p className="mt-4 text-ink-secondary leading-relaxed">
          Every recommendation on this platform - your debt stress score, settlement percentages, and priority
          rankings - comes from a documented, deterministic calculation engine, not a black box. When you generate a
          negotiation letter, you can see whether it was written by AI or by our rule-based fallback, so you always
          know what you're sending.
        </p>
        <p className="mt-4 text-ink-secondary leading-relaxed">
          We built this for people who want to take a proactive, informed step toward financial recovery, not for
          those looking for a shortcut around real financial hardship.
        </p>
      </section>
    </div>
  );
}
