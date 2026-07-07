import type { Metadata } from "next";
import {
  ArrowUpRight,
  Crown,
  Dumbbell,
  Medal,
  Sparkles,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { EmptyState, PageHeading, Panel, PanelHeader } from "@/components/ui";
import { getViewer } from "@/lib/auth";
import { getLiveSnapshot } from "@/lib/live-data";
import { displayRecordResult, displayWeight } from "@/lib/units";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Personal Records",
};

export default async function RecordsPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  const data = await getLiveSnapshot(viewer.id);
  const unit = data.preferences.units;
  const records = data.recentRecords;
  const latest = records[0];

  return (
    <>
      <PageHeading
        eyebrow="PERSONAL RECORDS"
        title="New standards, set by you."
        copy="Best sets and estimated strength milestones from your logged training."
      />
      {latest ? (
        <div className="record-hero">
          <div className="record-hero-glow" />
          <span className="record-crown"><Crown size={28} /></span>
          <div>
            <span className="status-chip"><span /> LATEST PR · {latest.date.toUpperCase()}</span>
            <h2>{latest.exercise}</h2>
            <p>{displayRecordResult(latest.weightKg, latest.reps, latest.estimatedOneRepMax, unit)} · estimated 1RM {displayWeight(latest.estimatedOneRepMax, unit)}</p>
          </div>
          <div className="hero-record-number">
            <strong>{data.totalRecords}</strong><span>TOTAL PRS</span>
          </div>
        </div>
      ) : (
        <Panel><EmptyState title="No records yet" copy="Personal records will appear after completed sets establish a new best." /></Panel>
      )}

      <div className="record-stats">
        <div><Trophy size={20} /><span><small>Total PRs</small><strong>{data.totalRecords}</strong></span></div>
        <div><TrendingUp size={20} /><span><small>Last six weeks</small><strong>{data.recordsThisBlock}</strong></span></div>
        <div><Medal size={20} /><span><small>Tracked exercises</small><strong>{new Set(records.map((record) => record.exercise)).size}</strong></span></div>
        <div><Sparkles size={20} /><span><small>Latest record</small><strong>{latest?.date ?? "—"}</strong></span></div>
      </div>

      <Panel className="records-table-panel">
        <PanelHeader eyebrow="RECORD BOARD" title="Recent best sets" />
        <div className="records-table">
          <div className="records-head"><span>EXERCISE</span><span>BEST SET</span><span>EST. 1RM</span><span>IMPROVEMENT</span><span>DATE</span><span /></div>
          {records.map((record) => (
            <div className="records-row" key={record.id}>
              <span className="record-exercise">
                <i><Dumbbell size={16} /></i>
                <span><strong>{record.exercise}</strong><small>{record.type}</small></span>
              </span>
              <strong>{displayRecordResult(record.weightKg, record.reps, record.estimatedOneRepMax, unit)}</strong>
              <span>{displayWeight(record.estimatedOneRepMax, unit)}</span>
              <span className="positive-delta">{record.type}</span>
              <span>{record.date}</span>
              <ArrowUpRight size={15} />
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}
