export const API_BASE_URL = "https://justit-production.up.railway.app";
export const NATIONAL_MEDIAN_DAYS = 293;

export const FALLBACK_STATES = [
  { code: 1, name: "Maharashtra" },
  { code: 2, name: "Andhra Pradesh" },
  { code: 3, name: "Karnataka" },
  { code: 4, name: "Kerala" },
  { code: 5, name: "Himachal Pradesh" },
  { code: 6, name: "Assam" },
  { code: 7, name: "Jharkhand" },
  { code: 8, name: "Bihar" },
  { code: 9, name: "Rajasthan" },
  { code: 10, name: "Tamil Nadu" },
  { code: 11, name: "Orissa" },
  { code: 12, name: "Jammu and Kashmir" },
  { code: 13, name: "Uttar Pradesh" },
  { code: 14, name: "Haryana" },
  { code: 15, name: "Uttarakhand" },
  { code: 16, name: "West Bengal" },
  { code: 17, name: "Gujarat" },
  { code: 18, name: "Chhattisgarh" },
  { code: 19, name: "Mizoram" },
  { code: 20, name: "Tripura" },
  { code: 21, name: "Meghalaya" },
  { code: 22, name: "Punjab" },
  { code: 23, name: "Madhya Pradesh" },
  { code: 24, name: "Sikkim" },
  { code: 25, name: "Manipur" },
  { code: 26, name: "Delhi" },
  { code: 27, name: "Chandigarh" },
  { code: 29, name: "Telangana" },
  { code: 30, name: "Goa" },
  { code: 31, name: "Diu and Daman" },
  { code: 32, name: "DNH at Silvasa" },
  { code: 33, name: "Ladakh" },
];

export const FEATURE_LABELS = {
  state_code: "State",
  dist_code: "District",
  court_no: "Court",
  judge_position: "Judge Assignment",
  type_name: "Case Type",
  filing_year: "Filing Year",
  filing_quarter: "Filing Season",
  court_historical_median_resolution: "Court Backlog",
  pending_cases_count: "Court Caseload",
};

export const TYPE_HINTS = [
  {
    code: 3983,
    label: "money suit",
    keywords: [
      "payment",
      "invoice",
      "receivable",
      "debt",
      "dues",
      "supplier",
      "goods",
      "purchase",
      "amount",
      "lakhs",
      "crore",
      "default",
      "breach",
      "overdue",
      "settlement",
    ],
  },
  {
    code: 3671,
    label: "original (title/partition/money) suit",
    keywords: ["title", "partition", "ownership", "property", "possession"],
  },
  {
    code: 4252,
    label: "original (title/partition/money) suit",
    keywords: ["commercial", "contract", "agreement", "indemnity", "invoice"],
  },
];

export const FORMATTED_RECOVERY = {
  under_6months: {
    label: "UNDER 6 MONTHS",
    tone: "good",
    recommendation: "Low delay risk. Standard litigation timeline expected.",
  },
  six_to_24months: {
    label: "6-24 MONTHS",
    tone: "warn",
    recommendation:
      "Moderate delay risk. Consider including arbitration clauses in contract negotiations.",
  },
  over_2years: {
    label: "OVER 2 YEARS",
    tone: "bad",
    recommendation:
      "High delay risk. Strong recommendation to pursue out-of-court settlement or choose a faster jurisdiction.",
  },
};
