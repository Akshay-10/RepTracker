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
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import type {
  ExerciseVariant,
  LoggedSet,
  WorkoutExercise,
} from "@/lib/types";
import { estimateOneRepMax, suggestVariation } from "@/lib/variation-engine";
import { CoachTag, ProgressRing } from "@/components/ui";
import { createClient } from "@/utils/supabase/client";
import {
  displayLoadInput,
  displayVolume,
  displayWeight,
  kgToUnit,
  unitToKg,
  type WeightUnit,
} from "@/lib/units";

function secondsLabel(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${rest.toString().padStart(2, "0")}`;
}

function formatPreviousBest(value: string, unit: WeightUnit) {
  const match = value.match(/^([\d.]+)\s*kg\s*×\s*(\d+)/i);
  if (!match) return value;
  return `${displayWeight(Number(match[1]), unit)} × ${match[2]}`;
}

function playTimerCue() {
  try {
    type WindowWithAudio = Window & {
      webkitAudioContext?: typeof window.AudioContext;
    };
    const AudioContextClass =
      window.AudioContext ||
      (window as WindowWithAudio).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 740;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.45);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.5);
    window.setTimeout(() => void context.close(), 700);
  } catch {
    // Browser audio can be blocked. The visual timer still completes.
  }
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
  mode,
  avoided,
  equipment,
  weekNumber,
  onSelect,
  onClose,
}: {
  exercise: WorkoutExercise;
  selected: string;
  mode: "stable" | "moderate" | "high";
  avoided: string[];
  equipment: string[];
  weekNumber: number;
  onSelect: (variant: ExerciseVariant | null) => void;
  onClose: () => void;
}) {
  const suggestion = suggestVariation(exercise, {
    mode,
    avoided,
    equipment,
    weekNumber,
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
  weightUnit,
  defaultOpen,
  onSetChange,
  onComplete,
  onOpenVariations,
  onFeedback,
}: {
  exercise: WorkoutExercise;
  index: number;
  sets: LoggedSet[];
  selectedVariant?: ExerciseVariant;
  weightUnit: WeightUnit;
  defaultOpen: boolean;
  onSetChange: (setNumber: number, field: "weight" | "reps", value: number) => void;
  onComplete: (setNumber: number) => void;
  onOpenVariations: () => void;
  onFeedback: (type: string, message: string) => void;
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
              <button onClick={() => { setFeedback("Kept for next week"); onFeedback("keep_next_week", "Kept for next week"); }}>
                <Heart size={15} />
                Keep next week
              </button>
              <button onClick={() => { setFeedback("Added to avoid list"); onFeedback("avoid", "Added to avoid list"); }}>
                <ThumbsDown size={15} />
                Avoid
              </button>
              <button className="pain-button" onClick={() => { setFeedback("Pain flag saved — reduce load and stop if pain persists"); onFeedback("pain", "Pain flag saved"); }}>
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
                <strong>{formatPreviousBest(exercise.previousBest, weightUnit)}</strong>
              </span>
              <span>
                <small>BEST EST. 1RM</small>
                <strong>{displayWeight(estimateOneRepMax(exercise.lastWeight, exercise.repMin + 2), weightUnit)}</strong>
              </span>
              <span>
                <small>TODAY’S TARGET</small>
                <strong>+1 rep total</strong>
              </span>
            </div>

            <div className="set-table">
              <div className="set-table-head">
                <span>SET</span>
                <span>WEIGHT · {weightUnit.toUpperCase()}</span>
                <span>REPS</span>
                <span>STATUS</span>
              </div>
              {sets.map((set) => {
                const weightInputId = `${exercise.id}-${set.setNumber}-weight`;
                const repsInputId = `${exercise.id}-${set.setNumber}-reps`;
                const weightStep = weightUnit === "lb" ? 5 : 2.5;

                return (
                  <div
                    className={`set-row ${set.completed ? "done" : ""}`}
                    key={set.setNumber}
                  >
                    <span className="set-number">
                      {set.completed ? <Check size={15} /> : set.setNumber}
                    </span>
                    <div className="set-field">
                      <label className="set-field-label" htmlFor={weightInputId}>
                        Weight <em>{weightUnit.toUpperCase()}</em>
                      </label>
                      <div className="stepper">
                        <button
                          onClick={() => onSetChange(set.setNumber, "weight", Math.max(0, kgToUnit(set.weight, weightUnit) - weightStep))}
                          aria-label={`Decrease ${displayName} set ${set.setNumber} weight by ${weightStep} ${weightUnit}`}
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          id={weightInputId}
                          aria-label={`${displayName} set ${set.setNumber} weight in ${weightUnit}`}
                          inputMode="decimal"
                          value={displayLoadInput(set.weight, weightUnit)}
                          onChange={(event) =>
                            onSetChange(set.setNumber, "weight", Number(event.target.value))
                          }
                        />
                        <button
                          onClick={() => onSetChange(set.setNumber, "weight", kgToUnit(set.weight, weightUnit) + weightStep)}
                          aria-label={`Increase ${displayName} set ${set.setNumber} weight by ${weightStep} ${weightUnit}`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="set-field">
                      <label className="set-field-label" htmlFor={repsInputId}>
                        Reps
                      </label>
                      <div className="stepper reps-stepper">
                        <button
                          onClick={() => onSetChange(set.setNumber, "reps", Math.max(0, set.reps - 1))}
                          aria-label={`Decrease ${displayName} set ${set.setNumber} reps`}
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          id={repsInputId}
                          aria-label={`${displayName} set ${set.setNumber} reps`}
                          inputMode="numeric"
                          value={set.reps}
                          onChange={(event) =>
                            onSetChange(set.setNumber, "reps", Number(event.target.value))
                          }
                        />
                        <button
                          onClick={() => onSetChange(set.setNumber, "reps", set.reps + 1)}
                          aria-label={`Increase ${displayName} set ${set.setNumber} reps`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      className={`complete-set ${set.completed ? "done" : ""}`}
                      onClick={() => onComplete(set.setNumber)}
                      aria-label={set.completed ? `Mark ${displayName} set ${set.setNumber} incomplete` : `Complete ${displayName} set ${set.setNumber}`}
                    >
                      {set.completed ? <Check size={17} /> : <span>Complete</span>}
                    </motion.button>
                  </div>
                );
              })}
            </div>
            <div className="exercise-footer">
              <p><Zap size={14} /> {exercise.formTip}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export function WorkoutExperience({
  workout,
  variationMode,
  avoidedExercises,
  equipment,
  weightUnit,
  includeWarmup,
  autoStartRestTimer,
  restTimerSound,
}: {
  workout: import("@/lib/types").WorkoutDay;
  variationMode: "stable" | "moderate" | "high";
  avoidedExercises: string[];
  equipment: string[];
  weightUnit: WeightUnit;
  includeWarmup: boolean;
  autoStartRestTimer: boolean;
  restTimerSound: boolean;
}) {
  const router = useRouter();
  const [weekNumber] = useState(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    return Math.max(1, Math.ceil((now.getTime() - start.getTime()) / 604_800_000));
  });
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
  const [selectedVariants, setSelectedVariants] = useState<Record<string, ExerciseVariant>>(
    () =>
      Object.fromEntries(
        workout.exercises.flatMap((exercise) =>
          exercise.selectedVariant
            ? [[exercise.id, exercise.selectedVariant] as const]
            : [],
        ),
      ),
  );
  const [warmupOpen, setWarmupOpen] = useState(true);
  const [warmupDone, setWarmupDone] = useState(false);
  const [finished, setFinished] = useState(false);
  const [finishedDuration, setFinishedDuration] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startedAt] = useState(() => Date.now());
  const [syncError, setSyncError] = useState("");
  const storageKey = `repforge-active-workout-${workout.databaseId ?? workout.key}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    const savedSession = localStorage.getItem(`${storageKey}-session`);
    let timeout: number | undefined;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        timeout = window.setTimeout(() => setLoggedSets(parsed), 0);
      } catch {
        localStorage.removeItem(storageKey);
      }
    }
    if (savedSession) {
      timeout = window.setTimeout(() => setSessionId(savedSession), 0);
    }
    return () => {
      if (timeout) window.clearTimeout(timeout);
    };
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(loggedSets));
  }, [loggedSets, storageKey]);

  useEffect(() => {
    if (!timer.active || timer.seconds <= 0) return;
    const interval = window.setInterval(() => {
      setTimer((current) => {
        if (current.seconds <= 1) {
          if (restTimerSound) playTimerCue();
          return { ...current, seconds: 0, active: false };
        }
        return { ...current, seconds: current.seconds - 1 };
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [restTimerSound, timer.active, timer.seconds]);

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
    if (!Number.isFinite(value)) return;
    const nextValue =
      field === "weight"
        ? Number(unitToKg(Math.max(0, value), weightUnit).toFixed(2))
        : Math.max(0, Math.round(value));
    const exercise = workout.exercises.find((item) => item.id === exerciseId);
    const currentSet = loggedSets[exerciseId]?.find(
      (set) => set.setNumber === setNumber,
    );
    const setToSync = currentSet?.completed
      ? { ...currentSet, [field]: nextValue }
      : null;
    setLoggedSets((current) => ({
      ...current,
      [exerciseId]: current[exerciseId].map((set) =>
        set.setNumber === setNumber ? { ...set, [field]: nextValue } : set,
      ),
    }));
    if (exercise && setToSync) {
      void syncCompletedSet(exercise, setToSync);
    }
  };

  const ensureSession = async () => {
    if (sessionId) return sessionId;
    const supabase = createClient();
    const { data: authData } = await supabase.auth.getClaims();
    const userId = authData?.claims?.sub;
    if (!userId) throw new Error("Your session expired. Please sign in again.");
    const { data, error } = await supabase
      .from("workout_sessions")
      .insert({
        user_id: userId,
        workout_day_id: workout.databaseId ?? null,
        started_at: new Date(startedAt).toISOString(),
        status: "active",
      })
      .select("id")
      .single();
    if (error) throw error;
    setSessionId(data.id);
    localStorage.setItem(`${storageKey}-session`, data.id);
    return data.id as string;
  };

  const persistSet = async (
    id: string,
    exercise: WorkoutExercise,
    set: LoggedSet,
  ) => {
    const supabase = createClient();
    const { error } = await supabase.from("workout_sets").upsert(
      {
        session_id: id,
        exercise_id: exercise.id,
        set_number: set.setNumber,
        weight: set.weight,
        reps: set.reps,
        completed: set.completed,
        rest_seconds: exercise.rest,
      },
      { onConflict: "session_id,exercise_id,set_number" },
    );
    if (error) throw error;
  };

  const syncCompletedSet = async (
    exercise: WorkoutExercise,
    set: LoggedSet,
  ) => {
    try {
      setSyncError("");
      const id = await ensureSession();
      await persistSet(id, exercise, set);
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : "Set sync failed.");
    }
  };

  const toggleComplete = async (exercise: WorkoutExercise, setNumber: number) => {
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
    if (completing && autoStartRestTimer) {
      setTimer({
        seconds: exercise.rest,
        total: exercise.rest,
        active: true,
      });
    }
    try {
      setSyncError("");
      const id = await ensureSession();
      if (currentSet) {
        await persistSet(id, exercise, {
          ...currentSet,
          completed: completing,
        });
      }
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : "Set sync failed.");
    }
  };

  const saveFeedback = async (
    exercise: WorkoutExercise,
    feedbackType: string,
  ) => {
    const supabase = createClient();
    const { data: authData } = await supabase.auth.getClaims();
    const userId = authData?.claims?.sub;
    if (!userId) return;
    const { error } = await supabase.from("exercise_feedback").insert({
      user_id: userId,
      exercise_id: exercise.id,
      feedback_type: feedbackType,
    });
    if (error) setSyncError(error.message);

    const preferenceField =
      feedbackType === "avoid"
        ? "exercises_to_avoid"
        : feedbackType === "pain"
          ? "injuries_or_pain"
          : feedbackType === "keep_next_week"
            ? "favorite_exercises"
            : null;
    if (!preferenceField) return;

    const selectedName = selectedVariants[exercise.id]?.name ?? exercise.name;
    const preferenceValue =
      feedbackType === "pain" ? `${selectedName}: pain reported` : selectedName;
    const { data: preferences } = await supabase
      .from("user_preferences")
      .select(preferenceField)
      .eq("user_id", userId)
      .maybeSingle();
    const preferenceRow = preferences as unknown as Record<string, unknown> | null;
    const currentValues = Array.isArray(preferenceRow?.[preferenceField])
      ? (preferenceRow[preferenceField] as string[])
      : [];
    if (!currentValues.includes(preferenceValue)) {
      const { error: preferenceError } = await supabase
        .from("user_preferences")
        .update({
          [preferenceField]: [...currentValues, preferenceValue],
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);
      if (preferenceError) setSyncError(preferenceError.message);
    }
  };

  const saveVariation = async (
    exercise: WorkoutExercise,
    choice: ExerciseVariant | null,
  ) => {
    if (!exercise.slotId || !workout.databaseId) return;
    const supabase = createClient();
    const { data: authData } = await supabase.auth.getClaims();
    const userId = authData?.claims?.sub;
    if (!userId) return;
    const todayKey = new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Kolkata",
    }).format(new Date());
    const indiaToday = new Date(`${todayKey}T00:00:00+05:30`);
    const dayName = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      timeZone: "Asia/Kolkata",
    }).format(indiaToday);
    const dayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(dayName);
    const distance = dayIndex === 0 ? 6 : dayIndex - 1;
    const week = new Date(indiaToday.getTime() - distance * 86_400_000);
    const weekStart = new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Kolkata",
    }).format(week);
    if (!choice) {
      const { error } = await supabase
        .from("selected_workout_variations")
        .delete()
        .eq("user_id", userId)
        .eq("slot_id", exercise.slotId)
        .eq("week_start_date", weekStart);
      if (error) setSyncError(error.message);
      return;
    }
    if (!choice.id) return;
    const { error } = await supabase
      .from("selected_workout_variations")
      .upsert(
        {
          user_id: userId,
          workout_day_id: workout.databaseId,
          slot_id: exercise.slotId,
          exercise_variant_id: choice.id,
          week_start_date: weekStart,
          reason: `User selected ${choice.name} from compatible live variations.`,
          source: "user_selected",
        },
        { onConflict: "user_id,slot_id,week_start_date" },
      );
    if (error) setSyncError(error.message);
  };

  const finishWorkout = async () => {
    try {
      const id = await ensureSession();
      const supabase = createClient();
      const duration = Math.max(1, Math.round((Date.now() - startedAt) / 60_000));
      const { error: rpcError } = await supabase.rpc("finish_workout_session", {
        p_session_id: id,
      });
      if (rpcError) {
        const { error } = await supabase
          .from("workout_sessions")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
            duration_minutes: duration,
          })
          .eq("id", id);
        if (error) throw error;
      }
      localStorage.removeItem(storageKey);
      localStorage.removeItem(`${storageKey}-session`);
      setFinishedDuration(duration);
      setFinished(true);
      router.refresh();
    } catch (error) {
      setSyncError(
        error instanceof Error ? error.message : "Workout completion failed.",
      );
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
          You completed {completeSets} working sets and saved the session.
          Recovery starts now.
        </p>
        <div className="finish-stats">
          <span><strong>{finishedDuration}</strong><small>minutes</small></span>
          <span><strong>{completeSets}</strong><small>sets logged</small></span>
          <span><strong>{displayVolume(Object.values(loggedSets).flat().filter((set) => set.completed).reduce((sum, set) => sum + set.weight * set.reps, 0), weightUnit)}</strong><small>volume</small></span>
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

      {includeWarmup && <section className={`warmup-card ${warmupDone ? "done" : ""}`}>
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
      </section>}

      <div className="exercise-list-heading">
        <div>
          <p className="eyebrow">WORKING SETS</p>
          <h2>Build the session</h2>
        </div>
        <span><CircleHelp size={14} /> {autoStartRestTimer ? "Complete a set to start rest automatically" : "Complete a set to save it to your log"}</span>
      </div>

      <div className="exercise-list">
        {syncError && <div className="feedback-banner"><AlertTriangle size={15} />{syncError}<button onClick={() => setSyncError("")}><X size={13} /></button></div>}
        {workout.exercises.map((exercise, index) => (
          <ExerciseCard
            exercise={exercise}
            index={index}
            sets={loggedSets[exercise.id] ?? []}
            selectedVariant={selectedVariants[exercise.id]}
            weightUnit={weightUnit}
            defaultOpen={index === 0}
            onSetChange={(setNumber, field, value) =>
              setValue(exercise.id, setNumber, field, value)
            }
            onComplete={(setNumber) => toggleComplete(exercise, setNumber)}
            onOpenVariations={() => setVariationExercise(exercise)}
            onFeedback={(type) => saveFeedback(exercise, type)}
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
          onClick={finishWorkout}
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
            mode={variationMode}
            avoided={avoidedExercises}
            equipment={equipment}
            weekNumber={weekNumber}
            onSelect={(choice) => {
              void saveVariation(variationExercise, choice);
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
