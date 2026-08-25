"use client";

import React from "react";
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Clock,
  ArrowUpRight,
} from "lucide-react";

interface ActivityItem {
  id: string;
  timestamp: number;
  eventType: string;
  detail: string;
  status: string;
}

interface FinancialActivityLogProps {
  activityLog: ActivityItem[];
}

export function FinancialActivityLog({
  activityLog,
}: FinancialActivityLogProps) {
  return (
    <div className="rounded-2xl bg-surface border border-border shadow-sm overflow-hidden">
      <div className="p-5 border-b border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-base font-bold text-text-primary">
              Financial Audit & Activity Log
            </h3>
            <p className="text-xs text-text-muted">
              Chronological immutable event stream of billing actions & disputes
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold text-text-muted">
          {activityLog.length} Event(s)
        </span>
      </div>

      {activityLog.length === 0 ? (
        <div className="py-12 text-center text-sm text-text-muted">
          No financial events recorded yet.
        </div>
      ) : (
        <div className="divide-y divide-border/60">
          {activityLog.map((act) => {
            const isSuccess = act.status === "successful";
            const isRefund =
              act.eventType === "Refund Approved" ||
              act.status === "refunded";
            const isFailed = act.status === "failed";

            return (
              <div
                key={act.id}
                className="p-4 hover:bg-border/20 transition-colors flex items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSuccess && !isRefund
                        ? "bg-success/10 text-success"
                        : isRefund
                          ? "bg-info/10 text-info"
                          : isFailed
                            ? "bg-error/10 text-error"
                            : "bg-warning/10 text-warning"
                    }`}
                  >
                    {isSuccess && !isRefund && (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    {isRefund && <RotateCcw className="w-4 h-4" />}
                    {isFailed && <AlertCircle className="w-4 h-4" />}
                    {!isSuccess && !isRefund && !isFailed && (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-text-primary">
                        {act.eventType}
                      </span>
                      <span className="text-xs text-text-muted hidden sm:inline">
                        •
                      </span>
                      <span className="text-xs text-text-muted">
                        {new Date(act.timestamp).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {act.detail}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      isSuccess && !isRefund
                        ? "bg-success/10 text-success border-success/30"
                        : isRefund
                          ? "bg-info/10 text-info border-info/30"
                          : isFailed
                            ? "bg-error/10 text-error border-error/30"
                            : "bg-warning/10 text-warning border-warning/30"
                    }`}
                  >
                    {act.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
