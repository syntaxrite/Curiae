import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { buildDeepPrompt, buildStandardPrompt, isRiskFlagged } from "../lib/constants";
import { fail, ok } from "./helpers";
import type {
  ApiResult,
  CuriaeDeepResponse,
  CuriaeStandardResponse,
  DocumentAnalysisResponse
} from "../lib/types";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

type GeminiPart = {
  text?: string;
};

type GeminiCandidate = {
  content?: {
    parts?: GeminiPart[];
  };
};

type GeminiResponse = {
  candidates?: GeminiCandidate[];
};

function extractTextFromGemini(response: GeminiResponse): string {
  const parts = response.candidates?.[0]?.content?.parts ?? [];
  return parts
    .map((part) => part.text?.trim() ?? "")
    .filter(Boolean)
    .join("\n")
    .trim();
}

function parseDeepResponse(raw: string): CuriaeDeepResponse {
  const normalized = raw.trim();
  const urgent = normalized.startsWith("URGENT:");
  const summary = normalized.match(/SUMMARY:\s*([\s\S]*?)(?:\n[A-Z_]+:|$)/)?.[1]?.trim() ?? "";
  const redFlagsBlock = normalized.match(/RED_FLAGS:\s*([\s\S]*?)(?:\n[A-Z_]+:|$)/)?.[1]?.trim() ?? "";
  const actionStepsBlock = normalized.match(/ACTION_STEPS:\s*([\s\S]*?)(?:\n[A-Z_]+:|$)/)?.[1]?.trim() ?? "";
  const lawyerNeeded = normalized.match(/LAWYER_NEEDED:\s*([\s\S]*?)(?:\n[A-Z_]+:|$)/)?.[1]?.trim() ?? "";
  const jurisdictionNote = normalized.match(/JURISDICTION_NOTE:\s*([\s\S]*?)(?:\n[A-Z_]+:|$)/)?.[1]?.trim() ?? "";
  const disclaimer = normalized.match(/DISCLAIMER:\s*([\s\S]*)$/)?.[1]?.trim() ?? "";
  const redFlags = redFlagsBlock
    .split(/\n+/)
    .map((line) => line.replace(/^[-*\d.\s]+/, "").trim())
    .filter(Boolean);
  const actionSteps = actionStepsBlock
    .split(/\n+/)
    .map((line) => line.replace(/^[-*\d.\s]+/, "").trim())
    .filter(Boolean);

  return {
    summary,
    redFlags,
    actionSteps,
    lawyerNeeded,
    jurisdictionNote,
    disclaimer: disclaimer || "This is not legal advice. Curiae is an AI tool. Curiae provides legal information, not legal representation. Consult a qualified lawyer for serious matters.",
    urgent,
    raw
  };
}

async function callGemini(model: string, prompt: string, apiKey: string, maxOutputTokens: number): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as GeminiResponse;
  return extractTextFromGemini(payload);
}

async function extractDocumentText(storageUrl: string, fileName: string): Promise<string> {
  const response = await fetch(storageUrl);
  if (!response.ok) {
    throw new Error("Unable to download document from storage.");
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const lower = fileName.toLowerCase();

  if (lower.endsWith(".pdf")) {
    const parsed = await pdfParse(buffer);
    return parsed.text.trim();
  }

  if (lower.endsWith(".docx")) {
    const parsed = await mammoth.extractRawText({ buffer });
    return parsed.value.trim();
  }

  return new TextDecoder().decode(buffer).trim();
}

export const askStandard = action({
  args: {
    userId: v.string(),
    question: v.string(),
    country: v.string(),
    state: v.optional(v.string())
  },
  handler: async (ctx, args): Promise<ApiResult<CuriaeStandardResponse>> => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return fail<CuriaeStandardResponse>("Missing GEMINI_API_KEY.", {
        answer: "",
        riskFlagged: false
      });
    }

    const prompt = buildStandardPrompt(args.country, args.state);
    const answer = await callGemini("gemini-2.0-flash", `${prompt}\n\nQuestion: ${args.question}`, apiKey, 256);
    const riskFlagged = isRiskFlagged(args.question);

    await ctx.runMutation(api.queries.saveQuery, {
      userId: args.userId,
      question: args.question,
      response: answer,
      country: args.country,
      state: args.state,
      type: "standard",
      riskFlagged
    });

    return ok<CuriaeStandardResponse>({ answer, riskFlagged });
  }
});

export const askDeep = action({
  args: {
    userId: v.string(),
    question: v.string(),
    country: v.string(),
    state: v.optional(v.string())
  },
  handler: async (ctx, args): Promise<ApiResult<CuriaeDeepResponse>> => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return fail<CuriaeDeepRespon
