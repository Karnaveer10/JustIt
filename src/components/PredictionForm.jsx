import React from "react";
import { InfoRow, MiniIndicator, SectionLabel } from "./shared.jsx";
import { formatDays, formatPending, getStatusTone } from "../justiceiq/utils.js";

function StateSelector({ states, value, onChange, loading }) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-medium text-slate-200">State</div>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={loading}
        className="w-full rounded-2xl border border-white/10 bg-[#101010] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-orange-400/50 focus:ring-2 focus:ring-orange-400/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <option value="">{loading ? "Loading states..." : "Select state"}</option>
        {states.map((state) => (
          <option key={state.code} value={String(state.code)}>
            {state.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function DistrictSelector({ districts, value, onChange, loading, disabled }) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-medium text-slate-200">District</div>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={loading || disabled}
        className="w-full rounded-2xl border border-white/10 bg-[#101010] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400/50 focus:ring-2 focus:ring-orange-400/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <option value="">{loading ? "Loading districts..." : disabled ? "Select state first" : "Select district"}</option>
        {districts.map((district) => (
          <option key={district.dist_code} value={String(district.dist_code)}>
            {district.district_name}
          </option>
        ))}
      </select>
    </label>
  );
}

function CourtSelector({
  courts,
  value,
  onChange,
  loading,
  disabled,
  selectedCourt,
  open,
  setOpen,
  dropdownRef,
}) {
  const currentCourt = selectedCourt || courts.find((court) => String(court.court_no) === String(value));

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="mb-2 text-sm font-medium text-slate-200">Court</div>
      <button
        type="button"
        onClick={() => {
          if (!disabled) setOpen((prev) => !prev);
        }}
        disabled={loading || disabled}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#101010] px-4 py-3 text-left text-sm text-white outline-none transition focus:border-orange-400/50 focus:ring-2 focus:ring-orange-400/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className={currentCourt ? "truncate" : "text-slate-500"}>
          {loading
            ? "Loading courts..."
            : disabled
              ? "Select district first"
              : currentCourt
                ? `${currentCourt.court_name} - ${formatDays(currentCourt.court_historical_median_resolution)}`
                : "Select court"}
        </span>
        <span className="text-xs uppercase tracking-[0.28em] text-slate-500">Open</span>
      </button>

      {open && !disabled && !loading ? (
        <div className="absolute z-20 mt-3 max-h-96 w-full overflow-hidden rounded-3xl border border-white/10 bg-[#0E0E0E] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <div className="border-b border-white/5 px-4 py-3 text-xs uppercase tracking-[0.3em] text-slate-500">
            Jurisdiction intelligence
          </div>
          <div className="max-h-80 overflow-auto p-2">
            {courts.length === 0 ? (
              <div className="px-3 py-4 text-sm text-slate-400">No courts available for this district.</div>
            ) : (
              courts.map((court) => {
                const tone = getStatusTone(Number(court.court_historical_median_resolution));
                const active = String(value) === String(court.court_no);
                return (
                  <button
                    key={`${court.court_no}-${court.court_name}`}
                    type="button"
                    onClick={() => {
                      onChange(String(court.court_no));
                      setOpen(false);
                    }}
                    className={`flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition ${
                      active ? "bg-orange-400/10 ring-1 ring-orange-400/20" : "hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className={`mt-1 h-2.5 w-2.5 rounded-full ${tone.dot}`} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-white">{court.court_name}</span>
                      <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span>{formatDays(court.court_historical_median_resolution)}</span>
                        <span className="text-slate-600">•</span>
                        <span>{formatPending(court.pending_cases_count)} pending disputes</span>
                      </span>
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.25em] ${tone.ring}`}>
                      {tone.label}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : null}

      {currentCourt ? (
        <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-slate-500">Selected jurisdiction</div>
              <div className="mt-1 text-sm font-medium text-white">{currentCourt.court_name}</div>
            </div>
            <div className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusTone(currentCourt.court_historical_median_resolution).ring}`}>
              {getStatusTone(currentCourt.court_historical_median_resolution).label}
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/5 bg-black/20 p-3">
              <div className="text-xs uppercase tracking-[0.25em] text-slate-500">Historical median</div>
              <div className="mt-1 font-mono text-lg text-white">{formatDays(currentCourt.court_historical_median_resolution)}</div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-black/20 p-3">
              <div className="text-xs uppercase tracking-[0.25em] text-slate-500">Pending cases</div>
              <div className="mt-1 font-mono text-lg text-white">{formatPending(currentCourt.pending_cases_count)}</div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CaseDescriptionInput({ value, onChange }) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-medium text-slate-200">Dispute description</div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={6}
        className="w-full rounded-2xl border border-white/10 bg-[#101010] px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-orange-400/50 focus:ring-2 focus:ring-orange-400/20"
        placeholder="Describe your dispute in plain English. Example: My supplier defaulted on payment of ₹45 lakhs for goods delivered in March 2024. We have a signed purchase agreement and delivery receipts."
      />
      <p className="mt-2 text-xs leading-6 text-slate-500">
        Our AI will automatically identify the applicable dispute type from your description.
      </p>
    </label>
  );
}

function FilingDatePicker({ value, onChange }) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-medium text-slate-200">Filing date</div>
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-[#101010] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400/50 focus:ring-2 focus:ring-orange-400/20"
      />
      <p className="mt-2 text-xs leading-6 text-slate-500">Filing year and filing quarter are derived automatically.</p>
    </label>
  );
}

export function PredictionForm({
  states,
  districts,
  courts,
  values,
  onStateChange,
  onDistrictChange,
  onCourtChange,
  onDescriptionChange,
  onDateChange,
  onAnalyze,
  predicting,
  error,
  courtDropdownOpen,
  setCourtDropdownOpen,
  dropdownRef,
}) {
  const canAnalyze =
    values.stateCode &&
    values.districtCode &&
    values.courtNo &&
    values.caseDescription.trim().length > 20 &&
    !predicting;

  const selectedCourt = courts.find((court) => String(court.court_no) === String(values.courtNo));

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10" id="analyze-form">
      <SectionLabel
        eyebrow="Prediction form"
        title="Enter the dispute details and review the jurisdiction intelligence"
        description="The form is intentionally spare: choose the jurisdiction, describe the dispute, and let the model produce the resolution timeline with supporting signals."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.75fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 sm:p-7">
          <div className="grid gap-5 md:grid-cols-2">
            <StateSelector states={states} value={values.stateCode} onChange={onStateChange} loading={values.loadingStates} />
            <DistrictSelector
              districts={districts}
              value={values.districtCode}
              onChange={onDistrictChange}
              loading={values.loadingDistricts}
              disabled={!values.stateCode}
            />
          </div>

          <div className="mt-5">
            <CourtSelector
              courts={courts}
              value={values.courtNo}
              onChange={onCourtChange}
              loading={values.loadingCourts}
              disabled={!values.stateCode || !values.districtCode}
              selectedCourt={selectedCourt}
              open={courtDropdownOpen}
              setOpen={setCourtDropdownOpen}
              dropdownRef={dropdownRef}
            />
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-[1.4fr_0.6fr]">
            <CaseDescriptionInput value={values.caseDescription} onChange={onDescriptionChange} />
            <FilingDatePicker value={values.filingDate} onChange={onDateChange} />
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={onAnalyze}
              disabled={!canAnalyze}
              className="flex w-full items-center justify-center rounded-2xl bg-[#E8732A] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#f08235] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {predicting ? (
                <span className="inline-flex items-center gap-3">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
                  Analyzing 500,000+ case patterns...
                </span>
              ) : (
                "Analyze Dispute Timeline →"
              )}
            </button>
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              Unable to analyze at this time. Please try again.
            </div>
          ) : null}
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 sm:p-7">
          <div className="text-xs uppercase tracking-[0.32em] text-slate-500">Model inputs</div>
          <div className="mt-4 space-y-4">
            <InfoRow label="Filing year" value={values.filingYear || "—"} />
            <InfoRow label="Filing quarter" value={values.filingQuarter || "—"} />
            <InfoRow label="Estimated dispute type" value={values.disputeTypeLabel || "Waiting for description"} />
            <InfoRow label="Judge position" value="civil judge senior division" />
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-5">
            <div className="text-xs uppercase tracking-[0.32em] text-slate-500">Ready state</div>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              The timeline prediction only runs once the jurisdiction is selected and the dispute description has enough
              detail for the model to infer the most likely type code.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MiniIndicator label="State" value={values.stateCode ? "Selected" : "Pending"} />
              <MiniIndicator label="District" value={values.districtCode ? "Selected" : "Pending"} />
              <MiniIndicator label="Court" value={values.courtNo ? "Selected" : "Pending"} />
              <MiniIndicator label="Description" value={values.caseDescription.trim() ? "Ready" : "Pending"} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
