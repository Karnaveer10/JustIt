import React from "react";
import { SectionLabel } from "./shared.jsx";

export function HowItWorksSection() {
  const steps = [
    {
      title: "Describe your dispute",
      body: "Write the facts in plain English. The model reads commercial context, remedy signals, and filing timing.",
    },
    {
      title: "AI identifies the jurisdiction signals",
      body: "We infer dispute type, court performance, and the operational factors that affect the resolution timeline.",
    },
    {
      title: "Review the prediction",
      body: "See the likely timeline, delay drivers, and faster jurisdiction options before you decide where to file.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
      <SectionLabel
        eyebrow="How it works"
        title="A fast workflow for serious dispute planning"
        description="The interface stays simple so legal and finance teams can review the outcome quickly without sacrificing analytical depth."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <article
            key={step.title}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-orange-400/25 hover:bg-white/[0.045]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-400/10 font-mono text-sm text-orange-200">
              0{index + 1}
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">{step.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">{step.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
