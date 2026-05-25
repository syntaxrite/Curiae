import { v } from "convex/values";
import { query } from "./_generated/server";
import { createFallbackRights } from "../lib/rights";
import { ok } from "./helpers";
import type { ApiResult, RightsRecord } from "../lib/types";

export const getRightsByCountryAndCategory = query({
  args: {
    country: v.string(),
    category: v.string()
  },
  handler: async (ctx, args): Promise<ApiResult<RightsRecord>> => {
    const existing = await ctx.db
      .query("rightsContent")
      .withIndex("by_country_category", (q) => q.eq("country", args.country))
      .filter((q) => q.eq(q.field("category"), args.category))
      .unique();

    if (!existing) {
      return ok<RightsRecord>(createFallbackRights(args.country, args.category));
    }

    return ok<RightsRecord>({
      _id: existing._id,
      country: existing.country,
      category: existing.category,
      question: existing.question,
      rights: existing.rights,
      exceptions: existing.exceptions,
      actionSteps: existing.actionSteps,
      whenToCall: existing.whenToCall
    });
  }
});
