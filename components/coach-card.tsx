"use client";

import { ArrowRight, BrainCircuit, LoaderCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import type { CoachResponse } from "@/lib/types";
import { CoachTag } from "@/components/ui";

type LiveCoachContext = {
  profile: Record<string, unknown>;
  completedSessions: number;
  consistencyPercent: number;
  weeklyVolume: number;
  recentRecords: unknown[];
  currentWorkout: string | null;
};

export function CoachCard({
  initialRecommendation,
  liveContext,
}: {
  initialRecommendation: {
    summary: string;
    nextActions: string[];
    createdAt: string;
  } | null;
  liveContext: LiveCoachContext;
}) {
  const [response, setResponse] = useState<CoachResponse | null>(
    initialRecommendation
      ? {
          summary: initialRecommendation.summary,
          recommendations: [],
          warnings: [],
          next_actions: initialRecommendation.nextActions,
          confidence: "high",
          source: "cache",
        }
      : null,
  );
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const sourceLabel =
    response?.source === "ai"
      ? "Live AI"
      : response?.source === "cache"
        ? "Cached AI"
        : response?.source === "local"
          ? "Local coach"
          : "Ready";

  const askCoach = async (taskType = "weekly_review") => {
    setLoading(true);
    try {
      const result = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_type: taskType,
          user_summary: liveContext.profile,
          training_summary: {
            completed_sessions: liveContext.completedSessions,
            consistency_percent: liveContext.consistencyPercent,
            weekly_volume: liveContext.weeklyVolume,
            recent_personal_records: liveContext.recentRecords,
          },
          current_workout: liveContext.currentWorkout,
          user_question: question || "Review my week and give me one priority.",
        }),
      });
      if (!result.ok) {
        const payload = (await result.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error || "Coach unavailable");
      }
      setResponse(await result.json());
      setQuestion("");
    } catch (error) {
      setResponse({
        summary:
          error instanceof Error && error.message
            ? `The live coach could not be reached: ${error.message}. Your local training data remains available, and no workout history was sent.`
            : "The live coach could not be reached. Your local training data remains available, and no workout history was sent.",
        recommendations: [],
        warnings: [],
        next_actions: ["Try generating the review again in a moment."],
        confidence: "low",
        source: "local",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="coach-card">
      <div className="coach-orb">
        <BrainCircuit size={24} />
      </div>
      <div className="coach-card-top">
        <CoachTag />
        <span className={`source-pill ${response?.source ?? "local"}`}>
          {sourceLabel}
        </span>
      </div>
      <h2>{response ? "Your live training review." : "Generate your first live review."}</h2>
      <p>{response?.summary ?? "Forge AI will analyze your saved profile, completed sessions, volume, records, and feedback only when you ask."}</p>
      <div className="coach-insight">
        <Sparkles size={15} />
        <span>
          <strong>{response ? "Next move" : "Data boundary"}</strong>
          {response?.next_actions[0] ?? "Compact summaries only—never your full raw history."}
        </span>
      </div>
      <div className="coach-ask">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && askCoach("progress_explanation")}
          placeholder="Ask about progress or a plateau…"
          aria-label="Ask Forge AI"
        />
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={() => askCoach("progress_explanation")}
          disabled={loading}
          aria-label="Ask coach"
        >
          {loading ? <LoaderCircle className="spin" size={18} /> : <ArrowRight size={18} />}
        </motion.button>
      </div>
    </section>
  );
}
