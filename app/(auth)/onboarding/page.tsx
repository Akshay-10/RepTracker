import type { Metadata } from "next";
import { OnboardingFlow } from "@/components/onboarding-flow";
import { getViewer } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Set up your training" };

export default async function OnboardingPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  return <OnboardingFlow initialName={viewer.name} />;
}
