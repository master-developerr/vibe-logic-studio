import React from "react";
import { cn } from "@/lib/utils";

/**
 * AdminEmptyState — shown when a section has no data.
 * Consistent minimal style: icon, heading, description, optional CTA.
 */
interface AdminEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function AdminEmptyState({
  icon,
  title,
  description,
  action,
  className,
}: AdminEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center px-6 rounded-lg border border-dashed border-border bg-background",
        className
      )}
    >
      {icon && (
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-surface border border-border text-text-muted mb-3">
          {icon}
        </div>
      )}
      <p className="text-[14px] font-semibold text-text-primary">{title}</p>
      {description && (
        <p className="text-[13px] text-text-muted mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
