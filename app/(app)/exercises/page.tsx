import type { Metadata } from "next";
import { ExerciseLibrary } from "@/components/exercise-library";
import { getExerciseCatalog } from "@/lib/live-data";

export const metadata: Metadata = {
  title: "Exercise Library",
};

export default async function ExercisesPage() {
  const catalog = await getExerciseCatalog();
  return <ExerciseLibrary catalog={catalog} />;
}
