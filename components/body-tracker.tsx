"use client";

import {
  Check,
  Plus,
  Ruler,
  Scale,
  Sparkles,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { WeightChart } from "@/components/charts";
import { PageHeading, Panel, PanelHeader } from "@/components/ui";
import type { LiveBodyMetric } from "@/lib/live-data";
import {
  displayWeight,
  kgToUnit,
  unitToKg,
  type WeightUnit,
} from "@/lib/units";
import { createClient } from "@/utils/supabase/client";

const measurementFields = [
  { key: "weight_kg", property: "weightKg", label: "Body weight", unit: "kg" },
  { key: "chest_cm", property: "chestCm", label: "Chest", unit: "cm" },
  { key: "waist_cm", property: "waistCm", label: "Waist", unit: "cm" },
  { key: "arm_cm", property: "armCm", label: "Arms", unit: "cm" },
  { key: "thigh_cm", property: "thighCm", label: "Thighs", unit: "cm" },
  { key: "shoulder_cm", property: "shoulderCm", label: "Shoulders", unit: "cm" },
] as const;

export function BodyTracker({
  metrics,
  weightTrend,
  weightUnit,
}: {
  metrics: LiveBodyMetric[];
  weightTrend: Array<{ date: string; weight: number }>;
  weightUnit: WeightUnit;
}) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const latest = metrics[0] ?? null;
  const oldest = metrics.at(-1) ?? null;
  const weightDelta =
    latest && oldest
      ? Number((latest.weightKg - oldest.weightKg).toFixed(2))
      : null;
  const displayedWeightTrend = weightTrend.map((point) => ({
    ...point,
    weight: Number(kgToUnit(point.weight, weightUnit).toFixed(1)),
  }));

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    const supabase = createClient();
    const { data: authData, error: authError } = await supabase.auth.getClaims();
    const userId = authData?.claims?.sub;
    if (authError || !userId) {
      setError("Your session expired. Please sign in again.");
      return;
    }

    const numericValue = (key: string) => {
      const value = String(formData.get(key) ?? "").trim();
      return value ? Number(value) : null;
    };
    const displayWeightValue = numericValue("weight_kg");
    const weightKg = displayWeightValue
      ? Number(unitToKg(displayWeightValue, weightUnit).toFixed(2))
      : null;
    if (!weightKg) {
      setError("Body weight is required.");
      return;
    }

    const payload = {
      user_id: userId,
      measured_on: new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Kolkata",
      }).format(new Date()),
      weight_kg: weightKg,
      chest_cm: numericValue("chest_cm"),
      waist_cm: numericValue("waist_cm"),
      arm_cm: numericValue("arm_cm"),
      thigh_cm: numericValue("thigh_cm"),
      shoulder_cm: numericValue("shoulder_cm"),
      notes: String(formData.get("notes") ?? "").trim() || null,
    };
    const { error: saveError } = await supabase
      .from("body_metrics")
      .upsert(payload, { onConflict: "user_id,measured_on" });
    if (saveError) {
      setError(saveError.message);
      return;
    }
    await supabase
      .from("profiles")
      .update({ current_weight_kg: weightKg, updated_at: new Date().toISOString() })
      .eq("id", userId);

    setSaved(true);
    window.setTimeout(() => {
      setModalOpen(false);
      setSaved(false);
      router.refresh();
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
          <span className="measure-line chest-line"><i />{latest?.chestCm?.toFixed(1) ?? "—"} cm <small>CHEST</small></span>
          <span className="measure-line waist-line"><i />{latest?.waistCm?.toFixed(1) ?? "—"} cm <small>WAIST</small></span>
          <span className="measure-line thigh-line"><i />{latest?.thighCm?.toFixed(1) ?? "—"} cm <small>THIGH</small></span>
        </div>
        <div className="body-summary-copy">
          <p className="eyebrow">CURRENT PHYSIQUE · {latest?.date ?? "NO MEASUREMENT"}</p>
          <h2>{displayWeight(latest?.weightKg, weightUnit).replace(` ${weightUnit}`, "")} <small>{weightUnit}</small></h2>
          <p>{weightDelta === null ? "Add at least two measurements to establish a trend." : `${weightDelta >= 0 ? "Up" : "Down"} ${Math.abs(kgToUnit(weightDelta, weightUnit)).toFixed(1)} ${weightUnit} across your saved measurements.`}</p>
          <div className="lean-rate">
            <Sparkles size={17} />
            <span><strong>{weightDelta === null ? "Baseline needed" : "Live trend"}</strong><small>Calculated only from saved body measurements.</small></span>
          </div>
          <div className="body-summary-nav">
            <span>Compared with <strong>{oldest?.date ?? "no baseline"}</strong></span>
          </div>
        </div>
      </div>

      <div className="metric-grid">
        {measurementFields.map((field, index) => {
          const current = latest?.[field.property];
          const initial = oldest?.[field.property];
          const unit = field.key === "weight_kg" ? weightUnit : field.unit;
          const delta =
            typeof current === "number" && typeof initial === "number"
              ? current - initial
              : null;
          const displayedCurrent =
            typeof current === "number" && field.key === "weight_kg"
              ? kgToUnit(current, weightUnit)
              : current;
          const displayedDelta =
            typeof delta === "number" && field.key === "weight_kg"
              ? kgToUnit(delta, weightUnit)
              : delta;
          return <article key={field.key}>
            <span className="metric-icon">{index === 0 ? <Scale size={17} /> : <Ruler size={17} />}</span>
            <small>{field.label}</small>
            <strong>{typeof displayedCurrent === "number" ? displayedCurrent.toFixed(1) : "—"} <em>{unit}</em></strong>
            <span>{displayedDelta === null ? "No comparison" : `${displayedDelta >= 0 ? "+" : ""}${displayedDelta.toFixed(1)} ${unit}`}</span>
          </article>;
        })}
      </div>

      <div className="body-grid body-grid-single">
        <Panel>
          <PanelHeader eyebrow="WEIGHT TREND" title="Slow gain, strong signal" />
          <WeightChart data={displayedWeightTrend} unit={weightUnit} />
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
                <div>
                  <p className="eyebrow">
                    TODAY · {new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", timeZone: "Asia/Kolkata" }).format(new Date()).toUpperCase()}
                  </p>
                  <h2>New measurement</h2>
                </div>
                <button type="button" className="icon-button" onClick={() => setModalOpen(false)}><X size={19} /></button>
              </div>
              <div className="measure-form-grid">
                {measurementFields.map((field, index) => (
                  <label key={field.key} className={index === 0 ? "wide" : ""}>
                    <span>{field.label}</span>
                    <div><input name={field.key} type="number" step="0.1" defaultValue={field.key === "weight_kg" && typeof latest?.weightKg === "number" ? kgToUnit(latest.weightKg, weightUnit).toFixed(1) : latest?.[field.property] ?? ""} required={index === 0} /><em>{field.key === "weight_kg" ? weightUnit : field.unit}</em></div>
                  </label>
                ))}
              </div>
              <label className="notes-field"><span>Notes (optional)</span><textarea name="notes" defaultValue={latest?.notes ?? ""} placeholder="Sleep, appetite, how you feel…" /></label>
              {error && <p className="auth-message error" role="alert">{error}</p>}
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
