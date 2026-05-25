// hello
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { fail, ok } from "./helpers";
import type { ApiResult, UserRecord } from "../lib/types";

export const getUserByClerkId = query({
  args: {
    clerkId: v.string()
  },
  handler: async (ctx, args): Promise<ApiResult<UserRecord | null>> => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    return ok<UserRecord | null>(
      existing
        ? {
            _id: existing._id,
            clerkId: existing.clerkId,
            email: existing.email,
            country: existing.country,
            state: existing.state,
            createdAt: existing.createdAt
          }
        : null
    );
  }
});

export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    country: v.optional(v.string()),
    state: v.optional(v.string())
  },
  handler: async (ctx, args): Promise<ApiResult<UserRecord>> => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existing) {
      const updated = await ctx.db.patch(existing._id, {
        email: args.email,
        country: args.country ?? existing.country,
        state: args.state ?? existing.state
      });
      return ok<UserRecord>({
        _id: existing._id,
        clerkId: existing.clerkId,
        email: args.email,
        country: args.country ?? existing.country,
        state: args.state ?? existing.state,
        createdAt: existing.createdAt
      });
    }

    const now = Date.now();
    const id = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      country: args.country,
      state: args.state,
      createdAt: now
    });

    return ok<UserRecord>({
      _id: id,
      clerkId: args.clerkId,
      email: args.email,
      country: args.country,
      state: args.state,
      createdAt: now
    });
  }
});

export const updateJurisdiction = mutation({
  args: {
    clerkId: v.string(),
    country: v.string(),
    state: v.optional(v.string())
  },
  handler: async (ctx, args): Promise<ApiResult<UserRecord>> => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!existing) {
      return fail<UserRecord>("User not found.", {
        clerkId: args.clerkId,
        email: "",
        country: args.country,
        state: args.state,
        createdAt: Date.now()
      });
    }

    await ctx.db.patch(existing._id, {
      country: args.country,
      state: args.state
    });

    return ok<UserRecord>({
      _id: existing._id,
      clerkId: existing.clerkId,
      email: existing.email,
      country: args.country,
      state: args.state,
      createdAt: existing.createdAt
    });
  }
});
