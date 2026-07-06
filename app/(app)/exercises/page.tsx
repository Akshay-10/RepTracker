import type { Metadata } from "next";
import { ExerciseLibrary } from "@/components/exercise-library";

export const metadata: Metadata = {
  title: "Exercise Library",
};

export default function ExercisesPage() {
  return <ExerciseLibrary />;
}
