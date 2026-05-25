// hello
import { capitalizeWords } from "@/lib/utils";
import type { CountryCode, CountryOption, RightsCategoryDefinition } from "@/lib/types";

export const TIER_LIMITS = {
  free: {
    dailyQueries: 12,
    deepQueries: 3,
    documentUploads: 5
  }
} as const;

export const COUNTRIES: CountryOption[] = [
  { code: "uk", label: "United Kingdom", requiresSubdivision: false },
  { code: "us", label: "United States", requiresSubdivision: true, subdivisionLabel: "State" },
  { code: "australia", label: "Australia", requiresSubdivision: false },
  { code: "canada", label: "Canada", requiresSubdivision: true, subdivisionLabel: "Province / Territory" },
  { code: "ireland", label: "Ireland", requiresSubdivision: false },
  { code: "new-zealand", label: "New Zealand", requiresSubdivision: false },
  { code: "singapore", label: "Singapore", requiresSubdivision: false },
  { code: "hong-kong", label: "Hong Kong", requiresSubdivision: false },
  { code: "south-africa", label: "South Africa", requiresSubdivision: false },
  { code: "brazil", label: "Brazil", requiresSubdivision: false }
];

export const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming"
] as const;

export const CANADIAN_PROVINCES = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Yukon"
] as const;

export const RIGHTS_CATEGORIES: RightsCategoryDefinition[] = [
  {
    key: "arrest",
    label: "Police & arrest",
    summary: "What to do if you are stopped, searched, detained, or arrested."
  },
  {
    key: "eviction",
    label: "Housing & eviction",
    summary: "Notice periods, defense steps, and when landlord action is urgent."
  },
  {
    key: "workplace",
    label: "Workplace rights",
    summary: "Pay, discrimination, dismissal, and basic employment protections."
  },
  {
    key: "family",
    label: "Family law",
    summary: "Custody, protection, urgent safety steps, and court deadlines."
  },
  {
    key: "consumer",
    label: "Consumer disputes",
    summary: "Refunds, unfair charges, chargebacks, and dispute timelines."
  },
  {
    key: "immigration",
    label: "Immigration",
    summary: "Visa, status, and border-related rights with urgent warning signs."
  }
];

export const RISK_KEYWORDS = [
  "criminal arrest",
  "arrest",
  "immigration",
  "deportation",
  "domestic violence",
  "lawsuit deadline",
  "tax penalties",
  "bankruptcy",
  "custody",
  "restraining order",
  "eviction notice",
  "fraud"
] as const;

export function isRiskFlagged(question: string): boolean {
  const normalized = question.toLowerCase();
  return RISK_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

export function buildStandardPrompt(country: string, state?: string): string {
  const stateLine = state ? `State / region: ${state}\n` : "";
  return `Answer this legal question in plain English in under 150 words.
Direct answer only. No structured sections.
Country: ${country}
${stateLine}`;
}

export function buildDeepPrompt(country: string, state?: string): string {
  const stateLine = state ? `State / region: ${state}` : "State / region: not provided";
  return `You are Curiae, an AI legal assistant for Curiae.
You are responding under ${country} ${stateLine} law specifically.
Adapt reasoning for Common Law (case precedents) or Civil Law
(codified statutes) as appropriate.

Structure your response EXACTLY as:

SUMMARY: [what the law says]
RED_FLAGS: [concerns in this situation]
ACTION_STEPS: [numbered concrete next steps]
LAWYER_NEEDED: [specific reason if they need a lawyer]
JURISDICTION_NOTE: [any jurisdiction-specific caveats]
DISCLAIMER: This is not legal advice. Curiae is an AI tool.
Curiae provides legal information, not legal representation.
Consult a qualified lawyer for serious matters.

If the query contains any of: criminal arrest, immigration,
deportation, domestic violence, lawsuit deadline, tax penalties,
bankruptcy, custody, restraining order, eviction notice, fraud —
prepend: URGENT: This situation may require immediate licensed
legal advice. Consult a qualified lawyer before taking any action.`;
}

export const DEFAULT_RIGHTS_COPY = {
  rights: [
    "You may have a right to understand why an action was taken against you.",
    "You may have a right to keep records and ask for explanations in writing.",
    "You may have a right to seek independent legal advice before signing anything."
  ],
  exceptions: [
    "Emergency or safety exceptions may shorten normal timelines.",
    "Local procedure can change the practical steps even when the underlying right is the same."
  ],
  actionSteps: [
    "Write down dates, names, reference numbers, and what happened.",
    "Keep copies of letters, screenshots, notices, and messages.",
    "Check the deadline for a response before taking any action."
  ]
} as const;


export function getCountryLabel(code: string): string {
  return COUNTRIES.find((item) => item.code === (code as CountryCode))?.label ?? capitalizeWords(code);
}
