import React from "react";
import { cn } from "@/lib/utils";

/**
 * Shared status badge used across all admin tables and cards.
 * Maps a status string → consistent visual badge.
 */
type StatusValue =
  | "active"
  | "live"
  | "upcoming"
  | "completed"
  | "cancelled"
  | "pending"
  | "successful"
  | "failed"
  | "draft"
  | string;

interface StatusBadgeProps {
  status: StatusValue;
  className?: string;
}

const colorMap: Record<string, string> = {
  active:     "bg-success/10 text-success border-success/20",
  live:       "bg-success/10 text-success border-success/20",
  successful: "bg-success/10 text-success border-success/20",
  published:  "bg-success/10 text-success border-success/20",
  completed:  "bg-info/10 text-info border-info/20",
  upcoming:   "bg-info/10 text-info border-info/20",
  pending:    "bg-warning/10 text-warning border-warning/20",
  draft:      "bg-warning/10 text-warning border-warning/20",
  cancelled:  "bg-error/10 text-error border-error/20",
  failed:     "bg-error/10 text-error border-error/20",
  archived:   "bg-border/40 text-text-muted border-border",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colorClass = colorMap[status?.toLowerCase()] ?? "bg-border text-text-secondary border-border";

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border uppercase tracking-wide",
        colorClass,
        className
      )}
    >
      {status}
    </span>
  );
}
