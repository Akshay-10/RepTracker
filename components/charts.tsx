"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  muscleVolume,
  strengthTrend,
  volumeTrend,
  weightTrend,
} from "@/lib/data";

const tooltipStyle = {
  background: "var(--surface-elevated)",
  border: "1px solid var(--border-strong)",
  borderRadius: "12px",
  boxShadow: "var(--shadow-lg)",
  color: "var(--text)",
  fontSize: "12px",
};

export function VolumeChart({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "chart-sm" : "chart-md"}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={volumeTrend} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c7ff3d" stopOpacity={0.32} />
              <stop offset="100%" stopColor="#c7ff3d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
          <XAxis
            dataKey="week"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted)", fontSize: 11 }}
          />
          {!compact && (
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted)", fontSize: 11 }}
              tickFormatter={(value) => `${value / 1000}k`}
            />
          )}
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => [`${Number(value).toLocaleString()} kg`, "Volume"]}
          />
          <Area
            type="monotone"
            dataKey="volume"
            stroke="#c7ff3d"
            strokeWidth={2.5}
            fill="url(#volumeFill)"
            activeDot={{ r: 5, fill: "#c7ff3d", stroke: "#12150e", strokeWidth: 3 }}
          />
          {!compact && (
            <Line
              type="monotone"
              dataKey="baseline"
              stroke="var(--muted)"
              strokeDasharray="5 6"
              dot={false}
              strokeWidth={1}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function WeightChart({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "chart-xs" : "chart-md"}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={weightTrend} margin={{ top: 10, right: 5, left: compact ? -35 : -12, bottom: 0 }}>
          <defs>
            <linearGradient id="weightFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6e8bff" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#6e8bff" stopOpacity={0} />
            </linearGradient>
          </defs>
          {!compact && <CartesianGrid stroke="var(--chart-grid)" vertical={false} />}
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted)", fontSize: 11 }}
            interval={compact ? "preserveStartEnd" : 0}
          />
          <YAxis
            domain={["dataMin - 0.4", "dataMax + 0.3"]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted)", fontSize: 11 }}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => [`${value} kg`, "Body weight"]}
          />
          <Area
            type="monotone"
            dataKey="weight"
            stroke="#7891ff"
            strokeWidth={2.5}
            fill="url(#weightFill)"
            activeDot={{ r: 5, fill: "#7891ff", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MuscleVolumeChart() {
  return (
    <div className="chart-md">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={muscleVolume} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
          <XAxis
            dataKey="muscle"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted)", fontSize: 11 }}
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 11 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="target" fill="var(--chart-track)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="sets" fill="#c7ff3d" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StrengthChart() {
  return (
    <div className="chart-lg">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={strengthTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 11 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 11 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" name="Incline press" dataKey="press" stroke="#c7ff3d" strokeWidth={2.4} dot={false} activeDot={{ r: 5 }} />
          <Line type="monotone" name="Cable row" dataKey="row" stroke="#7891ff" strokeWidth={2.2} dot={false} />
          <Line type="monotone" name="RDL" dataKey="rdl" stroke="#ff8a55" strokeWidth={2.2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
