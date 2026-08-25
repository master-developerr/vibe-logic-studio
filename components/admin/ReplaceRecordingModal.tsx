"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  RefreshCw,
  Video,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Lock,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface ReplaceRecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordingId?: Id<"liveClasses">;
  recordingTitle?: string;
  currentUrl?: string;
  recording?: any;
  onSuccess?: () => void;
}

export default function ReplaceRecordingModal({
  isOpen,
  onClose,
  recordingId,
  recordingTitle,
  currentUrl,
  recording,
  onSuccess,
}: ReplaceRecordingModalProps) {
  // STRICT RULES OF HOOKS: All hooks unconditionally at top level
  const updateRecording = useMutation(api.admin.updateBatchRecordingExtended);

  const targetId = recording?.id || recordingId;
  const targetTitle = recording?.title || recordingTitle || "Classroom Session";
  const targetUrl = recording?.recordingUrl || currentUrl || "";

  const [newUrl, setNewUrl] = useState("");
  const [newSource, setNewSource] = useState<
    "AWS S3" | "YouTube" | "Vimeo" | "Zoom"
  >("AWS S3");
  const [isReplacing, setIsReplacing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen || !targetId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) {
      setErrorMessage("Please enter a valid new recording URL.");
      return;
    }

    setIsReplacing(true);
    setErrorMessage("");

    try {
      if (!targetId.startsWith("mock-")) {
        await updateRecording({
          id: targetId as any,
          recordingUrl: newUrl.trim(),
          videoSource: newSource,
        });
      }

      setNewUrl("");
      setIsReplacing(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Failed to replace recording URL:", err);
      setErrorMessage(
        err?.message || "Failed to replace recording URL. Please try again."
      );
      setIsReplacing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-2xl text-text-primary z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <RefreshCw className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-text-primary">
                  Replace Video Stream
                </h3>
                <p className="text-xs text-text-muted">
                  Update source CDN URL without resetting student analytics
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-text-muted hover:bg-background hover:text-text-primary transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {errorMessage && (
              <div className="flex items-center gap-2 rounded-xl bg-error/10 border border-error/20 p-3 text-xs font-bold text-error">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Current Target Info */}
            <div className="rounded-xl border border-border bg-background p-3 text-xs">
              <div className="text-text-muted font-semibold">Target Session:</div>
              <div className="font-bold text-text-primary truncate mt-0.5">
                {targetTitle}
              </div>
              {targetUrl && (
                <div className="text-[11px] text-text-muted truncate mt-1">
                  Current: {targetUrl}
                </div>
              )}
            </div>

            {/* New URL */}
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">
                New Recording Stream URL <span className="text-error">*</span>
              </label>
              <input
                type="url"
                required
                placeholder="https://cdn.vibelogic.studio/stream/new-hd.mp4"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* New Source */}
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">
                New Video CDN Source
              </label>
              <select
                value={newSource}
                onChange={(e) => setNewSource(e.target.value as any)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-semibold text-text-primary focus:border-amber-500 focus:outline-none"
              >
                <option value="AWS S3">AWS S3 / CloudFront HD</option>
                <option value="YouTube">YouTube Live</option>
                <option value="Vimeo">Vimeo Enterprise</option>
                <option value="Zoom">Zoom Cloud</option>
              </select>
            </div>

            {/* Note banner */}
            <div className="flex items-start gap-2 rounded-xl bg-primary/5 border border-primary/20 p-3 text-[11px] text-text-secondary">
              <ShieldAlert className="h-4 w-4 shrink-0 text-primary mt-0.5" />
              <span>
                Replacing this URL updates the video player instantly for all enrolled students while preserving watch history and bookmarks.
              </span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                disabled={isReplacing}
                className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isReplacing}
                className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-amber-500 transition-colors shadow-sm disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4" />
                <span>
                  {isReplacing ? "Replacing Stream..." : "Replace Stream"}
                </span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
