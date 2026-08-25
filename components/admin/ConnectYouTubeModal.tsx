"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Link,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Folder,
  User,
  Shield,
  Video,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

function YoutubeIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

interface ConnectYouTubeModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchId: Id<"batches">;
  batchTitle?: string;
  courseTitle?: string;
  onSuccess?: () => void;
}

export default function ConnectYouTubeModal({
  isOpen,
  onClose,
  batchId,
  batchTitle,
  courseTitle,
  onSuccess,
}: ConnectYouTubeModalProps) {
  // Use createBatchRecordingExtended to connect YouTube stream
  const createRecMut = useMutation(api.admin.createBatchRecordingExtended);

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [titleOverride, setTitleOverride] = useState("");
  const [moduleTitle, setModuleTitle] = useState(
    "Module 1: Foundations & Setup"
  );
  const [instructorName, setInstructorName] = useState("Alex D'Souza");
  const [isSyncing, setIsSyncing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [syncedPreview, setSyncedPreview] = useState<{
    videoId: string;
    title: string;
    thumbnail: string;
  } | null>(null);

  if (!isOpen) return null;

  const extractYouTubeId = (url: string): string | null => {
    const regex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleVerifyUrl = () => {
    const vid = extractYouTubeId(youtubeUrl.trim());
    if (!vid) {
      setErrorMessage(
        "Invalid YouTube URL. Please provide a standard YouTube share or watch URL."
      );
      setSyncedPreview(null);
      return;
    }
    setErrorMessage("");
    setSyncedPreview({
      videoId: vid,
      title: titleOverride.trim() || `YouTube Stream (${vid})`,
      thumbnail: `https://img.youtube.com/vi/${vid}/maxresdefault.jpg`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const vid = extractYouTubeId(youtubeUrl.trim());
    if (!vid) {
      setErrorMessage("Please enter a valid YouTube live or archived video URL.");
      return;
    }

    setIsSyncing(true);
    setErrorMessage("");

    try {
      if (!batchId.toString().startsWith("mock-") && !batchId.toString().startsWith("demo-")) {
        await createRecMut({
          batchId: batchId as any,
          title: titleOverride.trim() || `YouTube Live Stream (${vid})`,
          recordingUrl: youtubeUrl.trim(),
          youtubeVideoId: vid,
          videoSource: "YouTube",
          moduleTitle,
          instructorName: instructorName.trim() || "Alex D'Souza",
          status: "Published",
          visibility: "Public to Batch",
        });
      }

      setYoutubeUrl("");
      setTitleOverride("");
      setSyncedPreview(null);
      setIsSyncing(false);

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error("YouTube sync failed:", err);
      setErrorMessage(
        err?.message || "Failed to synchronize YouTube video. Please try again."
      );
      setIsSyncing(false);
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
          className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-2xl text-text-primary z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-600">
                <YoutubeIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-text-primary">
                  Connect YouTube Stream
                </h3>
                <p className="text-xs text-text-muted">
                  Synchronize YouTube Live or playlist recording for <strong className="text-text-primary">{courseTitle || "Cohort"} {batchTitle ? `• ${batchTitle}` : ""}</strong>
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

            {/* YouTube URL */}
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">
                YouTube URL <span className="text-error">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => {
                    setYoutubeUrl(e.target.value);
                    setSyncedPreview(null);
                  }}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-red-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleVerifyUrl}
                  className="shrink-0 rounded-xl bg-background border border-border px-3.5 py-2.5 text-xs font-bold text-text-primary hover:bg-surface transition-colors shadow-sm"
                >
                  Verify URL
                </button>
              </div>
            </div>

            {/* Synced Preview Box */}
            {syncedPreview && (
              <div className="overflow-hidden rounded-xl border border-red-500/20 bg-red-500/5 p-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg bg-black">
                    <img
                      src={syncedPreview.thumbnail}
                      alt="YouTube Thumbnail"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <YoutubeIcon className="h-5 w-5 text-red-600" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-red-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>YouTube Stream Verified</span>
                    </div>
                    <div className="truncate text-xs font-bold text-text-primary mt-0.5">
                      Video ID: {syncedPreview.videoId}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Optional Title Override */}
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">
                Custom Title Override (Optional)
              </label>
              <input
                type="text"
                placeholder="Leave blank to use default YouTube video title..."
                value={titleOverride}
                onChange={(e) => setTitleOverride(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-red-500 focus:outline-none"
              />
            </div>

            {/* Module & Instructor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Assign to Module
                </label>
                <select
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-semibold text-text-primary focus:border-red-500 focus:outline-none"
                >
                  <option value="Module 1: Foundations & Setup">
                    Module 1: Foundations &amp; Setup
                  </option>
                  <option value="Module 2: Advanced Patterns & Architecture">
                    Module 2: Advanced Patterns &amp; Architecture
                  </option>
                  <option value="Module 3: Full-Stack Integration & APIs">
                    Module 3: Full-Stack Integration &amp; APIs
                  </option>
                  <option value="Module 4: Database Modeling & Deployment">
                    Module 4: Database Modeling &amp; Deployment
                  </option>
                  <option value="Bonus Workgroups & Q&A">
                    Bonus Workgroups &amp; Q&amp;A
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Instructor Name
                </label>
                <input
                  type="text"
                  placeholder="Alex D'Souza"
                  value={instructorName}
                  onChange={(e) => setInstructorName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                disabled={isSyncing}
                className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSyncing}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-500 transition-colors shadow-sm disabled:opacity-50"
              >
                <YoutubeIcon className="h-4 w-4" />
                <span>
                  {isSyncing
                    ? "Syncing YouTube..."
                    : "Synchronize Stream"}
                </span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
