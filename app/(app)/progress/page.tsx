import type { Metadata } from "next";
import {
  Activity,
  ArrowUpRight,
  CalendarCheck2,
  Dumbbell,
  Flame,
  Trophy,
} from "lucide-react";
import {
  MuscleVolumeChart,
  StrengthChart,
  VolumeChart,
  WeightChart,
} from "@/components/charts";
import { PageHeading, Panel, PanelHeader, StatCard } from "@/components/ui";
import { getViewer } from "@/lib/auth";
import { getLiveSnapshot } from "@/lib/live-data";
import {
  convertVolumePoint,
  displayRecordResult,
  displayVolume,
  kgToUnit,
} from "@/lib/units";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Progress",
};

export default async function ProgressPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  const data = await getLiveSnapshot(viewer.id);
  const unit = data.preferences.units;
  const completedConsistencyDays = data.consistencyDays.filter(
    (day) => day.completed,
  ).length;
  const displayedVolumeTrend = data.volumeTrend.map((point) =>
    convertVolumePoint(point, unit),
  );
  const displayedWeightTrend = data.weightTrend.map((point) => ({
    ...point,
    weight: Number(kgToUnit(point.weight, unit).toFixed(1)),
  }));
  const displayedStrengthTrend = data.strengthTrend.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => [
        key,
        key === "month" || typeof value !== "number"
          ? value
          : Number(kgToUnit(value, unit).toFixed(1)),
      ]),
    ),
  );

  return (
    <>
      <PageHeading
        eyebrow="PROGRESS ANALYTICS"
        title="The work is showing."
        copy="Clear trends, useful comparisons, and no vanity metrics."
        actions={<span className="source-pill ai">Live Supabase</span>}
      />

      <div className="progress-stats">
        <StatCard icon={Dumbbell} label="Weekly volume" value={Math.round(kgToUnit(data.weeklyVolume, unit)).toLocaleString()} suffix={unit} delta={`${displayVolume(data.previousWeeklyVolume, unit)} last week`} tone="lime" />
        <StatCard icon={CalendarCheck2} label="Consistency" value={String(data.consistencyPercent)} suffix="%" delta={`${data.completedLast28Days} of ${data.expectedLast28Days} sessions`} tone="blue" />
        <StatCard icon={Trophy} label="Personal records" value={String(data.recentRecords.length)} suffix="recent" delta={`${data.recordsThisBlock} in six weeks`} tone="violet" />
        <StatCard icon={Flame} label="Current streak" value={String(data.streak)} suffix="sessions" delta="Scheduled days completed" tone="orange" />
      </div>

      <div className="analytics-grid">
        <Panel className="strength-panel">
          <PanelHeader
            eyebrow="STRENGTH TREND"
            title="Key lifts are moving"
            action={<span className="positive-delta">{data.strengthSeries.length} TRACKED LIFTS</span>}
          />
          <div className="chart-legend">
            {data.strengthSeries.map((series, index) => (
              <span key={series}><i className={index === 1 ? "blue" : index === 2 ? "orange" : "lime"} /> {series}</span>
            ))}
          </div>
          <StrengthChart data={displayedStrengthTrend} series={data.strengthSeries} unit={unit} />
        </Panel>

        <Panel className="muscle-panel">
          <PanelHeader eyebrow="VOLUME DISTRIBUTION" title="Sets by muscle" />
          <MuscleVolumeChart data={data.muscleVolume} />
          <div className="volume-callout">
            <Activity size={17} />
            <span><strong>{data.muscleVolume.length} muscle groups logged</strong><small>Counts include completed sets from the current week.</small></span>
          </div>
        </Panel>

        <Panel>
          <PanelHeader eyebrow="TONNAGE" title="Weekly volume" />
          <VolumeChart data={displayedVolumeTrend} unit={unit} />
        </Panel>

        <Panel>
          <PanelHeader eyebrow="BODY WEIGHT" title="Tracked weight trend" action={<span className="positive-delta">{data.weightDelta === null ? "NO BASELINE" : `${data.weightDelta >= 0 ? "+" : ""}${kgToUnit(data.weightDelta, unit).toFixed(1)} ${unit}`}</span>} />
          <WeightChart data={displayedWeightTrend} unit={unit} />
        </Panel>

        <Panel className="consistency-panel">
          <PanelHeader eyebrow="CONSISTENCY" title="35-day training rhythm" />
          <div className="consistency-grid">
            {data.consistencyDays.map((day, index) => (
              <span className={day.completed ? `level-${(index % 3) + 1}` : ""} key={day.date} title={day.completed ? `Workout completed ${day.date}` : `No completed workout ${day.date}`} />
            ))}
          </div>
          <div className="consistency-footer">
            <span><strong>{completedConsistencyDays}</strong><small>sessions completed</small></span>
            <span><strong>{data.consistencyDays.length - completedConsistencyDays}</strong><small>rest / missed</small></span>
            <span><strong>{Math.round((completedConsistencyDays / Math.max(data.consistencyDays.length, 1)) * 100)}%</strong><small>35-day completion rate</small></span>
          </div>
        </Panel>

        <Panel className="progress-records">
          <PanelHeader eyebrow="LATEST WINS" title="Recent personal records" />
          {data.recentRecords.slice(0, 4).map((record) => (
            <div className="progress-record" key={record.id}>
              <span><Trophy size={16} /></span>
              <span><strong>{record.exercise}</strong><small>{record.date}</small></span>
              <span><strong>{displayRecordResult(record.weightKg, record.reps, record.estimatedOneRepMax, unit)}</strong><small>{record.type}</small></span>
              <ArrowUpRight size={15} />
            </div>
          ))}
        </Panel>
      </div>
    </>
  );
}
