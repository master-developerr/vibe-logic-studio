"use client";

import React from "react";
import {
  ShieldAlert,
  Users,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  TrendingUp,
} from "lucide-react";
import { BatchHealthMetrics } from "./types";

interface BatchSettingsHealthBannerProps {
  enrolledCount: number;
  capacity: number;
  health: BatchHealthMetrics;
}

export function BatchSettingsHealthBanner({
  enrolledCount = 0,
  capacity = 50,
  health,
}: BatchSettingsHealthBannerProps) {
  const safeHealth = health || { completenessScore: 0, alerts: [], auditLog: [] };
  const safeAlerts = safeHealth.alerts || [];
  const safeAuditLog = safeHealth.auditLog || [];
  const completenessScore = safeHealth.completenessScore || 0;

  const capacityPercent =
    capacity > 0 ? Math.min(100, Math.round((enrolledCount / capacity) * 100)) : 0;
  const isNearFull = capacityPercent >= 85;
  const isFull = enrolledCount >= capacity;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. Configuration Health Bento Card */}
      <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between shadow-xs">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-primary" />
              Config Health
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                completenessScore >= 80
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {completenessScore}% Complete
            </span>
          </div>

          {/* Completeness Progress Bar */}
          <div className="w-full bg-border rounded-full h-2 overflow-hidden mb-4">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                completenessScore >= 80 ? "bg-emerald-500" : "bg-primary"
              }`}
              style={{ width: `${completenessScore}%` }}
            />
          </div>

          {/* Alerts Feed */}
          <div className="space-y-2">
            {safeAlerts.length === 0 ? (
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>All core cohort links & settings are fully configured.</span>
              </div>
            ) : (
              safeAlerts.slice(0, 2).map((alert, idx) => {
                const isWarn = alert.type === "warning";
                const isErr = alert.type === "error";
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-2 text-xs font-medium p-2.5 rounded-xl border ${
                      isErr
                        ? "bg-red-50 text-red-800 border-red-200"
                        : isWarn
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-blue-50 text-blue-800 border-blue-200"
                    }`}
                  >
                    {isErr ? (
                      <ShieldAlert className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                    ) : isWarn ? (
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                    ) : (
                      <Info className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
                    )}
                    <span>{alert.message}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-text-muted">
          <span>Required fields checklist</span>
          <span className="font-semibold text-text-primary">8 / 8 Checked</span>
        </div>
      </div>

      {/* 2. Seat Capacity & Enrollment Utilization Card */}
      <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between shadow-xs">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-primary" />
              Enrollment Utilization
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                isFull
                  ? "bg-red-100 text-red-800"
                  : isNearFull
                  ? "bg-amber-100 text-amber-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {isFull ? "Capacity Full" : isNearFull ? "Near Capacity" : "Seats Open"}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-text-primary tracking-tight">
              {enrolledCount}
            </span>
            <span className="text-sm font-semibold text-text-muted">
              / {capacity} total seats
            </span>
          </div>

          {/* Utilization Bar */}
          <div className="w-full bg-border rounded-full h-2 overflow-hidden mb-3">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isFull
                  ? "bg-red-500"
                  : isNearFull
                  ? "bg-amber-500"
                  : "bg-primary"
              }`}
              style={{ width: `${capacityPercent}%` }}
            />
          </div>

          <p className="text-xs text-text-secondary">
            {isFull
              ? "New learner signups will be automatically routed to the waitlist queue."
              : `${
                  capacity - enrolledCount
                } seats remaining before waitlist triggers automatically.`}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
          <span className="text-text-muted">Enrollment Velocity</span>
          <span className="font-semibold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +8 this week
          </span>
        </div>
      </div>

      {/* 3. Recent Admin Audit Trail Feed Card */}
      <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col justify-between shadow-xs">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              Recent Audit Log
            </span>
            <span className="text-xs text-text-muted">Last 72 hours</span>
          </div>

          <div className="space-y-3">
            {safeAuditLog.length === 0 ? (
              <p className="text-xs text-text-muted italic py-2">No recent audit log entries.</p>
            ) : (
              safeAuditLog.map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between gap-2 text-xs border-b border-border/60 pb-2 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-semibold text-text-primary leading-snug">
                    {log.action}
                  </p>
                  <p className="text-text-muted text-[11px] mt-0.5">
                    by {log.user}
                  </p>
                </div>
                <span className="text-text-muted text-[11px] shrink-0 font-medium">
                  {log.timeAgo}
                </span>
              </div>
            )))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-text-muted">
          <span>Security & change tracking</span>
          <span className="font-semibold text-primary cursor-pointer hover:underline">
            View full audit trail →
          </span>
        </div>
      </div>
    </div>
  );
}
