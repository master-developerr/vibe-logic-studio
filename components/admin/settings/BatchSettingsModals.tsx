"use client";

import React, { useState } from "react";
import {
  X,
  Archive,
  Copy,
  Trash2,
  AlertTriangle,
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface ArchiveBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isArchived: boolean;
  batchTitle: string;
}

export function ArchiveBatchModal({
  isOpen,
  onClose,
  onConfirm,
  isArchived,
  batchTitle,
}: ArchiveBatchModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">
                {isArchived ? "Restore Cohort Program?" : "Archive Cohort Program?"}
              </h3>
              <p className="text-xs text-text-secondary">
                {batchTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-text-muted hover:text-text-primary rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed mb-6">
          {isArchived
            ? "Restoring this cohort will return it to active administrator and learner views. Enrolled students will regain live status displays."
            : "Archiving this cohort will move it to read-only archives. All existing recordings, materials, and certificates remain accessible to enrolled students."}
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border bg-surface text-xs font-semibold text-text-secondary hover:bg-[#FAF7F3]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Archive className="w-4 h-4" />
            )}
            <span>{isArchived ? "Yes, Restore Cohort" : "Yes, Archive Cohort"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

interface DuplicateBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newTitle: string) => Promise<void>;
  batchTitle: string;
}

export function DuplicateBatchModal({
  isOpen,
  onClose,
  onConfirm,
  batchTitle,
}: DuplicateBatchModalProps) {
  const [newTitle, setNewTitle] = useState(`${batchTitle} (Copy)`);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      setLoading(true);
      await onConfirm(newTitle.trim());
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              <Copy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">
                Duplicate Cohort Program
              </h3>
              <p className="text-xs text-text-secondary">
                Clone settings and syllabus structure
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-text-muted hover:text-text-primary rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleConfirm} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
              New Cohort Name <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. November 2026 Cohort"
              className="w-full h-11 px-3.5 rounded-xl border border-border bg-surface text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>

          <div className="p-3 rounded-xl bg-[#FAF7F3] border border-border/80 text-xs text-text-secondary space-y-1">
            <p className="font-semibold text-text-primary">What gets copied:</p>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-text-muted">
              <li>Course assignment and lead instructor profile</li>
              <li>Communication URLs (WhatsApp, Google Meet, Discord)</li>
              <li>Feature entitlements and waitlist policy</li>
              <li>Enrolled student count is reset to 0</li>
            </ul>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border bg-surface text-xs font-semibold text-text-secondary hover:bg-[#FAF7F3]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !newTitle.trim()}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span>Create Cloned Cohort</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface DeleteBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  batchTitle: string;
}

export function DeleteBatchModal({
  isOpen,
  onClose,
  onConfirm,
  batchTitle,
}: DeleteBatchModalProps) {
  const [confirmationText, setConfirmationText] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const isConfirmed =
    confirmationText.trim().toLowerCase() === batchTitle.trim().toLowerCase() ||
    confirmationText.trim().toUpperCase() === "DELETE";

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfirmed) return;
    try {
      setLoading(true);
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-surface border border-red-300 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-900">
                Permanently Delete Cohort?
              </h3>
              <p className="text-xs text-red-700">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-text-muted hover:text-text-primary rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed mb-4">
          You are about to permanently delete <strong>{batchTitle}</strong>. All associated schedule records and attendance data will be permanently erased.
        </p>

        <form onSubmit={handleConfirm} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
              Type <span className="text-red-600 font-bold">{batchTitle}</span> (or <span className="text-red-600 font-bold">DELETE</span>) to confirm
            </label>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={`Type "${batchTitle}" or "DELETE"`}
              className="w-full h-11 px-3.5 rounded-xl border border-red-300 bg-red-50/30 text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border bg-surface text-xs font-semibold text-text-secondary hover:bg-[#FAF7F3]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isConfirmed}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              <span>Delete Cohort Permanently</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
