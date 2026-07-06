import type { Metadata } from "next";
import {
  Activity,
  ArrowUpRight,
  CalendarCheck2,
  Dumbbell,
  Flame,
  Trophy,
} from "lucide-react";
import { consistency, recentRecords } from "@/lib/data";
import {
  MuscleVolumeChart,
  StrengthChart,
  VolumeChart,
  WeightChart,
} from "@/components/charts";
import { PageHeading, Panel, PanelHeader, StatCard } from "@/components/ui";

export const metadata: Metadata = {
  title: "Progress",
};

export default function ProgressPage() {
  return (
    <>
      <PageHeading
        eyebrow="PROGRESS ANALYTICS"
        title="The work is showing."
        copy="Clear trends, useful comparisons, and no vanity metrics."
        actions={
          <select className="select-control" defaultValue="6-weeks" aria-label="Chart date range">
            <option value="6-weeks">Last 6 weeks</option>
            <option value="3-months">Last 3 months</option>
            <option value="year">This year</option>
          </select>
        }
      />

      <div className="progress-stats">
        <StatCard icon={Dumbbell} label="Total volume" value="58.3k" suffix="kg" delta="+12.4% this block" tone="lime" />
        <StatCard icon={CalendarCheck2} label="Consistency" value="92" suffix="%" delta="22 of 24 sessions" tone="blue" />
        <StatCard icon={Trophy} label="Personal records" value="11" suffix="PRs" delta="4 in the last 14 days" tone="violet" />
        <StatCard icon={Flame} label="Longest streak" value="18" suffix="days" delta="Current streak" tone="orange" />
      </div>

      <div className="analytics-grid">
        <Panel className="strength-panel">
          <PanelHeader
            eyebrow="STRENGTH TREND"
            title="Key lifts are moving"
            action={<span className="positive-delta">↑ 14.8% block average</span>}
          />
          <div className="chart-legend">
            <span><i className="lime" /> Incline press</span>
            <span><i className="blue" /> Cable row</span>
            <span><i className="orange" /> RDL</span>
          </div>
          <StrengthChart />
        </Panel>

        <Panel className="muscle-panel">
          <PanelHeader eyebrow="VOLUME DISTRIBUTION" title="Sets by muscle" />
          <MuscleVolumeChart />
          <div className="volume-callout">
            <Activity size={17} />
            <span><strong>Balanced overall</strong><small>Add 1 core set on Saturday to meet target.</small></span>
          </div>
        </Panel>

        <Panel>
          <PanelHeader eyebrow="TONNAGE" title="Weekly volume" />
          <VolumeChart />
        </Panel>

        <Panel>
          <PanelHeader eyebrow="BODY WEIGHT" title="Lean gain pace" action={<span className="positive-delta">+1.3 kg</span>} />
          <WeightChart />
        </Panel>

        <Panel className="consistency-panel">
          <PanelHeader eyebrow="CONSISTENCY" title="35-day training rhythm" />
          <div className="consistency-grid">
            {consistency.map((value, index) => (
              <span className={value ? `level-${(index % 3) + 1}` : ""} key={index} title={value ? "Workout completed" : "Rest or missed"} />
            ))}
          </div>
          <div className="consistency-footer">
            <span><strong>31</strong><small>sessions completed</small></span>
            <span><strong>4</strong><small>rest / missed</small></span>
            <span><strong>88%</strong><small>rolling consistency</small></span>
          </div>
        </Panel>

        <Panel className="progress-records">
          <PanelHeader eyebrow="LATEST WINS" title="Recent personal records" />
          {recentRecords.map((record) => (
            <div className="progress-record" key={record.exercise}>
              <span><Trophy size={16} /></span>
              <span><strong>{record.exercise}</strong><small>{record.date}</small></span>
              <span><strong>{record.result}</strong><small>{record.gain}</small></span>
              <ArrowUpRight size={15} />
            </div>
          ))}
        </Panel>
      </div>
    </>
  );
}
