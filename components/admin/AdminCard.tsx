import React from "react";
import { cn } from "@/lib/utils";

/**
 * AdminCard — shared surface card for every admin widget.
 * Uses design system tokens: bg-surface, border-border, rounded-lg, p-6.
 */
interface AdminCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
}

export function AdminCard({
  children,
  className,
  padding = "md",
  ...props
}: AdminCardProps) {
  const paddingClass = {
    none: "",
    sm: "p-4",
    md: "p-5",
    lg: "p-6",
  }[padding];

  return (
    <div
      className={cn(
        "bg-surface border border-border rounded-lg shadow-sm",
        paddingClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── AdminCard.Header ───────────────────────────────────── */
interface AdminCardHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

AdminCard.Header = function AdminCardHeader({
  title,
  subtitle,
  actions,
}: AdminCardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-[14px] font-semibold text-text-primary">{title}</h3>
        {subtitle && (
          <p className="text-[12px] text-text-muted mt-0.5">{subtitle}</p>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
};
