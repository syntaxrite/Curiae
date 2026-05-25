// hello
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function StandardSearch() {
  const router = useRouter();
  const [value, setValue] = useState(
    "Can my landlord evict me without notice if I missed one payment?"
  );

  return (
    <form
      className="grid gap-4 rounded-[28px] border border-border bg-white p-5 shadow-soft"
      onSubmit={(event) => {
        event.preventDefault();
        router.push("/sign-up");
      }}
    >
      <div className="grid gap-2">
        <label className="text-sm font-medium text-text-primary" htmlFor="legal-question">
          Ask a legal question
        </label>
        <Textarea
          id="legal-question"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="min-h-[120px]"
          placeholder="Type your legal question here..."
        />
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs leading-5 text-text-muted">
          Curiae gives legal information by jurisdiction, not legal advice.
        </p>
        <Button type="submit">Get started free</Button>
      </div>
    </form>
  );
}
