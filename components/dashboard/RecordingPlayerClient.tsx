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
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface RecordingPlayerClientProps {
  batchId: Id<"batches">;
  recordingId: string;
  clerkId: string;
}

export function RecordingPlayerClient({ batchId, recordingId, clerkId }: RecordingPlayerClientProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasRestoredProgress, setHasRestoredProgress] = useState(false);

  const recordings = useQuery(api.student.getRecordingsData, {
    batchId,
  });

  const updateProgress = useMutation(api.student.updateRecordingProgress);

  const isLoading = recordings === undefined;

  const currentRecordingIndex = useMemo(() => {
    if (!recordings) return -1;
    return recordings.findIndex((r) => r._id === recordingId);
  }, [recordings, recordingId]);

  const recording = recordings?.[currentRecordingIndex];
  const prevRecording = currentRecordingIndex > 0 ? recordings![currentRecordingIndex - 1] : null;
  const nextRecording = currentRecordingIndex !== -1 && currentRecordingIndex < (recordings?.length || 0) - 1 
    ? recordings![currentRecordingIndex + 1] 
    : null;

  useEffect(() => {
    if (!recording || !videoRef.current || hasRestoredProgress) return;
    
    const savedTime = recording.watchProgress?.timestamp;
    if (savedTime && savedTime > 0) {
      videoRef.current.currentTime = savedTime;
    }
    setHasRestoredProgress(true);
  }, [recording, hasRestoredProgress]);

  useEffect(() => {
    if (!recording || !videoRef.current) return;
    const video = videoRef.current;

    const handleTimeUpdate = () => {
      // We throttle updates to the database to avoid spamming.
      // E.g. every 10 seconds.
    };

    let interval = setInterval(() => {
      if (video && !video.paused) {
        const currentTime = video.currentTime;
        const duration = video.duration || 1;
        const percentage = Math.round((currentTime / duration) * 100);
        
        updateProgress({
          batchId,
          recordingId: recording._id as Id<"liveClasses">,
          timestamp: Math.floor(currentTime),
          percentage,
        }).catch(console.error);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [recording, batchId, updateProgress]);

  // Sync on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && recording) {
        const currentTime = videoRef.current.currentTime;
        const duration = videoRef.current.duration || 1;
        const percentage = Math.round((currentTime / duration) * 100);
        
        updateProgress({
          batchId,
          recordingId: recording._id as Id<"liveClasses">,
          timestamp: Math.floor(currentTime),
          percentage,
        }).catch(console.error);
      }
    };
  }, [recording, batchId, updateProgress]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-text-muted" />
      </div>
    );
  }

  if (!recording) {
    return (
      <div className="flex flex-col h-[50vh] items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center text-text-muted mb-4 shadow-sm">
          <Video className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Recording Not Found</h2>
        <p className="text-text-secondary mb-6 max-w-md">
          This recording may have been removed, unpublished, or doesn't exist.
        </p>
        <button 
          onClick={() => router.push(`/dashboard/courses/${batchId}/recordings`)}
          className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-sm shadow-sm active:scale-95 transition-all"
        >
          Back to Library
        </button>
      </div>
    );
  }

  return (
    <div className="w-full font-sans pb-24">
      {/* BREADCRUMB */}
      <nav className="flex items-center text-[13px] font-semibold text-text-muted mb-6 tracking-wide">
        <Link href={`/dashboard/courses/${batchId}/recordings`} className="hover:text-text-primary transition-colors flex items-center gap-2">
          <Video className="w-4 h-4" />
          Recordings
        </Link>
        <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
        <span className="text-text-primary font-bold truncate max-w-sm">{recording.title}</span>
      </nav>

      {/* VIDEO PLAYER */}
      <div className="w-full bg-black rounded-2xl overflow-hidden shadow-sm border border-border mb-6 aspect-video flex items-center justify-center">
        <video
          ref={videoRef}
          controls
          autoPlay
          src={recording.recordingUrl}
          className="w-full h-full object-contain"
        >
          Your browser does not support HTML5 video.
        </video>
      </div>

      {/* METADATA & NAV */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
        <div className="flex-1">
          <h1 className="text-[28px] md:text-[32px] font-extrabold text-text-primary leading-tight mb-4 tracking-tight">
            {recording.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[14px] text-text-secondary font-medium mb-6">
            {recording.moduleTitle && (
              <span className="flex items-center gap-2">
                <BookOpenIcon className="w-4 h-4 opacity-70" />
                {recording.moduleTitle}
              </span>
            )}
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 opacity-70" />
              {new Date(recording.startTime).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            {recording.instructorName && (
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 opacity-70" />
                {recording.instructorName}
              </span>
            )}
            {recording.duration && (
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 opacity-70" />
                {recording.duration}
              </span>
            )}
          </div>
          
          {recording.description && (
            <div className="text-text-secondary text-[15px] leading-relaxed max-w-3xl whitespace-pre-wrap bg-surface p-6 rounded-2xl border border-border shadow-sm">
              {recording.description}
            </div>
          )}
        </div>

        {/* PREV / NEXT NAVIGATION */}
        <div className="flex flex-col gap-3 w-full lg:w-[320px] shrink-0">
          <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Up Next</div>
          
          {nextRecording ? (
            <Link 
              href={`/dashboard/courses/${batchId}/recordings/${nextRecording._id}`}
              className="group flex flex-col p-4 bg-surface border border-border rounded-xl hover:border-primary/40 transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Next Recording</span>
                <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
              </div>
              <h4 className="text-[14px] font-bold text-text-primary leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {nextRecording.title}
              </h4>
            </Link>
          ) : (
            <div className="p-4 bg-background border border-border rounded-xl border-dashed">
              <span className="text-[12px] font-bold text-text-muted">No next recording</span>
            </div>
          )}

          {prevRecording && (
            <Link 
              href={`/dashboard/courses/${batchId}/recordings/${prevRecording._id}`}
              className="group flex flex-col p-4 bg-surface border border-border rounded-xl hover:border-primary/40 transition-colors shadow-sm mt-2"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Previous Recording</span>
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

// Quick fallback icon if BookOpen isn't imported
function BookOpenIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
  );
}
