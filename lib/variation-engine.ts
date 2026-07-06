import type {
  CoachResponse,
  ExerciseVariant,
  WorkoutExercise,
} from "@/lib/types";

export type VariationPreference = {
  mode: "stable" | "moderate" | "high";
  avoided?: string[];
  equipment?: string[];
  weekNumber?: number;
};

function stringScore(value: string) {
  return [...value].reduce((total, char) => total + char.charCodeAt(0), 0);
}

export function suggestVariation(
  exercise: WorkoutExercise,
  preference: VariationPreference = { mode: "moderate" },
): { variant: ExerciseVariant; reason: string; shouldSwap: boolean } {
  const week = preference.weekNumber ?? 1;
  const avoided = new Set(preference.avoided ?? []);
  const available = exercise.variants.filter(
    (candidate) =>
      !avoided.has(candidate.name) &&
      (!preference.equipment?.length ||
        preference.equipment.includes(candidate.equipment)),
  );
  const fallback: ExerciseVariant = {
    name: exercise.name,
    angle: exercise.focus,
    equipment: exercise.equipment,
    jointStress: "moderate",
  };

  if (!available.length || exercise.kind === "main") {
    return {
      variant: fallback,
      shouldSwap: false,
      reason:
        exercise.kind === "main"
          ? "Main lift stays stable for 4–6 weeks so progressive overload remains measurable."
          : "No compatible alternative matches your current equipment and avoid list.",
    };
  }

  const interval =
    preference.mode === "stable" ? 3 : preference.mode === "high" ? 1 : 2;
  const shouldSwap =
    exercise.kind === "isolation" || (week - 1) % interval === 0;
  const index = (week + stringScore(exercise.id)) % available.length;
  const choice = shouldSwap ? available[index] : fallback;

  return {
    variant: choice,
    shouldSwap,
    reason: shouldSwap
      ? `Matches ${exercise.movement.toLowerCase()} and ${exercise.target.toLowerCase()} while rotating the ${choice.angle.toLowerCase()} angle.`
      : "Kept this week to preserve familiarity and a reliable overload signal.",
  };
}

export function buildLocalCoachResponse(): CoachResponse {
  return {
    summary:
      "Keep the incline dumbbell press: it is progressing. Rotate the fly slot to low-to-high cables for upper-chest coverage, and keep one rep in reserve on pressing today.",
    recommendations: [
      {
        type: "keep",
        exercise: "Incline Dumbbell Press",
        reason: "Your working weight and reps are both trending upward.",
      },
      {
        type: "replace",
        exercise_to_replace: "Pec Deck Fly",
        suggested_exercise: "Low-to-High Cable Fly",
        reason: "Adds a new angle with low joint stress while preserving the fly pattern.",
      },
    ],
    warnings: [],
    next_actions: [
      "Add 2 kg next session only if every press set reaches 10 clean reps.",
      "Log any shoulder discomfort before requesting another variation.",
    ],
    confidence: "high",
    source: "local",
  };
}

export function estimateOneRepMax(weight: number, reps: number) {
  if (!weight || !reps) return 0;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}
