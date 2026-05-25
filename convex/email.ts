// hello
import { v } from "convex/values";
import { action } from "./_generated/server";
import { fail, ok } from "./helpers";
import type { ApiResult } from "../lib/types";
import { Resend } from "resend";

export const sendWelcomeEmail = action({
  args: {
    email: v.string(),
    firstName: v.optional(v.string())
  },
  handler: async (_ctx, args): Promise<ApiResult<{ sent: boolean }>> => {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;

    if (!apiKey || !from) {
      return fail<{ sent: boolean }>("Missing RESEND_API_KEY or RESEND_FROM_EMAIL.", {
        sent: false
      });
    }

    const resend = new Resend(apiKey);
    const recipientName = args.firstName?.trim() || "there";

    const result = await resend.emails.send({
      from,
      to: args.email,
      subject: "Welcome to Curiae",
      html: `
        <div style="font-family: Inter, Arial, sans-serif; line-height: 1.6; color: #2C1810;">
          <h1 style="margin-bottom: 16px;">Welcome to Curiae</h1>
          <p>Hi ${recipientName},</p>
          <p>Curiae is ready to help you get structured legal information in plain English.</p>
          <p>You can ask a question, upload a document, or browse the rights hub for your country.</p>
          <p style="margin-top: 24px;">Curiae is for legal information only and does not provide legal representation.</p>
        </div>
      `
    });

    return ok<{ sent: boolean }>({ sent: Boolean(result.data?.id) });
  }
});
