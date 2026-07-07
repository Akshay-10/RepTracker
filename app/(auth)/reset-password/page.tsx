import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PasswordRecoveryShell } from "@/components/password-recovery-shell";
import { getViewer } from "@/lib/auth";

export const metadata: Metadata = { title: "Choose a new password" };

export default async function ResetPasswordPage() {
  if (!(await getViewer())) redirect("/forgot-password");
  return <PasswordRecoveryShell mode="update" />;
}
