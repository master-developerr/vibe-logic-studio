"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  User,
  Clock,
  BookOpen,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { extractYouTubeVideoId, getYouTubeEmbedUrl } from "@/lib/youtube";

interface RecordingItem {
  _id: Id<"liveClasses"> | string;
  batchId?: Id<"batches">;
  title: string;
  recordingUrl?: string;
  youtubeVideoId?: string;
  startTime?: number;
  duration?: string;
  moduleTitle?: string;
  instructorName?: string;
  description?: string;
}

interface RecordingPlayerModalProps {
  recording: RecordingItem | null;
  batchId: Id<"batches">;
  onClose: () => void;
}

export function RecordingPlayerModal({
  recording,
  batchId,
  onClose,
}: RecordingPlayerModalProps) {
  const recordOpened = useMutation(api.student.recordRecordingOpened);
  const [showEmbedHelp, setShowEmbedHelp] = useState(false);

  // Derive Canonical YouTube Video ID
  const youtubeVideoId = useMemo(() => {
    if (!recording) return null;
    if (recording.youtubeVideoId && typeof recording.youtubeVideoId === "string") {
      const vid = extractYouTubeVideoId(recording.youtubeVideoId);
      if (vid) return vid;
    }
    if (recording.recordingUrl && typeof recording.recordingUrl === "string") {
      return extractYouTubeVideoId(recording.recordingUrl);
    }
    return null;
  }, [recording]);

  // Record session watch activity and mark attendance on modal open
  useEffect(() => {
    if (!recording?._id || !batchId) return;
    recordOpened({
      batchId,
      recordingId: recording._id as Id<"liveClasses">,
    }).catch(() => {});
  }, [recording?._id, batchId, recordOpened]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (recording) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [recording, onClose]);

  // Format date safely
  const formattedDate = useMemo(() => {
    if (!recording?.startTime) return "Classroom Session";
    try {
      const d = new Date(recording.startTime);
      if (isNaN(d.getTime())) return "Classroom Session";
      return d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Classroom Session";
    }
  }, [recording?.startTime]);

  if (!recording) return null;

  const embedUrl = youtubeVideoId ? `https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&rel=0` : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* BACKDROP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* MODAL CONTENT CONTAINER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-border bg-surface shadow-2xl text-text-primary z-10 p-4 sm:p-6"
        >
          {/* MODAL HEADER */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                {recording.moduleTitle && (
                  <span className="rounded-md bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                    {recording.moduleTitle}
                  </span>
                )}
                <span className="rounded-md bg-surface border border-border px-2.5 py-0.5 text-[11px] font-semibold text-text-secondary">
                  Classroom Replay
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-text-primary leading-snug tracking-tight">
                {recording.title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 text-text-muted hover:bg-background hover:text-text-primary transition-colors shrink-0"
              title="Close Player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* EMBEDDED 16:9 VIDEO CONTAINER */}
          <div className="w-full bg-black rounded-2xl overflow-hidden shadow-lg border border-border aspect-video relative flex items-center justify-center mb-5">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={recording.title || "Course recording"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0 absolute inset-0 rounded-2xl"
              />
            ) : recording.recordingUrl ? (
              <video
                controls
                autoPlay
                src={recording.recordingUrl}
                className="w-full h-full object-contain"
              >
                Your browser does not support HTML5 video playback.
              </video>
            ) : (
              /* RECORDING UNAVAILABLE STATE */
              <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white/70 mb-3 shadow-inner">
                  <AlertTriangle className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">Recording unavailable</h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  The recording stream for this session is being processed or was not provided.
                </p>
              </div>
            )}
          </div>

          {/* EMBEDDING PERMISSION NOTICE (TOGGLEABLE) */}
          {showEmbedHelp && (
            <div className="mb-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-sm text-amber-800 dark:text-amber-100">
                  Video embedding restrictions
                </p>
                <p className="mt-0.5 leading-relaxed text-xs">
                  Unlisted YouTube videos play seamlessly when &quot;Allow embedding&quot; is enabled
                  in YouTube Studio. If you see an embed error, verify video embedding permissions
                  under the video&apos;s Advanced Settings.
                </p>
              </div>
              <button
                onClick={() => setShowEmbedHelp(false)}
                className="text-xs font-bold text-amber-700 hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* SESSION METADATA */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs sm:text-[13px] text-text-secondary font-medium border-b border-border pb-4 mb-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 opacity-70" />
              <span>{formattedDate}</span>
            </span>
            {recording.instructorName && (
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 opacity-70" />
                <span>{recording.instructorName}</span>
              </span>
            )}
            {recording.duration && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 opacity-70" />
                <span>{recording.duration}</span>
              </span>
            )}
            <button
              onClick={() => setShowEmbedHelp(!showEmbedHelp)}
              className="ml-auto text-[11px] text-text-muted hover:text-text-primary transition-colors underline"
            >
              Playback assistance
            </button>
          </div>

          {/* SESSION DESCRIPTION */}
          {recording.description && (
            <div className="text-text-secondary text-xs sm:text-[13px] leading-relaxed max-w-full whitespace-pre-wrap bg-background p-4 rounded-xl border border-border">
              {recording.description}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
