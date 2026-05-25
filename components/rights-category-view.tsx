"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createFallbackRights, rightsCategoryLabel, rightsCategorySummary } from "@/lib/rights";
import { getCountryLabel } from "@/lib/constants";
import type { RightsRecord } from "@/lib/types";

type RightsCategoryViewProps = {
  country: string;
  category: string;
};

export function RightsCategoryView({ country, category }: RightsCategoryViewProps) {
  const result = useQuery(api.rights.getRightsByCountryAndCategory, { country, category });
  const rights: RightsRecord = result?.data ?? createFallbackRights(country, category);
  const title = rightsCategoryLabel(category);
  const summary = rightsCategorySummary(category);

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <div className="flex items-center gap-3">
          <Badge tone="muted">{getCountryLabel(country)}</Badge>
          <Badge tone="default">{title}</Badge>
        </div>
        <h1 className="text-5xl tracking-tight">{title} in {getCountryLabel(country)}</h1>
        <p className="max-w-3xl text-lg leading-8 text-text-secondary">{summary}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Question</CardTitle>
            <CardDescription>The default prompt for this rights page.</CardDescription>
          </CardHeader>
          <CardContent className="legal-serif whitespace-pre-wrap text-[16px] leading-8 text-text-primary">
            {rights.question}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>When to call a lawyer</CardTitle>
            <CardDescription>Situations where a licensed lawyer matters quickly.</CardDescription>
          </CardHeader>
          <CardContent className="legal-serif whitespace-pre-wrap text-[16px] leading-8 text-text-primary">
            {rights.whenToCall}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Rights</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {rights.rights.map((item: string, index: number) => (
              <div key={`${item}-${index}`} className="rounded-2xl border border-border bg-white p-4 text-sm leading-6 text-text-primary">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exceptions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {rights.exceptions.map((item: string, index: number) => (
              <div key={`${item}-${index}`} className="rounded-2xl border border-border bg-surface p-4 text-sm leading-6 text-text-primary">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Action steps</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {rights.actionSteps.map((item: string, index: number) => (
              <div key={`${item}-${index}`} className="rounded-2xl border border-border bg-white p-4 text-sm leading-6 text-text-primary">
                <span className="mr-2 font-semibold text-accent">{index + 1}.</span>
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
