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
import { fullWeek, getTodayWorkout, recentRecords } from "@/lib/data";
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

export function DashboardContent() {
  const today = getTodayWorkout();
  const totalSets = today.exercises.reduce((sum, item) => sum + item.sets, 0);

  return (
    <>
      <div className="dashboard-welcome">
        <div>
          <div className="welcome-inline">
            <p className="eyebrow">GOOD MORNING, AKSHAY</p>
            <StreakBadge />
          </div>
          <h1>Ready to <em>forge</em> progress?</h1>
          <p className="page-copy">
            Week 4 of your hypertrophy block. You’re 2 sessions away from your most
            consistent month yet.
          </p>
        </div>
        <div className="readiness">
          <ProgressRing value={86} size={74} label="86" sublabel="READY" />
          <span>
            <strong>High readiness</strong>
            <small>Sleep and volume look good</small>
          </span>
        </div>
      </div>

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
              <span className="week-chip">WEEK 4 · BUILD</span>
            </div>
            <div className="today-card-main">
              <div>
                <p className="eyebrow">{today.day.toUpperCase()} · SESSION 01</p>
                <h2>{today.title}</h2>
                <p>{today.focus}</p>
              </div>
              <div className="session-score">
                <strong>01</strong>
                <span>/ 06</span>
              </div>
            </div>
            <div className="workout-meta">
              <span><Clock3 size={15} /> {today.duration} min</span>
              <span><Dumbbell size={15} /> {today.exercises.length} exercises</span>
              <span><Target size={15} /> {totalSets} working sets</span>
            </div>
            <div className="today-footer">
              <Link className="button button-primary button-lg" href="/workout/today">
                Start workout
                <ArrowRight size={18} />
              </Link>
              <div className="last-session">
                <span>LAST SESSION</span>
                <strong>8,940 kg volume</strong>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="dashboard-stats">
          <StatCard icon={Flame} label="Current streak" value="18" suffix="days" delta="Personal best" tone="orange" />
          <StatCard icon={Dumbbell} label="Sessions" value="22" suffix="/ 24" delta="92% consistency" tone="lime" />
          <StatCard icon={TrendingUp} label="Weekly volume" value="10.8k" suffix="kg" delta="+5.3% vs last week" tone="blue" />
          <StatCard icon={Trophy} label="New records" value="4" suffix="PRs" delta="This training block" tone="violet" />
        </div>

        <Panel className="week-panel">
          <PanelHeader
            eyebrow="WEEKLY RHYTHM"
            title="Your training week"
            action={<TextLink href="/plan">Full plan</TextLink>}
          />
          <div className="week-strip">
            {fullWeek.map((item, index) => {
              const active = index === 0;
              const complete = index > 0 && index < 6;
              return (
                <Link
                  href={item.exercises.length ? "/workout/today" : "/dashboard"}
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
            action={<span className="positive-delta">↑ 5.3%</span>}
          />
          <div className="chart-summary">
            <span><strong>10,780</strong> kg this week</span>
            <small>Target 11,200 kg</small>
          </div>
          <VolumeChart compact />
        </Panel>

        <Panel className="weight-panel">
          <PanelHeader
            eyebrow="LEAN GAIN"
            title="Body weight"
            action={<TextLink href="/body">Update</TextLink>}
          />
          <div className="weight-number">
            <strong>63.0</strong>
            <span>kg</span>
            <small>+0.2 this week</small>
          </div>
          <WeightChart compact />
        </Panel>

        <CoachCard />

        <Panel className="recent-panel">
          <PanelHeader
            eyebrow="MOMENTUM"
            title="Recent records"
            action={<TextLink href="/records">All records</TextLink>}
          />
          <div className="record-list">
            {recentRecords.slice(0, 3).map((record, index) => (
              <div className="record-row" key={record.exercise}>
                <span className="record-rank">0{index + 1}</span>
                <span className="record-copy">
                  <strong>{record.exercise}</strong>
                  <small>{record.date}</small>
                </span>
                <span className="record-result">
                  <strong>{record.result}</strong>
                  <small>{record.gain}</small>
                </span>
                <ChevronRight size={16} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="next-panel">
          <div className="next-icon">
            <CalendarDays size={21} />
          </div>
          <div>
            <p className="eyebrow">UP NEXT</p>
            <h3>Back + Biceps</h3>
            <p>Tomorrow · Lat width and back thickness</p>
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
            <small>Browse 60+ movements</small>
          </Link>
        </Panel>
      </div>
    </>
  );
}
