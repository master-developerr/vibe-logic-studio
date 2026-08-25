"use client";

import React from "react";
import { Download, PlusCircle, Activity, ShieldCheck, Clock } from "lucide-react";

interface BatchActivityToolbarProps {
  batchTitle: string;
  totalEvents: number;
  onOpenExport: () => void;
  onOpenLogNote: () => void;
}

export default function BatchActivityToolbar({
  batchTitle,
  totalEvents,
  onOpenExport,
  onOpenLogNote,
}: BatchActivityToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-border bg-surface px-6 rounded-2xl shadow-sm">
      {/* Left: Title and Subtitle */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-text-primary tracking-tight">
              Enterprise Activity Center
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-600 border border-green-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              LIVE MONITORING
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5 flex items-center gap-2">
            <span>{batchTitle}</span>
            <span>•</span>
            <span className="font-semibold text-text-primary">
              {totalEvents.toLocaleString()} Total Audit Events
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-text-secondary">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              Immutable Telemetry
            </span>
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onOpenExport}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border border-border bg-background hover:bg-surface text-text-primary transition-all shadow-sm active:scale-[0.98]"
        >
          <Download className="w-3.5 h-3.5 text-text-muted" />
          <span>Export Logs</span>
        </button>

        <button
          onClick={onOpenLogNote}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-primary/90 text-white transition-all shadow-sm hover:shadow active:scale-[0.98]"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Log Custom Event</span>
        </button>
      </div>
    </div>
  );
}
