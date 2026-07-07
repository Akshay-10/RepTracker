import type { Metadata } from "next";
import { PasswordRecoveryShell } from "@/components/password-recovery-shell";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return <PasswordRecoveryShell mode="request" />;
}
