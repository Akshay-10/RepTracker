"use client";

import { ArrowRight, BrainCircuit, LoaderCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import type { CoachResponse } from "@/lib/types";
import { buildLocalCoachResponse } from "@/lib/variation-engine";
import { CoachTag } from "@/components/ui";

export function CoachCard() {
  const [response, setResponse] = useState<CoachResponse>(buildLocalCoachResponse());
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");

  const askCoach = async (taskType = "weekly_review") => {
    setLoading(true);
    try {
      const result = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_type: taskType,
          user_summary: {
            age: 25,
            height_cm: 186,
            current_weight_kg: 63,
            goal: "Build muscle and strength while staying lean",
            experience_level: "intermediate",
            training_days: 6,
            workout_duration: 90,
          },
          training_summary: {
            completed_sessions: 22,
            missed_sessions: 2,
            top_progressing_exercises: ["Incline Dumbbell Press", "Romanian Deadlift"],
            stalled_exercises: ["Machine Chest Press"],
            soreness_or_pain_flags: [],
          },
          current_workout: "Monday · Chest + Triceps",
          user_question: question || "Review my week and give me one priority.",
        }),
      });
      if (!result.ok) throw new Error("Coach unavailable");
      setResponse(await result.json());
      setQuestion("");
    } catch {
      setResponse(buildLocalCoachResponse());
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
        <span className={`source-pill ${response.source ?? "local"}`}>
          {response.source === "ai" ? "Live AI" : response.source === "cache" ? "Cached" : "Local engine"}
        </span>
      </div>
      <h2>Your week is moving in the right direction.</h2>
      <p>{response.summary}</p>
      <div className="coach-insight">
        <Sparkles size={15} />
        <span>
          <strong>Next move</strong>
          {response.next_actions[0]}
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
