"use client";

import { ArrowRight, CheckCircle2, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function PasswordRecoveryForm({
  mode,
}: {
  mode: "request" | "update";
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    const supabase = createClient();

    if (mode === "request") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
      setMessage(
        error
          ? { type: "error", text: error.message }
          : {
              type: "success",
              text: "Password reset link sent. Check your email to continue.",
            },
      );
      setLoading(false);
      return;
    }

    if (password !== confirmation) {
      setMessage({ type: "error", text: "The passwords do not match." });
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage({ type: "error", text: error.message });
      setLoading(false);
      return;
    }

    setMessage({ type: "success", text: "Password updated. Opening your dashboard…" });
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form className="auth-form" onSubmit={submit}>
      {mode === "request" ? (
        <label>
          <span>Email</span>
          <div>
            <Mail size={17} />
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>
        </label>
      ) : (
        <>
          <label>
            <span>New password</span>
            <div>
              <LockKeyhole size={17} />
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                minLength={8}
                required
                autoComplete="new-password"
              />
            </div>
          </label>
          <label>
            <span>Confirm password</span>
            <div>
              <LockKeyhole size={17} />
              <input
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                type="password"
                minLength={8}
                required
                autoComplete="new-password"
              />
            </div>
          </label>
        </>
      )}

      {message && (
        <p className={`auth-message ${message.type}`} role="status">
          {message.type === "success" && <CheckCircle2 size={15} />}
          {message.text}
        </p>
      )}

      <button className="button button-primary button-lg full-button" type="submit" disabled={loading}>
        {loading ? (
          <LoaderCircle className="spin" size={18} />
        ) : (
          <>
            {mode === "request" ? "Send reset link" : "Update password"}
            <ArrowRight size={17} />
          </>
        )}
      </button>
      <p className="auth-switch">
        Remembered it? <Link href="/login">Return to sign in</Link>
      </p>
    </form>
  );
}
