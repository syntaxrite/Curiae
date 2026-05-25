// hello
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { fail, ok } from "./helpers";
import type { ApiResult, QueryRecord } from "../lib/types";

export const getQueriesByUser = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args): Promise<ApiResult<QueryRecord[]>> => {
    const queries = await ctx.db
      .query("queries")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit ?? 50);

    return ok<QueryRecord[]>(
      queries.map((item) => ({
        _id: item._id,
        userId: item.userId,
        question: item.question,
        response: item.response,
        country: item.country,
        state: item.state,
        type: item.type,
        riskFlagged: item.riskFlagged,
        createdAt: item.createdAt
      }))
    );
  }
});

export const getRecentQueries = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args): Promise<ApiResult<QueryRecord[]>> => {
    const queries = await ctx.db
      .query("queries")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit ?? 8);

    return ok<QueryRecord[]>(
      queries.map((item) => ({
        _id: item._id,
        userId: item.userId,
        question: item.question,
        response: item.response,
        country: item.country,
        state: item.state,
        type: item.type,
        riskFlagged: item.riskFlagged,
        createdAt: item.createdAt
      }))
    );
  }
});

export const saveQuery = mutation({
  args: {
    userId: v.string(),
    question: v.string(),
    response: v.string(),
    country: v.optional(v.string()),
    state: v.optional(v.string()),
    type: v.union(v.literal("standard"), v.literal("deep")),
    riskFlagged: v.boolean()
  },
  handler: async (ctx, args): Promise<ApiResult<QueryRecord>> => {
    const createdAt = Date.now();
    const id = await ctx.db.insert("queries", {
      userId: args.userId,
      question: args.question,
      response: args.response,
      country: args.country,
      state: args.state,
      type: args.type,
      riskFlagged: args.riskFlagged,
      createdAt
    });

    return ok<QueryRecord>({
      _id: id,
      userId: args.userId,
      question: args.question,
      response: args.response,
      country: args.country,
      state: args.state,
      type: args.type,
      riskFlagged: args.riskFlagged,
      createdAt
    });
  }
});
