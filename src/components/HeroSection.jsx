import React from "react";
import { StatCard } from "./shared.jsx";

function LadyJusticeIllustration() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(232,115,42,0.22),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_42%)]" />
      <svg
        viewBox="0 0 520 520"
        className="relative z-10 h-full w-full"
        role="img"
        aria-label="Engraved illustration of Lady Justice"
      >
        <defs>
          <linearGradient id="bronze" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff3e8" />
            <stop offset="50%" stopColor="#c58245" />
            <stop offset="100%" stopColor="#8d4f1d" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#bronze)" strokeLinecap="round" strokeLinejoin="round">
          <path strokeWidth="5" d="M260 64v112" />
          <path strokeWidth="5" d="M220 90h80" />
          <path strokeWidth="5" d="M162 186h196" />
          <path strokeWidth="3.5" d="M260 176c-24 0-46 13-58 34" />
          <path strokeWidth="3.5" d="M260 176c24 0 46 13 58 34" />
          <path strokeWidth="3.5" d="M202 210l-28 70" />
          <path strokeWidth="3.5" d="M318 210l28 70" />
          <path strokeWidth="3.5" d="M158 280c0 18 15 32 34 32s34-14 34-32" />
          <path strokeWidth="3.5" d="M294 280c0 18 15 32 34 32s34-14 34-32" />
          <path strokeWidth="3.5" d="M190 312h-36" />
          <path strokeWidth="3.5" d="M326 312h36" />
          <path strokeWidth="5" d="M260 176v136" />
          <path strokeWidth="5" d="M214 400h92" />
          <path strokeWidth="5" d="M190 400h140" />
          <path strokeWidth="5" d="M168 416h184" />
          <path strokeWidth="5" d="M230 216c0 18 14 32 30 32s30-14 30-32" />
          <path strokeWidth="4" d="M210 256h100" />
          <path strokeWidth="4" d="M220 288c16 10 64 10 80 0" />
          <path strokeWidth="4" d="M176 440h168" />
          <path strokeWidth="3.5" d="M246 320l-32 52" />
          <path strokeWidth="3.5" d="M274 320l32 52" />
          <path strokeWidth="3" d="M214 372c18 10 74 10 92 0" />
          <path strokeWidth="3" d="M260 400v32" />
          <path strokeWidth="3" d="M112 456h296" />
        </g>
        <g fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.2">
          <path d="M102 118h316" />
          <path d="M118 146h284" />
          <path d="M140 468h240" />
          <path d="M96 92h328" />
          <path d="M88 92c12 26 12 44 0 70" />
          <path d="M432 92c-12 26-12 44 0 70" />
          <path d="M132 206h256" />
          <path d="M144 238h232" />
          <path d="M152 346h216" />
        </g>
        <circle cx="260" cy="142" r="16" fill="rgba(255,255,255,0.08)" />
      </svg>
    </div>
  );
}

export function HeroSection({ onAnalyzeClick }) {
  return (
    <section className="relative overflow-hidden border-b border-white/5 bg-[#0A0A0A]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(232,115,42,0.18),transparent_38%),radial-gradient(circle_at_right,rgba(255,255,255,0.08),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_20%)]" />
      <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-6 sm:px-8 lg:px-10 lg:pb-24">
        <header className="flex items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <div className="text-xs uppercase tracking-[0.34em] text-slate-400">JusticeIQ</div>
            <div className="mt-1 text-sm text-slate-500">Commercial dispute resolution intelligence</div>
          </div>
          <div className="rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-orange-200">
            Built for legal ops and finance teams
          </div>
        </header>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-3xl">
            <p className="inline-flex items-center rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-orange-200">
              ML-powered dispute timeline predictor
            </p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Predict Commercial Dispute Timelines Before You File
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Trained on 500,000+ real Indian district court disputes. Get resolution probability, jurisdiction comparison,
              and plain-English delay analysis in seconds.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={onAnalyzeClick}
                className="rounded-full bg-[#E8732A] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.05)] transition hover:bg-[#f08235] focus:outline-none focus:ring-2 focus:ring-[#E8732A] focus:ring-offset-2 focus:ring-offset-[#0A0A0A]"
              >
                Analyze Your Case
              </button>
              <div className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-slate-300">
                Decision support for a <span className="font-mono text-white">₹5 crore</span> dispute
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <StatCard value="500K+ Cases Analyzed" label="Historic disputes used to train the model" />
              <StatCard value="26 States Covered" label="Coverage across major commercial jurisdictions" />
            </div>
          </div>

          <div className="lg:pl-8">
            <LadyJusticeIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}
