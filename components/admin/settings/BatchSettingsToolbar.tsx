"use client";

import React from "react";
import {
  Settings,
  ShieldCheck,
  Clock,
  Layers,
  Users,
  MessageSquare,
  Sliders,
  AlertTriangle,
} from "lucide-react";
import { BatchSettingsData } from "./types";

interface BatchSettingsToolbarProps {
  settings: BatchSettingsData;
  completenessScore: number;
  onJumpToSection: (sectionId: string) => void;
  activeSection?: string;
}

export function BatchSettingsToolbar({
  settings,
  completenessScore,
  onJumpToSection,
  activeSection = "general",
}: BatchSettingsToolbarProps) {
  const jumpItems = [
    { id: "general", label: "General", icon: Layers },
    { id: "enrollment", label: "Enrollment", icon: Users },
    { id: "communication", label: "Communication", icon: MessageSquare },
    { id: "resources", label: "Resources Hub", icon: Settings },
    { id: "features", label: "Features", icon: Sliders },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle, isDanger: true },
  ];

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <Settings className="w-3.5 h-3.5" />
              Cohort Configuration OS
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              {completenessScore}% Configured
            </span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            {settings.title} — Workspace Settings
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-2xl">
            Configure cohort lifecycle rules, enrollment capacity thresholds,
            live communication channels, and student feature entitlements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-text-primary">
              Instructor Lead
            </p>
            <p className="text-xs text-text-secondary flex items-center justify-end gap-1 mt-0.5">
              <Clock className="w-3 h-3 text-text-muted" />
              {settings.instructorName || "Marcus Krenn"}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Jump Pills */}
      <div className="pt-4 border-t border-border flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider pr-2 shrink-0">
          Quick Jump:
        </span>
        {jumpItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onJumpToSection(item.id)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                item.isDanger
                  ? "text-red-600 bg-red-50 hover:bg-red-100 border border-red-200"
                  : isActive
                  ? "bg-primary text-white shadow-xs"
                  : "bg-surface hover:bg-[#FAF7F3] text-text-secondary border border-border"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
