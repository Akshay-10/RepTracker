import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import type { CoachResponse } from "@/lib/types";
import { getViewer } from "@/lib/auth";
import { getLiveSnapshot, type LiveSnapshot } from "@/lib/live-data";
import { createClient } from "@/utils/supabase/server";

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

function compactRequest(body: CoachRequest, snapshot: LiveSnapshot) {
  return {
    task_type: body.task_type ?? "progress_explanation",
    user_summary: {
      age: snapshot.profile.age,
      height_cm: snapshot.profile.heightCm,
      current_weight_kg: snapshot.currentWeightKg,
      goal: snapshot.profile.goal,
      experience_level: snapshot.profile.experienceLevel,
      training_days: snapshot.profile.trainingDays,
      workout_duration: snapshot.profile.workoutDuration,
      preferred_equipment: snapshot.preferences.preferredEquipment,
      exercises_to_avoid: snapshot.preferences.exercisesToAvoid,
      injuries_or_pain: snapshot.preferences.injuriesOrPain,
    },
    training_summary: {
      completed_sessions_last_28_days: snapshot.completedLast28Days,
      expected_sessions_last_28_days: snapshot.expectedLast28Days,
      consistency_percent: snapshot.consistencyPercent,
      weekly_volume_kg: snapshot.weeklyVolume,
      previous_weekly_volume_kg: snapshot.previousWeeklyVolume,
      recent_personal_records: snapshot.recentRecords.slice(0, 5),
    },
    exercise_summary:
      snapshot.todayWorkout?.exercises.slice(0, 8).map((exercise) => ({
        exercise_name: exercise.name,
        target_muscle: exercise.target,
        movement_pattern: exercise.movement,
        last_working_weight_kg: exercise.lastWeight,
        previous_best: exercise.previousBest,
        target_rep_range: `${exercise.repMin}-${exercise.repMax}`,
      })) ?? [],
    current_workout: snapshot.todayWorkout
      ? {
          day: snapshot.todayWorkout.day,
          title: snapshot.todayWorkout.title,
          duration_minutes: snapshot.todayWorkout.duration,
        }
      : null,
    user_question: String(body.user_question ?? "").slice(0, 600),
  };
}

function buildLiveLocalResponse(snapshot: LiveSnapshot): CoachResponse {
  if (snapshot.totalWorkouts === 0) {
    return {
      summary:
        "No completed workouts are available yet. Complete your first session so the coach can evaluate volume, consistency, and progression.",
      recommendations: [],
      warnings: snapshot.preferences.injuriesOrPain.length
        ? [
            "Pain is recorded in your profile. Avoid painful movements and consult a qualified professional if it persists.",
          ]
        : [],
      next_actions: [
        snapshot.todayWorkout
          ? `Complete and log today’s ${snapshot.todayWorkout.title} session.`
          : "Create or activate a workout plan.",
      ],
      confidence: "low",
      source: "local",
    };
  }

  const volumeDirection =
    snapshot.previousWeeklyVolume === 0
      ? "has no previous-week baseline yet"
      : snapshot.weeklyVolume >= snapshot.previousWeeklyVolume
        ? "is above last week"
        : "is below last week";
  const anchor = snapshot.todayWorkout?.exercises.find(
    (exercise) => exercise.kind === "main",
  );

  return {
    summary: `You completed ${snapshot.completedLast28Days} of ${snapshot.expectedLast28Days} planned sessions. This week’s logged volume ${volumeDirection}.`,
    recommendations: anchor
      ? [
          {
            type: "keep",
            exercise: anchor.name,
            reason:
              "Keep the main lift stable while its logged sets provide a clear progression signal.",
          },
        ]
      : [],
    warnings: snapshot.preferences.injuriesOrPain.length
      ? [
          "Pain or discomfort is recorded. Reduce or stop painful movements and seek qualified help if symptoms persist.",
        ]
      : [],
    next_actions: [
      snapshot.consistencyPercent < 75
        ? "Prioritize completing the next scheduled session before adding volume."
        : "Use double progression: add load only after every set reaches the top of its rep range with good form.",
    ],
    confidence: snapshot.completedLast28Days >= 3 ? "medium" : "low",
    source: "local",
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

  const viewer = await getViewer();
  if (!viewer) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const snapshot = await getLiveSnapshot(viewer.id);
  const compact = compactRequest(body, snapshot);
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(buildLiveLocalResponse(snapshot), {
      headers: { "x-repforge-coach": "local" },
    });
  }

  const model = process.env.OPENAI_MODEL || "gpt-5.4-mini";
  const inputHash = createHash("sha256")
    .update(JSON.stringify({ model, compact }))
    .digest("hex");
  const cached = cache.get(inputHash);
  const supabase = await createClient();

  if (cached && cached.expiresAt > Date.now()) {
    await supabase.from("ai_usage_logs").insert({
      user_id: viewer.id,
      task_type: compact.task_type,
      model,
      input_tokens: 0,
      output_tokens: 0,
      cache_hit: true,
    });
    return NextResponse.json(
      { ...cached.response, source: "cache" satisfies CoachResponse["source"] },
      { headers: { "x-repforge-coach": "cache" } },
    );
  }

  const { data: durableCache } = await supabase
    .from("ai_recommendations")
    .select("output_json")
    .eq("user_id", viewer.id)
    .eq("task_type", compact.task_type)
    .eq("input_hash", inputHash)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (durableCache?.output_json) {
    await supabase.from("ai_usage_logs").insert({
      user_id: viewer.id,
      task_type: compact.task_type,
      model,
      input_tokens: 0,
      output_tokens: 0,
      cache_hit: true,
    });
    return NextResponse.json(
      {
        ...(durableCache.output_json as unknown as CoachResponse),
        source: "cache",
      },
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
    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ).toISOString();
    await Promise.all([
      supabase.from("ai_recommendations").upsert(
        {
          user_id: viewer.id,
          task_type: compact.task_type,
          input_hash: inputHash,
          output_json: response,
          expires_at: expiresAt,
        },
        { onConflict: "user_id,task_type,input_hash" },
      ),
      supabase.from("ai_usage_logs").insert({
        user_id: viewer.id,
        task_type: compact.task_type,
        model,
        input_tokens: payload.usage?.input_tokens ?? 0,
        output_tokens: payload.usage?.output_tokens ?? 0,
        cache_hit: false,
      }),
    ]);

    return NextResponse.json(response, {
      headers: { "x-repforge-coach": "ai" },
    });
  } catch (error) {
    console.error("RepForge coach fallback:", error);
    return NextResponse.json(buildLiveLocalResponse(snapshot), {
      headers: { "x-repforge-coach": "local-fallback" },
    });
  }
}
