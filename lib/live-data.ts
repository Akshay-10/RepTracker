import type { WorkoutDay, WorkoutExercise } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";
import { normalizeWeightUnit, type WeightUnit } from "@/lib/units";

type DbVariant = {
  id: string;
  variation_name: string;
  angle_focus: string;
  equipment: string;
  joint_stress_level: "low" | "moderate" | "high";
};

type DbExercise = {
  id: string;
  slug: string;
  name: string;
  muscle_group: string;
  target_muscle: string;
  secondary_muscles: string[];
  equipment: string;
  movement_pattern: string;
  angle_focus: string | null;
  joint_stress_level: "low" | "moderate" | "high";
  form_tips: string | null;
  common_mistakes: string | null;
  exercise_variants?: DbVariant[];
};

type DbPlanExercise = {
  id: string;
  slot_id: string | null;
  sort_order: number;
  sets: number;
  reps_min: number;
  reps_max: number;
  rest_seconds: number;
  notes: string | null;
  exercises: DbExercise | DbExercise[] | null;
};

type DbWorkoutDay = {
  id: string;
  day_of_week: number;
  title: string;
  muscle_groups: string[];
  estimated_duration: number;
  sort_order: number;
  block_type: string;
  workout_day_exercises: DbPlanExercise[];
};

type DbSelectedVariation = {
  slot_id: string;
  exercise_variants: DbVariant | DbVariant[] | null;
};

type DbSet = {
  exercise_id: string;
  weight: number | string;
  reps: number;
  completed: boolean;
  exercises:
    | Pick<DbExercise, "name" | "slug" | "muscle_group" | "target_muscle">
    | Array<
        Pick<DbExercise, "name" | "slug" | "muscle_group" | "target_muscle">
      >
    | null;
};

type DbSession = {
  id: string;
  workout_day_id: string | null;
  started_at: string;
  completed_at: string | null;
  duration_minutes: number | null;
  status: string;
  notes: string | null;
  workout_sets: DbSet[];
};

type DbBodyMetric = {
  id: string;
  measured_on: string;
  weight_kg: number | string;
  chest_cm: number | string | null;
  waist_cm: number | string | null;
  arm_cm: number | string | null;
  thigh_cm: number | string | null;
  shoulder_cm: number | string | null;
  notes: string | null;
};

type DbRecord = {
  id: string;
  record_type: string;
  weight: number | string | null;
  reps: number | null;
  estimated_1rm: number | string | null;
  achieved_at: string;
  exercises: { name: string; muscle_group: string } | null;
};

export type LiveRecord = {
  id: string;
  exercise: string;
  result: string;
  weightKg: number | null;
  reps: number | null;
  estimatedOneRepMax: number;
  type: string;
  date: string;
};

export type LiveBodyMetric = {
  id: string;
  date: string;
  weightKg: number;
  chestCm: number | null;
  waistCm: number | null;
  armCm: number | null;
  thighCm: number | null;
  shoulderCm: number | null;
  notes: string;
};

export type LiveSnapshot = {
  setupRequired: boolean;
  profile: {
    name: string;
    age: number | null;
    heightCm: number | null;
    currentWeightKg: number | null;
    goal: string;
    experienceLevel: string;
    trainingDays: number;
    workoutDuration: number;
  };
  preferences: {
    units: WeightUnit;
    theme: string;
    variationMode: string;
    aiUsageMode: string;
    includeWarmup: boolean;
    autoStartRestTimer: boolean;
    restTimerSound: boolean;
    preferredEquipment: string[];
    exercisesToAvoid: string[];
    favoriteExercises: string[];
    injuriesOrPain: string[];
    weakMuscles: string[];
  };
  plan: WorkoutDay[];
  todayWorkout: WorkoutDay | null;
  totalWorkouts: number;
  completedLast28Days: number;
  expectedLast28Days: number;
  consistencyPercent: number;
  streak: number;
  readiness: number;
  weeklyVolume: number;
  previousWeeklyVolume: number;
  recentSession: {
    duration: number;
    volume: number;
    completedAt: string;
  } | null;
  recentRecords: LiveRecord[];
  totalRecords: number;
  recordsThisBlock: number;
  bodyMetrics: LiveBodyMetric[];
  currentWeightKg: number | null;
  weightDelta: number | null;
  volumeTrend: Array<{ week: string; volume: number }>;
  weightTrend: Array<{ date: string; weight: number }>;
  muscleVolume: Array<{ muscle: string; sets: number }>;
  strengthTrend: Array<Record<string, number | string>>;
  strengthSeries: string[];
  consistencyDays: Array<{ date: string; completed: boolean }>;
  aiRecommendation: {
    summary: string;
    nextActions: string[];
    createdAt: string;
  } | null;
  aiUsage: {
    calls: number;
    tokens: number;
    cacheHits: number;
    lastCall: string | null;
  };
};

const DAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function numberOrNull(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function dateKey(value: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(value);
}

function indiaDayIndex(value: Date) {
  const day = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: "Asia/Kolkata",
  }).format(value);
  return DAY_NAMES.indexOf(day);
}

function indiaDateStart(value: Date) {
  return new Date(`${dateKey(value)}T00:00:00+05:30`);
}

function startOfWeek(date: Date) {
  const copy = indiaDateStart(date);
  const day = indiaDayIndex(copy);
  const distance = day === 0 ? 6 : day - 1;
  return addDays(copy, -distance);
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 86_400_000);
}

function firstRelation<T>(value: T | T[] | null | undefined): T | null {
  return Array.isArray(value) ? value[0] ?? null : value ?? null;
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

function mapWorkoutDay(
  row: DbWorkoutDay,
  recentSetsByExercise: Map<string, DbSet[]>,
  selectedBySlot: Map<string, DbVariant>,
): WorkoutDay {
  const exercises = [...(row.workout_day_exercises ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .flatMap((item): WorkoutExercise[] => {
      const source = firstRelation(item.exercises);
      if (!source) return [];
      const previousSets = recentSetsByExercise.get(source.id) ?? [];
      const best = previousSets.reduce<DbSet | null>((current, set) => {
        if (!current) return set;
        const currentScore = Number(current.weight) * current.reps;
        const nextScore = Number(set.weight) * set.reps;
        return nextScore > currentScore ? set : current;
      }, null);
      const lastWeight = previousSets.length
        ? Number(previousSets[0].weight)
        : 0;

      return [
        {
          id: source.id,
          slotId: item.slot_id ?? undefined,
          name: source.name,
          target: source.target_muscle,
          secondary: source.secondary_muscles ?? [],
          movement: source.movement_pattern,
          focus: source.angle_focus || source.target_muscle,
          equipment: source.equipment,
          sets: item.sets,
          repMin: item.reps_min,
          repMax: item.reps_max,
          rest: item.rest_seconds,
          previousBest: best
            ? `${Number(best.weight)} kg × ${best.reps}`
            : "No logged sets",
          lastWeight,
          kind:
            item.sort_order <= 2
              ? "main"
              : item.sort_order <= 5
                ? "accessory"
                : "isolation",
          goal: row.block_type === "strength" ? "strength" : "hypertrophy",
          reason:
            item.notes ||
            "Selected from your active plan for this movement slot.",
          formTip:
            source.form_tips ||
            "Use a controlled range of motion and stop when form changes.",
          mistake:
            source.common_mistakes ||
            "Avoid adding load at the expense of repeatable technique.",
          variants: (source.exercise_variants ?? []).map((variant) => ({
            id: variant.id,
            name: variant.variation_name,
            angle: variant.angle_focus,
            equipment: variant.equipment,
            jointStress: variant.joint_stress_level,
          })),
          selectedVariant: item.slot_id
            ? (() => {
                const selected = selectedBySlot.get(item.slot_id);
                return selected
                  ? {
                      id: selected.id,
                      name: selected.variation_name,
                      angle: selected.angle_focus,
                      equipment: selected.equipment,
                      jointStress: selected.joint_stress_level,
                    }
                  : undefined;
              })()
            : undefined,
        },
      ];
    });
  const groups = (row.muscle_groups ?? []).map((group) => group.toLowerCase());
  const warmup = groups.some((group) => group.includes("leg"))
    ? [
        "Easy treadmill or cycle · 5–8 minutes",
        "Bodyweight squats · 2 controlled sets",
      ]
    : [
        ...(groups.some((group) => group.includes("chest") || group.includes("shoulder"))
          ? ["Push-ups · 2 sets, stop at least 3 reps before fatigue"]
          : []),
        ...(groups.some((group) => group.includes("back"))
          ? ["Pull-ups · 2–3 sets, stop at least 3 reps before fatigue"]
          : []),
        "One light ramp-up set for the first compound exercise",
      ];

  return {
    databaseId: row.id,
    key: DAY_KEYS[row.day_of_week] ?? `day-${row.day_of_week}`,
    day: DAY_NAMES[row.day_of_week] ?? "Training day",
    shortDay: (DAY_NAMES[row.day_of_week] ?? "T").slice(0, 1),
    title: row.title,
    focus: row.muscle_groups?.join(" · ") || "Planned training",
    duration: row.estimated_duration,
    intensity:
      row.block_type === "strength"
        ? "Heavy"
        : row.block_type === "deload"
          ? "Recovery"
          : "Build",
    warmup,
    exercises,
  };
}

function calculateStreak(
  sessions: DbSession[],
  scheduledDays: Set<number>,
  now: Date,
) {
  const completedDates = new Set(
    sessions
      .filter((session) => session.status === "completed")
      .map((session) => dateKey(new Date(session.completed_at || session.started_at))),
  );

  let streak = 0;
  let cursor = indiaDateStart(now);
  for (let index = 0; index < 90; index += 1) {
    const scheduled = scheduledDays.has(indiaDayIndex(cursor));
    const key = dateKey(cursor);

    if (scheduled) {
      if (completedDates.has(key)) streak += 1;
      else if (key !== dateKey(now)) break;
    }
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export async function getLiveSnapshot(userId: string): Promise<LiveSnapshot> {
  const supabase = await createClient();
  const now = new Date();
  const historyStart = addDays(now, -180).toISOString();
  const currentWeekStart = startOfWeek(now);
  const currentWeekKey = dateKey(currentWeekStart);

  const [
    profileResult,
    preferencesResult,
    planResult,
    selectedVariationsResult,
    sessionsResult,
    totalResult,
    metricsResult,
    recordsResult,
    recordsCountResult,
    recordsBlockCountResult,
    aiResult,
    aiUsageResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "name,age,height_cm,current_weight_kg,goal,experience_level,training_days,workout_duration_minutes",
      )
      .eq("id", userId)
      .maybeSingle(),
    supabase.from("user_preferences").select("*").eq("user_id", userId).maybeSingle(),
    supabase
      .from("workout_days")
      .select(
        "id,day_of_week,title,muscle_groups,estimated_duration,sort_order,block_type,workout_day_exercises(id,slot_id,sort_order,sets,reps_min,reps_max,rest_seconds,notes,exercises(id,slug,name,muscle_group,target_muscle,secondary_muscles,equipment,movement_pattern,angle_focus,joint_stress_level,form_tips,common_mistakes,exercise_variants(id,variation_name,angle_focus,equipment,joint_stress_level)))",
      )
      .eq("user_id", userId)
      .eq("active", true)
      .order("sort_order"),
    supabase
      .from("selected_workout_variations")
      .select(
        "slot_id,exercise_variants(id,variation_name,angle_focus,equipment,joint_stress_level)",
      )
      .eq("user_id", userId)
      .eq("week_start_date", currentWeekKey),
    supabase
      .from("workout_sessions")
      .select(
        "id,workout_day_id,started_at,completed_at,duration_minutes,status,notes,workout_sets(exercise_id,weight,reps,completed,exercises(name,slug,muscle_group,target_muscle))",
      )
      .eq("user_id", userId)
      .gte("started_at", historyStart)
      .order("started_at", { ascending: false }),
    supabase
      .from("workout_sessions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "completed"),
    supabase
      .from("body_metrics")
      .select("*")
      .eq("user_id", userId)
      .order("measured_on", { ascending: false })
      .limit(24),
    supabase
      .from("personal_records")
      .select(
        "id,record_type,weight,reps,estimated_1rm,achieved_at,exercises(name,muscle_group)",
      )
      .eq("user_id", userId)
      .order("achieved_at", { ascending: false })
      .limit(50),
    supabase
      .from("personal_records")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("personal_records")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("achieved_at", addDays(now, -42).toISOString()),
    supabase
      .from("ai_recommendations")
      .select("output_json,created_at")
      .eq("user_id", userId)
      .gt("expires_at", now.toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("ai_usage_logs")
      .select("input_tokens,output_tokens,cache_hit,created_at")
      .eq("user_id", userId)
      .gte(
        "created_at",
        new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
      )
      .order("created_at", { ascending: false }),
  ]);

  const setupRequired = Boolean(
    profileResult.error &&
      (profileResult.error.code === "42P01" ||
        profileResult.error.message.toLowerCase().includes("schema cache")),
  );
  const profile = profileResult.data;
  const preferences = preferencesResult.data;
  const sessions = (sessionsResult.data ?? []) as unknown as DbSession[];
  const metrics = (metricsResult.data ?? []) as unknown as DbBodyMetric[];
  const records = (recordsResult.data ?? []) as unknown as DbRecord[];
  const dbPlan = (planResult.data ?? []) as unknown as DbWorkoutDay[];
  const selectedVariations = (selectedVariationsResult.data ??
    []) as unknown as DbSelectedVariation[];
  const selectedBySlot = new Map<string, DbVariant>();
  selectedVariations.forEach((row) => {
    const variant = firstRelation(row.exercise_variants);
    if (variant) selectedBySlot.set(row.slot_id, variant);
  });

  const recentSetsByExercise = new Map<string, DbSet[]>();
  sessions.forEach((session) => {
    session.workout_sets?.forEach((set) => {
      if (!set.completed) return;
      const existing = recentSetsByExercise.get(set.exercise_id) ?? [];
      existing.push(set);
      recentSetsByExercise.set(set.exercise_id, existing);
    });
  });
  const plan = dbPlan.map((day) =>
    mapWorkoutDay(day, recentSetsByExercise, selectedBySlot),
  );
  const currentDay = indiaDayIndex(now);
  const todayWorkout =
    plan.find((_, index) => dbPlan[index]?.day_of_week === currentDay) ?? null;

  const completedSessions = sessions.filter(
    (session) => session.status === "completed",
  );
  const last28Start = addDays(now, -28);
  const completedLast28Days = completedSessions.filter(
    (session) => new Date(session.completed_at || session.started_at) >= last28Start,
  ).length;
  const scheduledDays = new Set(dbPlan.map((day) => day.day_of_week));
  const trainingDays =
    profile?.training_days || Math.max(scheduledDays.size, 1);
  const expectedLast28Days = trainingDays * 4;
  const consistencyPercent = expectedLast28Days
    ? Math.min(100, Math.round((completedLast28Days / expectedLast28Days) * 100))
    : 0;

  const previousWeekStart = addDays(currentWeekStart, -7);
  const sessionVolume = (session: DbSession) =>
    (session.workout_sets ?? [])
      .filter((set) => set.completed)
      .reduce((total, set) => total + Number(set.weight) * set.reps, 0);
  const volumeBetween = (start: Date, end: Date) =>
    completedSessions
      .filter((session) => {
        const date = new Date(session.completed_at || session.started_at);
        return date >= start && date < end;
      })
      .reduce((total, session) => total + sessionVolume(session), 0);
  const weeklyVolume = volumeBetween(currentWeekStart, addDays(currentWeekStart, 7));
  const previousWeeklyVolume = volumeBetween(previousWeekStart, currentWeekStart);

  const volumeTrend = Array.from({ length: 6 }, (_, index) => {
    const start = addDays(currentWeekStart, (index - 5) * 7);
    return {
      week: new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
      }).format(start),
      volume: Math.round(volumeBetween(start, addDays(start, 7))),
    };
  });

  const bodyMetrics = metrics.map((metric) => ({
    id: metric.id,
    date: metric.measured_on,
    weightKg: Number(metric.weight_kg),
    chestCm: numberOrNull(metric.chest_cm),
    waistCm: numberOrNull(metric.waist_cm),
    armCm: numberOrNull(metric.arm_cm),
    thighCm: numberOrNull(metric.thigh_cm),
    shoulderCm: numberOrNull(metric.shoulder_cm),
    notes: metric.notes || "",
  }));
  const chronologicalMetrics = [...bodyMetrics].reverse();
  const currentWeightKg =
    bodyMetrics[0]?.weightKg ?? numberOrNull(profile?.current_weight_kg);
  const weightDelta =
    bodyMetrics.length > 1
      ? Number((bodyMetrics[0].weightKg - bodyMetrics.at(-1)!.weightKg).toFixed(2))
      : null;

  const liveRecords = records.map((record) => {
    const weight = numberOrNull(record.weight);
    const reps = record.reps;
    return {
      id: record.id,
      exercise: record.exercises?.name || "Exercise",
      result:
        weight !== null && reps
          ? `${weight} kg × ${reps}`
          : weight !== null
            ? `${weight} kg`
            : `${numberOrNull(record.estimated_1rm) ?? 0} kg est. 1RM`,
      weightKg: weight,
      reps,
      estimatedOneRepMax: numberOrNull(record.estimated_1rm) ?? 0,
      type: record.record_type,
      date: formatShortDate(record.achieved_at),
    };
  });

  const weekSets = completedSessions
    .filter((session) => {
      const date = new Date(session.completed_at || session.started_at);
      return date >= currentWeekStart;
    })
    .flatMap((session) => session.workout_sets ?? [])
    .filter((set) => set.completed);
  const muscleMap = new Map<string, number>();
  weekSets.forEach((set) => {
    const exercise = firstRelation(set.exercises);
    const muscle = exercise?.muscle_group || "Other";
    muscleMap.set(muscle, (muscleMap.get(muscle) ?? 0) + 1);
  });

  const exerciseFrequency = new Map<string, number>();
  completedSessions.flatMap((session) => session.workout_sets ?? []).forEach((set) => {
    if (!set.completed) return;
    const exercise = firstRelation(set.exercises);
    if (!exercise) return;
    exerciseFrequency.set(
      exercise.name,
      (exerciseFrequency.get(exercise.name) ?? 0) + 1,
    );
  });
  const strengthSeries = [...exerciseFrequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name);
  const monthBuckets = new Map<string, Record<string, number | string>>();
  completedSessions.forEach((session) => {
    const month = new Intl.DateTimeFormat("en-IN", {
      month: "short",
      year: "2-digit",
    }).format(new Date(session.completed_at || session.started_at));
    const bucket = monthBuckets.get(month) ?? { month };
    (session.workout_sets ?? []).forEach((set) => {
      const exercise = firstRelation(set.exercises);
      if (!set.completed || !exercise || !strengthSeries.includes(exercise.name)) {
        return;
      }
      const estimate = Number(set.weight) * (1 + set.reps / 30);
      bucket[exercise.name] = Math.max(
        Number(bucket[exercise.name] ?? 0),
        Number(estimate.toFixed(1)),
      );
    });
    monthBuckets.set(month, bucket);
  });

  const consistencyDays = Array.from({ length: 35 }, (_, index) => {
    const date = addDays(now, index - 34);
    const key = dateKey(date);
    return {
      date: key,
      completed: completedSessions.some(
        (session) =>
          dateKey(new Date(session.completed_at || session.started_at)) === key,
      ),
    };
  });

  const latestAiOutput = aiResult.data?.output_json as
    | { summary?: string; next_actions?: string[] }
    | undefined;
  const recentSession = completedSessions[0];
  const blockStart = addDays(now, -42);
  const recoveryGap = recentSession
    ? (now.getTime() -
        new Date(recentSession.completed_at || recentSession.started_at).getTime()) /
      86_400_000
    : 2;
  const readiness = Math.max(
    35,
    Math.min(
      95,
      Math.round(
        45 + consistencyPercent * 0.35 + Math.min(15, recoveryGap * 5),
      ),
    ),
  );

  return {
    setupRequired,
    profile: {
      name: profile?.name || "Athlete",
      age: profile?.age ?? null,
      heightCm: numberOrNull(profile?.height_cm),
      currentWeightKg: numberOrNull(profile?.current_weight_kg),
      goal: profile?.goal || "not_set",
      experienceLevel: profile?.experience_level || "not_set",
      trainingDays,
      workoutDuration: profile?.workout_duration_minutes || 90,
    },
    preferences: {
      units: normalizeWeightUnit(preferences?.units),
      theme: preferences?.theme || "dark",
      variationMode: preferences?.variation_mode || "moderate",
      aiUsageMode: preferences?.ai_usage_mode || "balanced",
      includeWarmup: preferences?.include_pushup_pullup_warmup ?? true,
      autoStartRestTimer: preferences?.auto_start_rest_timer ?? true,
      restTimerSound: preferences?.rest_timer_sound ?? true,
      preferredEquipment: preferences?.preferred_equipment ?? [],
      exercisesToAvoid: preferences?.exercises_to_avoid ?? [],
      favoriteExercises: preferences?.favorite_exercises ?? [],
      injuriesOrPain: preferences?.injuries_or_pain ?? [],
      weakMuscles: preferences?.weak_muscles ?? [],
    },
    plan,
    todayWorkout,
    totalWorkouts: totalResult.count ?? completedSessions.length,
    completedLast28Days,
    expectedLast28Days,
    consistencyPercent,
    streak: calculateStreak(sessions, scheduledDays, now),
    readiness,
    weeklyVolume,
    previousWeeklyVolume,
    recentSession: recentSession
      ? {
          duration: recentSession.duration_minutes ?? 0,
          volume: Math.round(sessionVolume(recentSession)),
          completedAt: recentSession.completed_at || recentSession.started_at,
        }
      : null,
    recentRecords: liveRecords.slice(0, 10),
    totalRecords: recordsCountResult.count ?? records.length,
    recordsThisBlock:
      recordsBlockCountResult.count ??
      records.filter((record) => new Date(record.achieved_at) >= blockStart).length,
    bodyMetrics,
    currentWeightKg,
    weightDelta,
    volumeTrend,
    weightTrend: chronologicalMetrics.map((metric) => ({
      date: formatShortDate(metric.date),
      weight: metric.weightKg,
    })),
    muscleVolume: [...muscleMap.entries()]
      .map(([muscle, sets]) => ({ muscle, sets }))
      .sort((a, b) => b.sets - a.sets),
    strengthTrend: [...monthBuckets.values()].slice(-6),
    strengthSeries,
    consistencyDays,
    aiRecommendation:
      latestAiOutput?.summary && aiResult.data
        ? {
            summary: latestAiOutput.summary,
            nextActions: latestAiOutput.next_actions ?? [],
            createdAt: aiResult.data.created_at,
          }
        : null,
    aiUsage: {
      calls: aiUsageResult.data?.length ?? 0,
      tokens:
        aiUsageResult.data?.reduce(
          (total, log) =>
            total +
            Number(log.input_tokens ?? 0) +
            Number(log.output_tokens ?? 0),
          0,
        ) ?? 0,
      cacheHits:
        aiUsageResult.data?.filter((log) => log.cache_hit).length ?? 0,
      lastCall: aiUsageResult.data?.[0]?.created_at ?? null,
    },
  };
}

export type LiveLibraryExercise = WorkoutExercise & {
  day: string;
  dayTitle: string;
};

export async function getExerciseCatalog(): Promise<LiveLibraryExercise[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("exercises")
    .select(
      "id,slug,name,muscle_group,target_muscle,secondary_muscles,equipment,movement_pattern,angle_focus,joint_stress_level,default_sets,default_reps_min,default_reps_max,default_rest_seconds,form_tips,common_mistakes,exercise_variants(id,variation_name,angle_focus,equipment,joint_stress_level)",
    )
    .order("muscle_group")
    .order("name");

  type CatalogRow = DbExercise & {
    default_sets: number;
    default_reps_min: number;
    default_reps_max: number;
    default_rest_seconds: number;
  };

  return ((data ?? []) as unknown as CatalogRow[]).map((source) => ({
    id: source.id,
    name: source.name,
    target: source.target_muscle,
    secondary: source.secondary_muscles ?? [],
    movement: source.movement_pattern,
    focus: source.angle_focus || source.target_muscle,
    equipment: source.equipment,
    sets: source.default_sets,
    repMin: source.default_reps_min,
    repMax: source.default_reps_max,
    rest: source.default_rest_seconds,
    previousBest: "No logged sets",
    lastWeight: 0,
    kind: "accessory",
    goal: "hypertrophy",
    reason: "Available in your live exercise catalog.",
    formTip:
      source.form_tips ||
      "Use a controlled range of motion and repeatable technique.",
    mistake:
      source.common_mistakes ||
      "Avoid adding load when it changes the intended movement.",
    variants: (source.exercise_variants ?? []).map((variant) => ({
      id: variant.id,
      name: variant.variation_name,
      angle: variant.angle_focus,
      equipment: variant.equipment,
      jointStress: variant.joint_stress_level,
    })),
    day: "Library",
    dayTitle: source.muscle_group,
  }));
}
