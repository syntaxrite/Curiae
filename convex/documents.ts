// hello
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { fail, ok } from "./helpers";
import type { ApiResult, DocumentRecord } from "../lib/types";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx): Promise<ApiResult<{ uploadUrl: string }>> => {
    const uploadUrl = await ctx.storage.generateUploadUrl();
    return ok<{ uploadUrl: string }>({ uploadUrl });
  }
});

export const getDocumentsByUser = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args): Promise<ApiResult<DocumentRecord[]>> => {
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit ?? 20);

    const data = await Promise.all(
      documents.map(async (item) => ({
        _id: item._id,
        userId: item.userId,
        fileName: item.fileName,
        storageId: item.storageId,
        docType: item.docType,
        analysis: item.analysis,
        createdAt: item.createdAt,
        storageUrl: await ctx.storage.getUrl(item.storageId)
      }))
    );

    return ok<DocumentRecord[]>(data);
  }
});

export const getDocumentById = query({
  args: {
    documentId: v.string()
  },
  handler: async (ctx, args): Promise<ApiResult<DocumentRecord | null>> => {
    const document = await ctx.db.get(args.documentId as never);

    if (!document) {
      return ok<DocumentRecord | null>(null);
    }

    return ok<DocumentRecord>({
      _id: document._id,
      userId: document.userId,
      fileName: document.fileName,
      storageId: document.storageId,
      docType: document.docType,
      analysis: document.analysis,
      createdAt: document.createdAt,
      storageUrl: await ctx.storage.getUrl(document.storageId)
    });
  }
});

export const saveDocument = mutation({
  args: {
    userId: v.string(),
    fileName: v.string(),
    storageId: v.string(),
    docType: v.optional(v.string())
  },
  handler: async (ctx, args): Promise<ApiResult<DocumentRecord>> => {
    const createdAt = Date.now();
    const id = await ctx.db.insert("documents", {
      userId: args.userId,
      fileName: args.fileName,
      storageId: args.storageId,
      docType: args.docType,
      createdAt
    });

    return ok<DocumentRecord>({
      _id: id,
      userId: args.userId,
      fileName: args.fileName,
      storageId: args.storageId,
      docType: args.docType,
      createdAt,
      storageUrl: await ctx.storage.getUrl(args.storageId)
    });
  }
});

export const updateDocumentAnalysis = mutation({
  args: {
    documentId: v.string(),
    analysis: v.string()
  },
  handler: async (ctx, args): Promise<ApiResult<DocumentRecord>> => {
    const existing = await ctx.db.get(args.documentId as never);

    if (!existing) {
      return fail<DocumentRecord>("Document not found.", {
        userId: "",
        fileName: "",
        storageId: "",
        analysis: args.analysis,
        createdAt: Date.now(),
        storageUrl: null
      });
    }

    await ctx.db.patch(existing._id, {
      analysis: args.analysis
    });

    return ok<DocumentRecord>({
      _id: existing._id,
      userId: existing.userId,
      fileName: existing.fileName,
      storageId: existing.storageId,
      docType: existing.docType,
      analysis: args.analysis,
      createdAt: existing.createdAt,
      storageUrl: await ctx.storage.getUrl(existing.storageId)
    });
  }
});
