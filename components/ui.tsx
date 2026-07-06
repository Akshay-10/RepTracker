import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Flame,
  LucideIcon,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export function PageHeading({
  eyebrow,
  title,
  copy,
  actions,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {copy && <p className="page-copy">{copy}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}

export function Panel({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section className={`panel ${className}`} id={id}>
      {children}
    </section>
  );
}

export function PanelHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="panel-header">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  delta,
  tone = "lime",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  suffix?: string;
  delta: string;
  tone?: "lime" | "blue" | "orange" | "violet";
}) {
  return (
    <article className={`stat-card tone-${tone}`}>
      <div className="stat-icon">
        <Icon size={18} />
      </div>
      <span className="stat-label">{label}</span>
      <div className="stat-value">
        {value} {suffix && <small>{suffix}</small>}
      </div>
      <span className="stat-delta">{delta}</span>
    </article>
  );
}

export function ProgressRing({
  value,
  size = 104,
  label,
  sublabel,
}: {
  value: number;
  size?: number;
  label?: string;
  sublabel?: string;
}) {
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-hidden="true">
        <circle
          className="ring-track"
          strokeWidth={stroke}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="ring-value"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset: offset }}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div>
        <strong>{label ?? `${value}%`}</strong>
        {sublabel && <span>{sublabel}</span>}
      </div>
    </div>
  );
}

export function StreakBadge({ days = 18 }: { days?: number }) {
  return (
    <span className="streak-badge">
      <Flame size={15} fill="currentColor" />
      {days} day streak
    </span>
  );
}

export function CoachTag({ children = "FORGE AI" }: { children?: React.ReactNode }) {
  return (
    <span className="coach-tag">
      <Sparkles size={12} />
      {children}
    </span>
  );
}

export function TextLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link className="text-link" href={href}>
      {children}
      <ArrowUpRight size={14} />
    </Link>
  );
}

export function EmptyState({
  title,
  copy,
  action,
}: {
  title: string;
  copy: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="empty-state">
      <span className="empty-check">
        <Check size={20} />
      </span>
      <h3>{title}</h3>
      <p>{copy}</p>
      {action}
    </div>
  );
}

export function SettingRow({
  icon: Icon,
  label,
  copy,
  control,
  href,
}: {
  icon: LucideIcon;
  label: string;
  copy: string;
  control?: React.ReactNode;
  href?: string;
}) {
  const content = (
    <>
      <span className="setting-icon">
        <Icon size={18} />
      </span>
      <span className="setting-copy">
        <strong>{label}</strong>
        <small>{copy}</small>
      </span>
      {control ?? (href && <ChevronRight size={18} />)}
    </>
  );

  return href ? (
    <Link className="setting-row" href={href}>
      {content}
    </Link>
  ) : (
    <div className="setting-row">{content}</div>
  );
}
