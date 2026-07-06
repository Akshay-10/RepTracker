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
import { useState } from "react";
import { CoachTag, PageHeading, Panel, PanelHeader, SettingRow } from "@/components/ui";

function Toggle({ defaultOn = true }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      className={`toggle ${on ? "on" : ""}`}
      onClick={() => setOn(!on)}
      aria-label={on ? "Disable setting" : "Enable setting"}
      aria-pressed={on}
    >
      <span />
    </button>
  );
}

export function SettingsContent() {
  const [aiMode, setAiMode] = useState("Balanced AI");
  const [variationMode, setVariationMode] = useState("Moderate");
  const [saved, setSaved] = useState(false);

  return (
    <>
      <PageHeading
        eyebrow="PREFERENCES"
        title="Make RepForge yours."
        copy="Tune the training experience while keeping the defaults sensible."
        actions={
          <button
            className="button button-primary"
            onClick={() => {
              setSaved(true);
              window.setTimeout(() => setSaved(false), 1500);
            }}
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
            ["Notifications", Bell],
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
              <span className="profile-avatar">AK</span>
              <span><strong>Akshay</strong><small>akshay@example.com · Intermediate</small></span>
              <button className="button button-secondary">Edit profile</button>
            </div>
            <div className="profile-data">
              <label><span>Age</span><input defaultValue="25" /></label>
              <label><span>Height</span><div><input defaultValue="186" /><em>cm</em></div></label>
              <label><span>Current weight</span><div><input defaultValue="63.0" /><em>kg</em></div></label>
              <label><span>Primary goal</span><select defaultValue="muscle"><option value="muscle">Muscle + strength</option><option value="strength">Strength</option><option value="recomp">Recomposition</option></select></label>
            </div>
          </Panel>

          <Panel id="training">
            <PanelHeader eyebrow="TRAINING" title="Workout defaults" />
            <div className="settings-list">
              <SettingRow icon={Timer} label="Workout duration" copy="Hard cap for plan generation" control={<select defaultValue="90"><option value="60">60 min</option><option value="75">75 min</option><option value="90">90 min</option></select>} />
              <SettingRow icon={Ruler} label="Units" copy="Used across workouts and body tracking" control={<select defaultValue="kg"><option value="kg">Kilograms</option><option value="lb">Pounds</option></select>} />
              <SettingRow icon={HeartPulse} label="Warm-up primer" copy="Include push-ups and pull-ups without fatigue" control={<Toggle />} />
              <SettingRow icon={Gauge} label="Auto-start rest timer" copy="Starts as soon as a set is completed" control={<Toggle />} />
            </div>
          </Panel>

          <Panel id="variations">
            <PanelHeader eyebrow="VARIATION ENGINE" title="Control how your plan rotates" action={<CoachTag>LOCAL FIRST</CoachTag>} />
            <div className="choice-cards three">
              {[
                ["Stable", "Mainly repeat the same plan"],
                ["Moderate", "30–40% accessories rotate"],
                ["High", "More frequent angle changes"],
              ].map(([label, copy]) => (
                <button className={variationMode === label ? "active" : ""} onClick={() => setVariationMode(label)} key={label}>
                  <span className="choice-check">{variationMode === label && <Check size={12} />}</span>
                  <strong>{label}</strong><small>{copy}</small>
                  {label === "Moderate" && <em>RECOMMENDED</em>}
                </button>
              ))}
            </div>
            <div className="settings-list compact">
              <SettingRow icon={Dumbbell} label="Available equipment" copy="Dumbbells, cables, machines, barbell" />
              <SettingRow icon={Shield} label="Exercises to avoid" copy="No exercises currently blocked" />
              <SettingRow icon={Sparkles} label="Weak-point priority" copy="Upper chest · side delts · lats" />
            </div>
          </Panel>

          <Panel id="ai-coach">
            <PanelHeader eyebrow="FORGE AI" title="Coaching, on your terms" action={<CoachTag />} />
            <p className="panel-copy">
              AI receives compact summaries, never your full raw history. The local engine
              handles timers, calculations, PRs, and standard exercise swaps.
            </p>
            <div className="choice-cards">
              {[
                ["Minimal AI", "Weekly summary and requested replacements only"],
                ["Balanced AI", "Reviews, plateau alerts, and smart suggestions"],
                ["Full AI Coach", "More frequent, detailed coaching analysis"],
              ].map(([label, copy]) => (
                <button className={aiMode === label ? "active" : ""} onClick={() => setAiMode(label)} key={label}>
                  <span className="choice-check">{aiMode === label && <Check size={12} />}</span>
                  <strong>{label}</strong><small>{copy}</small>
                  {label === "Balanced AI" && <em>RECOMMENDED</em>}
                </button>
              ))}
            </div>
            <div className="usage-grid">
              <span><small>AI calls this month</small><strong>7</strong><em>of 30 guide</em></span>
              <span><small>Estimated tokens</small><strong>8.4k</strong><em>compact context</em></span>
              <span><small>Cache hits</small><strong>12</strong><em>calls avoided</em></span>
              <span><small>Last review</small><strong>Jul 5</strong><em>weekly review</em></span>
            </div>
          </Panel>

          <Panel id="appearance">
            <PanelHeader eyebrow="APPEARANCE" title="Interface" />
            <div className="settings-list">
              <SettingRow icon={Moon} label="Theme" copy="Dark by default, light when you need it" control={<select defaultValue="dark"><option>Dark</option><option>Light</option><option>System</option></select>} />
              <SettingRow icon={Palette} label="Reduced motion" copy="Limit non-essential interface animation" control={<Toggle defaultOn={false} />} />
              <SettingRow icon={Bell} label="Rest timer sound" copy="Quiet cue when your timer ends" control={<Toggle />} />
            </div>
          </Panel>

          <Panel id="data-&-privacy">
            <PanelHeader eyebrow="YOUR DATA" title="Export and privacy" />
            <div className="data-actions">
              <button><Download size={18} /><span><strong>Export training data</strong><small>Download workouts and metrics as CSV</small></span><ChevronRight size={16} /></button>
              <button><Shield size={18} /><span><strong>Privacy controls</strong><small>Manage cloud sync and AI data use</small></span><ChevronRight size={16} /></button>
              <button className="danger"><RotateCcw size={18} /><span><strong>Reset workout plan</strong><small>Restore the original six-day program</small></span><ChevronRight size={16} /></button>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
