import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link className="brand" href={compact ? "/dashboard" : "/"}>
      <span className="brand-mark" aria-hidden="true">
        <span />
        <span />
      </span>
      {!compact && (
        <span className="brand-word">
          REP<span>FORGE</span>
        </span>
      )}
    </Link>
  );
}
