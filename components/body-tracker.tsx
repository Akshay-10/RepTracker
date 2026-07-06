"use client";

import {
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Ruler,
  Scale,
  Sparkles,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { bodyMetrics } from "@/lib/data";
import { WeightChart } from "@/components/charts";
import { PageHeading, Panel, PanelHeader } from "@/components/ui";

export function BodyTracker() {
  const [modalOpen, setModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => {
      setModalOpen(false);
      setSaved(false);
    }, 800);
  };

  return (
    <>
      <PageHeading
        eyebrow="BODY TRACKING"
        title="Measure the trend, not the day."
        copy="Calm, monthly signals for a lean muscle-building goal."
        actions={
          <button className="button button-primary" onClick={() => setModalOpen(true)}>
            <Plus size={17} /> Add measurement
          </button>
        }
      />

      <div className="body-summary">
        <div className="body-silhouette" aria-hidden="true">
          <div className="silhouette-head" />
          <div className="silhouette-body" />
          <span className="measure-line chest-line"><i />94.5 cm <small>CHEST</small></span>
          <span className="measure-line waist-line"><i />76.0 cm <small>WAIST</small></span>
          <span className="measure-line thigh-line"><i />53.4 cm <small>THIGH</small></span>
        </div>
        <div className="body-summary-copy">
          <p className="eyebrow">CURRENT PHYSIQUE · JUL 2026</p>
          <h2>63.0 <small>kg</small></h2>
          <p>Up 1.3 kg over 6 weeks at a steady lean-gain pace.</p>
          <div className="lean-rate">
            <Sparkles size={17} />
            <span><strong>On target</strong><small>+0.22 kg per week · goal range 0.15–0.30</small></span>
          </div>
          <div className="body-summary-nav">
            <button aria-label="Previous month"><ChevronLeft size={17} /></button>
            <span>Compared with <strong>May 25</strong></span>
            <button aria-label="Next month" disabled><ChevronRight size={17} /></button>
          </div>
        </div>
      </div>

      <div className="metric-grid">
        {bodyMetrics.map((metric, index) => (
          <article key={metric.label}>
            <span className="metric-icon">{index === 0 ? <Scale size={17} /> : <Ruler size={17} />}</span>
            <small>{metric.label}</small>
            <strong>{metric.value} <em>{metric.unit}</em></strong>
            <span>{metric.delta}</span>
          </article>
        ))}
      </div>

      <div className="body-grid">
        <Panel>
          <PanelHeader eyebrow="WEIGHT TREND" title="Slow gain, strong signal" />
          <WeightChart />
        </Panel>
        <Panel className="photo-panel">
          <PanelHeader eyebrow="PROGRESS PHOTOS" title="Monthly check-in" />
          <div className="photo-grid">
            <button><Camera size={24} /><span>Front</span><small>Add photo</small></button>
            <button><Camera size={24} /><span>Side</span><small>Add photo</small></button>
            <button><Camera size={24} /><span>Back</span><small>Add photo</small></button>
          </div>
          <p>Photos stay private and are never sent to the AI coach.</p>
        </Panel>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.button
              className="modal-backdrop"
              onClick={() => setModalOpen(false)}
              aria-label="Close form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.form
              className="metric-modal"
              onSubmit={save}
              initial={{ opacity: 0, y: 25, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 25, scale: 0.97 }}
            >
              <div className="modal-head">
                <div><p className="eyebrow">TODAY · 06 JUL</p><h2>New measurement</h2></div>
                <button type="button" className="icon-button" onClick={() => setModalOpen(false)}><X size={19} /></button>
              </div>
              <div className="measure-form-grid">
                {bodyMetrics.map((metric, index) => (
                  <label key={metric.label} className={index === 0 ? "wide" : ""}>
                    <span>{metric.label}</span>
                    <div><input type="number" step="0.1" defaultValue={metric.value} /><em>{metric.unit}</em></div>
                  </label>
                ))}
              </div>
              <label className="notes-field"><span>Notes (optional)</span><textarea placeholder="Sleep, appetite, how you feel…" /></label>
              <button className="button button-primary full-button" type="submit">
                {saved ? <><Check size={17} /> Saved</> : "Save measurement"}
              </button>
            </motion.form>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
