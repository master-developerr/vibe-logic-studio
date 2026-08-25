"use client";

import React, { useState } from "react";
import {
  Activity,
  User,
  Clock,
  Globe,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Video,
  DollarSign,
  Shield,
  Download,
} from "lucide-react";
import { BatchActivityGroup, BatchActivityEvent } from "./types";

interface BatchActivityFeedProps {
  groups: BatchActivityGroup[];
  onResetFilters: () => void;
  onExportSelected: () => void;
}

export default function BatchActivityFeed({
  groups,
  onResetFilters,
  onExportSelected,
}: BatchActivityFeedProps) {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [visibleCount, setVisibleCount] = useState(15);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Flatten events for pagination slice while preserving groups
  const allEvents = groups.flatMap((g) => g.items);
  const totalEvents = allEvents.length;

  if (totalEvents === 0) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-12 text-center shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center text-text-muted mx-auto mb-3">
          <Activity className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-text-primary">
          No matching audit activities found
        </h3>
        <p className="text-xs text-text-secondary mt-1 max-w-sm mx-auto">
          We couldn&apos;t find any cohort logs matching your search query or filter presets. Try broadening your criteria.
        </p>
        <div className="mt-5">
          <button
            onClick={onResetFilters}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary/90 transition-all shadow-sm"
          >
            Reset All Filters
          </button>
        </div>
      </div>
    );
  }

  // Helper for status styling
  const renderStatusBadge = (status: BatchActivityEvent["status"]) => {
    switch (status) {
      case "SUCCESS":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-600 border border-green-500/20">
            <CheckCircle2 className="w-3 h-3" />
            SUCCESS
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 border border-blue-500/20">
            <CheckCircle2 className="w-3 h-3" />
            COMPLETED
          </span>
        );
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <DollarSign className="w-3 h-3" />
            PAID
          </span>
        );
      case "REMOVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-600 border border-red-500/20">
            <XCircle className="w-3 h-3" />
            REMOVED
          </span>
        );
      case "WARNING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <AlertCircle className="w-3 h-3" />
            WARNING
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-500/10 text-neutral-600 border border-neutral-500/20">
            {status}
          </span>
        );
    }
  };

  // Helper for category badge styling
  const renderCategoryIcon = (category: string) => {
    switch (category) {
      case "Students":
        return (
          <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-600 border border-green-500/20 flex items-center justify-center font-bold text-xs shrink-0">
            ST
          </div>
        );
      case "Content":
        return (
          <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center font-bold text-xs shrink-0">
            CT
          </div>
        );
      case "Payments":
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center font-bold text-xs shrink-0">
            $
          </div>
        );
      case "System":
        return (
          <div className="w-8 h-8 rounded-full bg-neutral-500/10 text-neutral-600 border border-neutral-500/20 flex items-center justify-center font-bold text-xs shrink-0">
            SY
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs shrink-0">
            EV
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {groups.map((group, groupIdx) => {
        const isGroupEmpty = group.items.length === 0;
        if (isGroupEmpty) return null;

        return (
          <div key={group.dateKey || groupIdx} className="space-y-3">
            {/* Group Header Label ("TODAY", "YESTERDAY", "AUGUST 20, 2026") */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-text-muted tracking-wider uppercase">
                {group.groupTitle}
              </span>
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] font-semibold text-text-muted bg-background px-2 py-0.5 rounded-md border border-border">
                {group.items.length} logs
              </span>
            </div>

            {/* Timeline Cards Container */}
            <div className="space-y-2.5">
              {group.items.map((ev) => {
                const isExpanded = expandedIds[ev.id];

                return (
                  <div
                    key={ev.id}
                    className="group bg-surface border border-border rounded-xl p-4 shadow-sm hover:shadow hover:border-text-secondary/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Left side: Avatar + Title/Action */}
                      <div className="flex items-start gap-3 min-w-0">
                        {renderCategoryIcon(ev.category)}

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-text-primary font-medium">
                            <span className="font-bold text-text-primary">
                              {ev.actorName}
                            </span>
                            <span className="text-text-secondary">
                              {ev.action}
                            </span>
                            <span className="font-semibold text-primary break-all">
                              {ev.target}
                            </span>
                          </div>

                          {/* Secondary Meta Row */}
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-text-muted">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(ev.timestamp).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                            {ev.ipAddress && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1 font-mono">
                                  <Globe className="w-3 h-3 text-text-muted" />
                                  IP: {ev.ipAddress}
                                </span>
                              </>
                            )}
                            {ev.details && (
                              <>
                                <span>•</span>
                                <span className="text-text-secondary font-medium">
                                  {ev.details}
                                </span>
                              </>
                            )}
                          </div>

                          {/* Expandable Description/Payload */}
                          {ev.description && (
                            <div className="mt-2">
                              {isExpanded ? (
                                <div className="p-3 rounded-lg bg-background border border-border text-xs text-text-secondary space-y-1">
                                  <div className="font-semibold text-text-primary flex items-center justify-between">
                                    <span>Audit Payload Description:</span>
                                    <span className="text-[10px] text-text-muted font-mono uppercase">
                                      ID: {ev.id}
                                    </span>
                                  </div>
                                  <p>{ev.description}</p>
                                </div>
                              ) : (
                                <p className="text-xs text-text-secondary line-clamp-1">
                                  {ev.description}
                                </p>
                              )}

                              <button
                                onClick={() => toggleExpand(ev.id)}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary mt-1 hover:underline"
                              >
                                {isExpanded ? (
                                  <>
                                    <span>Hide audit details</span>
                                    <ChevronUp className="w-3 h-3" />
                                  </>
                                ) : (
                                  <>
                                    <span>Show full audit payload</span>
                                    <ChevronDown className="w-3 h-3" />
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right side: Status Badge */}
                      <div className="shrink-0">
                        {renderStatusBadge(ev.status)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Infinite Scroll / Pagination Simulator Bar */}
      {visibleCount < totalEvents && (
        <div className="pt-4 text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 15)}
            className="px-6 py-2.5 rounded-xl text-xs font-bold border border-border bg-surface hover:bg-background text-text-primary transition-all shadow-sm active:scale-[0.98]"
          >
            Load More Activity Logs ({totalEvents - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
