// hello
---

**lib/types.ts**
```ts
export type ApiResult<T> = {
  success: boolean;
  data: T;
  error: string | null;
};

export type CountryCode =
  | "uk"
  | "us"
  | "australia"
  | "canada"
  | "ireland"
  | "new-zealand"
  | "singapore"
  | "hong-kong"
  | "south-africa"
  | "brazil";

export type CountryOption = {
  code: CountryCode;
  label: string;
  requiresSubdivision: boolean;
  subdivisionLabel?: string;
};

export type Jurisdiction = {
  country: CountryCode;
  state?: string;
};

export type UserRecord = {
  _id?: string;
  clerkId: string;
  email: string;
  country?: string;
  state?: string;
  createdAt: number;
};

export type QueryRecord = {
  _id?: string;
  userId: string;
  question: string;
  response: string;
  country?: string;
  state?: string;
  type: "standard" | "deep";
  riskFlagged: boolean;
  createdAt: number;
};

export type DocumentRecord = {
  _id?: string;
  userId: string;
  fileName: string;
  storageId: string;
  docType?: string;
  analysis?: string;
  createdAt: number;
  storageUrl?: string | null;
};

export type RightsRecord = {
  _id?: string;
  country: string;
  category: string;
  question: string;
  rights: string[];
  exceptions: string[];
  actionSteps: string[];
  whenToCall: string;
};

export type CuriaeStandardResponse = {
  answer: string;
  riskFlagged: boolean;
};

export type CuriaeDeepResponse = {
  summary: string;
  redFlags: string[];
  actionSteps: string[];
  lawyerNeeded: string;
  jurisdictionNote: string;
  disclaimer: string;
  urgent: boolean;
  raw: string;
};

export type DocumentAnalysisResponse = {
  extraction: string;
  analysis: string;
  urgent: boolean;
};

export type RightsCategoryDefinition = {
  key: string;
  label: string;
  summary: string;
};

export type SidebarLink = {
  href: string;
  label: string;
};
