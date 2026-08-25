"use client";

import React from "react";
import {
  Sliders,
  CheckCircle,
  FileCode,
  Award,
  Bot,
  Terminal,
} from "lucide-react";

interface BatchSettingsFeaturesProps {
  attendanceEnabled: boolean;
  assignmentsEnabled: boolean;
  certificatesEnabled: boolean;
  aiTutorEnabled: boolean;
  sandboxEnabled: boolean;
  onChange: (field: string, value: boolean) => void;
}

export function BatchSettingsFeatures({
  attendanceEnabled,
  assignmentsEnabled,
  certificatesEnabled,
  aiTutorEnabled,
  sandboxEnabled,
  onChange,
}: BatchSettingsFeaturesProps) {
  const features = [
    {
      key: "attendanceEnabled",
      label: "Live Class Attendance Tracking",
      desc: "Automatically record student check-ins during live sessions and calculate cohort attendance percentage.",
      icon: CheckCircle,
      iconBg: "bg-emerald-100 text-emerald-700",
      enabled: attendanceEnabled,
    },
    {
      key: "assignmentsEnabled",
      label: "Student Assignments & Submissions",
      desc: "Enable assignment dropzones, grading rubrics, and project feedback loops within student dashboards.",
      icon: FileCode,
      iconBg: "bg-blue-100 text-blue-700",
      enabled: assignmentsEnabled,
    },
    {
      key: "certificatesEnabled",
      label: "Blockchain Completion Certificates",
      desc: "Automatically issue verified completion certificates when students reach 85%+ attendance and finish assignments.",
      icon: Award,
      iconBg: "bg-amber-100 text-amber-700",
      enabled: certificatesEnabled,
    },
    {
      key: "aiTutorEnabled",
      label: "24/7 AI Learning Assistant Module",
      desc: "Provide students with an interactive AI coding tutor trained on the cohort syllabus and study materials.",
      icon: Bot,
      iconBg: "bg-purple-100 text-purple-700",
      enabled: aiTutorEnabled,
    },
    {
      key: "sandboxEnabled",
      label: "Embedded Web IDE & Code Sandbox",
      desc: "Allow students to run and test TypeScript, Python, and React code blocks directly in browser without local setup.",
      icon: Terminal,
      iconBg: "bg-indigo-100 text-indigo-700",
      enabled: sandboxEnabled,
    },
  ];

  return (
    <div
      id="features"
      className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-5 scroll-mt-6"
    >
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary">
              Cohort Capability & Feature Entitlements
            </h2>
            <p className="text-xs text-text-secondary">
              Toggle specific learning tools, AI tutors, and assessment pipelines for this cohort
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className="p-4 rounded-xl border border-border bg-[#FAF7F3]/40 flex items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${item.iconBg}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">
                    {item.label}
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onChange(item.key, !item.enabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  item.enabled ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    item.enabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
