import type { Metadata } from "next";
import { SettingsContent } from "@/components/settings-content";
import { getViewer } from "@/lib/auth";
import { getLiveSnapshot } from "@/lib/live-data";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  const data = await getLiveSnapshot(viewer.id);
  return <SettingsContent data={data} email={viewer.email} />;
}
