// hello
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    country: v.optional(v.string()),
    state: v.optional(v.string()),
    createdAt: v.number()
  }).index("by_clerk_id", ["clerkId"]),

  queries: defineTable({
    userId: v.string(),
    question: v.string(),
    response: v.string(),
    country: v.optional(v.string()),
    state: v.optional(v.string()),
    type: v.union(v.literal("standard"), v.literal("deep")),
    riskFlagged: v.boolean(),
    createdAt: v.number()
  }).index("by_user", ["userId"]),

  documents: defineTable({
    userId: v.string(),
    fileName: v.string(),
    storageId: v.string(),
    docType: v.optional(v.string()),
    analysis: v.optional(v.string()),
    createdAt: v.number()
  }).index("by_user", ["userId"]),

  rightsContent: defineTable({
    country: v.string(),
    category: v.string(),
    question: v.string(),
    rights: v.array(v.string()),
    exceptions: v.array(v.string()),
    actionSteps: v.array(v.string()),
    whenToCall: v.string()
  }).index("by_country_category", ["country", "category"])
});
