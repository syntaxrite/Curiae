// hello
"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentUpload } from "@/components/document-upload";
import { formatDateTime, truncate } from "@/lib/utils";
import type { Jurisdiction } from "@/lib/types";

export default function DocumentsPage() {
  const { userId, isLoaded } = useAuth();
  const clerkId = userId ?? "";
  const userResult = useQuery(api.users.getUserByClerkId, { clerkId });
  const documentsResult = useQuery(api.documents.getDocumentsByUser, { userId: clerkId, limit: 20 });

  const user = userResult?.data ?? null;
  const documents = documentsResult?.data ?? [];
  const jurisdiction: Jurisdiction = {
    country: (user?.country as Jurisdiction["country"]) ?? "uk",
    state: user?.state ?? ""
  };

  if (!isLoaded) {
    return <div className="text-sm text-text-secondary">Loading documents…</div>;
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h2 className="text-4xl tracking-tight">Documents</h2>
        <p className="max-w-3xl text-base leading-7 text-text-secondary">
          Upload a file to save it to Convex storage and run Curiae analysis against your selected jurisdiction.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[0.95fr_1.05fr]">
        <DocumentUpload userId={clerkId} jurisdiction={jurisdiction} />
        <Card>
          <CardHeader>
            <CardTitle>Saved documents</CardTitle>
            <CardDescription>Recent uploads and their current analysis state.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {documents.length ? (
              documents.map((document) => (
                <Link
                  href={`/documents/${document._id}`}
                  key={document._id}
                  className="rounded-2xl border border-border bg-white p-4 hover:bg-surface"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-text-primary">{truncate(document.fileName, 48)}</p>
                    <p className="text-xs text-text-muted">{document.docType?.toUpperCase() ?? "FILE"}</p>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-text-muted">
                    {document.analysis ? "Analysis ready" : "Awaiting analysis"} • {formatDateTime(document.createdAt)}
                  </p>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-surface p-5 text-sm text-text-secondary">
                No documents have been uploaded yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
