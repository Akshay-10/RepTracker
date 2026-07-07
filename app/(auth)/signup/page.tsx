import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";
import { getViewer } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Create account" };

export default async function SignupPage() {
  if (await getViewer()) redirect("/dashboard");
  return <AuthShell mode="signup" />;
}
