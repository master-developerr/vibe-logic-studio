import React from "react";
import { cn } from "@/lib/utils";

/**
 * StatCard — matches the 5-across KPI cards from the reference image.
 * Used for: Total Revenue, Active Students, Today's Live Classes, Pending Reviews, Completion Rate.
 */

interface StatCardProps {
  label: string;
  value: string | number;
  /** Small colored icon or emoji — raw ReactNode */
  icon: React.ReactNode;
  /** Optional trend badge, e.g. "+12%" */
  trend?: string;
  trendPositive?: boolean;
  /** Optional badge chip above the number e.g. "PENDING" */
  badge?: string;
  badgeColor?: "primary" | "warning" | "success" | "error" | "info";
  className?: string;
}

const badgeColorMap = {
  primary: "bg-primary/10 text-primary",
  warning:  "bg-warning/10 text-warning",
  success:  "bg-success/10 text-success",
  error:    "bg-error/10 text-error",
  info:     "bg-info/10 text-info",
};

export function StatCard({
  label,
  value,
  icon,
  trend,
  trendPositive = true,
  badge,
  badgeColor = "warning",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-surface border border-border rounded-lg p-5 flex flex-col gap-3 shadow-sm",
        className
      )}
    >
      {/* Top row: icon + trend/badge */}
      <div className="flex items-start justify-between">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-background border border-border text-text-secondary">
          {icon}
        </div>

        <div className="flex flex-col items-end gap-1">
          {badge && (
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full",
                badgeColorMap[badgeColor]
              )}
            >
              {badge}
            </span>
          )}
          {trend && (
            <span
              className={cn(
                "text-[11px] font-semibold",
                trendPositive ? "text-success" : "text-error"
              )}
            >
              {trend}
            </span>
          )}
        </div>
      </div>

      {/* Label + Value */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          {label}
        </p>
        <p className="text-[24px] font-bold text-text-primary leading-tight mt-0.5 tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}
