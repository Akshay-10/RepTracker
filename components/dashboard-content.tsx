"use client";

import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Dumbbell,
  Flame,
  Gauge,
  Sparkles,
  Target,
  TimerReset,
  TrendingUp,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import type { LiveSnapshot } from "@/lib/live-data";
import {
  Panel,
  PanelHeader,
  ProgressRing,
  StatCard,
  StreakBadge,
  TextLink,
} from "@/components/ui";
import { VolumeChart, WeightChart } from "@/components/charts";
import { CoachCard } from "@/components/coach-card";
import {
  convertVolumePoint,
  displayVolume,
  displayWeight,
  displayRecordResult,
  kgToUnit,
} from "@/lib/units";

function compactNumber(value: number) {
  return new Intl.NumberFormat("en-IN", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

function percentChange(current: number, previous: number) {
  if (!previous) return null;
  return ((current - previous) / previous) * 100;
}

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const dayShort = ["S", "M", "T", "W", "T", "F", "S"];

function indiaDateKey(value: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(value);
}

function indiaDayIndex(value: Date) {
  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: "Asia/Kolkata",
  }).format(value);
  return dayNames.indexOf(weekday);
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 86_400_000);
}

function startOfIndiaWeek(value: Date) {
  const start = new Date(`${indiaDateKey(value)}T00:00:00+05:30`);
  const day = indiaDayIndex(start);
  const distance = day === 0 ? 6 : day - 1;
  return addDays(start, -distance);
}

function readinessLabel(value: number) {
  if (value >= 80) return "High readiness";
  if (value >= 60) return "Moderate readiness";
  return "Recovery priority";
}

