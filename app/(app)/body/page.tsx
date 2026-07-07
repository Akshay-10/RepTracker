import type { Metadata } from "next";
import { BodyTracker } from "@/components/body-tracker";
import { getViewer } from "@/lib/auth";
import { getLiveSnapshot } from "@/lib/live-data";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Body Tracking",
};

export default async function BodyPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  const data = await getLiveSnapshot(viewer.id);
  return (
    <BodyTracker
      metrics={data.bodyMetrics}
      weightTrend={data.weightTrend}
      weightUnit={data.preferences.units}
    />
  );
}
