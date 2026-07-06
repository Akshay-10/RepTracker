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
  ShieldCheck,
  Shuffle,
  Sparkles,
  Target,
  TimerReset,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Brand } from "@/components/brand";

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

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="landing">
      <nav className="marketing-nav">
        <Brand />
        <div className="marketing-links">
          <a href="#system">The system</a>
          <a href="#progress">Progress</a>
          <a href="#coach">AI coach</a>
          <Link href="/login">Sign in</Link>
        </div>
        <Link className="button button-primary nav-cta" href="/onboarding">
          Start training <ArrowRight size={16} />
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
            <Link className="button button-primary button-xl" href="/dashboard">
              Start today’s workout <ArrowRight size={18} />
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
            <div><small>READINESS</small><strong>86 · High</strong></div>
          </div>
          <div className="float-card float-pr">
            <span><TrendingUp size={15} /></span>
            <div><small>NEW PR</small><strong>24 kg × 10</strong></div>
          </div>
          <div className="phone-frame">
            <div className="phone-top"><span>9:41</span><i /></div>
            <div className="phone-app-head">
              <Brand compact />
              <span className="mini-avatar">AK</span>
            </div>
            <div className="phone-greeting"><small>GOOD MORNING, AKSHAY</small><strong>Today’s <em>forge.</em></strong></div>
            <div className="phone-session">
              <span className="phone-session-label"><i /> MONDAY · BUILD</span>
              <h3>Chest +<br />Triceps</h3>
              <p>Upper chest strength · arms</p>
              <div><span><Clock3 size={11} /> 82 min</span><span><Dumbbell size={11} /> 6 moves</span></div>
              <Link href="/workout/today">Start workout <ArrowRight size={14} /></Link>
            </div>
            <div className="phone-row-title"><strong>This week</strong><span>4 / 6</span></div>
            <div className="phone-week">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                <span className={index === 0 ? "active" : index < 4 ? "done" : ""} key={`${day}-${index}`}>
                  <i>{index > 0 && index < 4 ? <Check size={9} /> : day}</i>
                  <small>{index + 6}</small>
                </span>
              ))}
            </div>
            <div className="phone-insight">
              <span><Sparkles size={14} /></span>
              <div><small>FORGE AI</small><strong>Keep the incline press today.</strong><p>You’re adding reps with clean form.</p></div>
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
          <span><strong>60–70%</strong><small>PLAN STAYS STABLE</small></span>
          <span><strong>&lt; 5 sec</strong><small>TO LOG A SET</small></span>
          <span><strong>90 min</strong><small>SESSION HARD CAP</small></span>
          <span><strong>100%</strong><small>USEFUL SIGNAL</small></span>
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
        <div className="variation-demo">
          <div className="demo-head"><span><Sparkles size={15} /> VARIATION FOR THIS WEEK</span><em>MATCH 96%</em></div>
          <div className="swap-card old">
            <span className="swap-index">PREVIOUS</span>
            <div><strong>Pec Deck Fly</strong><small>Mid chest · supported adduction</small></div>
            <span className="equipment-pill">MACHINE</span>
          </div>
          <div className="swap-connector"><Shuffle size={17} /><span /></div>
          <div className="swap-card new">
            <span className="swap-index">THIS WEEK</span>
            <div><strong>Low-to-High Cable Fly</strong><small>Upper chest · constant cable tension</small></div>
            <span className="equipment-pill">CABLE</span>
          </div>
          <div className="demo-reason">
            <Sparkles size={16} />
            <p><strong>Why this?</strong> Same fly pattern, a fresh upper-chest angle, and lower joint stress after two pressing movements.</p>
          </div>
          <div className="demo-tags"><span><ShieldCheck size={13} /> Low joint stress</span><span><Target size={13} /> Upper chest</span><span><TimerReset size={13} /> 75s rest</span></div>
        </div>
      </section>

      <section className="progress-story" id="progress">
        <div className="section-heading">
          <p className="eyebrow">PROGRESS, WITHOUT THE NOISE</p>
          <h2>Turn effort into <em>evidence.</em></h2>
        </div>
        <div className="landing-chart-card">
          <div className="landing-chart-copy">
            <small>WEEKLY TRAINING VOLUME</small>
            <strong>10,780 <em>kg</em></strong>
            <span>↑ 5.3% vs last week</span>
          </div>
          <div className="fake-chart">
            {[35, 48, 43, 63, 58, 74, 86].map((height, index) => (
              <span style={{ height: `${height}%` }} key={index}><i /></span>
            ))}
          </div>
          <div className="chart-note"><Sparkles size={15} /><span><strong>Steady overload</strong><small>Volume is climbing while session length stays controlled.</small></span></div>
        </div>
      </section>

      <section className="landing-cta">
        <div className="cta-lines" />
        <p className="eyebrow">YOUR NEXT SET IS WAITING</p>
        <h2>Build the body.<br /><em>Keep the proof.</em></h2>
        <p>Start with your exact six-day plan. Adjust as you grow.</p>
        <Link className="button button-primary button-xl" href="/onboarding">Start training today <ArrowRight size={18} /></Link>
      </section>

      <footer className="marketing-footer">
        <div><Brand /><p>Train with intent. Track what matters.</p></div>
        <div><strong>PRODUCT</strong><Link href="/dashboard">Dashboard</Link><Link href="/plan">Workout plan</Link><Link href="/progress">Progress</Link></div>
        <div><strong>ACCOUNT</strong><Link href="/login">Sign in</Link><Link href="/signup">Create account</Link><Link href="/settings">Settings</Link></div>
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
              <Link href="/login">Sign in</Link>
              <Link className="button button-primary" href="/onboarding">Start training <ArrowRight size={16} /></Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
