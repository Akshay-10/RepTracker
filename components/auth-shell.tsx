import { Activity, BarChart3, Dumbbell, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { AuthForm } from "@/components/auth-form";

export function AuthShell({ mode }: { mode: "login" | "signup" }) {
  return (
    <main className="auth-page">
      <div className="auth-brand"><Brand /></div>
      <section className="auth-story">
        <div className="auth-orbit orbit-one" />
        <div className="auth-orbit orbit-two" />
        <div className="auth-story-content">
          <span className="launch-pill"><Sparkles size={13} /> TRAIN WITH INTENT</span>
          <h1>{mode === "login" ? <>Welcome back to<br /><em>the forge.</em></> : <>Your strongest chapter<br /><em>starts here.</em></>}</h1>
          <p>{mode === "login" ? "Your plan, progress, and next set are ready when you are." : "Build a plan that adapts just enough—and keeps every useful signal."}</p>
          <div className="auth-feature-list">
            <span><i><Dumbbell size={18} /></i><strong>Fast workout logging</strong><small>Every set captured in seconds</small></span>
            <span><i><Activity size={18} /></i><strong>Smart exercise rotation</strong><small>Familiar enough to measure progress</small></span>
            <span><i><BarChart3 size={18} /></i><strong>Clear progress signals</strong><small>Volume, strength, consistency, body</small></span>
            <span><i><ShieldCheck size={18} /></i><strong>Local-first foundation</strong><small>Train even without integrations</small></span>
          </div>
        </div>
        <blockquote>“Consistency builds the body. Evidence builds belief.”</blockquote>
      </section>
      <section className="auth-card-wrap">
        <div className="auth-card">
          <div className="auth-heading">
            <p className="eyebrow">{mode === "login" ? "WELCOME BACK" : "START YOUR BLOCK"}</p>
            <h2>{mode === "login" ? "Sign in to continue" : "Create your account"}</h2>
            <p>{mode === "login" ? "Your next workout is already waiting." : "It takes less than a minute."}</p>
          </div>
          <AuthForm mode={mode} />
        </div>
        <Link className="back-home" href="/">← Back to RepForge</Link>
      </section>
    </main>
  );
}
