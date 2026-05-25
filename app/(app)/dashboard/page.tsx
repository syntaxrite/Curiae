// hello
"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, truncate } from "@/lib/utils";

export default function DashboardPage() {
  const { userId, isLoaded } = useAuth();
  const userKey = userId ?? "";
  const userResult = useQuery(api.users.getUserByClerkId, { clerkId: userKey });
  const queriesResult = useQuery(api.queries.getRecentQueries, { userId: userKey, limit: 5 });
  const documentsResult = useQuery(api.documents.getDocumentsByUser, { userId: userKey, limit: 5 });

  const user = userResult?.data ?? null;
  const queries = queriesResult?.data ?? [];
  const documents = documentsResult?.data ?? [];

  const deepCount = queries.filter((item) => item.type === "deep").length;
  const flaggedCount = queries.filter((item) => item.riskFlagged).length;

  if (!isLoaded) {
    return <div className="text-sm text-text-secondary">Loading dashboard…</div>;
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="grid gap-2">
          <h2 className="text-4xl tracking-tight">Dashboard</h2>
          <p className="max-w-3xl text-base leading-7 text-text-secondary">
            Welcome back{user?.email ? `, ${user.email}` : ""}. Track your latest legal questions, documents, and
            jurisdiction settings here.
          </p>
        </div>
        <Link href="/ask" className="inline-flex items-center justify-center rounded-2xl border border-accent bg-accent px-4 py-3 text-sm font-medium text-white hover:bg-accent-hover">
          Ask Curiae
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Recent questions</CardDescription>
            <CardTitle>{queries.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Deep analyses</CardDescription>
            <CardTitle>{deepCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Risk flagged</CardDescription>
            <CardTitle>{flaggedCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Documents saved</CardDescription>
            <CardTitle>{documents.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent queries</CardTitle>
            <CardDescription>The latest answers saved by Curiae.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {queries.length ? (
              queries.map((item) => (
                <Link
                  href="/history"
                  key={item._id}
                  className="rounded-2xl border border-border bg-white p-4 transition-colors hover:bg-surface"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-text-primary">{truncate(item.question, 90)}</p>
                    <Badge tone={item.type === "deep" ? "default" : "muted"}>{item.type}</Badge>
                  </div>
                  <p className="mt-2 text-xs text-text-muted">{formatDateTime(item.createdAt)}</p>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-surface p-5 text-sm text-text-secondary">
                No queries yet. Ask your first question to create a record.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick ask</CardTitle>
              <CardDescription>Jump straight into Curiae from the dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/ask" className="inline-flex w-full items-center justify-center rounded-2xl border border-accent bg-accent px-4 py-3 text-sm font-medium text-white hover:bg-accent-hover">
                Open ask page
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Saved documents</CardTitle>
              <CardDescription>Recent uploads and their analysis status.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {documents.length ? (
                documents.map((document) => (
                  <Link
                    href={`/documents/${document._id}`}
                    key={document._id}
                    className="rounded-2xl border border-border bg-white p-4 hover:bg-surface"
                  >
                    <p className="text-sm font-medium text-text-primary">{document.fileName}</p>
                    <p className="mt-1 text-xs text-text-muted">
                      {document.analysis ? "Analysis complete" : "Awaiting analysis"} • {formatDateTime(document.createdAt)}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-surface p-5 text-sm text-text-secondary">
                  Upload a document to analyze it here.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
                      }
