import { ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { PasswordRecoveryForm } from "@/components/password-recovery-form";

export function PasswordRecoveryShell({
  mode,
}: {
  mode: "request" | "update";
}) {
  return (
    <main className="auth-page">
      <div className="auth-brand"><Brand /></div>
      <section className="auth-story">
        <div className="auth-orbit orbit-one" />
        <div className="auth-orbit orbit-two" />
        <div className="auth-story-content">
          <span className="launch-pill"><Sparkles size={13} /> SECURE ACCOUNT RECOVERY</span>
          <h1>Back to training.<br /><em>Without the detour.</em></h1>
          <p>Your reset is handled by Supabase Auth and the recovery link expires automatically.</p>
          <div className="auth-feature-list">
            <span><i><ShieldCheck size={18} /></i><strong>Verified recovery</strong><small>Only the emailed link can open a reset session</small></span>
          </div>
        </div>
      </section>
      <section className="auth-card-wrap">
        <div className="auth-card">
          <div className="auth-heading">
            <p className="eyebrow">ACCOUNT RECOVERY</p>
            <h2>{mode === "request" ? "Reset your password" : "Choose a new password"}</h2>
            <p>
              {mode === "request"
                ? "We will email a secure link to your account."
                : "Use at least eight characters."}
            </p>
          </div>
          <PasswordRecoveryForm mode={mode} />
        </div>
        <Link className="back-home" href="/">← Back to RepForge</Link>
      </section>
    </main>
  );
}
