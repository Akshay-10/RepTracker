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
const tooltipStyle = {
  background: "var(--surface-elevated)",
  border: "1px solid var(--border-strong)",
  borderRadius: "12px",
  boxShadow: "var(--shadow-lg)",
  color: "var(--text)",
  fontSize: "12px",
};

export function VolumeChart({
  compact = false,
  data,
  unit = "kg",
}: {
  compact?: boolean;
  data: Array<{ week: string; volume: number }>;
  unit?: string;
}) {
  return (
    <div className={compact ? "chart-sm" : "chart-md"}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
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
            formatter={(value) => [`${Number(value).toLocaleString()} ${unit}`, "Volume"]}
          />
          <Area
            type="monotone"
            dataKey="volume"
            stroke="#c7ff3d"
            strokeWidth={2.5}
            fill="url(#volumeFill)"
            activeDot={{ r: 5, fill: "#c7ff3d", stroke: "#12150e", strokeWidth: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function WeightChart({
  compact = false,
  data,
  unit = "kg",
}: {
  compact?: boolean;
  data: Array<{ date: string; weight: number }>;
  unit?: string;
}) {
  return (
    <div className={compact ? "chart-xs" : "chart-md"}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 5, left: compact ? -35 : -12, bottom: 0 }}>
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
            formatter={(value) => [`${value} ${unit}`, "Body weight"]}
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

export function MuscleVolumeChart({
  data,
}: {
  data: Array<{ muscle: string; sets: number }>;
}) {
  return (
    <div className="chart-md">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
          <XAxis
            dataKey="muscle"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted)", fontSize: 11 }}
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 11 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="sets" fill="#c7ff3d" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const strengthColors = ["#c7ff3d", "#7891ff", "#ff8a55"];

export function StrengthChart({
  data,
  series,
  unit = "kg",
}: {
  data: Array<Record<string, number | string>>;
  series: string[];
  unit?: string;
}) {
  return (
    <div className="chart-lg">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 11 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 11 }} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value, name) => [`${Number(value).toFixed(1)} ${unit}`, name]}
          />
          {series.map((name, index) => (
            <Line
              type="monotone"
              name={name}
              dataKey={name}
              stroke={strengthColors[index % strengthColors.length]}
              strokeWidth={2.3}
              dot={false}
              activeDot={{ r: 5 }}
              key={name}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
