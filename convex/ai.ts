// hello
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

    await ctx.runMutation(api.queries.saveQuery as never, {
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
      return fail<CuriaeDeepResponse>("Missing GEMINI_API_KEY.", {
        summary: "",
        redFlags: [],
        actionSteps: [],
        lawyerNeeded: "",
        jurisdictionNote: "",
        disclaimer:
          "This is not legal advice. Curiae is an AI tool. Curiae provides legal information, not legal representation. Consult a qualified lawyer for serious matters.",
        urgent: false,
        raw: ""
      });
    }

    const prompt = buildDeepPrompt(args.country, args.state);
    const urgent = isRiskFlagged(args.question);
    const prefixedQuestion = urgent
      ? `URGENT: This situation may require immediate licensed legal advice. Consult a qualified lawyer before taking any action.\n\nQuestion: ${args.question}`
      : `Question: ${args.question}`;

    const raw = await callGemini("gemini-1.5-pro", `${prompt}\n\n${prefixedQuestion}`, apiKey, 2048);
    const parsed = parseDeepResponse(raw);

    await ctx.runMutation(api.queries.saveQuery as never, {
      userId: args.userId,
      question: args.question,
      response: raw,
      country: args.country,
      state: args.state,
      type: "deep",
      riskFlagged: urgent
    });

    return ok<CuriaeDeepResponse>(parsed);
  }
});

export const analyzeDocument = action({
  args: {
    userId: v.string(),
    documentId: v.string(),
    storageId: v.string(),
    fileName: v.string(),
    country: v.string(),
    state: v.optional(v.string())
  },
  handler: async (ctx, args): Promise<ApiResult<DocumentAnalysisResponse>> => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return fail<DocumentAnalysisResponse>("Missing GEMINI_API_KEY.", {
        extraction: "",
        analysis: "",
        urgent: false
      });
    }

    const storageUrl = await ctx.storage.getUrl(args.storageId);
    if (!storageUrl) {
      return fail<DocumentAnalysisResponse>("Unable to resolve document storage URL.", {
        extraction: "",
        analysis: "",
        urgent: false
      });
    }

    const extractedText = await extractDocumentText(storageUrl, args.fileName);
    const urgent = isRiskFlagged(extractedText);

    const extractionPrompt = [
      "Extract the key legal facts, dates, names, obligations, deadlines, money amounts, and parties from this document.",
      "Return concise plain English bullet points.",
      `Country: ${args.country}`,
      args.state ? `State / region: ${args.state}` : "State / region: not provided",
      "",
      extractedText.slice(0, 12000)
    ].join("\n");

    const extraction = await callGemini("gemini-2.0-flash", extractionPrompt, apiKey, 700);

    const analysisPrompt = [
      buildDeepPrompt(args.country, args.state),
      "",
      "Document extraction:",
      extraction,
      "",
      "Now analyze the document as Curiae. Focus on legal meaning, deadlines, risks, and concrete next steps."
    ].join("\n");

    const analysisRaw = await callGemini("gemini-1.5-pro", analysisPrompt, apiKey, 2048);
    const parsed = parseDeepResponse(analysisRaw);

    await ctx.runMutation(api.documents.updateDocumentAnalysis as never, {
      documentId: args.documentId,
      analysis: analysisRaw
    });

    return ok<DocumentAnalysisResponse>({
      extraction,
      analysis: parsed.raw,
      urgent
    });
  }
});
