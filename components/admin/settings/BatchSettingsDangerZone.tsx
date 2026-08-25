"use client";

import React from "react";
import { AlertTriangle, Archive, Copy, Trash2 } from "lucide-react";

interface BatchSettingsDangerZoneProps {
  isArchived: boolean;
  onOpenArchiveModal: () => void;
  onOpenDuplicateModal: () => void;
  onOpenDeleteModal: () => void;
}

export function BatchSettingsDangerZone({
  isArchived,
  onOpenArchiveModal,
  onOpenDuplicateModal,
  onOpenDeleteModal,
}: BatchSettingsDangerZoneProps) {
  return (
    <div
      id="danger"
      className="bg-red-50/70 border border-red-200 rounded-2xl p-6 shadow-xs space-y-5 scroll-mt-6"
    >
      <div className="flex items-center gap-3 border-b border-red-200 pb-4">
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 font-bold">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-red-900">
            Danger Zone — Destructive Operations
          </h2>
          <p className="text-xs text-red-700">
            Archiving, cloning, or deleting a cohort program directly affects active learner access and billing
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* 1. Archive Toggle */}
        <div className="p-4 rounded-xl border border-red-200 bg-surface/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Archive className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-text-primary">
                {isArchived ? "Restore Cohort Program" : "Archive Cohort Program"}
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                {isArchived
                  ? "This cohort is currently archived and hidden from public views. Restoring will make it visible again."
                  : "Move this batch to read-only archives. Enrolled students retain historical certificate and recording access."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenArchiveModal}
            className="px-4 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold shrink-0 transition-all"
          >
            {isArchived ? "Unarchive Cohort" : "Archive Cohort"}
          </button>
        </div>

        {/* 2. Duplicate / Clone Batch */}
        <div className="p-4 rounded-xl border border-red-200 bg-surface/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Copy className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-text-primary">
                Duplicate Cohort Configuration & Syllabus
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                Create a clone of this batch with all settings, feature entitlements, and study materials for a future cohort.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenDuplicateModal}
            className="px-4 py-2 rounded-xl border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold shrink-0 transition-all"
          >
            Duplicate Cohort
          </button>
        </div>

        {/* 3. Delete Batch */}
        <div className="p-4 rounded-xl border border-red-300 bg-red-100/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Trash2 className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-900">
                Permanently Delete Cohort Program
              </p>
              <p className="text-xs text-red-700 mt-0.5">
                Permanently erase this cohort, all live class schedules, and attendance logs. This cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenDeleteModal}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shrink-0 shadow-xs transition-all"
          >
            Delete Cohort Program
          </button>
        </div>
      </div>
    </div>
  );
}
