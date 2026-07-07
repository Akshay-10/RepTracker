import type { Metadata } from "next";
import { WorkoutExperience } from "@/components/workout-experience";
import { getViewer } from "@/lib/auth";
import { getLiveSnapshot } from "@/lib/live-data";
import { redirect } from "next/navigation";
import { EmptyState, Panel } from "@/components/ui";

export const metadata: Metadata = {
  title: "Today’s Workout",
};

export default async function TodayWorkoutPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  const data = await getLiveSnapshot(viewer.id);
  if (!data.todayWorkout) {
    return (
      <Panel>
        <EmptyState
          title="No workout scheduled today"
          copy="Your live plan has no active session for this day. Open the plan to review the week."
        />
      </Panel>
    );
  }
  return (
    <WorkoutExperience
      workout={data.todayWorkout}
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
