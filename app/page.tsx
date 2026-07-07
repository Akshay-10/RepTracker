import type { Metadata } from "next";
import { LandingPage } from "@/components/landing-page";
import { getViewer } from "@/lib/auth";

export const metadata: Metadata = {
  title: "RepForge — Push the weight. Track the proof.",
};

export default async function HomePage() {
  const viewer = await getViewer();
  return <LandingPage authenticated={Boolean(viewer)} />;
}
