import type { Metadata } from "next";
import { WorkoutExperience } from "@/components/workout-experience";

export const metadata: Metadata = {
  title: "Active Session",
};

export default function WorkoutSessionPage() {
  return <WorkoutExperience />;
}
