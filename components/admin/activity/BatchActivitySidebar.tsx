"use client";

import React, { useState } from "react";
import {
  PieChart,
  Users,
  AlertTriangle,
  Calendar as CalendarIcon,
  ArrowUp,
  ChevronRight,
  ShieldAlert,
  Clock,
} from "lucide-react";
import {
  BatchActivitySummaryItem,
  BatchContributor,
  BatchAlert,
  BatchCalendarDate,
} from "./types";

interface BatchActivitySidebarProps {
  activitySummary: BatchActivitySummaryItem[];
  topContributors: BatchContributor[];
  recentAlerts: BatchAlert[];
  calendarDates: BatchCalendarDate[];
  selectedDay: number | null | undefined;
  onSelectDay: (day: number | null) => void;
  onJumpToToday: () => void;
}

export default function BatchActivitySidebar({
  activitySummary,
  topContributors,
  recentAlerts,
  calendarDates,
  selectedDay,
  onSelectDay,
  onJumpToToday,
}: BatchActivitySidebarProps) {
  const [showAllContributors, setShowAllContributors] = useState(false);
  const visibleContributors = showAllContributors
    ? topContributors
    : topContributors.slice(0, 3);

  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="space-y-5">
      {/* 1. Activity Summary Donut & Breakdown Card */}
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-text-primary tracking-tight">
            Activity Summary
          </h3>
          <span className="text-[11px] font-semibold text-text-muted">
            LAST 30 DAYS
          </span>
        </div>

        {/* Donut Chart Visualizer (Pure CSS Ring & Center Badge) */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative w-36 h-36 rounded-full border-[14px] border-primary flex items-center justify-center shadow-inner">
            <div
              className="absolute inset-0 rounded-full border-[14px] border-blue-500"
              style={{
                clipPath: "polygon(50% 50%, 100% 0, 100% 100%, 0 100%)",
              }}
            />
            <div
              className="absolute inset-0 rounded-full border-[14px] border-green-500"
              style={{ clipPath: "polygon(50% 50%, 0 100%, 0 0)" }}
            />
            <div className="text-center z-10 bg-surface w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-sm border border-border">
              <span className="text-xl font-extrabold text-text-primary tracking-tight">
                248
              </span>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                EVENTS
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown Percentage List */}
        <div className="space-y-2 mt-2">
          {activitySummary.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-0"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-semibold text-text-primary">
                  {item.name}
                </span>
              </div>
              <span className="font-bold text-text-secondary">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>

        {/* Floating Jump to Today Button (matching input_file_0.png) */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onJumpToToday}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary text-white text-xs font-bold shadow-md hover:bg-secondary/90 transition-all active:scale-[0.98]"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Jump to Today</span>
          </button>
        </div>
      </div>

      {/* 2. Top Contributors Card */}
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-text-primary tracking-tight">
            Top Contributors
          </h3>
          <button
            onClick={() => setShowAllContributors(!showAllContributors)}
            className="text-[11px] font-bold text-primary uppercase tracking-wider hover:underline"
          >
            {showAllContributors ? "SHOW LESS" : "VIEW ALL"}
          </button>
        </div>

        <div className="space-y-3">
          {visibleContributors.map((user, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-background border border-border/60 hover:border-border transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                  {user.avatar}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-text-primary truncate">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-text-muted truncate">
                    {user.role}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-text-primary">
                  {user.events}
                </span>
                <span className="block text-[10px] text-text-muted uppercase tracking-wider">
                  events
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Recent Alerts Card */}
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <h3 className="text-sm font-bold text-text-primary tracking-tight">
              Recent Alerts
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-600 border border-red-500/20">
            {recentAlerts.length} Active
          </span>
        </div>

        <div className="space-y-2.5">
          {recentAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-xl border text-left transition-all ${
                alert.severity === "error"
                  ? "bg-red-500/5 border-red-500/20 text-red-900"
                  : "bg-amber-500/5 border-amber-500/20 text-amber-900"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                  <AlertTriangle
                    className={`w-3.5 h-3.5 ${
                      alert.severity === "error"
                        ? "text-red-600"
                        : "text-amber-600"
                    }`}
                  />
                  {alert.title}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    alert.severity === "error"
                      ? "text-red-600"
                      : "text-amber-600"
                  }`}
                >
                  {alert.timeAgo}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-1">
                {alert.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Jump to Date Calendar Card */}
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-text-primary tracking-tight flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4 text-primary" />
            <span>Jump to Date</span>
          </h3>
          {selectedDay !== null && selectedDay !== undefined && (
            <button
              onClick={() => onSelectDay(null)}
              className="text-[11px] font-bold text-primary hover:underline"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
          {daysOfWeek.map((day, idx) => (
            <div
              key={idx}
              className="text-[10px] font-bold text-text-muted uppercase"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Date Numbers Grid */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {calendarDates.map((cd, idx) => {
            const isSelected = selectedDay === cd.day;

            return (
              <button
                key={idx}
                onClick={() => onSelectDay(isSelected ? null : cd.day)}
                className={`h-8 rounded-full text-xs font-bold transition-all flex items-center justify-center relative ${
                  cd.isToday
                    ? "bg-primary text-white shadow-md ring-2 ring-primary/40"
                    : isSelected
                    ? "bg-secondary text-white"
                    : cd.hasActivity
                    ? "bg-background border border-border text-text-primary hover:border-primary"
                    : "text-text-muted hover:bg-background"
                }`}
              >
                <span>{cd.day}</span>
                {cd.hasActivity && !cd.isToday && !isSelected && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>

        {/* Floating Bottom Black Jump Button (matching input_file_0.png) */}
        <div className="mt-5 pt-3 border-t border-border flex justify-center">
          <button
            onClick={onJumpToToday}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-white text-xs font-bold shadow-md hover:bg-secondary/90 transition-all active:scale-[0.98]"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Jump to Today</span>
          </button>
        </div>
      </div>
    </div>
  );
}
