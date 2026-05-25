// hello
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CuriaeDeepResponse, CuriaeStandardResponse } from "@/lib/types";
import { Separator } from "@/components/ui/separator";

type CuriaeOutputProps =
  | {
      mode: "standard";
      response: CuriaeStandardResponse;
    }
  | {
      mode: "deep";
      response: CuriaeDeepResponse;
    };

export function CuriaeOutput(props: CuriaeOutputProps) {
  if (props.mode === "standard") {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Curiae response</CardTitle>
            <Badge tone={props.response.riskFlagged ? "warning" : "default"}>
              {props.response.riskFlagged ? "Review carefully" : "Standard"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="legal-serif whitespace-pre-wrap text-[16px] leading-8 text-text-primary">
            {props.response.answer}
          </div>
        </CardContent>
      </Card>
    );
  }

  const { response } = props;

  return (
    <div className="grid gap-4">
      {response.urgent ? (
        <Badge tone="danger" className="w-fit">
          Urgent
        </Badge>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="legal-serif whitespace-pre-wrap text-[16px] leading-8 text-text-primary">
            {response.summary}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Red flags</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {response.redFlags.length ? (
            response.redFlags.map((item, index) => (
              <div key={`${item}-${index}`} className="rounded-2xl border border-danger/20 bg-danger-soft p-4 text-sm leading-6 text-text-primary">
                {item}
              </div>
            ))
          ) : (
            <div className="text-sm text-text-secondary">No major red flags identified.</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Action steps</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {response.actionSteps.map((item, index) => (
            <div key={`${item}-${index}`} className="rounded-2xl border border-border bg-surface p-4 text-sm leading-6 text-text-primary">
              <span className="mr-2 font-semibold text-accent">{index + 1}.</span>
              {item}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lawyer needed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="legal-serif whitespace-pre-wrap text-[16px] leading-8 text-text-primary">
            {response.lawyerNeeded}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Jurisdiction note</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="legal-serif whitespace-pre-wrap text-[16px] leading-8 text-text-primary">
              {response.jurisdictionNote}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Disclaimer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="legal-serif whitespace-pre-wrap text-[16px] leading-8 text-text-secondary">
              {response.disclaimer}
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Raw response</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-2xl border border-border bg-surface p-4 text-xs leading-6 text-text-secondary">
{response.raw}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
      }
