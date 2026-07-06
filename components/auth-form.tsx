"use client";

import {
  ArrowRight,
  Check,
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

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      router.push(mode === "signup" ? "/onboarding" : "/dashboard");
    }, 550);
  };

  return (
    <form className="auth-form" onSubmit={submit}>
      {mode === "signup" && (
        <label>
          <span>Name</span>
          <div><UserRound size={17} /><input placeholder="Your name" required autoComplete="name" /></div>
        </label>
      )}
      <label>
        <span>Email</span>
        <div><Mail size={17} /><input type="email" placeholder="you@example.com" required autoComplete="email" /></div>
      </label>
      <label>
        <span>Password</span>
        <div>
          <LockKeyhole size={17} />
          <input type={showPassword ? "text" : "password"} placeholder={mode === "signup" ? "8+ characters" : "Your password"} required minLength={8} autoComplete={mode === "signup" ? "new-password" : "current-password"} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </label>
      <div className="auth-options">
        <label className="check-label"><input type="checkbox" /><span><Check size={11} /></span>{mode === "login" ? "Remember me" : "I agree to the Terms"}</label>
        {mode === "login" && <a href="#">Forgot password?</a>}
      </div>
      <button className="button button-primary button-lg full-button" type="submit" disabled={loading}>
        {loading ? <LoaderCircle className="spin" size={18} /> : <>{mode === "signup" ? "Create my account" : "Enter RepForge"} <ArrowRight size={17} /></>}
      </button>
      <div className="auth-divider"><span>OR CONTINUE WITH</span></div>
      <button className="google-button" type="button"><span>G</span> Google <em>Setup required</em></button>
      <p className="auth-switch">
        {mode === "login" ? "New to RepForge?" : "Already have an account?"}{" "}
        <Link href={mode === "login" ? "/signup" : "/login"}>{mode === "login" ? "Create account" : "Sign in"}</Link>
      </p>
    </form>
  );
}
