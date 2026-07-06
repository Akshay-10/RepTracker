"use client";

import {
  ArrowLeft,
  ArrowRight,
  BicepsFlexed,
  Check,
  Clock3,
  Dumbbell,
  Gauge,
  HeartPulse,
  Minus,
  Plus,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Brand } from "@/components/brand";

const stepMeta = [
  { label: "About you", icon: UserRound },
  { label: "Your goal", icon: Target },
  { label: "Training", icon: Dumbbell },
  { label: "Preferences", icon: Sparkles },
];

const goals = [
  ["Build muscle", "Add size with controlled progressive overload", BicepsFlexed],
  ["Gain strength", "Prioritize performance on key compound lifts", Zap],
  ["Recomposition", "Build muscle while staying lean", Gauge],
  ["Fat loss", "Preserve strength while reducing body fat", HeartPulse],
] as const;

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("Build muscle");
  const [days, setDays] = useState(6);
  const [duration, setDuration] = useState(90);
  const [experience, setExperience] = useState("Intermediate");
  const [equipment, setEquipment] = useState(["Dumbbells", "Cable", "Machines", "Barbell"]);
  const [warmups, setWarmups] = useState(true);

  const toggleEquipment = (item: string) => {
    setEquipment((current) =>
      current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item],
    );
  };

  const finish = () => {
    localStorage.setItem(
      "repforge-profile",
      JSON.stringify({ goal, days, duration, experience, equipment, warmups }),
    );
    router.push("/dashboard");
  };

  return (
    <main className="onboarding-page">
      <header className="onboarding-header">
        <Brand />
        <span>Already set up? <button onClick={() => router.push("/dashboard")}>Skip to demo</button></span>
      </header>
      <div className="onboarding-shell">
        <aside className="onboarding-rail">
          <div>
            <p className="eyebrow">BUILD YOUR BASELINE</p>
            <h2>A plan that starts with <em>you.</em></h2>
            <p>Four short steps. Everything can be changed later.</p>
          </div>
          <ol>
            {stepMeta.map((item, index) => (
              <li className={index === step ? "active" : index < step ? "done" : ""} key={item.label}>
                <span>{index < step ? <Check size={15} /> : <item.icon size={16} />}</span>
                <div><small>STEP 0{index + 1}</small><strong>{item.label}</strong></div>
                {index < step && <em>DONE</em>}
              </li>
            ))}
          </ol>
          <div className="onboarding-privacy"><ShieldCheck size={17} /><span><strong>Private by default</strong><small>Your raw workout history is never sent to AI.</small></span></div>
        </aside>

        <section className="onboarding-content">
          <div className="mobile-step-progress">
            <span>STEP {step + 1} OF 4</span>
            <div>{stepMeta.map((_, index) => <i className={index <= step ? "active" : ""} key={index} />)}</div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              className="onboarding-step"
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22 }}
            >
              {step === 0 && (
                <>
                  <div className="step-heading"><p className="eyebrow">LET’S START SIMPLE</p><h1>Tell us about yourself.</h1><p>This sets sensible defaults for your training and progress.</p></div>
                  <div className="onboarding-form">
                    <label className="wide"><span>Your name</span><input defaultValue="Akshay" placeholder="What should we call you?" /></label>
                    <label><span>Age</span><div><input defaultValue="25" inputMode="numeric" /><em>years</em></div></label>
                    <label><span>Height</span><div><input defaultValue="186" inputMode="numeric" /><em>cm</em></div></label>
                    <label><span>Current weight</span><div><input defaultValue="63" inputMode="decimal" /><em>kg</em></div></label>
                    <label><span>Target weight <small>OPTIONAL</small></span><div><input defaultValue="70" inputMode="decimal" /><em>kg</em></div></label>
                  </div>
                  <div className="step-note"><Scale size={18} /><span><strong>Lean gain pace</strong><small>At 186 cm and 63 kg, start with a slow 0.15–0.30 kg weekly gain and adjust from real trends.</small></span></div>
                </>
              )}

              {step === 1 && (
                <>
                  <div className="step-heading"><p className="eyebrow">CHOOSE YOUR DIRECTION</p><h1>What are you training for?</h1><p>We’ll bias volume and progression without locking you in.</p></div>
                  <div className="goal-grid">
                    {goals.map(([label, copy, Icon]) => (
                      <button className={goal === label ? "active" : ""} onClick={() => setGoal(label)} key={label}>
                        <span className="goal-icon"><Icon size={23} /></span>
                        <span><strong>{label}</strong><small>{copy}</small></span>
                        <i>{goal === label && <Check size={13} />}</i>
                      </button>
                    ))}
                  </div>
                  <label className="experience-select"><span>Experience level</span><div>{["Beginner", "Intermediate", "Advanced"].map((item) => <button className={experience === item ? "active" : ""} onClick={() => setExperience(item)} key={item}>{item}</button>)}</div></label>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="step-heading"><p className="eyebrow">YOUR WEEK</p><h1>Shape the training rhythm.</h1><p>Your six-day split is preloaded. Adjust the constraints here.</p></div>
                  <div className="stepper-setting">
                    <span className="setting-big-icon"><Dumbbell size={23} /></span>
                    <span><strong>Training days</strong><small>Monday to Saturday, Sunday recovery</small></span>
                    <div><button onClick={() => setDays(Math.max(2, days - 1))}><Minus size={15} /></button><strong>{days}<small>days</small></strong><button onClick={() => setDays(Math.min(7, days + 1))}><Plus size={15} /></button></div>
                  </div>
                  <div className="stepper-setting">
                    <span className="setting-big-icon"><Clock3 size={23} /></span>
                    <span><strong>Workout duration</strong><small>We cap sets and rest to fit this window</small></span>
                    <div><button onClick={() => setDuration(Math.max(45, duration - 15))}><Minus size={15} /></button><strong>{duration}<small>min</small></strong><button onClick={() => setDuration(Math.min(120, duration + 15))}><Plus size={15} /></button></div>
                  </div>
                  <div className="schedule-preview">
                    <span><strong>MON</strong><small>Chest<br />+ Triceps</small></span>
                    <span><strong>TUE</strong><small>Back<br />+ Biceps</small></span>
                    <span><strong>WED</strong><small>Shoulders<br />+ Arms</small></span>
                    <span><strong>THU</strong><small>Chest<br />+ Back</small></span>
                    <span><strong>FRI</strong><small>Upper<br />Volume</small></span>
                    <span><strong>SAT</strong><small>Legs<br />+ Abs</small></span>
                    <span className="rest"><strong>SUN</strong><small>Rest +<br />recover</small></span>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="step-heading"><p className="eyebrow">LAST DETAILS</p><h1>Set the guardrails.</h1><p>These keep variations practical and warm-ups productive.</p></div>
                  <div className="preference-block">
                    <span><strong>Available equipment</strong><small>Choose everything you can reliably use.</small></span>
                    <div className="equipment-grid">
                      {["Dumbbells", "Cable", "Machines", "Barbell", "Smith machine", "Bodyweight"].map((item) => (
                        <button className={equipment.includes(item) ? "active" : ""} onClick={() => toggleEquipment(item)} key={item}>
                          <span>{equipment.includes(item) && <Check size={12} />}</span>{item}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="warmup-preference">
                    <span className="setting-big-icon"><HeartPulse size={22} /></span>
                    <span><strong>Include push-up and pull-up primers</strong><small>Low-fatigue warm-ups that activate without draining strength.</small></span>
                    <button className={`toggle ${warmups ? "on" : ""}`} onClick={() => setWarmups(!warmups)}><span /></button>
                  </div>
                  <div className="ready-summary">
                    <Sparkles size={20} />
                    <div><strong>Your baseline is ready.</strong><p>{days} days · {duration} minutes · {goal} · Moderate variation · Balanced AI</p></div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="onboarding-actions">
            <button className="button button-secondary" onClick={() => setStep(step - 1)} disabled={step === 0}><ArrowLeft size={16} /> Back</button>
            <button className="button button-primary" onClick={() => step === 3 ? finish() : setStep(step + 1)}>
              {step === 3 ? "Enter RepForge" : "Continue"} <ArrowRight size={17} />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
