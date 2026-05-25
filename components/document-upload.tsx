// hello
"use client";

import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Jurisdiction, DocumentRecord, DocumentAnalysisResponse } from "@/lib/types";
import { RiskBanner } from "@/components/risk-banner";

type DocumentUploadProps = {
  userId: string;
  jurisdiction: Jurisdiction;
  onUploaded?: (document: DocumentRecord) => void;
};

export function DocumentUpload({ userId, jurisdiction, onUploaded }: DocumentUploadProps) {
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl as never);
  const saveDocument = useMutation(api.documents.saveDocument as never);
  const analyzeDocument = useAction(api.ai.analyzeDocument as never);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [analysis, setAnalysis] = useState<DocumentAnalysisResponse | null>(null);
  const [urgent, setUrgent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleUpload() {
    if (!file) {
      setStatus("Choose a file first.");
      return;
    }

    setBusy(true);
    setStatus("Preparing upload…");
    setAnalysis(null);

    try {
      const uploadResult = await generateUploadUrl();
      if (!uploadResult.success || !uploadResult.data) {
        throw new Error(uploadResult.error ?? "Unable to create an upload URL.");
      }

      const uploadResponse = await fetch(uploadResult.data.uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": file.type || "application/octet-stream"
        },
        body: file
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed.");
      }

      const uploaded = (await uploadResponse.json()) as { storageId: string };
      const docType = file.name.split(".").pop()?.toLowerCase();

      const saved = await saveDocument({
        userId,
        fileName: file.name,
        storageId: uploaded.storageId,
        docType
      });

      if (!saved.success || !saved.data) {
        throw new Error(saved.error ?? "Unable to save the document record.");
      }

      onUploaded?.(saved.data);
      setStatus("Running Curiae analysis…");

      const analysisResult = await analyzeDocument({
        userId,
        documentId: saved.data._id ?? "",
        storageId: saved.data.storageId,
        fileName: saved.data.fileName,
        country: jurisdiction.country,
        state: jurisdiction.state
      });

      if (!analysisResult.success || !analysisResult.data) {
        throw new Error(analysisResult.error ?? "Analysis failed.");
      }

      setAnalysis(analysisResult.data);
      setUrgent(analysisResult.data.urgent);
      setStatus("Analysis complete.");
      setFile(null);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload a document</CardTitle>
        <CardDescription>
          Upload a PDF, DOCX, or text file. Curiae will extract the text and produce a legal analysis in your selected
          jurisdiction.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="document-file">Choose file</Label>
          <Input
            id="document-file"
            type="file"
            accept=".pdf,.docx,.txt,.md,.rtf"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleUpload} disabled={busy}>
            {busy ? "Working…" : "Upload & analyze"}
          </Button>
          <p className="text-xs leading-5 text-text-muted">
            Supported: PDF, DOCX, TXT, MD, RTF.
          </p>
        </div>

        {status ? <p className="text-sm text-text-secondary">{status}</p> : null}
        <RiskBanner urgent={urgent} />

        {analysis ? (
          <div className="grid gap-4 rounded-3xl border border-border bg-surface p-4">
            <div>
              <p className="text-sm font-semibold text-text-primary">Extraction</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-text-secondary">{analysis.extraction}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Analysis</p>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-2xl border border-border bg-white p-4 text-sm leading-7 text-text-primary">
{analysis.analysis}
              </pre>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
    }
