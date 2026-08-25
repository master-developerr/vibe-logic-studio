"use client";

import React from "react";
import { Users, UserPlus, Shield, Check, AlertCircle } from "lucide-react";

interface BatchSettingsEnrollmentProps {
  capacity: number;
  enrolledCount: number;
  enrollmentStatus: string;
  allowWaitlist: boolean;
  onChange: (field: string, value: any) => void;
}

export function BatchSettingsEnrollment({
  capacity,
  enrolledCount,
  enrollmentStatus,
  allowWaitlist,
  onChange,
}: BatchSettingsEnrollmentProps) {
  const capacityPercent =
    capacity > 0 ? Math.min(100, Math.round((enrolledCount / capacity) * 100)) : 0;
  const seatsRemaining = Math.max(0, capacity - enrolledCount);

  return (
    <div
      id="enrollment"
      className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-6 scroll-mt-6"
    >
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary">
              Enrollment & Seat Capacity Rules
            </h2>
            <p className="text-xs text-text-secondary">
              Control student admission thresholds, waitlist fallback queues, and checkout gating
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Automatic Seat Protection Enabled</span>
        </div>
      </div>

      {/* Seat Capacity & Quick Adjusters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
            Maximum Seat Capacity
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={10000}
              value={capacity}
              onChange={(e) =>
                onChange("capacity", Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-full h-11 px-3.5 rounded-xl border border-border bg-surface text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {[10, 25, 50].map((inc) => (
              <button
                key={inc}
                type="button"
                onClick={() => onChange("capacity", capacity + inc)}
                className="px-3 h-11 rounded-xl border border-border bg-surface hover:bg-[#FAF7F3] text-xs font-semibold text-text-secondary shrink-0"
              >
                +{inc}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-text-muted mt-1.5">
            When enrolled students reach {capacity}, checkout switches to waitlist mode if enabled.
          </p>
        </div>

        {/* Realtime Seat Gauge */}
        <div className="bg-[#FAF7F3] rounded-xl p-4 border border-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-text-secondary">Seat Utilization Status</span>
            <span
              className={
                seatsRemaining === 0 ? "text-red-600 font-bold" : "text-emerald-600"
              }
            >
              {seatsRemaining === 0
                ? "Full • Waitlist Active"
                : `${seatsRemaining} seats open`}
            </span>
          </div>

          <div className="w-full bg-border rounded-full h-3 overflow-hidden my-2">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                seatsRemaining === 0 ? "bg-red-500" : "bg-primary"
              }`}
              style={{ width: `${capacityPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-text-muted">
            <span>
              Enrolled: <strong className="text-text-primary">{enrolledCount}</strong>
            </span>
            <span>
              Capacity: <strong className="text-text-primary">{capacity}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Enrollment Status Selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
          Public Checkout & Admission Window
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {[
            {
              value: "Running",
              label: "Running (Open)",
              desc: "Learners can enroll immediately via course landing page.",
              dot: "bg-emerald-500",
            },
            {
              value: "Upcoming",
              label: "Upcoming (Pre-Order)",
              desc: "Accepting early registrations before cohort kick-off.",
              dot: "bg-blue-500",
            },
            {
              value: "Completed",
              label: "Completed",
              desc: "Cohort finished; public admission permanently closed.",
              dot: "bg-gray-500",
            },
            {
              value: "Closed",
              label: "Enrollment Closed",
              desc: "Temporarily pause new enrollments while batch runs.",
              dot: "bg-amber-500",
            },
          ].map((item) => {
            const isSelected = enrollmentStatus === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onChange("enrollmentStatus", item.value)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-xs ring-2 ring-primary/20"
                    : "border-border bg-surface hover:bg-[#FAF7F3]"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                  <span className="text-xs font-bold text-text-primary">
                    {item.label}
                  </span>
                </div>
                <p className="text-[11px] text-text-secondary leading-snug">
                  {item.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Waitlist Policy Toggle Card */}
      <div className="p-4 rounded-xl border border-border bg-[#FAF7F3]/70 flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <UserPlus className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-text-primary">
              Allow Waitlist Queue When Seats Full
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              If enabled, prospective students can join a prioritized waitlist and get notified when someone drops.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onChange("allowWaitlist", !allowWaitlist)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            allowWaitlist ? "bg-primary" : "bg-gray-300"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              allowWaitlist ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
