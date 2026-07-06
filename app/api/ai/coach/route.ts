import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { buildLocalCoachResponse } from "@/lib/variation-engine";
import type { CoachResponse } from "@/lib/types";

export const runtime = "nodejs";

type CoachRequest = {
  task_type?: string;
  user_summary?: Record<string, unknown>;
  training_summary?: Record<string, unknown>;
  exercise_summary?: unknown[];
  current_workout?: unknown;
  user_question?: string;
};

type CacheEntry = {
  response: CoachResponse;
  expiresAt: number;
};

const cache = new Map<string, CacheEntry>();

const responseSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "summary",
    "recommendations",
    "warnings",
    "next_actions",
    "confidence",
  ],
  properties: {
    summary: { type: "string" },
    recommendations: {
      type: "array",
      maxItems: 4,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "type",
          "exercise",
          "exercise_to_replace",
          "suggested_exercise",
          "reason",
        ],
        properties: {
          type: { type: "string" },
          exercise: { type: ["string", "null"] },
          exercise_to_replace: { type: ["string", "null"] },
          suggested_exercise: { type: ["string", "null"] },
          reason: { type: "string" },
        },
      },
    },
    warnings: {
      type: "array",
      maxItems: 3,
      items: { type: "string" },
    },
    next_actions: {
      type: "array",
      minItems: 1,
      maxItems: 4,
      items: { type: "string" },
    },
    confidence: {
      type: "string",
      enum: ["low", "medium", "high"],
    },
  },
} as const;

function compactRequest(body: CoachRequest) {
  return {
    task_type: body.task_type ?? "progress_explanation",
    user_summary: body.user_summary ?? {},
    training_summary: body.training_summary ?? {},
    exercise_summary: (body.exercise_summary ?? []).slice(0, 8),
    current_workout: body.current_workout ?? null,
    user_question: String(body.user_question ?? "").slice(0, 600),
  };
}

function extractOutputText(payload: {
  output_text?: string;
  output?: Array<{
    content?: Array<{ type?: string; text?: string }>;
  }>;
}) {
  if (payload.output_text) return payload.output_text;
  return (
    payload.output
      ?.flatMap((item) => item.content ?? [])
      .find((content) => content.type === "output_text")?.text ?? ""
  );
}

function normalizeResponse(value: CoachResponse): CoachResponse {
  return {
    ...value,
    recommendations: value.recommendations.map((item) => ({
      type: item.type,
      reason: item.reason,
      ...(item.exercise ? { exercise: item.exercise } : {}),
      ...(item.exercise_to_replace
        ? { exercise_to_replace: item.exercise_to_replace }
        : {}),
      ...(item.suggested_exercise
        ? { suggested_exercise: item.suggested_exercise }
        : {}),
    })),
  };
}

export async function POST(request: Request) {
  let body: CoachRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "A valid JSON request body is required." },
      { status: 400 },
    );
  }

  const compact = compactRequest(body);
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(buildLocalCoachResponse(), {
      headers: { "x-repforge-coach": "local" },
    });
  }

  const model = process.env.OPENAI_MODEL || "gpt-5.4-mini";
  const inputHash = createHash("sha256")
    .update(JSON.stringify({ model, compact }))
    .digest("hex");
  const cached = cache.get(inputHash);

  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(
      { ...cached.response, source: "cache" satisfies CoachResponse["source"] },
      { headers: { "x-repforge-coach": "cache" } },
    );
  }

  try {
    const openAIResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        store: false,
        instructions:
          "You are a practical gym progress coach. Give concise, evidence-informed recommendations using only the supplied summaries. Do not invent history. Prioritize progressive overload, sessions under 90 minutes, 18–24 working sets, and familiar movement patterns. Do not diagnose injuries. For pain, advise stopping or reducing the painful movement and consulting a qualified professional if it persists.",
        input: JSON.stringify(compact),
        max_output_tokens: 850,
        reasoning: { effort: "low" },
        text: {
          format: {
            type: "json_schema",
            name: "repforge_coach_response",
            strict: true,
            schema: responseSchema,
          },
        },
      }),
      signal: AbortSignal.timeout(20_000),
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI request failed with ${openAIResponse.status}`);
    }

    const payload = await openAIResponse.json();
    const outputText = extractOutputText(payload);
    if (!outputText) throw new Error("OpenAI returned no coach output");

    const parsed = normalizeResponse(JSON.parse(outputText) as CoachResponse);
    const response: CoachResponse = { ...parsed, source: "ai" };
    cache.set(inputHash, {
      response,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });

    return NextResponse.json(response, {
      headers: { "x-repforge-coach": "ai" },
    });
  } catch (error) {
    console.error("RepForge coach fallback:", error);
    return NextResponse.json(buildLocalCoachResponse(), {
      headers: { "x-repforge-coach": "local-fallback" },
    });
  }
}
