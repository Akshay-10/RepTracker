import type {
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

function normalizedEquipment(value: string) {
  return value.toLowerCase().replaceAll("machines", "machine").replaceAll("dumbbells", "dumbbell");
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
        preference.equipment.some(
          (item) =>
            normalizedEquipment(item) === normalizedEquipment(candidate.equipment),
        )),
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

export function estimateOneRepMax(weight: number, reps: number) {
  if (!weight || !reps) return 0;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}
