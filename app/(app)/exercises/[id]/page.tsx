import type { Metadata } from "next";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Dumbbell,
  ShieldAlert,
  Sparkles,
  Target,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLibraryExercises } from "@/lib/data";
import { CoachTag, Panel, PanelHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Exercise Details",
};

export default async function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exercise = getLibraryExercises().find((item) => item.id === id);
  if (!exercise) notFound();

  return (
    <>
      <Link className="back-link" href="/exercises"><ArrowLeft size={15} /> Exercise library</Link>
      <div className="exercise-detail-hero">
        <div className="detail-visual">
          <Dumbbell size={64} strokeWidth={1} />
          <span>{exercise.equipment}</span>
        </div>
        <div className="detail-title">
          <p className="eyebrow">{exercise.movement.toUpperCase()} · {exercise.day.toUpperCase()}</p>
          <h1>{exercise.name}</h1>
          <p>{exercise.focus}. Built into your {exercise.dayTitle.toLowerCase()} session.</p>
          <div className="detail-tags">
            <span><Target size={14} /> {exercise.target}</span>
            <span><Dumbbell size={14} /> {exercise.equipment}</span>
            <span><Clock3 size={14} /> {exercise.rest}s rest</span>
          </div>
        </div>
        <div className="detail-prescription">
          <small>YOUR PRESCRIPTION</small>
          <strong>{exercise.sets} × {exercise.repMin}–{exercise.repMax}</strong>
          <span>{exercise.goal}</span>
        </div>
      </div>

      <div className="detail-grid">
        <Panel>
          <PanelHeader eyebrow="EXECUTION" title="Make every rep count" />
          <div className="tip-block good">
            <CheckCircle2 size={20} />
            <span><strong>Form cue</strong><p>{exercise.formTip}</p></span>
          </div>
          <div className="tip-block warning">
            <ShieldAlert size={20} />
            <span><strong>Common mistake</strong><p>{exercise.mistake}</p></span>
          </div>
          <div className="muscles-worked">
            <span><small>PRIMARY</small><strong>{exercise.target}</strong></span>
            <span><small>SECONDARY</small><strong>{exercise.secondary.join(", ") || "Stabilizers"}</strong></span>
          </div>
        </Panel>

        <Panel>
          <PanelHeader eyebrow="SMART SWAPS" title="Compatible variations" action={<CoachTag />} />
          <p className="panel-copy">Every option keeps the same movement intent while changing equipment, angle, or joint demand.</p>
          <div className="detail-variations">
            {exercise.variants.map((item, index) => (
              <div key={item.name}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span><strong>{item.name}</strong><small>{item.angle} · {item.equipment}</small></span>
                <em className={`stress stress-${item.jointStress}`}>{item.jointStress}</em>
              </div>
            ))}
          </div>
          <div className="ai-reason"><Sparkles size={16} /><p>{exercise.reason}</p></div>
        </Panel>
      </div>
    </>
  );
}
