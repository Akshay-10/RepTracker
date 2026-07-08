"use client";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getAuthCallbackUrl } from "@/lib/app-url";
import { createClient } from "@/utils/supabase/client";

const googleAuthEnabled =
  process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === "true";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: getAuthCallbackUrl("/onboarding"),
          },
        });
        if (error) throw error;

        if (!data.session) {
          setMessage({
            type: "success",
            text: "Check your email to confirm your account, then continue onboarding.",
          });
          return;
        }

        router.push("/onboarding");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      }

      router.refresh();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Authentication failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  const continueWithGoogle = async () => {
    setLoading(true);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getAuthCallbackUrl("/dashboard"),
      },
    });
    if (error) {
      setMessage({ type: "error", text: error.message });
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={submit}>
      {mode === "signup" && (
        <label>
          <span>Name</span>
          <div><UserRound size={17} /><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" required autoComplete="name" /></div>
        </label>
      )}
      <label>
        <span>Email</span>
        <div><Mail size={17} /><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="you@example.com" required autoComplete="email" /></div>
      </label>
      <label>
        <span>Password</span>
        <div>
          <LockKeyhole size={17} />
          <input value={password} onChange={(event) => setPassword(event.target.value)} type={showPassword ? "text" : "password"} placeholder={mode === "signup" ? "8+ characters" : "Your password"} required minLength={8} autoComplete={mode === "signup" ? "new-password" : "current-password"} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </label>
      <div className="auth-options">
        {mode === "login" ? (
          <>
            <span>Secure session persistence is enabled.</span>
            <Link href="/forgot-password">Forgot password?</Link>
          </>
        ) : (
          <span>By continuing, you agree to store your training data securely.</span>
        )}
      </div>
      {message && (
        <p className={`auth-message ${message.type}`} role="status">
          {message.text}
        </p>
      )}
      <button className="button button-primary button-lg full-button" type="submit" disabled={loading}>
        {loading ? <LoaderCircle className="spin" size={18} /> : <>{mode === "signup" ? "Create my account" : "Enter RepForge"} <ArrowRight size={17} /></>}
      </button>
      {googleAuthEnabled && (
        <>
          <div className="auth-divider"><span>OR CONTINUE WITH</span></div>
          <button className="google-button" type="button" onClick={continueWithGoogle} disabled={loading}><span>G</span> Google</button>
        </>
      )}
      <p className="auth-switch">
        {mode === "login" ? "New to RepForge?" : "Already have an account?"}{" "}
        <Link href={mode === "login" ? "/signup" : "/login"}>{mode === "login" ? "Create account" : "Sign in"}</Link>
      </p>
    </form>
  );
}
