"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Search,
  Video,
  Play,
  RotateCcw,
  Loader2,
  Calendar,
  User,
} from "lucide-react";
import Link from "next/link";
import { extractYouTubeVideoId } from "@/lib/youtube";
import { WatchRecordingButton } from "./WatchRecordingButton";

interface CourseRecordingsClientProps {
  batchId: Id<"batches">;
  clerkId: string;
}

export function CourseRecordingsClient({ batchId, clerkId }: CourseRecordingsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // All | Watched | Unwatched
  const [moduleFilter, setModuleFilter] = useState("All Modules");
  const [instructorFilter, setInstructorFilter] = useState("All Instructors");
  const [sortOption, setSortOption] = useState("Newest First");

  const recordings = useQuery(api.student.getRecordingsData, {
    batchId,
  });

  const isLoading = recordings === undefined;

  // Extract unique modules and instructors for filters
  const modules = useMemo(() => {
    if (!recordings) return ["All Modules"];
    const mods = new Set<string>();
    recordings.forEach((r) => {
      if (r.moduleTitle) mods.add(r.moduleTitle);
    });
    return ["All Modules", ...Array.from(mods)];
  }, [recordings]);

  const instructors = useMemo(() => {
    if (!recordings) return ["All Instructors"];
    const insts = new Set<string>();
    recordings.forEach((r) => {
      if (r.instructorName) insts.add(r.instructorName);
    });
    return ["All Instructors", ...Array.from(insts)];
  }, [recordings]);

  // Statistics
  const stats = useMemo(() => {
    if (!recordings) return { total: 0, watched: 0, unwatched: 0, watchTimeHours: 0, watchTimeMins: 0 };
    let watched = 0;
    let unwatched = 0;
    let totalSeconds = 0;

    recordings.forEach((r) => {
      if (r.watchProgress?.status === "Completed") {
        watched++;
      } else {
        unwatched++;
      }
      
      if (r.watchProgress && r.watchProgress.timestamp) {
        totalSeconds += r.watchProgress.timestamp;
      }
    });

    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);

    return { total: recordings.length, watched, unwatched, watchTimeHours: hours, watchTimeMins: mins };
  }, [recordings]);

  const filteredRecordings = useMemo(() => {
    if (!recordings) return [];

    return recordings
      .filter((rec) => {
        const matchesSearch =
          rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (rec.moduleTitle && rec.moduleTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (rec.instructorName && rec.instructorName.toLowerCase().includes(searchQuery.toLowerCase()));

        let matchesStatus = true;
        if (statusFilter === "Watched") {
          matchesStatus = rec.watchProgress?.status === "Completed";
        } else if (statusFilter === "Unwatched") {
          matchesStatus = rec.watchProgress?.status !== "Completed";
        }

        const matchesModule = moduleFilter === "All Modules" || rec.moduleTitle === moduleFilter;
        const matchesInstructor = instructorFilter === "All Instructors" || rec.instructorName === instructorFilter;

        return matchesSearch && matchesStatus && matchesModule && matchesInstructor;
      })
      .sort((a, b) => {
        const getSeconds = (durationStr?: string) => {
          if (!durationStr) return 0;
          const parts = durationStr.split(":").map(Number);
          if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
          if (parts.length === 2) return parts[0] * 60 + parts[1];
          return 0;
        };

        switch (sortOption) {
          case "Newest First":
            return b.startTime - a.startTime;
          case "Oldest First":
            return a.startTime - b.startTime;
          case "Longest":
            return getSeconds(b.duration) - getSeconds(a.duration);
          case "Shortest":
            return getSeconds(a.duration) - getSeconds(b.duration);
          case "Most Watched":
            return (b.views || 0) - (a.views || 0);
          case "Least Watched":
            return (a.views || 0) - (b.views || 0);
          case "Recently Watched":
            return (b.watchProgress?.updatedAt || 0) - (a.watchProgress?.updatedAt || 0);
          default:
            return b.startTime - a.startTime;
        }
      });
  }, [recordings, searchQuery, statusFilter, moduleFilter, instructorFilter, sortOption]);

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  return (
    <div className="w-full font-sans pb-24 flex flex-col items-start max-w-[1320px]">
      {/* PAGE HEADER */}
      <div className="flex flex-col items-start text-left mb-8 w-full">
        <h2 className="text-[36px] md:text-[40px] font-extrabold text-text-primary leading-tight mb-3 tracking-tight">
          Class Recordings
        </h2>
        <p className="text-[15px] md:text-[16px] text-text-secondary max-w-2xl leading-relaxed">
          Replay previous live classes, review key discussions, and catch up at your own pace.
        </p>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full mb-8">
        {[
          { label: "TOTAL RECORDINGS", value: stats.total, color: "text-text-primary" },
          { label: "WATCHED", value: stats.watched, color: "text-green-600" },
          { label: "UNWATCHED", value: stats.unwatched, color: "text-orange-500" },
          { label: "WATCH TIME", value: `${stats.watchTimeHours}h ${stats.watchTimeMins}m`, color: "text-text-primary" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white border border-border rounded-[14px] p-6 flex flex-col items-start shadow-sm">
            <span className={`text-[32px] font-black tracking-tight leading-none mb-2 ${stat.color}`}>
              {stat.value}
            </span>
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* FILTER TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between w-full mb-6 gap-4">
        
        {/* LEFT: Search & Filters */}
        <div className="flex flex-wrap items-center gap-[10px] lg:gap-[12px] justify-start m-0 p-0 w-full xl:w-auto">
          {/* Search */}
          <div className="relative w-full md:w-[300px] shrink-0">
            <Search 
              className="w-[17px] h-[17px] text-[#8A9199] absolute left-[18px] top-1/2 -translate-y-1/2" 
              strokeWidth={1.5}
            />
            <input
              type="text"
              placeholder="Search recordings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[46px] pl-[45px] pr-8 bg-[#FFFFFF] border border-[#E4E7EC] rounded-[10px] text-[14px] font-medium text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[#FF5722] focus:shadow-[0_0_0_3px_rgba(255,87,34,0.08)] transition-all text-left"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary focus:outline-none"
              >
                <span className="text-[18px] leading-none">×</span>
              </button>
            )}
          </div>

          {/* Status Pills */}
          <div className="flex items-center p-1 bg-white border border-[#E4E7EC] rounded-[10px] h-[46px] shrink-0">
            {["All", "Watched", "Unwatched"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 h-full text-[13px] font-semibold rounded-[8px] transition-all ${
                  statusFilter === status
                    ? "bg-primary text-white"
                    : "bg-transparent text-text-secondary hover:text-text-primary"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Dropdowns */}
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="h-[46px] px-4 bg-white border border-[#E4E7EC] rounded-[10px] text-[13px] font-semibold text-text-primary focus:outline-none focus:border-[#FF5722] focus:shadow-[0_0_0_3px_rgba(255,87,34,0.08)] cursor-pointer appearance-none min-w-[140px] shrink-0"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundPosition: "right 12px center", backgroundRepeat: "no-repeat", backgroundSize: "16px", paddingRight: "36px" }}
          >
            {modules.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <select
            value={instructorFilter}
            onChange={(e) => setInstructorFilter(e.target.value)}
            className="h-[46px] px-4 bg-white border border-[#E4E7EC] rounded-[10px] text-[13px] font-semibold text-text-primary focus:outline-none focus:border-[#FF5722] focus:shadow-[0_0_0_3px_rgba(255,87,34,0.08)] cursor-pointer appearance-none min-w-[140px] shrink-0"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundPosition: "right 12px center", backgroundRepeat: "no-repeat", backgroundSize: "16px", paddingRight: "36px" }}
          >
            {instructors.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>

        {/* RIGHT: Sort */}
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <span className="text-[12px] font-bold text-text-muted uppercase tracking-wider">Sort by</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="h-[46px] px-4 bg-white border border-[#E4E7EC] rounded-[10px] text-[13px] font-bold text-text-primary focus:outline-none focus:border-[#FF5722] focus:shadow-[0_0_0_3px_rgba(255,87,34,0.08)] cursor-pointer appearance-none"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundPosition: "right 12px center", backgroundRepeat: "no-repeat", backgroundSize: "16px", paddingRight: "36px" }}
          >
            {["Newest First", "Oldest First", "Longest", "Shortest", "Most Watched", "Least Watched", "Recently Watched"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* RECORDINGS LIBRARY */}
      <div className="w-full flex flex-col gap-4">
        {isLoading ? (
          <div className="flex h-32 items-center justify-start">
            <Loader2 className="w-5 h-5 animate-spin text-text-muted" />
            <span className="ml-3 text-sm font-medium text-text-secondary">Loading library...</span>
          </div>
        ) : filteredRecordings.length === 0 ? (
          <div className="w-full max-w-xl flex flex-col items-start pt-4">
            <h3 className="text-[20px] font-bold text-text-primary mb-2">No recordings available yet</h3>
            <p className="text-[15px] text-text-secondary leading-relaxed mb-6">
              Your instructor hasn't published any recorded sessions for this course matching your filters.
            </p>
            <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center text-text-muted">
              <Video className="w-6 h-6" />
            </div>
          </div>
        ) : (
          filteredRecordings.map((rec) => {
            const progress = rec.watchProgress;
            const pStatus = progress?.status || "Unwatched";
            const percent = progress?.percentage || 0;

            let progressColor = "bg-border";
            if (pStatus === "Partially Watched") progressColor = "bg-primary";
            if (pStatus === "Completed") progressColor = "bg-green-500";
            const ytVid = rec.youtubeVideoId || extractYouTubeVideoId(rec.recordingUrl);

            return (
              <div
                key={rec._id}
                className="group bg-white border border-border rounded-[14px] p-4 flex flex-col md:flex-row items-center md:items-stretch gap-6 hover:border-primary/40 transition-colors shadow-sm w-full"
              >
                {/* THUMBNAIL */}
                <div className="relative w-full md:w-[190px] h-[160px] md:h-auto md:min-h-[140px] shrink-0 bg-gray-900 rounded-[10px] overflow-hidden border border-gray-800 flex items-center justify-center">
                  {ytVid ? (
                    <img 
                      src={`https://img.youtube.com/vi/${ytVid}/maxresdefault.jpg`}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${ytVid}/hqdefault.jpg`;
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10 bg-gray-900">
                      <Video className="w-6 h-6 text-white/40 mb-2" />
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">VibeLogic</span>
                    </div>
                  )}
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 ml-1" fill="currentColor" />
                    </div>
                  </div>
                  {rec.duration && (
                    <span className="absolute bottom-2 right-2 z-20 bg-black/80 backdrop-blur text-white text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide">
                      {rec.duration}
                    </span>
                  )}
                </div>

                {/* INFO */}
                <div className="flex-1 flex flex-col justify-center py-1 w-full">
                  <h3 className="text-[18px] font-bold text-text-primary mb-1.5 leading-snug group-hover:text-primary transition-colors line-clamp-1">
                    {rec.title}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-text-secondary font-medium mb-4">
                    {rec.moduleTitle && (
                      <span className="flex items-center gap-1.5">
                        <BookOpenIcon className="w-3.5 h-3.5 opacity-60" />
                        {rec.moduleTitle}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 opacity-60" />
                      {new Date(rec.startTime || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    {rec.instructorName && (
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 opacity-60" />
                        {rec.instructorName}
                      </span>
                    )}
                  </div>

                  {/* Watch Progress */}
                  <div className="mt-auto max-w-sm w-full">
                    <div className="flex items-center justify-between text-[11px] font-bold mb-1.5 uppercase tracking-wider">
                      <span className={
                        pStatus === "Completed" ? "text-green-600" : 
                        pStatus === "Partially Watched" ? "text-primary" : 
                        "text-text-muted"
                      }>
                        {pStatus === "Partially Watched" ? `Resume at ${formatTime(progress?.timestamp || 0)}` : pStatus}
                      </span>
                      <span className="text-text-muted font-semibold">{percent}% watched</span>
                    </div>
                    <div className="h-1 w-full bg-surface rounded-full overflow-hidden border border-border">
                      <div className={`h-full ${progressColor} rounded-full transition-all duration-500`} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                </div>

                {/* ACTION */}
                <div className="shrink-0 flex items-center md:justify-end md:w-[150px] w-full pt-2 md:pt-0">
                  <WatchRecordingButton
                    sessionId={rec._id}
                    batchId={batchId}
                    className={`flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-[10px] text-[13px] font-bold transition-all active:scale-95 ${
                      pStatus === "Completed" 
                        ? "bg-surface text-text-secondary hover:text-text-primary border border-border hover:bg-gray-50" 
                        : pStatus === "Partially Watched"
                        ? "bg-white text-text-primary border border-border hover:border-primary/50"
                        : "bg-primary text-white hover:bg-primary/90 shadow-sm"
                    }`}
                  >
                    {pStatus === "Completed" ? (
                      <>
                        <RotateCcw className="w-4 h-4" />
                        Watch Again
                      </>
                    ) : pStatus === "Partially Watched" ? (
                      <>
                        Resume <span className="text-[16px] leading-none ml-0.5">→</span>
                      </>
                    ) : (
                      <>
                        Watch <span className="text-[16px] leading-none ml-0.5">→</span>
                      </>
                    )}
                  </WatchRecordingButton>
                </div>
              </div>
            );
          })
        )}
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
