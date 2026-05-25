"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JurisdictionSelector } from "@/components/jurisdiction-selector";
import type { Jurisdiction } from "@/lib/types";

export default function SettingsPage() {
  const { userId, isLoaded } = useAuth();
  const { user } = useUser();
  const clerkId = userId ?? "";
  const userResult = useQuery(api.users.getUserByClerkId, { clerkId });
  const updateJurisdiction = useMutation(api.users.updateJurisdiction);
  const current = userResult?.data ?? null;
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>({
    country: "uk",
    state: ""
  });
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (current?.country) {
      setJurisdiction({
        country: current.country as Jurisdiction["country"],
        state: current.state ?? ""
      });
    }
  }, [current?.country, current?.state]);

  async function handleSave() {
    setStatus("Saving…");
    const result = await updateJurisdiction({
      clerkId,
      country: jurisdiction.country,
      state: jurisdiction.state
    });

    setStatus(result.success ? "Jurisdiction updated." : result.error ?? "Unable to update jurisdiction.");
  }

  if (!isLoaded) {
    return <div className="text-sm text-text-secondary">Loading settings…</div>;
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h2 className="text-4xl tracking-tight">Settings</h2>
        <p className="max-w-3xl text-base leading-7 text-text-secondary">
          Keep your jurisdiction current so Curiae can tailor guidance correctly.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Clerk-managed account details.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm text-text-secondary">
            <div>
              <p className="font-medium text-text-primary">Email</p>
              <p className="mt-1">{user?.primaryEmailAddress?.emailAddress ?? current?.email ?? "Not available"}</p>
            </div>
            <div>
              <p className="font-medium text-text-primary">User ID</p>
              <p className="mt-1 break-all">{clerkId}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jurisdiction</CardTitle>
            <CardDescription>Used by Curiae when shaping answers.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <JurisdictionSelector value={jurisdiction} onChange={setJurisdiction} />
            <div className="flex items-center gap-3">
              <Button onClick={handleSave}>Save jurisdiction</Button>
              <p className="text-sm text-text-secondary">{status}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
