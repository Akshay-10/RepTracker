import type { Metadata } from "next";
import { WorkoutExperience } from "@/components/workout-experience";

export const metadata: Metadata = {
  title: "Today’s Workout",
};

export default function TodayWorkoutPage() {
  return <WorkoutExperience />;
}
