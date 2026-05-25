// hello
import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-[140px] w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-text-primary shadow-sm transition-colors placeholder:text-text-muted focus:border-border-strong focus:outline-none focus:ring-2 focus:ring-border-strong disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
