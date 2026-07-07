import type { Metadata } from "next";
import { PlanContent } from "@/components/plan-content";
import { getViewer } from "@/lib/auth";
import { getLiveSnapshot } from "@/lib/live-data";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Workout Plan",
};

export default async function PlanPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  const data = await getLiveSnapshot(viewer.id);
  return (
    <PlanContent
      plan={data.plan}
      initialVariationMode={
        data.preferences.variationMode as "stable" | "moderate" | "high"
      }
    />
  );
}
