"use client";

import {
  AlertTriangle,
  ArrowLeftRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  Clock3,
  Dumbbell,
  Flame,
  Heart,
  Minus,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  ShieldCheck,
  Sparkles,
  ThumbsDown,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { getTodayWorkout } from "@/lib/data";
import type {
  ExerciseVariant,
  LoggedSet,
  WorkoutExercise,
} from "@/lib/types";
import { estimateOneRepMax, suggestVariation } from "@/lib/variation-engine";
import { CoachTag, ProgressRing } from "@/components/ui";

function secondsLabel(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${rest.toString().padStart(2, "0")}`;
}

function RestTimer({
  seconds,
  total,
  active,
  onToggle,
  onChange,
  onClose,
}: {
  seconds: number;
  total: number;
  active: boolean;
  onToggle: () => void;
  onChange: (value: number) => void;
  onClose: () => void;
}) {
  const percentage = total ? (seconds / total) * 100 : 0;

  return (
    <motion.div
      className="floating-timer"
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 18, scale: 0.96 }}
    >
      <ProgressRing
        value={percentage}
        size={62}
        label={secondsLabel(seconds)}
        sublabel="REST"
      />
      <div className="timer-copy">
        <span>NEXT SET</span>
        <strong>{seconds > 0 ? "Recover with intent" : "You’re ready"}</strong>
        <small>{seconds > 0 ? "Breathe. Reset. Repeat." : "Start when your form is set."}</small>
      </div>
      <div className="timer-controls">
        <button onClick={() => onChange(Math.max(0, seconds - 15))}>−15</button>
        <button className="timer-play" onClick={onToggle} aria-label={active ? "Pause timer" : "Start timer"}>
          {active ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button onClick={() => onChange(seconds + 15)}>+15</button>
        <button className="timer-close" onClick={onClose} aria-label="Close timer">
          <X size={15} />
        </button>
      </div>
    </motion.div>
  );
}

function VariationSheet({
  exercise,
  selected,
  onSelect,
  onClose,
}: {
  exercise: WorkoutExercise;
  selected: string;
  onSelect: (variant: ExerciseVariant | null) => void;
  onClose: () => void;
}) {
  const suggestion = suggestVariation(exercise, {
    mode: "moderate",
    weekNumber: 4,
  });
  const current: ExerciseVariant = {
    name: exercise.name,
    angle: exercise.focus,
    equipment: exercise.equipment,
    jointStress: "moderate",
  };

  return (
    <>
      <motion.button
        className="sheet-backdrop"
        aria-label="Close variation picker"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.aside
        className="variation-sheet"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        <div className="sheet-header">
          <div>
            <p className="eyebrow">SMART VARIATIONS</p>
            <h2>Swap movement</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="swap-context">
          <span>Replacing</span>
          <strong>{exercise.name}</strong>
          <small>{exercise.movement} · {exercise.target}</small>
        </div>
        <div className="variation-options">
          {[current, ...exercise.variants].map((item) => {
            const recommended = item.name === suggestion.variant.name;
            const checked = item.name === selected;
            return (
              <button
                className={`${checked ? "selected" : ""} ${recommended ? "recommended" : ""}`}
                onClick={() => onSelect(item.name === exercise.name ? null : item)}
                key={item.name}
              >
                <span className="variation-radio">
                  {checked && <Check size={13} />}
                </span>
                <span className="variation-option-copy">
                  <span>
                    <strong>{item.name}</strong>
                    {recommended && <em><Sparkles size={11} /> BEST MATCH</em>}
                  </span>
                  <small>{item.angle} · {item.equipment}</small>
                  {recommended && (
                    <p>
                      {suggestion.reason}
                    </p>
                  )}
                </span>
                <span className={`stress stress-${item.jointStress}`}>
                  {item.jointStress} stress
                </span>
              </button>
            );
          })}
        </div>
        <div className="sheet-safety">
          <ShieldCheck size={17} />
          <p>
            Swaps preserve the movement pattern and target muscle. Main lifts stay
            stable during your 4–6 week block.
          </p>
        </div>
      </motion.aside>
    </>
  );
}

function ExerciseCard({
  exercise,
  index,
  sets,
  selectedVariant,
  defaultOpen,
  onSetChange,
  onComplete,
  onOpenVariations,
}: {
  exercise: WorkoutExercise;
  index: number;
  sets: LoggedSet[];
  selectedVariant?: ExerciseVariant;
  defaultOpen: boolean;
  onSetChange: (setNumber: number, field: "weight" | "reps", value: number) => void;
  onComplete: (setNumber: number) => void;
  onOpenVariations: () => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [reasonOpen, setReasonOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const completeCount = sets.filter((set) => set.completed).length;
  const complete = completeCount === exercise.sets;
  const displayName = selectedVariant?.name ?? exercise.name;

  return (
    <motion.article
      className={`exercise-card ${complete ? "exercise-complete" : ""}`}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.035, 0.2) }}
    >
      <button className="exercise-summary" onClick={() => setOpen(!open)}>
        <span className="exercise-index">
          {complete ? <Check size={16} /> : String(index + 1).padStart(2, "0")}
        </span>
        <span className="exercise-title">
          <span>
            {exercise.kind === "main" && <em className="anchor-label">ANCHOR</em>}
            {selectedVariant && <em className="rotated-label">ROTATED</em>}
          </span>
          <strong>{displayName}</strong>
          <small>{exercise.target} · {exercise.focus}</small>
        </span>
        <span className="exercise-dose">
          <strong>{exercise.sets} × {exercise.repMin}–{exercise.repMax}</strong>
          <small>{secondsLabel(exercise.rest)} rest</small>
        </span>
        <span className="exercise-progress">
          {completeCount}/{exercise.sets}
        </span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="exercise-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24 }}
          >
            <div className="exercise-insight">
              <span className="insight-icon"><Sparkles size={15} /></span>
              <div>
                <span><CoachTag>WHY THIS?</CoachTag></span>
                <p>{exercise.reason}</p>
                {reasonOpen && (
                  <small>
                    Slot match: {exercise.movement} · {exercise.target} · {exercise.goal}.
                    Your plan keeps main lifts stable and rotates lower-fatigue accessories.
                  </small>
                )}
              </div>
              <button onClick={() => setReasonOpen(!reasonOpen)}>
                {reasonOpen ? "Less" : "Details"}
              </button>
            </div>

            <div className="exercise-tools">
              <button onClick={onOpenVariations}>
                <ArrowLeftRight size={15} />
                Swap variation
              </button>
              <button onClick={() => setFeedback("Kept for next week")}>
                <Heart size={15} />
                Keep next week
              </button>
              <button onClick={() => setFeedback("Added to avoid list")}>
                <ThumbsDown size={15} />
                Avoid
              </button>
              <button className="pain-button" onClick={() => setFeedback("Pain flag saved — reduce load and stop if pain persists")}>
                <AlertTriangle size={15} />
                Felt pain
              </button>
            </div>

            {feedback && (
              <div className="feedback-banner">
                <CheckCircle2 size={15} />
                {feedback}
                <button onClick={() => setFeedback(null)}><X size={13} /></button>
              </div>
            )}

            <div className="previous-strip">
              <span>
                <small>LAST SESSION</small>
                <strong>{exercise.previousBest}</strong>
              </span>
              <span>
                <small>BEST EST. 1RM</small>
                <strong>{estimateOneRepMax(exercise.lastWeight, exercise.repMin + 2)} kg</strong>
              </span>
              <span>
                <small>TODAY’S TARGET</small>
                <strong>+1 rep total</strong>
              </span>
            </div>

            <div className="set-table">
              <div className="set-table-head">
                <span>SET</span>
                <span>WEIGHT · KG</span>
                <span>REPS</span>
                <span>STATUS</span>
              </div>
              {sets.map((set) => (
                <div
                  className={`set-row ${set.completed ? "done" : ""}`}
                  key={set.setNumber}
                >
                  <span className="set-number">
                    {set.completed ? <Check size={15} /> : set.setNumber}
                  </span>
                  <div className="stepper">
                    <button
                      onClick={() => onSetChange(set.setNumber, "weight", Math.max(0, set.weight - 2.5))}
                      aria-label="Decrease weight"
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      aria-label={`Set ${set.setNumber} weight`}
                      inputMode="decimal"
                      value={set.weight}
                      onChange={(event) =>
                        onSetChange(set.setNumber, "weight", Number(event.target.value))
                      }
                    />
                    <button
                      onClick={() => onSetChange(set.setNumber, "weight", set.weight + 2.5)}
                      aria-label="Increase weight"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="stepper reps-stepper">
                    <button
                      onClick={() => onSetChange(set.setNumber, "reps", Math.max(0, set.reps - 1))}
                      aria-label="Decrease reps"
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      aria-label={`Set ${set.setNumber} reps`}
                      inputMode="numeric"
                      value={set.reps}
                      onChange={(event) =>
                        onSetChange(set.setNumber, "reps", Number(event.target.value))
                      }
                    />
                    <button
                      onClick={() => onSetChange(set.setNumber, "reps", set.reps + 1)}
                      aria-label="Increase reps"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    className={`complete-set ${set.completed ? "done" : ""}`}
                    onClick={() => onComplete(set.setNumber)}
                    aria-label={set.completed ? "Mark set incomplete" : "Complete set"}
                  >
                    {set.completed ? <Check size={17} /> : <span>Complete</span>}
                  </motion.button>
                </div>
              ))}
            </div>
            <div className="exercise-footer">
              <p><Zap size={14} /> {exercise.formTip}</p>
              <button aria-label="More exercise options"><MoreHorizontal size={18} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export function WorkoutExperience() {
  const workout = getTodayWorkout();
  const [loggedSets, setLoggedSets] = useState<Record<string, LoggedSet[]>>(() =>
    Object.fromEntries(
      workout.exercises.map((item) => [
        item.id,
        Array.from({ length: item.sets }, (_, index) => ({
          exerciseId: item.id,
          setNumber: index + 1,
          weight: item.lastWeight,
          reps: item.repMin,
          completed: false,
        })),
      ]),
    ),
  );
  const [timer, setTimer] = useState({ seconds: 0, total: 0, active: false });
  const [variationExercise, setVariationExercise] = useState<WorkoutExercise | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, ExerciseVariant>>({});
  const [warmupOpen, setWarmupOpen] = useState(true);
  const [warmupDone, setWarmupDone] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("repforge-active-workout");
    let timeout: number | undefined;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        timeout = window.setTimeout(() => setLoggedSets(parsed), 0);
      } catch {
        localStorage.removeItem("repforge-active-workout");
      }
    }
    return () => {
      if (timeout) window.clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("repforge-active-workout", JSON.stringify(loggedSets));
  }, [loggedSets]);

  useEffect(() => {
    if (!timer.active || timer.seconds <= 0) return;
    const interval = window.setInterval(() => {
      setTimer((current) => {
        if (current.seconds <= 1) {
          return { ...current, seconds: 0, active: false };
        }
        return { ...current, seconds: current.seconds - 1 };
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timer.active, timer.seconds]);

  const completeSets = useMemo(
    () =>
      Object.values(loggedSets)
        .flat()
        .filter((set) => set.completed).length,
    [loggedSets],
  );
  const totalSets = useMemo(
    () => Object.values(loggedSets).flat().length,
    [loggedSets],
  );
  const progress = totalSets ? Math.round((completeSets / totalSets) * 100) : 0;

  const setValue = (
    exerciseId: string,
    setNumber: number,
    field: "weight" | "reps",
    value: number,
  ) => {
    setLoggedSets((current) => ({
      ...current,
      [exerciseId]: current[exerciseId].map((set) =>
        set.setNumber === setNumber ? { ...set, [field]: value } : set,
      ),
    }));
  };

  const toggleComplete = (exercise: WorkoutExercise, setNumber: number) => {
    const currentSet = loggedSets[exercise.id].find(
      (set) => set.setNumber === setNumber,
    );
    const completing = !currentSet?.completed;
    setLoggedSets((current) => ({
      ...current,
      [exercise.id]: current[exercise.id].map((set) =>
        set.setNumber === setNumber
          ? { ...set, completed: !set.completed }
          : set,
      ),
    }));
    if (completing) {
      setTimer({
        seconds: exercise.rest,
        total: exercise.rest,
        active: true,
      });
    }
  };

  if (finished) {
    return (
      <div className="workout-finished">
        <motion.div
          className="finish-mark"
          initial={{ scale: 0.4, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 14 }}
        >
          <Check size={38} />
        </motion.div>
        <p className="eyebrow">SESSION COMPLETE</p>
        <h1>Proof, forged.</h1>
        <p>
          You completed {completeSets} working sets and kept the streak alive.
          Recovery starts now.
        </p>
        <div className="finish-stats">
          <span><strong>78</strong><small>minutes</small></span>
          <span><strong>{completeSets}</strong><small>sets logged</small></span>
          <span><strong>8.9k</strong><small>kg volume</small></span>
        </div>
        <div className="finish-actions">
          <Link className="button button-primary" href="/dashboard">Back to dashboard</Link>
          <Link className="button button-secondary" href="/progress">View progress</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="workout-page">
      <header className="workout-header">
        <div className="workout-header-main">
          <div>
            <p className="eyebrow">{workout.day.toUpperCase()} · TODAY’S FORGE</p>
            <h1>{workout.title}</h1>
            <p>{workout.focus}</p>
          </div>
          <div className="workout-header-actions">
            <span><Clock3 size={15} /> {workout.duration} min</span>
            <span><Dumbbell size={15} /> {workout.exercises.length} movements</span>
            <button className="icon-button" aria-label="Workout options">
              <MoreHorizontal size={19} />
            </button>
          </div>
        </div>
        <div className="workout-progress-row">
          <div className="workout-progress-track">
            <motion.span
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 22 }}
            />
          </div>
          <strong>{completeSets} / {totalSets} SETS</strong>
          <span>{progress}%</span>
        </div>
      </header>

      <section className={`warmup-card ${warmupDone ? "done" : ""}`}>
        <button className="warmup-heading" onClick={() => setWarmupOpen(!warmupOpen)}>
          <span className="warmup-icon"><Flame size={18} /></span>
          <span>
            <span><strong>Primer, not punishment</strong><em>WARM-UP</em></span>
            <small>8–10 minutes · Keep 3+ reps in reserve</small>
          </span>
          {warmupOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        <AnimatePresence initial={false}>
          {warmupOpen && (
            <motion.div
              className="warmup-body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div>
                {workout.warmup.map((item) => (
                  <p key={item}><CheckCircle2 size={15} /> {item}</p>
                ))}
              </div>
              <button
                className={`button ${warmupDone ? "button-secondary" : "button-quiet"}`}
                onClick={() => setWarmupDone(!warmupDone)}
              >
                {warmupDone ? <><Check size={16} /> Warm-up done</> : "Mark complete"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <div className="exercise-list-heading">
        <div>
          <p className="eyebrow">WORKING SETS</p>
          <h2>Build the session</h2>
        </div>
        <span><CircleHelp size={14} /> Tap a set to start rest automatically</span>
      </div>

      <div className="exercise-list">
        {workout.exercises.map((exercise, index) => (
          <ExerciseCard
            exercise={exercise}
            index={index}
            sets={loggedSets[exercise.id] ?? []}
            selectedVariant={selectedVariants[exercise.id]}
            defaultOpen={index === 0}
            onSetChange={(setNumber, field, value) =>
              setValue(exercise.id, setNumber, field, value)
            }
            onComplete={(setNumber) => toggleComplete(exercise, setNumber)}
            onOpenVariations={() => setVariationExercise(exercise)}
            key={exercise.id}
          />
        ))}
      </div>

      <div className="finish-workout-bar">
        <div>
          <span>SESSION PROGRESS</span>
          <strong>{completeSets} of {totalSets} working sets logged</strong>
        </div>
        <button
          className="button button-primary"
          onClick={() => setFinished(true)}
          disabled={completeSets === 0}
        >
          <CheckCircle2 size={18} />
          Finish workout
        </button>
      </div>

      <AnimatePresence>
        {timer.total > 0 && (
          <RestTimer
            seconds={timer.seconds}
            total={timer.total}
            active={timer.active}
            onToggle={() =>
              setTimer((current) => ({ ...current, active: !current.active }))
            }
            onChange={(seconds) =>
              setTimer((current) => ({
                ...current,
                seconds,
                total: Math.max(current.total, seconds),
              }))
            }
            onClose={() => setTimer({ seconds: 0, total: 0, active: false })}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {variationExercise && (
          <VariationSheet
            exercise={variationExercise}
            selected={selectedVariants[variationExercise.id]?.name ?? variationExercise.name}
            onSelect={(choice) => {
              setSelectedVariants((current) => {
                const next = { ...current };
                if (choice) next[variationExercise.id] = choice;
                else delete next[variationExercise.id];
                return next;
              });
              setVariationExercise(null);
            }}
            onClose={() => setVariationExercise(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
