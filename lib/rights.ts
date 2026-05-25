import { capitalizeWords } from "@/lib/utils";
import { DEFAULT_RIGHTS_COPY, RIGHTS_CATEGORIES, getCountryLabel } from "@/lib/constants";
import type { RightsRecord, RightsCategoryDefinition } from "@/lib/types";

function getCategoryDefinition(category: string): RightsCategoryDefinition {
  return RIGHTS_CATEGORIES.find((item) => item.key === category) ?? {
    key: category,
    label: capitalizeWords(category),
    summary: "General rights information for this topic."
  };
}

export function createFallbackRights(country: string, category: string): RightsRecord {
  const definition = getCategoryDefinition(category);
  const countryLabel = getCountryLabel(country);
  return {
    country,
    category,
    question: `What are my basic rights in ${countryLabel} for ${definition.label.toLowerCase()}?`,
    rights: [
      `${countryLabel} law may give you basic procedural rights relating to ${definition.label.toLowerCase()}.`,
      ...DEFAULT_RIGHTS_COPY.rights
    ],
    exceptions: [...DEFAULT_RIGHTS_COPY.exceptions],
    actionSteps: [...DEFAULT_RIGHTS_COPY.actionSteps],
    whenToCall:
      "Call a licensed lawyer quickly if a deadline is running, if money or housing is at risk, or if safety is involved."
  };
}

export function rightsCategoryLabel(category: string): string {
  return getCategoryDefinition(category).label;
}

export function rightsCategorySummary(category: string): string {
  return getCategoryDefinition(category).summary;
}
