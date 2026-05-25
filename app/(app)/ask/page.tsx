"use client";

import { useEffect, useMemo, useState } from "react";
import { useAction, useQuery } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { JurisdictionSelector } from "@/components/jurisdiction-selector";
import { CuriaeOutput } from "@/components/curiae-output";
import { RiskBanner } from "@/components/risk-banner";
import type { CuriaeDeepResponse, CuriaeStandardResponse, Jurisdiction } from "@/lib/types";
import { isRiskFlagged } from "@/lib/constants";

export default function AskPage() {
  const { userId, isLoaded } = useAuth();
  const clerkId = userId ?? "";
  const userResult = useQuery(api.users.getUserByClerkId, { clerkId });
  const askStandard = useAction(api.ai.askStandard);
  const askDeep = useAction(api.ai.askDeep);

  const user = userResult?.data ?? null;

  const [question, setQuestion] = useState(
    "What should I do if I receive a formal legal notice from my landlord?"
  );
  const [mode, setMode] = useState<"standard" | "deep">("deep");
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>({
    country: "uk",
    state: ""
  });
  const [loading, setLoading] = useState(false);
  const [standardResponse, setStandardResponse] = useState<CuriaeStandardResponse | null>(null);
  const [deepResponse, setDeepResponse] = useState<CuriaeDeepResponse | null>(null);
  const flagged = useMemo(() => isRiskFlagged(question), [question]);

  useEffect(() => {
    if (user?.country) {
      setJurisdiction({
        country: user.country as Jurisdiction["country"],
        state: user.state ?? ""
      });
    }
  }, [user?.country, user?.state]);

  async function handleAsk() {
    if (!question.trim()) {
      return;
    }

    setLoading(true);
    setStandardResponse(null);
    setDeepResponse(null);

    try {
      if (mode === "standard") {
        const result = await askStandard({
          userId: clerkId,
          question,
          country: jurisdiction.country,
          state: jurisdiction.state
        });

        if (!result.success || !result.data) {
          throw new Error(result.error ?? "Unable to generate a response.");
        }

        setStandardResponse(result.data);
      } else {
        const result = await askDeep({
          userId: clerkId,
          question,
          country: jurisdiction.country,
          state: jurisdiction.state
        });

        if (!result.success || !result.data) {
          throw new Error(result.error ?? "Unable to generate a response.");
        }

        setDeepResponse(result.data);
      }
    } catch (error) {
      setDeepResponse({
        summary: error instanceof Error ? error.message : "Something went wrong.",
        redFlags: [],
        actionSteps: [],
        lawyerNeeded: "",
        jurisdictionNote: "",
        disclaimer: "This is not legal advice. Curiae is an AI tool.",
        urgent: true,
        raw: ""
      });
      setMode("deep");
    } finally {
      setLoading(false);
    }
  }

  if (!isLoaded) {
    return <div className="text-sm text-text-secondary">Loading Curiae…</div>;
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <div className="flex items-center gap-3">
          <h2 className="text-4xl tracking-tight">Ask Curiae</h2>
          <Badge tone="muted">Jurisdiction aware</Badge>
        </div>
        <p className="max-w-3xl text-base leading-7 text-text-secondary">
          Choose a jurisdiction, ask your question, and receive either a plain answer or a deeper structured analysis.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle>Question</CardTitle>
            <CardDescription>Keep it focused. Curiae works best with a single issue and a clear location.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-text-primary">Mode</label>
              <div className="flex gap-3">
                <button
                  className={`rounded-2xl border px-4 py-3 text-sm transition-colors ${
                    mode === "standard"
                      ? "border-accent bg-surface text-text-primary"
                      : "border-border bg-white text-text-secondary"
                  }`}
                  onClick={() => setMode("standard")}
                  type="button"
                >
                  Standard
                </button>
                <button
                  className={`rounded-2xl border px-4 py-3 text-sm transition-colors ${
                    mode === "deep"
                      ? "border-accent bg-surface text-text-primary"
                      : "border-border bg-white text-text-secondary"
                  }`}
                  onClick={() => setMode("deep")}
                  type="button"
                >
                  Deep
                </button>
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-text-primary" htmlFor="question">
                Your question
              </label>
              <Textarea
                id="question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask a legal question..."
              />
            </div>

            <JurisdictionSelector value={jurisdiction} onChange={setJurisdiction} />

            <div className="flex items-center gap-3">
              <Button onClick={handleAsk} disabled={loading}>
                {loading ? "Curiae is thinking…" : "Ask Curiae"}
              </Button>
              <p className="text-xs leading-5 text-text-muted">
                {flagged ? "This question contains a risk keyword and will be treated carefully." : "General legal guidance only."}
              </p>
            </div>

            <RiskBanner urgent={flagged} />
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {standardResponse ? <CuriaeOutput mode="standard" response={standardResponse} /> : null}
          {deepResponse ? <CuriaeOutput mode="deep" response={deepResponse} /> : null}
          {!standardResponse && !deepResponse ? (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle>Curiae output</CardTitle>
                <CardDescription>Your response will appear here after submission.</CardDescription>
              </CardHeader>
              <CardContent className="text-sm leading-7 text-text-secondary">
                Deep mode returns structured sections. Standard mode returns a short plain-English answer.
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}

