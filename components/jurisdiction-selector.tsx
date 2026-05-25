// hello
"use client";

import { useMemo, useState } from "react";
import { CANADIAN_PROVINCES, COUNTRIES, US_STATES } from "@/lib/constants";
import type { CountryCode, Jurisdiction } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type JurisdictionSelectorProps = {
  value: Jurisdiction;
  onChange: (next: Jurisdiction) => void;
};

export function JurisdictionSelector({ value, onChange }: JurisdictionSelectorProps) {
  const [country, setCountry] = useState<CountryCode>(value.country);
  const selectedCountry = useMemo(
    () => COUNTRIES.find((item) => item.code === country) ?? COUNTRIES[0],
    [country]
  );

  const subdivisions = useMemo(() => {
    if (country === "us") {
      return [...US_STATES];
    }
    if (country === "canada") {
      return [...CANADIAN_PROVINCES];
    }
    return [];
  }, [country]);

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="country">Country</Label>
        <select
          id="country"
          className="h-11 rounded-2xl border border-border bg-white px-4 text-sm text-text-primary shadow-sm outline-none focus:border-border-strong"
          value={country}
          onChange={(event) => {
            const next = event.target.value as CountryCode;
            setCountry(next);
            onChange({ country: next, state: "" });
          }}
        >
          {COUNTRIES.map((option) => (
            <option key={option.code} value={option.code}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {selectedCountry.requiresSubdivision ? (
        <div className="grid gap-2">
          <Label htmlFor="state">{selectedCountry.subdivisionLabel ?? "State / province"}</Label>
          <select
            id="state"
            className="h-11 rounded-2xl border border-border bg-white px-4 text-sm text-text-primary shadow-sm outline-none focus:border-border-strong"
            value={value.state ?? ""}
            onChange={(event) => onChange({ country, state: event.target.value })}
          >
            <option value="">Select one</option>
            {subdivisions.map((subdivision) => (
              <option key={subdivision} value={subdivision}>
                {subdivision}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="grid gap-2">
          <Label htmlFor="state">State / region</Label>
          <Input
            id="state"
            value={value.state ?? ""}
            placeholder="Optional"
            onChange={(event) => onChange({ country, state: event.target.value })}
          />
        </div>
      )}
    </div>
  );
}
