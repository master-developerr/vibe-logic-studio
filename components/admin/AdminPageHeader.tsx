import React from "react";

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  emoji?: string;
  actions?: React.ReactNode;
  /** Optional date range picker or filter area */
  controls?: React.ReactNode;
}

/**
 * Shared page header used at the top of every Admin page.
 * Only the title/subtitle/actions props change per page.
 * Layout, spacing, and structure remain identical across all pages.
 */
export function AdminPageHeader({
  title,
  subtitle,
  emoji,
  actions,
  controls,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-[22px] font-bold text-text-primary tracking-tight flex items-center gap-2">
          {title}
          {emoji && <span>{emoji}</span>}
        </h1>
        {subtitle && (
          <p className="text-[13px] text-text-muted mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {controls}
        {actions}
      </div>
    </div>
  );
}
