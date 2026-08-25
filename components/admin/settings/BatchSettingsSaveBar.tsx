"use client";

import React from "react";
import { Save, RotateCcw, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface BatchSettingsSaveBarProps {
  isDirty: boolean;
  isSaving: boolean;
  onReset: () => void;
  onSave: () => void;
  saveSuccess?: boolean;
}

export function BatchSettingsSaveBar({
  isDirty,
  isSaving,
  onReset,
  onSave,
  saveSuccess,
}: BatchSettingsSaveBarProps) {
  if (!isDirty && !saveSuccess) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div
        className={`rounded-2xl p-4 shadow-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md ${
          saveSuccess
            ? "bg-emerald-900/95 border-emerald-500 text-white"
            : "bg-secondary/95 border-border/20 text-white"
        }`}
      >
        <div className="flex items-center gap-3">
          {saveSuccess ? (
            <div className="w-9 h-9 rounded-xl bg-emerald-700/60 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
          )}
          <div>
            <p className="text-sm font-bold tracking-tight">
              {saveSuccess
                ? "Cohort Settings Saved Successfully"
                : "You have unsaved cohort configuration changes"}
            </p>
            <p className="text-xs text-white/70 mt-0.5">
              {saveSuccess
                ? "All changes have been synchronized with Convex database and live student dashboards."
                : "Unsaved changes will be discarded if you navigate away from this workspace."}
            </p>
          </div>
        </div>

        {!saveSuccess && (
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end shrink-0">
            <button
              type="button"
              onClick={onReset}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl border border-white/20 hover:bg-white/10 text-xs font-semibold text-white transition-all disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5 inline-block mr-1.5" />
              Reset Changes
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save All Settings</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
