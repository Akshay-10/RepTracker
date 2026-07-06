import type { Metadata } from "next";
import { PlanContent } from "@/components/plan-content";

export const metadata: Metadata = {
  title: "Workout Plan",
};

export default function PlanPage() {
  return <PlanContent />;
}
