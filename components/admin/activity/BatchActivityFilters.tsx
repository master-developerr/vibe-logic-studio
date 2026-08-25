"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  X,
  Bookmark,
  Check,
  ChevronDown,
  Tag,
} from "lucide-react";
import {
  ActivityFilterState,
  ActivityTypeFilter,
  DateRangeFilter,
  ActivityStatus,
} from "./types";

interface BatchActivityFiltersProps {
  filters: ActivityFilterState;
  onChange: (patch: Partial<ActivityFilterState>) => void;
  onReset: () => void;
  totalFilteredCount: number;
}

export default function BatchActivityFilters({
  filters,
  onChange,
  onReset,
  totalFilteredCount,
}: BatchActivityFiltersProps) {
  const [showPresets, setShowPresets] = useState(false);

  const hasActiveFilters =
    filters.search !== "" ||
    filters.eventType !== "ALL" ||
    filters.dateRange !== "ALL" ||
    filters.status !== "ALL" ||
    filters.category !== "All" ||
    filters.selectedDay !== null;

  const presets = [
    {
      label: "Recent Payments & Tuition",
      apply: () =>
        onChange({
          category: "Payments",
          eventType: "payment",
          status: "ALL",
          selectedDay: null,
        }),
    },
    {
      label: "Security & System Bots",
      apply: () =>
        onChange({
          category: "System",
          eventType: "system",
          status: "ALL",
          selectedDay: null,
        }),
    },
    {
      label: "Student Enrollments",
      apply: () =>
        onChange({
          category: "Students",
          eventType: "student",
          status: "SUCCESS",
          selectedDay: null,
        }),
    },
    {
      label: "Content & Recordings",
      apply: () =>
        onChange({
          category: "Content",
          eventType: "recording",
          status: "ALL",
          selectedDay: null,
        }),
    },
    {
      label: "Operational Warnings / Errors",
      apply: () =>
        onChange({
          category: "All",
          eventType: "ALL",
          status: "WARNING",
          selectedDay: null,
        }),
    },
  ];

  return (
    <div className="space-y-3 bg-surface p-4 rounded-2xl border border-border shadow-sm">
      {/* Top Search and Selectors Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Global Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Filter logs by actor, action, target, IP address, description..."
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-border bg-background text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ search: "" })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Event Types Dropdown */}
          <div className="relative">
            <select
              value={filters.eventType}
              onChange={(e) =>
                onChange({ eventType: e.target.value as ActivityTypeFilter })
              }
              className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-border bg-background text-xs font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
            >
              <option value="ALL">All Event Types</option>
              <option value="student">Student Actions</option>
              <option value="instructor">Instructor Actions</option>
              <option value="attendance">Attendance & Check-ins</option>
              <option value="payment">Payments & Tuition</option>
              <option value="material">Study Materials</option>
              <option value="recording">Video Recordings</option>
              <option value="announcement">Announcements & Broadcasts</option>
              <option value="review">Reviews & Feedback</option>
              <option value="system">System Bots & Automation</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>

          {/* Date Range Dropdown */}
          <div className="relative">
            <select
              value={filters.dateRange}
              onChange={(e) =>
                onChange({ dateRange: e.target.value as DateRangeFilter })
              }
              className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-border bg-background text-xs font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
            >
              <option value="ALL">All Time</option>
              <option value="TODAY">Today</option>
              <option value="YESTERDAY">Yesterday</option>
              <option value="LAST_7">Last 7 Days</option>
              <option value="LAST_30">Last 30 Days</option>
            </select>
            <Calendar className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) =>
                onChange({ status: e.target.value as ActivityStatus })
              }
              className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-border bg-background text-xs font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">Success</option>
              <option value="COMPLETED">Completed</option>
              <option value="PAID">Paid</option>
              <option value="REMOVED">Removed</option>
              <option value="WARNING">Warning</option>
              <option value="ERROR">Error</option>
            </select>
            <Tag className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>

          {/* Saved Presets Button */}
          <div className="relative">
            <button
              onClick={() => setShowPresets(!showPresets)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                showPresets
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background hover:bg-surface text-text-secondary"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Presets</span>
            </button>

            {showPresets && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-surface border border-border shadow-lg z-30 p-2 space-y-1">
                <div className="px-2 py-1 text-[10px] font-bold tracking-wider text-text-muted uppercase">
                  Saved Enterprise Presets
                </div>
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      p.apply();
                      setShowPresets(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-text-primary hover:bg-background transition-all flex items-center justify-between"
                  >
                    <span>{p.label}</span>
                    <Check className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-500/10 transition-all"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Status Chips Bar */}
      <div className="flex items-center justify-between pt-1 border-t border-border text-xs text-text-secondary">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-text-muted font-semibold text-[11px] uppercase tracking-wider shrink-0">
            Quick Chips:
          </span>
          {(
            [
              { label: "All Events", val: "ALL" },
              { label: "Success only", val: "SUCCESS" },
              { label: "Paid Payments", val: "PAID" },
              { label: "Warnings & Alerts", val: "WARNING" },
              { label: "Removed Students", val: "REMOVED" },
            ] as const
          ).map((chip) => {
            const active = filters.status === chip.val;
            return (
              <button
                key={chip.val}
                onClick={() =>
                  onChange({ status: chip.val as ActivityStatus })
                }
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                  active
                    ? "bg-text-primary text-surface"
                    : "bg-background border border-border text-text-secondary hover:text-text-primary hover:border-text-muted"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        <div className="shrink-0 font-semibold text-text-primary text-xs">
          Showing <span className="text-primary">{totalFilteredCount}</span>{" "}
          matching activities
        </div>
      </div>
    </div>
  );
}
