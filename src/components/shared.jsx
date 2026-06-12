import React from "react";

export function SectionLabel({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs uppercase tracking-[0.35em] text-orange-300/80">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">{description}</p>
    </div>
  );
}

export function StatCard({ value, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur">
      <div className="font-mono text-2xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-sm text-slate-400">{label}</div>
    </div>
  );
}

export function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-black/20 px-4 py-3">
      <div className="text-sm text-slate-400">{label}</div>
      <div className="font-mono text-sm text-white">{value}</div>
    </div>
  );
}

export function MiniIndicator({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3">
      <div className="text-[10px] uppercase tracking-[0.28em] text-slate-500">{label}</div>
      <div className="mt-1 text-sm text-white">{value}</div>
    </div>
  );
}

export function StatBlock({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
      <div className="text-xs uppercase tracking-[0.25em] text-slate-500">{label}</div>
      <div className="mt-2 font-mono text-lg text-white">{value}</div>
    </div>
  );
}
