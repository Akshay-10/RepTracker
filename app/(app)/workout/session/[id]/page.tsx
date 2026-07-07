import type { Metadata } from "next";
import { WorkoutExperience } from "@/components/workout-experience";
import { getViewer } from "@/lib/auth";
import { getLiveSnapshot } from "@/lib/live-data";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Active Session",
};

export default async function WorkoutSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  const { id } = await params;
  const data = await getLiveSnapshot(viewer.id);
  const workout =
    data.plan.find((day) => day.databaseId === id) ?? data.todayWorkout;
  if (!workout) redirect("/plan");
  return (
    <WorkoutExperience
      workout={workout}
      variationMode={data.preferences.variationMode as "stable" | "moderate" | "high"}
      avoidedExercises={data.preferences.exercisesToAvoid}
      equipment={data.preferences.preferredEquipment}
      weightUnit={data.preferences.units}
      includeWarmup={data.preferences.includeWarmup}
      autoStartRestTimer={data.preferences.autoStartRestTimer}
      restTimerSound={data.preferences.restTimerSound}
    />
  );
}
