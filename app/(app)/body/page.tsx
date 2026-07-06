import type { Metadata } from "next";
import { BodyTracker } from "@/components/body-tracker";

export const metadata: Metadata = {
  title: "Body Tracking",
};

export default function BodyPage() {
  return <BodyTracker />;
}
