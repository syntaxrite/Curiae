// hello
"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiskBanner } from "@/components/risk-banner";
import { formatDateTime } from "@/lib/utils";

type Params = {
  id: string;
};

export default function DocumentDetailPage() {
  const params = useParams<Params>();
  const id = params.id;
  const documentResult = useQuery(api.documents.getDocumentById, { documentId: id });
  const document = documentResult?.data ?? null;

  if (!document) {
    return <div className="text-sm text-text-secondary">Loading document…</div>;
  }

  const analysis = document.analysis ?? "";

  return (
    <div className="grid gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="grid gap-2">
          <h2 className="text-4xl tracking-tight">{document.fileName}</h2>
          <p className="text-base leading-7 text-text-secondary">
            Uploaded {formatDateTime(document.createdAt)} • {document.docType?.toUpperCase() ?? "FILE"}
          </p>
        </div>
        <Badge tone={analysis ? "success" : "warning"}>{analysis ? "Analyzed" : "Pending"}</Badge>
      </div>

      <RiskBanner urgent={Boolean(analysis)} message="Document analysis may highlight serious deadlines or urgent issues." />

      <Card>
        <CardHeader>
          <CardTitle>Stored file</CardTitle>
          <CardDescription>Open the original upload when needed.</CardDescription>
        </CardHeader>
        <CardContent>
          {document.storageUrl ? (
            <a href={document.storageUrl} className="text-sm font-medium text-accent hover:text-accent-hover">
              Download original file
            </a>
          ) : (
            <p className="text-sm text-text-secondary">No storage URL is available for this file.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Curiae analysis</CardTitle>
          <CardDescription>Saved after the two-step extraction and analysis flow completes.</CardDescription>
        </CardHeader>
        <CardContent>
          {analysis ? (
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-2xl border border-border bg-surface p-4 text-sm leading-7 text-text-primary">
{analysis}
            </pre>
          ) : (
            <div className="text-sm text-text-secondary">No analysis has been saved for this document yet.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
