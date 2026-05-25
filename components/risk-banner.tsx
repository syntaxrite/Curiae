// hello
import { AlertTriangle } from "lucide-react";

type RiskBannerProps = {
  urgent?: boolean;
  message?: string;
};

export function RiskBanner({
  urgent = false,
  message = "This question may need licensed legal advice quickly. Review carefully before relying on any summary."
}: RiskBannerProps) {
  if (!urgent) {
    return null;
  }

  return (
    <div className="flex items-start gap-3 rounded-3xl border border-danger/20 bg-danger-soft p-4 text-danger">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="space-y-1">
        <p className="font-semibold">High-risk legal issue</p>
        <p className="text-sm leading-6">{message}</p>
      </div>
    </div>
  );
}
