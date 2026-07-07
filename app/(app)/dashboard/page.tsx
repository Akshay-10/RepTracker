import type { Metadata } from "next";
import { DashboardContent } from "@/components/dashboard-content";
import { getViewer } from "@/lib/auth";
import { getLiveSnapshot } from "@/lib/live-data";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  const data = await getLiveSnapshot(viewer.id);
  return <DashboardContent data={data} />;
}
