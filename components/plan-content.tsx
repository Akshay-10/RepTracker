"use client";

import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  Dumbbell,
  LockKeyhole,
  Settings2,
  ShieldCheck,
  Shuffle,
  Sparkles,
  Target,
} from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { fullWeek } from "@/lib/data";
import { CoachTag, PageHeading, Panel, PanelHeader } from "@/components/ui";

export function PlanContent() {
  const [selected, setSelected] = useState("monday");
  const [mode, setMode] = useState<"stable" | "moderate" | "high">("moderate");
  const day = fullWeek.find((item) => item.key === selected) ?? fullWeek[0];
  const totalSets = day.exercises.reduce((sum, item) => sum + item.sets, 0);

  return (
    <>
      <PageHeading
        eyebrow="YOUR PROGRAM"
        title="Six days. One clear direction."
        copy="A familiar structure with just enough intelligent variation to keep progress moving."
        actions={
          <Link className="button button-primary" href="/workout/today">
            Start today’s workout <ArrowRight size={17} />
          </Link>
        }
      />

      <div className="block-banner">
        <div className="block-number">04</div>
        <div>
          <span className="status-chip"><span /> ACTIVE BLOCK</span>
          <h2>Hypertrophy foundation</h2>
          <p>Week 4 of 6 · Progressive overload · 1–2 reps in reserve</p>
        </div>
        <div className="block-progress">
          <span><strong>66%</strong> complete</span>
          <div><i style={{ width: "66%" }} /></div>
        </div>
        <div className="block-target">
          <Target size={18} />
          <span><small>BLOCK GOAL</small><strong>Quality volume</strong></span>
        </div>
      </div>

      <div className="plan-layout">
        <div className="plan-main">
          <div className="day-tabs" role="tablist" aria-label="Workout days">
            {fullWeek.map((item) => (
              <button
                className={item.key === selected ? "active" : ""}
                onClick={() => setSelected(item.key)}
                role="tab"
                aria-selected={item.key === selected}
                key={item.key}
              >
                <span>{item.shortDay}</span>
                <strong>{item.day.slice(0, 3)}</strong>
                <small>{item.exercises.length || "—"}</small>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              className="day-program"
              key={day.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="day-program-head">
                <div>
                  <p className="eyebrow">{day.day.toUpperCase()} · DAY {String(fullWeek.indexOf(day) + 1).padStart(2, "0")}</p>
                  <h2>{day.title}</h2>
                  <p>{day.focus}</p>
                </div>
                {day.exercises.length > 0 && (
                  <div className="day-program-meta">
                    <span><Clock3 size={15} /> {day.duration} min</span>
                    <span><Dumbbell size={15} /> {totalSets} sets</span>
                  </div>
                )}
              </div>

              {day.exercises.length === 0 ? (
                <div className="rest-day-card">
                  <span>R</span>
                  <h3>Earned recovery.</h3>
                  <p>Walk, hydrate, eat well, and prepare for Monday. Adaptation is training too.</p>
                </div>
              ) : (
                <div className="program-exercises">
                  {day.exercises.map((item, index) => (
                    <div className="program-row" key={item.id}>
                      <span className="program-index">{String(index + 1).padStart(2, "0")}</span>
                      <span className="program-exercise">
                        <span>
                          {item.kind === "main" ? (
                            <em className="anchor-label"><LockKeyhole size={10} /> ANCHOR</em>
                          ) : (
                            <em className="rotated-label"><Shuffle size={10} /> FLEX SLOT</em>
                          )}
                        </span>
                        <strong>{item.name}</strong>
                        <small>{item.target} · {item.focus}</small>
                      </span>
                      <span className="program-dose">
                        <strong>{item.sets} × {item.repMin}–{item.repMax}</strong>
                        <small>{item.rest}s rest</small>
                      </span>
                      <span className="program-equipment">{item.equipment}</span>
                      <button aria-label={`Expand ${item.name}`}><ChevronDown size={17} /></button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <aside className="plan-aside">
          <Panel className="variation-settings-card">
            <PanelHeader
              eyebrow="VARIATION ENGINE"
              title="Familiar, not stale"
              action={<CoachTag>LOCAL + AI</CoachTag>}
            />
            <p>
              Main lifts stay stable. Accessories rotate only when they match the
              same target, angle, and equipment.
            </p>
            <div className="mode-selector">
              {(["stable", "moderate", "high"] as const).map((item) => (
                <button
                  className={mode === item ? "active" : ""}
                  onClick={() => setMode(item)}
                  key={item}
                >
                  <span className="mode-radio">{mode === item && <Check size={11} />}</span>
                  <span>
                    <strong>{item[0].toUpperCase() + item.slice(1)}</strong>
                    <small>
                      {item === "stable"
                        ? "Fewest changes"
                        : item === "moderate"
                          ? "30–40% rotates"
                          : "More frequent swaps"}
                    </small>
                  </span>
                  {item === "moderate" && <em>DEFAULT</em>}
                </button>
              ))}
            </div>
            <Link className="button button-secondary full-button" href="/settings#variations">
              <Settings2 size={16} /> Tune variation settings
            </Link>
          </Panel>

          <Panel className="rules-card">
            <p className="eyebrow">GUARDRAILS</p>
            <h3>How your plan adapts</h3>
            <ul>
              <li><ShieldCheck size={16} /><span><strong>60–70% stable</strong> for measurable overload</span></li>
              <li><Shuffle size={16} /><span><strong>Accessories rotate</strong> every 1–2 weeks</span></li>
              <li><Clock3 size={16} /><span><strong>90-minute cap</strong> and 18–24 working sets</span></li>
              <li><Sparkles size={16} /><span><strong>Every swap explained</strong> before you accept it</span></li>
            </ul>
          </Panel>
        </aside>
      </div>
    </>
  );
}
