// hello
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export const runtime = "nodejs";

type ClerkWebhookEvent = {
  type: string;
  data: {
    id: string;
    email_addresses?: Array<{ email_address: string }>;
    first_name?: string | null;
    last_name?: string | null;
  };
};

export async function POST(request: Request) {
  const payload = await request.text();
  const secret = process.env.CLERK_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json({ error: "Missing CLERK_WEBHOOK_SECRET." }, { status: 500 });
  }

  const svixHeaders = request.headers;
  const wh = new Webhook(secret);

  let event: ClerkWebhookEvent;
  try {
    event = wh.verify(payload, {
      "svix-id": svixHeaders.get("svix-id") ?? "",
      "svix-timestamp": svixHeaders.get("svix-timestamp") ?? "",
      "svix-signature": svixHeaders.get("svix-signature") ?? ""
    }) as ClerkWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  if (event.type === "user.created") {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      return NextResponse.json({ error: "Missing NEXT_PUBLIC_CONVEX_URL." }, { status: 500 });
    }

    const client = new ConvexHttpClient(convexUrl);
    const email = event.data.email_addresses?.[0]?.email_address ?? "";
    const result = await client.mutation(api.users.createUser, {
      clerkId: event.data.id,
      email
    });

    if (result.success) {
      await client.action(api.email.sendWelcomeEmail, {
        email,
        firstName: event.data.first_name ?? undefined
      });
    }

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}
