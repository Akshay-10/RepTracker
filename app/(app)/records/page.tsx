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
import { recentRecords } from "@/lib/data";
import { PageHeading, Panel, PanelHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Personal Records",
};

const records = [
  ...recentRecords,
  { exercise: "Wide-Grip Pulldown", result: "50 kg × 9", gain: "+3 reps", date: "Jun 18" },
  { exercise: "Seated DB Press", result: "18 kg × 10", gain: "+2 kg", date: "Jun 14" },
  { exercise: "EZ-Bar Curl", result: "22.5 kg × 11", gain: "+1 rep", date: "Jun 10" },
];

export default function RecordsPage() {
  return (
    <>
      <PageHeading
        eyebrow="PERSONAL RECORDS"
        title="New standards, set by you."
        copy="Best sets and estimated strength milestones from your logged training."
      />
      <div className="record-hero">
        <div className="record-hero-glow" />
        <span className="record-crown"><Crown size={28} /></span>
        <div>
          <span className="status-chip"><span /> LATEST PR · 3 DAYS AGO</span>
          <h2>Incline Dumbbell Press</h2>
          <p>24 kg × 10 reps · estimated 1RM 32.0 kg</p>
        </div>
        <div className="hero-record-number">
          <strong>+2</strong><span>REPS</span>
        </div>
      </div>

      <div className="record-stats">
        <div><Trophy size={20} /><span><small>Total PRs</small><strong>37</strong></span></div>
        <div><TrendingUp size={20} /><span><small>This block</small><strong>11</strong></span></div>
        <div><Medal size={20} /><span><small>Best month</small><strong>June</strong></span></div>
        <div><Sparkles size={20} /><span><small>Strongest trend</small><strong>RDL +21%</strong></span></div>
      </div>

      <Panel className="records-table-panel">
        <PanelHeader eyebrow="RECORD BOARD" title="All best sets" action={<button className="filter-button">All muscle groups</button>} />
        <div className="records-table">
          <div className="records-head"><span>EXERCISE</span><span>BEST SET</span><span>EST. 1RM</span><span>IMPROVEMENT</span><span>DATE</span><span /></div>
          {records.map((record, index) => (
            <div className="records-row" key={record.exercise}>
              <span className="record-exercise">
                <i><Dumbbell size={16} /></i>
                <span><strong>{record.exercise}</strong><small>{index % 2 ? "Pull" : "Push"} · Hypertrophy</small></span>
              </span>
              <strong>{record.result}</strong>
              <span>{["32.0 kg", "68.0 kg", "63.3 kg", "136.7 kg", "65.0 kg", "24.0 kg", "30.8 kg"][index]}</span>
              <span className="positive-delta">{record.gain}</span>
              <span>{record.date}</span>
              <ArrowUpRight size={15} />
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}
