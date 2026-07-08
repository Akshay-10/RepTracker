"use client";

import {
  Bell,
  BrainCircuit,
  Check,
  ChevronRight,
  Download,
  Dumbbell,
  Gauge,
  HeartPulse,
  Moon,
  Palette,
  RotateCcw,
  Ruler,
  Shield,
  SlidersHorizontal,
  Sparkles,
  Timer,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CoachTag, PageHeading, Panel, PanelHeader, SettingRow } from "@/components/ui";
import type { LiveSnapshot } from "@/lib/live-data";
import {
  displayWeightValue,
  kgToUnit,
  normalizeWeightUnit,
  unitToKg,
  type WeightUnit,
} from "@/lib/units";
import { createClient } from "@/utils/supabase/client";

function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      className={`toggle ${value ? "on" : ""}`}
      onClick={() => onChange(!value)}
      aria-label={value ? "Disable setting" : "Enable setting"}
      aria-pressed={value}
    >
      <span />
    </button>
  );
}

export function SettingsContent({
  data,
  email,
}: {
  data: LiveSnapshot;
  email: string;
}) {
  const router = useRouter();
  const [aiMode, setAiMode] = useState(data.preferences.aiUsageMode);
  const [variationMode, setVariationMode] = useState(
    data.preferences.variationMode,
  );
  const [name, setName] = useState(data.profile.name);
  const [age, setAge] = useState(data.profile.age?.toString() ?? "");
  const [height, setHeight] = useState(
    data.profile.heightCm?.toString() ?? "",
  );
  const [weight, setWeight] = useState(
    displayWeightValue(data.currentWeightKg, data.preferences.units),
  );
  const [units, setUnits] = useState<WeightUnit>(
    normalizeWeightUnit(data.preferences.units),
  );
  const [goal, setGoal] = useState(data.profile.goal);
  const [duration, setDuration] = useState(data.profile.workoutDuration);
  const [warmup, setWarmup] = useState(data.preferences.includeWarmup);
  const [autoRest, setAutoRest] = useState(
    data.preferences.autoStartRestTimer,
  );
  const [restSound, setRestSound] = useState(
    data.preferences.restTimerSound,
  );
  const [theme, setTheme] = useState(data.preferences.theme);
  const [preferredEquipment, setPreferredEquipment] = useState(
    data.preferences.preferredEquipment.join(", "),
  );
  const [exercisesToAvoid, setExercisesToAvoid] = useState(
    data.preferences.exercisesToAvoid.join(", "),
  );
  const [injuriesOrPain, setInjuriesOrPain] = useState(
    data.preferences.injuriesOrPain.join(", "),
  );
  const [weakMuscles, setWeakMuscles] = useState(
    data.preferences.weakMuscles.join(", "),
  );
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const initials =
    data.profile.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "RF";
  const hasAdvancedVariationPreferences = [
    data.preferences.preferredEquipment,
    data.preferences.exercisesToAvoid,
    data.preferences.injuriesOrPain,
    data.preferences.weakMuscles,
  ].some((items) => items.length > 0);

  const changeUnits = (nextUnit: WeightUnit) => {
    if (nextUnit === units) return;
    setWeight((current) => {
      const parsed = Number(current);
      if (!current || !Number.isFinite(parsed)) return current;
      return kgToUnit(unitToKg(parsed, units), nextUnit).toFixed(1);
    });
    setUnits(nextUnit);
  };

  const listFromText = (value: string) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

  const saveChanges = async () => {
    setError("");
    const supabase = createClient();
    const { data: authData } = await supabase.auth.getClaims();
    const userId = authData?.claims?.sub;
    if (!userId) {
      setError("Your session expired. Please sign in again.");
      return;
    }
    const parsedWeight = weight ? Number(weight) : null;
    if (parsedWeight !== null && !Number.isFinite(parsedWeight)) {
      setError("Enter a valid current weight.");
      return;
    }

    const [profileResult, preferencesResult] = await Promise.all([
      supabase
        .from("profiles")
        .update({
          name,
          age: age ? Number(age) : null,
          height_cm: height ? Number(height) : null,
          current_weight_kg: parsedWeight
            ? Number(unitToKg(parsedWeight, units).toFixed(2))
            : null,
          goal,
          workout_duration_minutes: duration,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId),
      supabase.from("user_preferences").upsert({
        user_id: userId,
        units,
        theme,
        variation_mode: variationMode,
        ai_usage_mode: aiMode,
        include_pushup_pullup_warmup: warmup,
        auto_start_rest_timer: autoRest,
        rest_timer_sound: restSound,
        preferred_equipment: listFromText(preferredEquipment),
        exercises_to_avoid: listFromText(exercisesToAvoid),
        injuries_or_pain: listFromText(injuriesOrPain),
        weak_muscles: listFromText(weakMuscles),
        updated_at: new Date().toISOString(),
      }),
    ]);

    const saveError = profileResult.error || preferencesResult.error;
    if (saveError) {
      setError(saveError.message);
      return;
    }
    const appliedTheme =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark"
        : theme;
    localStorage.setItem("repforge-theme", appliedTheme);
    document.documentElement.dataset.theme = appliedTheme;
    setSaved(true);
    router.refresh();
    window.setTimeout(() => setSaved(false), 1500);
  };

  const exportData = () => {
    const rows: Array<Array<string | number>> = [
      ["section", "date_or_day", "item", "value", "detail"],
      ...data.plan.flatMap((day) =>
        day.exercises.map((exercise) => [
          "plan",
          day.day,
          exercise.name,
          `${exercise.sets}x${exercise.repMin}-${exercise.repMax}`,
          exercise.equipment,
        ]),
      ),
      ...data.bodyMetrics.map((metric) => [
        "body",
        metric.date,
        "weight_kg",
        metric.weightKg,
        metric.notes,
      ]),
      ...data.recentRecords.map((record) => [
        "record",
        record.date,
        record.exercise,
        record.result,
        record.type,
      ]),
    ];
    const escapeCell = (value: string | number) =>
      `"${String(value).replaceAll('"', '""')}"`;
    const csv = rows.map((row) => row.map(escapeCell).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `repforge-export-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setActionMessage("Live training export downloaded.");
  };

  const resetPlan = async () => {
    if (!window.confirm("Replace your current plan with a fresh six-day plan? Logged sessions stay intact.")) {
      return;
    }
    setActionMessage("Resetting plan…");
    const supabase = createClient();
    const { error: resetError } = await supabase.rpc("create_default_workout_plan");
    if (resetError) {
      setActionMessage(resetError.message);
      return;
    }
    setActionMessage("Workout plan reset from the live exercise catalog.");
    router.refresh();
  };

  return (
    <>
      <PageHeading
        eyebrow="PREFERENCES"
        title="Make RepForge yours."
        copy="Tune the training experience while keeping the defaults sensible."
        actions={
          <button
            className="button button-primary"
            onClick={saveChanges}
          >
            {saved ? <><Check size={17} /> Saved</> : "Save changes"}
          </button>
        }
      />
      <div className="settings-layout">
        <nav className="settings-nav">
          {[
            ["Profile", UserRound],
            ["Training", Dumbbell],
            ["Variations", SlidersHorizontal],
            ["AI coach", BrainCircuit],
            ["Appearance", Palette],
            ["Data & privacy", Shield],
          ].map(([label, Icon], index) => {
            const NavIcon = Icon as typeof UserRound;
            return (
              <a className={index === 0 ? "active" : ""} href={`#${String(label).toLowerCase().replaceAll(" ", "-")}`} key={String(label)}>
                <NavIcon size={17} /> {String(label)} <ChevronRight size={15} />
              </a>
            );
          })}
        </nav>

        <div className="settings-panels">
          <Panel id="profile">
            <PanelHeader eyebrow="PROFILE" title="Your training baseline" />
            <div className="profile-row">
              <span className="profile-avatar">{initials}</span>
              <span><strong>{data.profile.name}</strong><small>{email} · {data.profile.experienceLevel}</small></span>
              <span className="source-pill ai">Live profile</span>
            </div>
            <div className="profile-data">
              <label><span>Name</span><input value={name} onChange={(event) => setName(event.target.value)} /></label>
              <label><span>Age</span><input value={age} onChange={(event) => setAge(event.target.value)} inputMode="numeric" /></label>
              <label><span>Height</span><div><input value={height} onChange={(event) => setHeight(event.target.value)} inputMode="decimal" /><em>cm</em></div></label>
              <label><span>Current weight</span><div><input value={weight} onChange={(event) => setWeight(event.target.value)} inputMode="decimal" /><em>{units}</em></div></label>
              <label><span>Primary goal</span><select value={goal} onChange={(event) => setGoal(event.target.value)}><option value="muscle_gain">Muscle gain</option><option value="strength">Strength</option><option value="fat_loss">Fat loss</option><option value="recomposition">Recomposition</option></select></label>
            </div>
            {error && <p className="auth-message error" role="alert">{error}</p>}
          </Panel>

          <Panel id="training">
            <PanelHeader eyebrow="TRAINING" title="Workout defaults" />
            <div className="settings-list">
              <SettingRow icon={Timer} label="Workout duration" copy="Hard cap for plan generation" control={<select value={duration} onChange={(event) => setDuration(Number(event.target.value))}><option value="60">60 min</option><option value="75">75 min</option><option value="90">90 min</option></select>} />
              <SettingRow
                icon={Ruler}
                label="Units"
                copy="Show workout and body values in your preferred unit; RepForge stores kg internally for accurate calculations."
                control={
                  <select
                    value={units}
                    onChange={(event) =>
                      changeUnits(normalizeWeightUnit(event.target.value))
                    }
                  >
                    <option value="kg">Kilograms</option>
                    <option value="lb">Pounds</option>
                  </select>
                }
              />
              <SettingRow icon={HeartPulse} label="Warm-up primer" copy="Include push-ups and pull-ups without fatigue" control={<Toggle value={warmup} onChange={setWarmup} />} />
              <SettingRow icon={Gauge} label="Auto-start rest timer" copy="Starts as soon as a set is completed" control={<Toggle value={autoRest} onChange={setAutoRest} />} />
            </div>
          </Panel>

          <Panel id="variations">
            <PanelHeader eyebrow="VARIATION ENGINE" title="Control how your plan rotates" action={<CoachTag>LOCAL FIRST</CoachTag>} />
            <div className="choice-cards three">
              {[
                ["stable", "Mainly repeat the same plan"],
                ["moderate", "30–40% accessories rotate"],
                ["high", "More frequent angle changes"],
              ].map(([label, copy]) => (
                <button className={variationMode === label ? "active" : ""} onClick={() => setVariationMode(label)} key={label}>
                  <span className="choice-check">{variationMode === label && <Check size={12} />}</span>
                  <strong>{label[0].toUpperCase() + label.slice(1)}</strong><small>{copy}</small>
                  {label === "moderate" && <em>RECOMMENDED</em>}
                </button>
              ))}
            </div>
            <details className="advanced-details" open={hasAdvancedVariationPreferences}>
              <summary>
                <span>
                  <strong>Advanced variation constraints</strong>
                  <small>Equipment, avoid list, pain notes, and weak-point priorities.</small>
                </span>
                <ChevronRight size={16} />
              </summary>
              <div className="preference-fields">
                <label>
                  <span><Dumbbell size={15} /> Available equipment</span>
                  <textarea value={preferredEquipment} onChange={(event) => setPreferredEquipment(event.target.value)} placeholder="Dumbbells, Cable, Machine" />
                  <small>Comma-separated. Used by smart swaps and AI context.</small>
                </label>
                <label>
                  <span><Shield size={15} /> Exercises to avoid</span>
                  <textarea value={exercisesToAvoid} onChange={(event) => setExercisesToAvoid(event.target.value)} placeholder="Skull Crusher, Barbell Squat" />
                  <small>RepForge avoids matching these when suggesting variations.</small>
                </label>
                <label>
                  <span><HeartPulse size={15} /> Pain or injury notes</span>
                  <textarea value={injuriesOrPain} onChange={(event) => setInjuriesOrPain(event.target.value)} placeholder="Right shoulder pain, knee irritation" />
                  <small>AI and the local engine treat these as safety constraints.</small>
                </label>
                <label>
                  <span><Sparkles size={15} /> Weak-point priority</span>
                  <textarea value={weakMuscles} onChange={(event) => setWeakMuscles(event.target.value)} placeholder="Upper chest, side delts, hamstrings" />
                  <small>Used as coaching context and future plan tuning signal.</small>
                </label>
              </div>
            </details>
          </Panel>

          <Panel id="ai-coach">
            <PanelHeader eyebrow="FORGE AI" title="Coaching, on your terms" action={<CoachTag />} />
            <p className="panel-copy">
              AI receives compact summaries, never your full raw history. The local engine
              handles timers, calculations, PRs, and standard exercise swaps.
            </p>
            <div className="choice-cards">
              {[
                ["minimal", "Weekly summary and requested replacements only"],
                ["balanced", "Reviews, plateau alerts, and smart suggestions"],
                ["full", "More frequent, detailed coaching analysis"],
              ].map(([label, copy]) => (
                <button className={aiMode === label ? "active" : ""} onClick={() => setAiMode(label)} key={label}>
                  <span className="choice-check">{aiMode === label && <Check size={12} />}</span>
                  <strong>{label === "minimal" ? "Minimal AI" : label === "balanced" ? "Balanced AI" : "Full AI Coach"}</strong><small>{copy}</small>
                  {label === "balanced" && <em>RECOMMENDED</em>}
                </button>
              ))}
            </div>
            <details className="advanced-details" open={data.aiUsage.calls > 0}>
              <summary>
                <span>
                  <strong>Usage and cache details</strong>
                  <small>Live AI calls, estimated tokens, cache hits, and latest review.</small>
                </span>
                <ChevronRight size={16} />
              </summary>
              <div className="usage-grid">
              <span><small>AI calls this month</small><strong>{data.aiUsage.calls}</strong><em>live usage log</em></span>
              <span><small>Estimated tokens</small><strong>{data.aiUsage.tokens.toLocaleString()}</strong><em>input + output</em></span>
              <span><small>Cache hits</small><strong>{data.aiUsage.cacheHits}</strong><em>calls avoided</em></span>
              <span><small>Last review</small><strong>{data.aiUsage.lastCall ? new Date(data.aiUsage.lastCall).toLocaleDateString() : "—"}</strong><em>latest call</em></span>
              </div>
            </details>
          </Panel>

          <Panel id="appearance">
            <PanelHeader eyebrow="APPEARANCE" title="Interface" />
            <div className="settings-list">
              <SettingRow icon={Moon} label="Theme" copy="Dark by default, light when you need it" control={<select value={theme} onChange={(event) => setTheme(event.target.value)}><option value="dark">Dark</option><option value="light">Light</option><option value="system">System</option></select>} />
              <SettingRow icon={Palette} label="Reduced motion" copy="Uses your operating-system preference" control={<span className="source-pill">System</span>} />
              <SettingRow icon={Bell} label="Rest timer sound" copy="Quiet cue when your timer ends" control={<Toggle value={restSound} onChange={setRestSound} />} />
            </div>
          </Panel>

          <Panel id="data-&-privacy">
            <PanelHeader eyebrow="YOUR DATA" title="Export and privacy" />
            <div className="data-actions">
              <button onClick={exportData}><Download size={18} /><span><strong>Export training data</strong><small>Download your live plan, metrics, and records as CSV</small></span><ChevronRight size={16} /></button>
              <button onClick={() => document.getElementById("ai-coach")?.scrollIntoView({ behavior: "smooth" })}><Shield size={18} /><span><strong>AI privacy controls</strong><small>Choose how often live summaries are used for coaching</small></span><ChevronRight size={16} /></button>
              <button className="danger" onClick={() => void resetPlan()}><RotateCcw size={18} /><span><strong>Reset workout plan</strong><small>Create a fresh plan without deleting workout history</small></span><ChevronRight size={16} /></button>
            </div>
            {actionMessage && <p className="setting-save-status" role="status">{actionMessage}</p>}
          </Panel>
        </div>
      </div>
    </>
  );
}
