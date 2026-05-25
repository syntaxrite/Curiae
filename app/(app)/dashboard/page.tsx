"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, truncate } from "@/lib/utils";
import type { QueryRecord, DocumentRecord } from "@/lib/types";

export default function DashboardPage() {
  const { userId, isLoaded } = useAuth();
  const userKey = userId ?? "";
  const userResult = useQuery(api.users.getUserByClerkId, { clerkId: userKey });
  const queriesResult = useQuery(api.queries.getRecentQueries, { userId: userKey, limit: 5 });
  const documentsResult = useQuery(api.documents.getDocumentsByUser, { userId: userKey, limit: 5 });

  const user = userResult?.data ?? null;
  const queries: QueryRecord[] = queriesResult?.data ?? [];
  const documents: DocumentRecord[] = documentsResult?.data ?? [];

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
