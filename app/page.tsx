import type { Metadata } from "next";
import { LandingPage } from "@/components/landing-page";

export const metadata: Metadata = {
  title: "RepForge — Push the weight. Track the proof.",
};

export default function HomePage() {
  return <LandingPage />;
}
