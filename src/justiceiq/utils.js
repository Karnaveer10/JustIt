import { FEATURE_LABELS, TYPE_HINTS } from "./constants.js";

export function formatDays(value) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return `${Math.round(Number(value)).toLocaleString("en-IN")} days`;
}

export function formatPending(value) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return Number(value).toLocaleString("en-IN");
}

export function getQuarter(dateValue) {
  if (!dateValue) return 1;
  const month = new Date(`${dateValue}T00:00:00`).getMonth();
  return Math.floor(month / 3) + 1;
}

export function getStatusTone(medianDays) {
  if (medianDays < 365) {
    return {
      ring: "ring-emerald-400/35 bg-emerald-500/10 text-emerald-300",
      dot: "bg-emerald-400",
      bar: "bg-emerald-400",
      label: "Faster",
    };
  }
  if (medianDays <= 730) {
    return {
      ring: "ring-amber-400/35 bg-amber-500/10 text-amber-300",
      dot: "bg-amber-400",
      bar: "bg-amber-400",
      label: "Moderate",
    };
  }
  return {
    ring: "ring-rose-400/35 bg-rose-500/10 text-rose-300",
    dot: "bg-rose-400",
    bar: "bg-rose-400",
    label: "Slower",
  };
}

export function normalizePrediction(prediction) {
  const value = String(prediction || "").toLowerCase();
  if (value.includes("under_6months") || value.includes("under 6") || value.includes("short")) {
    return "under_6months";
  }
  if (
    value.includes("six_to_24months") ||
    value.includes("6-24") ||
    value.includes("six") ||
    value.includes("24")
  ) {
    return "six_to_24months";
  }
  if (value.includes("over_2years") || value.includes("over 2") || value.includes("2years")) {
    return "over_2years";
  }
  return "six_to_24months";
}

export function humanizeFeature(feature) {
  return FEATURE_LABELS[feature] || feature.replace(/_/g, " ");
}

export function inferTypeFromDescription(description) {
  const text = String(description || "").toLowerCase();
  for (const hint of TYPE_HINTS) {
    if (hint.keywords.some((keyword) => text.includes(keyword))) {
      return hint;
    }
  }

  // TODO: replace this local heuristic with a real LLM/classifier call once the backend is ready.
  return { code: 3983, label: "money suit" };
}

export async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}
