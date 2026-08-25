"use client";

import React from "react";
import { Layers, Calendar, Globe, UserCheck, BookOpen } from "lucide-react";

interface BatchSettingsGeneralProps {
  title: string;
  description: string;
  instructorName: string;
  timezone: string;
  startDate: string;
  endDate: string;
  status: string;
  courseTitle: string;
  courseSlug: string;
  onChange: (field: string, value: string) => void;
}

export function BatchSettingsGeneral({
  title,
  description,
  instructorName,
  timezone,
  startDate,
  endDate,
  status,
  courseTitle,
  courseSlug,
  onChange,
}: BatchSettingsGeneralProps) {
  return (
    <div
      id="general"
      className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-6 scroll-mt-6"
    >
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary">
              General Cohort Information
            </h2>
            <p className="text-xs text-text-secondary">
              Core identity, curriculum attachment, lead instructor, and schedule boundaries
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF7F3] border border-border text-xs font-semibold text-text-secondary">
          <BookOpen className="w-3.5 h-3.5 text-primary" />
          <span>Course:</span>
          <span className="text-text-primary font-bold">{courseTitle}</span>
          <span className="text-text-muted">({courseSlug})</span>
        </div>
      </div>

      {/* Grid for Name and Instructor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
            Cohort Batch Name <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="e.g. October 2026 Intensive Cohort"
            className="w-full h-11 px-3.5 rounded-xl border border-border bg-surface text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            required
          />
          <p className="text-[11px] text-text-muted mt-1">
            Displayed across learner dashboards, certificates, and calendar invites.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
            Lead Instructor & Mentor
          </label>
          <div className="relative">
            <UserCheck className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={instructorName}
              onChange={(e) => onChange("instructorName", e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-surface text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
            >
              <option value="Marcus Krenn">Marcus Krenn (Lead AI Architect)</option>
              <option value="Alex D'Souza">Alex D&apos;Souza (Product Admin)</option>
              <option value="Sarah Chen">Sarah Chen (Senior Fullstack Lead)</option>
              <option value="Elena Rostova">Elena Rostova (Systems Engineer)</option>
            </select>
          </div>
          <p className="text-[11px] text-text-muted mt-1">
            Instructor profile photo and bio will be shown on the student portal.
          </p>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
          Cohort Companion Description
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Brief executive summary of cohort learning objectives and schedule structure..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
        />
      </div>

      {/* Grid for Schedule & Timezone */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onChange("startDate", e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl border border-border bg-surface text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onChange("endDate", e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl border border-border bg-surface text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-primary" />
            Cohort Timezone
          </label>
          <select
            value={timezone}
            onChange={(e) => onChange("timezone", e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl border border-border bg-surface text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="Asia/Kolkata (GMT+5:30)">Asia/Kolkata (GMT+5:30)</option>
            <option value="America/New_York (GMT-5:00)">America/New_York (GMT-5:00)</option>
            <option value="America/Los_Angeles (GMT-8:00)">America/Los_Angeles (GMT-8:00)</option>
            <option value="Europe/London (GMT+0:00)">Europe/London (GMT+0:00)</option>
            <option value="Asia/Singapore (GMT+8:00)">Asia/Singapore (GMT+8:00)</option>
          </select>
        </div>
      </div>

      {/* Operational Status */}
      <div className="pt-2 border-t border-border">
        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
          Cohort Operational Lifecycle State
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              value: "upcoming",
              title: "Upcoming (Pre-launch)",
              desc: "Students can view syllabus & onboard before live classes start.",
              badge: "bg-blue-100 text-blue-800 border-blue-200",
            },
            {
              value: "live",
              title: "Live (Active Learning)",
              desc: "Cohort is currently in session; live classes & attendance active.",
              badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
            },
            {
              value: "completed",
              title: "Completed (Archived)",
              desc: "Curriculum finished. Recordings & materials remain accessible.",
              badge: "bg-gray-100 text-gray-800 border-gray-200",
            },
          ].map((item) => {
            const isSelected = status === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onChange("status", item.value)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-xs ring-2 ring-primary/20"
                    : "border-border bg-surface hover:bg-[#FAF7F3]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-text-primary">
                    {item.title}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <p className="text-xs text-text-secondary leading-snug">
                  {item.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
