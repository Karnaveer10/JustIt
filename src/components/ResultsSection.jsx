import React from "react";
import { FORMATTED_RECOVERY, NATIONAL_MEDIAN_DAYS } from "../justiceiq/constants.js";
import { formatDays, formatPending, getStatusTone, humanizeFeature, normalizePrediction } from "../justiceiq/utils.js";
import { SectionLabel, StatBlock } from "./shared.jsx";

function PredictionCard({ result }) {
  if (!result) return null;
  const bucket = normalizePrediction(result.prediction);
  const confidence = Number(result.confidence || 0);
  const theme =
    bucket === "under_6months"
      ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
      : bucket === "over_2years"
        ? "border-rose-400/20 bg-rose-500/10 text-rose-200"
        : "border-amber-400/20 bg-amber-500/10 text-amber-200";
  const display = FORMATTED_RECOVERY[bucket];

  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
      <div className="text-xs uppercase tracking-[0.32em] text-slate-500">Primary prediction</div>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-sm text-slate-400">Likely timeline</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight text-white">{display.label}</div>
        </div>
        <div className={`rounded-full border px-4 py-2 text-sm font-medium ${theme}`}>
          {confidence.toFixed(1)}% Confidence
        </div>
      </div>
      <div className="mt-5 rounded-2xl border border-white/5 bg-black/20 p-4">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-slate-500">
          <span>Outcome confidence</span>
          <span>{display.label.toLowerCase()}</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
          <div
            className={`h-full rounded-full ${
              bucket === "under_6months"
                ? "bg-emerald-400"
                : bucket === "over_2years"
                  ? "bg-rose-400"
                  : "bg-amber-400"
            }`}
            style={{ width: `${Math.max(22, Math.min(100, confidence))}%` }}
          />
        </div>
        <div className="mt-3 font-mono text-sm text-slate-300">
          Prediction label: <span className="text-white">{display.label}</span>
        </div>
      </div>
    </article>
  );
}

function CourtIntelligenceCard({ court }) {
  if (!court) return null;
  const tone = getStatusTone(court.court_historical_median_resolution);
  const ratio = Math.max(8, Math.min(100, (Number(court.court_historical_median_resolution) / NATIONAL_MEDIAN_DAYS) * 100));

  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
      <div className="text-xs uppercase tracking-[0.32em] text-slate-500">Court intelligence</div>
      <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <h3 className="text-xl font-semibold text-white">{court.court_name}</h3>
          <div className="mt-1 text-sm text-slate-400">{tone.label} jurisdiction speed profile</div>
        </div>
        <div className={`rounded-full px-3 py-1 text-xs font-medium ${tone.ring}`}>{tone.label}</div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <StatBlock label="Historical median" value={formatDays(court.court_historical_median_resolution)} />
        <StatBlock label="Pending cases" value={formatPending(court.pending_cases_count)} />
      </div>

      <div className="mt-5 rounded-2xl border border-white/5 bg-black/20 p-4">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-slate-500">
          <span>Relative to national median</span>
          <span>{Math.round((Number(court.court_historical_median_resolution) / NATIONAL_MEDIAN_DAYS) * 100)}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
          <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${ratio}%` }} />
        </div>
      </div>
    </article>
  );
}

function DelayAnalysisCard({ explanation }) {
  if (!explanation || explanation.length === 0) return null;
  const maxImpact = Math.max(...explanation.map((item) => Math.abs(Number(item.impact) || 0)), 1);

  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
      <div className="text-xs uppercase tracking-[0.32em] text-slate-500">Delay analysis</div>
      <div className="mt-2 text-lg font-semibold text-white">Top drivers from SHAP</div>
      <div className="mt-5 space-y-4">
        {explanation.map((item) => {
          const positive = Number(item.impact) > 0;
          const width = Math.max(18, (Math.abs(Number(item.impact)) / maxImpact) * 100);
          return (
            <div key={item.feature} className="rounded-2xl border border-white/5 bg-black/20 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-white">{humanizeFeature(item.feature)}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-500">
                    SHAP impact {Number(item.impact).toFixed(3)}
                  </div>
                </div>
                <div
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    positive ? "bg-rose-500/10 text-rose-200" : "bg-emerald-500/10 text-emerald-200"
                  }`}
                >
                  {positive ? "↑ Increases Delay" : "↓ Reduces Delay"}
                </div>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
                <div
                  className={positive ? "h-full rounded-full bg-rose-400" : "h-full rounded-full bg-emerald-400"}
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function RecommendationCard({ prediction }) {
  if (!prediction) return null;
  const bucket = normalizePrediction(prediction);
  const copy = FORMATTED_RECOVERY[bucket];

  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
      <div className="text-xs uppercase tracking-[0.32em] text-slate-500">Recommendation</div>
      <div className="mt-3 text-lg font-semibold text-white">Suggested next move</div>
      <p className="mt-4 text-sm leading-7 text-slate-300">{copy.recommendation}</p>
      <div className="mt-5 rounded-2xl border border-white/5 bg-black/20 p-4">
        <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Interpretation</div>
        <div className="mt-2 font-mono text-sm text-white">{copy.label}</div>
      </div>
    </article>
  );
}

function JurisdictionComparisonTable({ courts, selectedCourtNo }) {
  if (!courts || courts.length === 0) return null;

  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.32em] text-slate-500">Jurisdiction comparison</div>
          <div className="mt-2 text-xl font-semibold text-white">All courts in the selected district</div>
        </div>
        <div className="text-sm text-slate-400">Selected court is highlighted for quick comparison</div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-white/5">
        <table className="min-w-full divide-y divide-white/5">
          <thead className="bg-white/[0.03]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.28em] text-slate-500">Court</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.28em] text-slate-500">
                Median resolution
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.28em] text-slate-500">
                Pending cases
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.28em] text-slate-500">
                Speed signal
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-black/10">
            {courts.map((court) => {
              const selected = String(court.court_no) === String(selectedCourtNo);
              const tone = getStatusTone(court.court_historical_median_resolution);
              return (
                <tr
                  key={`${court.court_no}-${court.court_name}`}
                  className={selected ? "bg-orange-400/10" : "hover:bg-white/[0.03]"}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span className={`h-2.5 w-2.5 rounded-full ${tone.dot}`} />
                      <div>
                        <div className="text-sm font-medium text-white">{court.court_name}</div>
                        {selected ? (
                          <div className="mt-1 text-xs uppercase tracking-[0.24em] text-orange-200">
                            Selected jurisdiction
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-mono text-sm text-white">{formatDays(court.court_historical_median_resolution)}</td>
                  <td className="px-4 py-4 font-mono text-sm text-white">{formatPending(court.pending_cases_count)}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${tone.ring}`}>{tone.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </article>
  );
}

export function ResultsSection({ result, selectedCourt, courts, selectedCourtNo }) {
  if (!result) return null;
  const recommendation = result.prediction;

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10" id="results-section">
      <SectionLabel
        eyebrow="Results"
        title="The resolution timeline and jurisdiction signals appear below"
        description="The model returns a primary prediction, the jurisdiction intelligence behind it, and a side-by-side comparison of the district courts."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <PredictionCard result={result} />
        <CourtIntelligenceCard court={selectedCourt} />
        <DelayAnalysisCard explanation={result?.explanation || []} />
        <RecommendationCard prediction={recommendation} />
      </div>

      <div className="mt-6">
        <JurisdictionComparisonTable courts={courts} selectedCourtNo={selectedCourtNo} />
      </div>
    </section>
  );
}
