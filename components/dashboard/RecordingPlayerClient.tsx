"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  ChevronLeft,
  ChevronRight,
  Video,
  Loader2,
  Calendar,
  User,
  Clock,
  BookOpen,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { extractYouTubeVideoId, getYouTubeEmbedUrl } from "@/lib/youtube";

interface RecordingPlayerClientProps {
  batchId: Id<"batches">;
  recordingId: string;
  clerkId: string;
}

export function RecordingPlayerClient({ batchId, recordingId, clerkId }: RecordingPlayerClientProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasRestoredProgress, setHasRestoredProgress] = useState(false);
  const [embedIssueNotice, setEmbedIssueNotice] = useState(false);

  // Single recording query
  const singleRecording = useQuery(api.student.getRecordingById, {
    batchId,
    recordingId,
  });

  // Batch recordings for playlist / next & prev navigation
  const recordings = useQuery(api.student.getRecordingsData, {
    batchId,
  });

  const updateProgress = useMutation(api.student.updateRecordingProgress);
  const markAttendance = useMutation(api.student.markSessionAttendance);

  const isLoading = singleRecording === undefined && recordings === undefined;

  // Resolve target recording
  const recording = useMemo(() => {
    if (singleRecording) return singleRecording;
    if (!recordings) return null;
    return recordings.find((r) => r._id === recordingId) || null;
  }, [singleRecording, recordings, recordingId]);

  // Playlist navigation indices
  const currentRecordingIndex = useMemo(() => {
    if (!recordings || !recording) return -1;
    return recordings.findIndex((r) => r._id === recording._id);
  }, [recordings, recording]);

  const prevRecording = currentRecordingIndex > 0 ? recordings![currentRecordingIndex - 1] : null;
  const nextRecording =
    currentRecordingIndex !== -1 && currentRecordingIndex < (recordings?.length || 0) - 1
      ? recordings![currentRecordingIndex + 1]
      : null;

  // Resolve Canonical YouTube Video ID (from database field or dynamically extracted)
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

  // Mark session attendance once on initial load
  useEffect(() => {
    if (!recording?._id) return;
    markAttendance({
      sessionId: recording._id as Id<"liveClasses">,
      attendanceSource: "recording_watch",
    }).catch(() => {});
  }, [recording?._id, markAttendance]);

  // Restore playback progress for native video
  useEffect(() => {
    if (!recording || !videoRef.current || hasRestoredProgress || youtubeVideoId) return;

    const savedTime = recording.watchProgress?.timestamp;
    if (savedTime && savedTime > 0) {
      videoRef.current.currentTime = savedTime;
    }
    setHasRestoredProgress(true);
  }, [recording, hasRestoredProgress, youtubeVideoId]);

  // Periodic watch progress tracking
  useEffect(() => {
    if (!recording) return;

    if (youtubeVideoId) {
      // Periodic progress update for embedded YouTube sessions
      const interval = setInterval(() => {
        updateProgress({
          batchId,
          recordingId: recording._id as Id<"liveClasses">,
          timestamp: 60,
          percentage: 100,
        }).catch(() => {});
      }, 30000);
      return () => clearInterval(interval);
    }

    if (!videoRef.current) return;
    const video = videoRef.current;

    const interval = setInterval(() => {
      if (video && !video.paused) {
        const currentTime = video.currentTime;
        const duration = video.duration || 1;
        const percentage = Math.round((currentTime / duration) * 100);

        updateProgress({
          batchId,
          recordingId: recording._id as Id<"liveClasses">,
          timestamp: Math.floor(currentTime),
          percentage,
        }).catch(() => {});
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [recording, batchId, updateProgress, youtubeVideoId]);

  // Sync on unmount for native video
  useEffect(() => {
    return () => {
      if (videoRef.current && recording && !youtubeVideoId) {
        const currentTime = videoRef.current.currentTime;
        const duration = videoRef.current.duration || 1;
        const percentage = Math.round((currentTime / duration) * 100);

        updateProgress({
          batchId,
          recordingId: recording._id as Id<"liveClasses">,
          timestamp: Math.floor(currentTime),
          percentage,
        }).catch(() => {});
      }
    };
  }, [recording, batchId, updateProgress, youtubeVideoId]);

  // Helper for safe date string formatting
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

  if (isLoading) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-semibold text-text-muted">Loading recording player...</p>
      </div>
    );
  }

  if (!recording) {
    return (
      <div className="flex flex-col h-[55vh] items-center justify-center text-center p-6">
        <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center text-text-muted mb-4 shadow-sm">
          <Video className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-text-primary mb-2">Recording Not Found</h2>
        <p className="text-text-secondary mb-6 max-w-md text-sm leading-relaxed">
          This recording may have been moved, unpublished, or is not available for your enrolled cohort.
        </p>
        <button
          onClick={() => router.push(`/dashboard/courses/${batchId}/recordings`)}
          className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-xs shadow-sm active:scale-95 transition-all"
        >
          Back to Recordings Library
        </button>
      </div>
    );
  }

  const hasVideoSource = Boolean(youtubeVideoId || recording.recordingUrl);

  return (
    <div className="w-full font-sans pb-24 max-w-[1320px] mx-auto">
      {/* BREADCRUMB NAVIGATION */}
      <nav className="flex items-center text-[13px] font-semibold text-text-muted mb-6 tracking-wide">
        <Link
          href={`/dashboard/courses/${batchId}/recordings`}
          className="hover:text-text-primary transition-colors flex items-center gap-2"
        >
          <Video className="w-4 h-4" />
          <span>Recordings</span>
        </Link>
        <ChevronRight className="w-4 h-4 mx-2 opacity-40" />
        <span className="text-text-primary font-bold truncate max-w-sm">{recording.title}</span>
      </nav>

      {/* EMBEDDED VIDEO PLAYER CONTAINER (RESPONSIVE 16:9) */}
      <div className="w-full bg-black rounded-2xl overflow-hidden shadow-md border border-border mb-6 aspect-video relative flex items-center justify-center">
        {youtubeVideoId ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&rel=0`}
            title={recording.title || "Course recording"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0 absolute inset-0 rounded-2xl"
          />
        ) : recording.recordingUrl ? (
          <video
            ref={videoRef}
            controls
            autoPlay
            src={recording.recordingUrl}
            className="w-full h-full object-contain"
          >
            Your browser does not support HTML5 video playback.
          </video>
        ) : (
          /* VIDEO UNAVAILABLE FALLBACK */
          <div className="flex flex-col items-center justify-center p-8 text-center max-w-md z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white/70 mb-3 shadow-inner">
              <AlertTriangle className="w-7 h-7 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Video unavailable</h3>
            <p className="text-xs text-white/60 leading-relaxed mb-4">
              The stream for this recording is currently unavailable or being processed.
            </p>
            <button
              onClick={() => router.push(`/dashboard/courses/${batchId}/recordings`)}
              className="px-5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors"
            >
              Return to Library
            </button>
          </div>
        )}
      </div>

      {/* EMBEDDING PERMISSION NOTICE (IF DISABLED BY YOUTUBE SETTINGS) */}
      {embedIssueNotice && (
        <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-sm text-amber-800 dark:text-amber-100">
              This video cannot be embedded.
            </p>
            <p className="mt-0.5 leading-relaxed text-xs">
              Please check the YouTube video&apos;s embedding permissions in YouTube Studio. Ensure
              &quot;Allow embedding&quot; is turned on in the video&apos;s Advanced Settings.
            </p>
          </div>
          <button
            onClick={() => setEmbedIssueNotice(false)}
            className="text-xs font-bold text-amber-700 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* METADATA & SIDEBAR NAVIGATION */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-[26px] md:text-[32px] font-black text-text-primary leading-tight mb-4 tracking-tight">
            {recording.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-text-secondary font-medium mb-6">
            {recording.moduleTitle && (
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 opacity-70" />
                <span>{recording.moduleTitle}</span>
              </span>
            )}
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 opacity-70" />
              <span>{formattedDate}</span>
            </span>
            {recording.instructorName && (
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 opacity-70" />
                <span>{recording.instructorName}</span>
              </span>
            )}
            {recording.duration && (
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 opacity-70" />
                <span>{recording.duration}</span>
              </span>
            )}
          </div>

          {recording.description && (
            <div className="text-text-secondary text-[14px] leading-relaxed max-w-3xl whitespace-pre-wrap bg-surface p-6 rounded-2xl border border-border shadow-sm">
              {recording.description}
            </div>
          )}

          {/* Player Controls / Help banner */}
          <div className="mt-4 flex items-center gap-4 text-xs text-text-muted">
            <button
              onClick={() => setEmbedIssueNotice(!embedIssueNotice)}
              className="hover:text-text-primary transition-colors text-[11px] underline"
            >
              Having playback or embedding issues?
            </button>
          </div>
        </div>

        {/* PLAYLIST / UP NEXT NAVIGATION */}
        <div className="flex flex-col gap-3 w-full lg:w-[320px] shrink-0">
          <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">
            Cohort Recordings
          </div>

          {nextRecording ? (
            <Link
              href={`/dashboard/courses/${batchId}/recordings/${nextRecording._id}`}
              className="group flex flex-col p-4 bg-surface border border-border rounded-2xl hover:border-primary/40 transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                  Next Recording
                </span>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
              </div>
              <h4 className="text-[14px] font-bold text-text-primary leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {nextRecording.title}
              </h4>
            </Link>
          ) : (
            <div className="p-4 bg-background border border-border rounded-2xl border-dashed">
              <span className="text-[12px] font-bold text-text-muted">No next recording</span>
            </div>
          )}

          {prevRecording && (
            <Link
              href={`/dashboard/courses/${batchId}/recordings/${prevRecording._id}`}
              className="group flex flex-col p-4 bg-surface border border-border rounded-2xl hover:border-primary/40 transition-colors shadow-sm mt-2"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                  Previous Recording
                </span>
                <ChevronLeft className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
              </div>
              <h4 className="text-[14px] font-bold text-text-primary leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {prevRecording.title}
              </h4>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
