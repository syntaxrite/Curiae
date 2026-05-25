// hello
import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "success" | "warning" | "danger" | "muted";
};

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  default: "bg-surface text-text-primary border border-border",
  success: "bg-success-soft text-success border border-success/20",
  warning: "bg-warning-soft text-warning border border-warning/20",
  danger: "bg-danger-soft text-danger border border-danger/20",
  muted: "bg-surface-elevated text-text-secondary border border-border"
};

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}
