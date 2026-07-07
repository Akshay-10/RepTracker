"use client";

import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  Clock3,
  Dumbbell,
  Menu,
  Play,
  Shuffle,
  Sparkles,
  Target,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Brand } from "@/components/brand";
import { AuthNav } from "@/components/auth-nav";

const features = [
  {
    icon: Dumbbell,
    index: "01",
    title: "Log without losing focus",
    copy: "Quick steppers, last-set recall, and one-tap completion keep the phone out of your way.",
    tone: "lime",
  },
  {
    icon: Shuffle,
    index: "02",
    title: "Variation with a reason",
    copy: "Keep anchor lifts stable while compatible accessories rotate by angle, fatigue, and equipment.",
    tone: "blue",
  },
  {
    icon: BarChart3,
    index: "03",
    title: "See what is actually moving",
    copy: "Strength, volume, consistency, and body trends translated into signals you can use.",
    tone: "orange",
  },
  {
    icon: Sparkles,
    index: "04",
    title: "Coaching that knows when to speak",
    copy: "Concise weekly reviews and plateau guidance—without wasting calls on simple calculations.",
    tone: "violet",
  },
];

export function LandingPage({ authenticated }: { authenticated: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="landing">
      <nav className="marketing-nav">
        <Brand />
        <div className="marketing-links">
          <a href="#system">The system</a>
          <a href="#progress">Progress</a>
          <a href="#coach">AI coach</a>
          <AuthNav initialAuthenticated={authenticated} />
        </div>
        <Link className="button button-primary nav-cta" href={authenticated ? "/dashboard" : "/onboarding"}>
          {authenticated ? "Open dashboard" : "Start training"} <ArrowRight size={16} />
        </Link>
        <button className="marketing-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Menu size={21} />
        </button>
      </nav>

      <section className="landing-hero">
        <div className="hero-grid-lines" />
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <span className="launch-pill"><Sparkles size={13} /> YOUR TRAINING, WITH A SIGNAL</span>
          <h1>
            Push the weight.<br />
            <em>Track the proof.</em>
          </h1>
          <p>
            A focused gym companion that keeps your plan familiar, rotates the right
            movements, and turns every session into visible progress.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary button-xl" href={authenticated ? "/workout/today" : "/signup"}>
              {authenticated ? "Open today’s workout" : "Create your account"} <ArrowRight size={18} />
            </Link>
            <a className="watch-link" href="#system"><span><Play size={14} fill="currentColor" /></span> See how it works</a>
          </div>
          <div className="hero-proof">
            <span><Check size={14} /> No card required</span>
            <span><Check size={14} /> Works without AI</span>
            <span><Check size={14} /> Your data stays yours</span>
          </div>
        </motion.div>

        <motion.div
          className="phone-stage"
          initial={{ opacity: 0, x: 24, rotate: 2 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 0.65, delay: 0.15 }}
        >
          <div className="stage-glow" />
          <div className="float-card float-readiness">
            <span><Zap size={15} /></span>
            <div><small>READINESS</small><strong>Live · Synced</strong></div>
          </div>
          <div className="float-card float-pr">
            <span><TrendingUp size={15} /></span>
            <div><small>NEW PR</small><strong>From your logs</strong></div>
          </div>
          <div className="phone-frame">
            <div className="phone-top"><span>LIVE PREVIEW</span><i /></div>
            <div className="phone-app-head">
              <Brand compact />
              <span className="mini-avatar">YOU</span>
            </div>
            <div className="phone-greeting"><small>YOUR LIVE PLAN</small><strong>Today’s <em>forge.</em></strong></div>
            <div className="phone-session">
              <span className="phone-session-label"><i /> NEXT · LIVE PLAN</span>
              <h3>Your<br />Workout</h3>
              <p>Exercises, sets, and rest come from your plan</p>
              <div><span><Clock3 size={11} /> Plan timing</span><span><Dumbbell size={11} /> Live moves</span></div>
              <Link href="/workout/today">Start workout <ArrowRight size={14} /></Link>
            </div>
            <div className="phone-row-title"><strong>Training week</strong><span>SYNCED</span></div>
            <div className="phone-week">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                <span className={index === 0 ? "active" : index < 4 ? "done" : ""} key={`${day}-${index}`}>
                  <i>{index > 0 && index < 4 ? <Check size={9} /> : day}</i>
                  <small>{index === 0 ? "NOW" : "DAY"}</small>
                </span>
              ))}
            </div>
            <div className="phone-insight">
              <span><Sparkles size={14} /></span>
              <div><small>FORGE AI</small><strong>Built from your live logs.</strong><p>Recommendations update with your training.</p></div>
              <ChevronRight size={14} />
            </div>
            <div className="phone-nav">
              <span className="active"><Target size={16} /><small>Home</small></span>
              <span><Dumbbell size={16} /><small>Workout</small></span>
              <span><BarChart3 size={16} /><small>Progress</small></span>
            </div>
          </div>
        </motion.div>

        <div className="landing-metrics">
          <span><strong>Stable</strong><small>ANCHOR LIFTS</small></span>
          <span><strong>Fast</strong><small>SET LOGGING</small></span>
          <span><strong>Focused</strong><small>SESSION DESIGN</small></span>
          <span><strong>Live</strong><small>PROGRESS SIGNAL</small></span>
        </div>
      </section>

      <section className="system-section" id="system">
        <div className="section-heading">
          <p className="eyebrow">BUILT FOR THE WORK</p>
          <h2>Structure where you need it.<br /><em>Intelligence where it helps.</em></h2>
          <p>Every feature earns its place between one set and the next.</p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className={`feature-card tone-${feature.tone}`} key={feature.title}>
              <span className="feature-number">{feature.index}</span>
              <span className="feature-icon"><feature.icon size={21} /></span>
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
              <a href="#progress">Explore feature <ArrowRight size={14} /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="variation-story" id="coach">
        <div className="variation-copy">
          <span className="launch-pill"><Shuffle size={13} /> SMART VARIATION ENGINE</span>
          <h2>Never random.<br /><em>Never stale.</em></h2>
          <p>
            RepForge understands the slot behind an exercise—target muscle,
            movement pattern, angle, fatigue, and joint stress—before suggesting a swap.
          </p>
          <ul>
            <li><span><Check size={13} /></span><div><strong>Anchor your strength work</strong><small>Main lifts stay for 4–6 weeks.</small></div></li>
            <li><span><Check size={13} /></span><div><strong>Rotate the right 30–40%</strong><small>Accessories change only when the match is useful.</small></div></li>
            <li><span><Check size={13} /></span><div><strong>Know why before you accept</strong><small>Every variation includes a concise reason.</small></div></li>
          </ul>
          <Link className="button button-secondary" href="/plan">See the workout plan <ArrowRight size={16} /></Link>
        </div>
        <div className="live-system-card">
          <span className="launch-pill"><Sparkles size={13} /> LIVE INPUTS ONLY</span>
          <h3>The engine reads your actual account data.</h3>
          <ul>
            <li><Check size={14} /><span>Saved plan slots and compatible variations</span></li>
            <li><Check size={14} /><span>Preferred equipment, avoid list, and pain flags</span></li>
            <li><Check size={14} /><span>Completed sets, recent load, reps, and records</span></li>
            <li><Check size={14} /><span>Your selected kg/lb display preference</span></li>
          </ul>
          <Link className="button button-primary" href={authenticated ? "/plan" : "/signup"}>
            {authenticated ? "Open live plan" : "Create your live plan"} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="progress-story" id="progress">
        <div className="section-heading">
          <p className="eyebrow">PROGRESS, WITHOUT THE NOISE</p>
          <h2>Turn effort into <em>evidence.</em></h2>
        </div>
        <div className="progress-live-card">
          <div>
            <small>NO SAMPLE METRICS</small>
            <strong>Your charts appear after your first saved sets.</strong>
            <span>Volume, consistency, body weight, strength trend, and PRs are calculated from Supabase rows for your account.</span>
          </div>
          <Link className="button button-secondary" href={authenticated ? "/progress" : "/signup"}>
            {authenticated ? "Open live progress" : "Start logging"} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="landing-cta">
        <div className="cta-lines" />
        <p className="eyebrow">YOUR NEXT SET IS WAITING</p>
        <h2>Build the body.<br /><em>Keep the proof.</em></h2>
        <p>Start with your exact six-day plan. Adjust as you grow.</p>
        <Link className="button button-primary button-xl" href={authenticated ? "/dashboard" : "/onboarding"}>{authenticated ? "Open dashboard" : "Start training today"} <ArrowRight size={18} /></Link>
      </section>

      <footer className="marketing-footer">
        <div><Brand /><p>Train with intent. Track what matters.</p></div>
        <div><strong>PRODUCT</strong><Link href="/dashboard">Dashboard</Link><Link href="/plan">Workout plan</Link><Link href="/progress">Progress</Link></div>
        <div><strong>ACCOUNT</strong><AuthNav initialAuthenticated={authenticated} compact />{!authenticated && <Link href="/signup">Create account</Link>}</div>
        <div><strong>PRINCIPLES</strong><span>Progressive overload</span><span>Useful variation</span><span>Private by default</span></div>
        <p>© 2026 RepForge. Built for the next rep.</p>
      </footer>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button className="drawer-backdrop" onClick={() => setMenuOpen(false)} aria-label="Close menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div className="marketing-drawer" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}>
              <div><Brand /><button onClick={() => setMenuOpen(false)}><X size={20} /></button></div>
              <a href="#system" onClick={() => setMenuOpen(false)}>The system</a>
              <a href="#progress" onClick={() => setMenuOpen(false)}>Progress</a>
              <a href="#coach" onClick={() => setMenuOpen(false)}>AI coach</a>
              <AuthNav initialAuthenticated={authenticated} compact />
              <Link className="button button-primary" href={authenticated ? "/dashboard" : "/onboarding"}>
                {authenticated ? "Open dashboard" : "Start training"} <ArrowRight size={16} />
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