function greeting() {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: "Asia/Kolkata",
    }).format(new Date()),
  );
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardContent({ data }: { data: LiveSnapshot }) {
  const today = data.todayWorkout;
  const totalSets =
    today?.exercises.reduce((sum, item) => sum + item.sets, 0) ?? 0;
  const readiness = data.readiness;
  const unit = data.preferences.units;
  const volumeDelta = percentChange(
    data.weeklyVolume,
    data.previousWeeklyVolume,
  );
  const now = new Date();
  const todayIndex = indiaDayIndex(now);
  const weekStart = startOfIndiaWeek(now);
  const completedKeys = new Set(
    data.consistencyDays
      .filter((day) => day.completed)
      .map((day) => day.date),
  );
  const calendar = Array.from({ length: 7 }, (_, index) => {
    const dayOfWeek = index === 6 ? 0 : index + 1;
    const date = addDays(weekStart, index);
    const key = indiaDateKey(date);
    const plan = data.plan.find(
      (item) => item.day.toLowerCase() ===
        dayNames[dayOfWeek].toLowerCase(),
    );
    return {
      key: plan?.key ?? `rest-${dayOfWeek}`,
      date: key,
      day: dayNames[dayOfWeek],
      shortDay: dayShort[dayOfWeek],
      title: plan?.title ?? "Rest",
      hasWorkout: Boolean(plan),
      active: dayOfWeek === todayIndex,
      complete: completedKeys.has(key),
    };
  });
  const nextWorkout = data.plan
    .map((item) => ({
      item,
      dayIndex: dayNames.indexOf(item.day),
    }))
    .map(({ item, dayIndex }) => ({
      item,
      distance: (dayIndex - todayIndex + 7) % 7 || 7,
    }))
    .sort((a, b) => a.distance - b.distance)[0]?.item;

  return (
    <>
      <div className="dashboard-welcome">
        <div>
          <div className="welcome-inline">
            <p className="eyebrow">{greeting().toUpperCase()}, {data.profile.name.toUpperCase()}</p>
            <StreakBadge days={data.streak} />
          </div>
          <h1>Ready to <em>forge</em> progress?</h1>
          <p className="page-copy">
            {data.completedLast28Days} of {data.expectedLast28Days} planned sessions
            completed in the last four weeks.
          </p>
        </div>
        <div className="readiness">
          <ProgressRing value={readiness} size={74} label={String(readiness)} sublabel="READY" />
          <span>
            <strong>{readinessLabel(readiness)}</strong>
            <small>Computed from consistency and recovery gap</small>
          </span>
        </div>
      </div>

      {(data.setupRequired || data.plan.length === 0) && (
        <Panel className="setup-panel">
          <PanelHeader
            eyebrow="SETUP CHECK"
            title="Create your live training plan"
            action={<TextLink href="/onboarding">Finish setup</TextLink>}
          />
          <p>
            {data.setupRequired
              ? "The Supabase schema/bootstrap is not fully installed yet. Run the setup SQL, then finish onboarding to generate your plan."
              : "Finish onboarding or reset your workout plan from settings. RepForge will not show fake workouts while your live plan is empty."}
          </p>
        </Panel>
      )}

      <div className="dashboard-grid">
        <motion.section
          className="today-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="today-card-noise" />
          <div className="today-card-lines" />
          <div className="today-card-content">
            <div className="today-card-top">
              <span className="status-chip">
                <span />
                TODAY’S FORGE
              </span>
              <span className="week-chip">{data.plan.length || 0} DAY PLAN · {today?.intensity ?? "LIVE"}</span>
            </div>
            <div className="today-card-main">
              <div>
                <p className="eyebrow">{today ? `${today.day.toUpperCase()} · TODAY` : "NO SESSION SCHEDULED"}</p>
                <h2>{today?.title ?? "Recovery day"}</h2>
                <p>{today?.focus ?? "No active workout is assigned for today."}</p>
              </div>
              <div className="session-score">
                <strong>{String(data.completedLast28Days).padStart(2, "0")}</strong>
                <span>/ {data.expectedLast28Days || "—"}</span>
              </div>
            </div>
            <div className="workout-meta">
              <span><Clock3 size={15} /> {today?.duration ?? 0} min</span>
              <span><Dumbbell size={15} /> {today?.exercises.length ?? 0} exercises</span>
              <span><Target size={15} /> {totalSets} working sets</span>
            </div>
            <div className="today-footer">
              <Link className="button button-primary button-lg" href={today ? "/workout/today" : "/plan"}>
                {today ? "Start workout" : "View plan"}
                <ArrowRight size={18} />
              </Link>
              <div className="last-session">
                <span>LAST SESSION</span>
                <strong>
                  {data.recentSession
                    ? `${displayVolume(data.recentSession.volume, unit)} volume`
                    : "No completed sessions"}
                </strong>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="dashboard-stats">
          <StatCard icon={Flame} label="Current streak" value={String(data.streak)} suffix="sessions" delta="From completed scheduled days" tone="orange" />
          <StatCard icon={Dumbbell} label="Sessions" value={String(data.completedLast28Days)} suffix={`/ ${data.expectedLast28Days}`} delta={`${data.consistencyPercent}% consistency`} tone="lime" />
          <StatCard icon={TrendingUp} label="Weekly volume" value={compactNumber(kgToUnit(data.weeklyVolume, unit))} suffix={unit} delta={volumeDelta === null ? "No prior week yet" : `${volumeDelta >= 0 ? "+" : ""}${volumeDelta.toFixed(1)}% vs last week`} tone="blue" />
          <StatCard icon={Trophy} label="New records" value={String(data.recordsThisBlock)} suffix="PRs" delta="Last six weeks" tone="violet" />
        </div>

        <Panel className="week-panel">
          <PanelHeader
            eyebrow="WEEKLY RHYTHM"
            title="Your training week"
            action={<TextLink href="/plan">Full plan</TextLink>}
          />
          <div className="week-strip">
            {calendar.map((item) => {
              const active = item.active;
              const complete = item.complete;
              return (
                <Link
                  href={item.hasWorkout ? "/plan" : "/dashboard"}
                  className={`${active ? "active" : ""} ${complete ? "complete" : ""}`}
                  key={item.key}
                >
                  <span className="day-bubble">
                    {complete ? <Check size={14} /> : item.shortDay}
                  </span>
                  <strong>{item.day.slice(0, 3)}</strong>
                  <small>{item.title.split(" ")[0]}</small>
                  {active && <span className="today-label">TODAY</span>}
                </Link>
              );
            })}
          </div>
        </Panel>

        <Panel className="volume-panel">
          <PanelHeader
            eyebrow="LOAD TREND"
            title="Weekly volume"
            action={<span className="positive-delta">{volumeDelta === null ? "NEW" : `${volumeDelta >= 0 ? "↑" : "↓"} ${Math.abs(volumeDelta).toFixed(1)}%`}</span>}
          />
          <div className="chart-summary">
            <span><strong>{displayVolume(data.weeklyVolume, unit)}</strong> this week</span>
            <small>{displayVolume(data.previousWeeklyVolume, unit)} last week</small>
          </div>
          <VolumeChart compact data={data.volumeTrend.map((point) => convertVolumePoint(point, unit))} unit={unit} />
        </Panel>

        <Panel className="weight-panel">
          <PanelHeader
            eyebrow="LEAN GAIN"
            title="Body weight"
            action={<TextLink href="/body">Update</TextLink>}
          />
          <div className="weight-number">
            <strong>{displayWeight(data.currentWeightKg, unit).replace(` ${unit}`, "")}</strong>
            <span>{unit}</span>
            <small>{data.weightDelta === null ? "Add a measurement" : `${data.weightDelta >= 0 ? "+" : ""}${kgToUnit(data.weightDelta, unit).toFixed(1)} ${unit} tracked`}</small>
          </div>
          <WeightChart compact data={data.weightTrend.map((point) => ({ ...point, weight: Number(kgToUnit(point.weight, unit).toFixed(1)) }))} unit={unit} />
        </Panel>

        <CoachCard
          initialRecommendation={data.aiRecommendation}
          liveContext={{
            profile: data.profile,
            completedSessions: data.completedLast28Days,
            consistencyPercent: data.consistencyPercent,
            weeklyVolume: data.weeklyVolume,
            recentRecords: data.recentRecords.slice(0, 5),
            currentWorkout: today?.title ?? null,
          }}
        />

        <Panel className="recent-panel">
          <PanelHeader
            eyebrow="MOMENTUM"
            title="Recent records"
            action={<TextLink href="/records">All records</TextLink>}
          />
          <div className="record-list">
            {data.recentRecords.length > 0 ? (
              data.recentRecords.slice(0, 3).map((record, index) => (
                <div className="record-row" key={record.id}>
                  <span className="record-rank">0{index + 1}</span>
                  <span className="record-copy">
                    <strong>{record.exercise}</strong>
                    <small>{record.date}</small>
                  </span>
                  <span className="record-result">
                    <strong>{displayRecordResult(record.weightKg, record.reps, record.estimatedOneRepMax, unit)}</strong>
                    <small>{record.type}</small>
                  </span>
                  <ChevronRight size={16} />
                </div>
              ))
            ) : (
              <div className="inline-empty">
                <strong>No records yet</strong>
                <span>Complete sets close to your best effort and RepForge will surface new PRs here.</span>
              </div>
            )}
          </div>
        </Panel>

        <Panel className="next-panel">
          <div className="next-icon">
            <CalendarDays size={21} />
          </div>
          <div>
            <p className="eyebrow">UP NEXT</p>
            <h3>{nextWorkout?.title ?? "No next session"}</h3>
            <p>{nextWorkout?.focus ?? "Create an active workout plan"}</p>
          </div>
          <Link className="icon-button" href="/plan" aria-label="View plan">
            <ChevronRight size={18} />
          </Link>
        </Panel>

        <Panel className="quick-panel">
          <Link href="/workout/today">
            <span><TimerReset size={19} /></span>
            <strong>Quick log</strong>
            <small>Resume your latest set</small>
          </Link>
          <Link href="/progress">
            <span><Gauge size={19} /></span>
            <strong>Check progress</strong>
            <small>View strength trends</small>
          </Link>
          <Link href="/exercises">
            <span><Sparkles size={19} /></span>
            <strong>Find a variation</strong>
            <small>Browse your exercise catalog</small>
          </Link>
        </Panel>
      </div>
    </>
  );
}
