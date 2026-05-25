// hello
"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, truncate } from "@/lib/utils";

export default function HistoryPage() {
  const { userId, isLoaded } = useAuth();
  const clerkId = userId ?? "";
  const [filter, setFilter] = useState<"all" | "standard" | "deep">("all");
  const result = useQuery(api.queries.getQueriesByUser, { userId: clerkId, limit: 100 });
  const queries = result?.data ?? [];

  const filtered = useMemo(() => {
    if (filter === "all") {
      return queries;
    }
    return queries.filter((item) => item.type === filter);
  }, [filter, queries]);

  if (!isLoaded) {
    return <div className="text-sm text-text-secondary">Loading history…</div>;
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h2 className="text-4xl tracking-tight">History</h2>
        <p className="max-w-3xl text-base leading-7 text-text-secondary">
          Review every saved question and filter by standard or deep analysis.
        </p>
      </div>

      <div className="flex gap-3">
        {(["all", "standard", "deep"] as const).map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`rounded-2xl border px-4 py-3 text-sm transition-colors ${
              filter === item ? "border-accent bg-surface text-text-primary" : "border-border bg-white text-text-secondary"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Query log</CardTitle>
          <CardDescription>{filtered.length} result(s)</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {filtered.length ? (
            filtered.map((item) => (
              <div key={item._id} className="rounded-2xl border border-border bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-text-primary">{truncate(item.question, 90)}</p>
                  <Badge tone={item.type === "deep" ? "default" : "muted"}>{item.type}</Badge>
                </div>
                <p className="mt-2 text-xs text-text-muted">{formatDateTime(item.createdAt)}</p>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-text-secondary">{truncate(item.response, 500)}</p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-surface p-5 text-sm text-text-secondary">
              No queries match the current filter.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
        }
