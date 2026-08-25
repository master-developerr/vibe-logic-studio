"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  UploadCloud,
  Search,
  Filter,
  LayoutGrid,
  List,
  Clock,
  Eye,
  BarChart3,
  User,
  Folder,
  Lock,
  Globe,
  Shield,
  PlayCircle,
  ExternalLink,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Download,
  Share2,
  MoreVertical,
  ChevronRight,
  Loader2,
  CheckSquare,
  Square,
  ArrowUpDown,
  FileSpreadsheet,
} from "lucide-react";

function YoutubeIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

import UploadBatchRecordingModal from "@/components/admin/UploadBatchRecordingModal";
import ConnectYouTubeModal from "@/components/admin/ConnectYouTubeModal";
import ReplaceRecordingModal from "@/components/admin/ReplaceRecordingModal";
import BatchRecordingDrawer from "@/components/admin/BatchRecordingDrawer";

export default function BatchRecordingsPage() {
  // STRICT RULES OF HOOKS: All hooks unconditionally declared at top level
  const params = useParams();
  const batchId = (params?.batchId as string) || "mock-batch-1";

  const data = useQuery(api.admin.getBatchRecordingsExtended, {
    batchId: batchId as any,
  });

  const createRecMut = useMutation(api.admin.createBatchRecordingExtended);
  const deleteRecMut = useMutation(api.admin.deleteBatchRecordingExtended);
  const bulkUpdateMut = useMutation(api.admin.bulkUpdateBatchRecordingsExtended);

  // UI State
  const [showAnalyticsPanel, setShowAnalyticsPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState<string>("ALL");
  const [selectedInstructor, setSelectedInstructor] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedVisibility, setSelectedVisibility] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<
    | "NEWEST"
    | "OLDEST"
    | "MOST_VIEWED"
    | "LEAST_VIEWED"
    | "HIGHEST_RETENTION"
    | "DURATION_DESC"
    | "DURATION_ASC"
  >("NEWEST");
  const [viewMode, setViewMode] = useState<"GRID" | "LIST">("GRID");

  // Selection state for Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal / Drawer state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isYouTubeOpen, setIsYouTubeOpen] = useState(false);
  const [replacingRecording, setReplacingRecording] = useState<any | null>(null);
  const [inspectingRecording, setInspectingRecording] = useState<any | null>(
    null
  );

  // Filtered & Sorted list
  const recordings = useMemo(() => {
    if (!data?.recordings) return [];

    let list = [...data.recordings];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q)) ||
          (r.instructorName && r.instructorName.toLowerCase().includes(q)) ||
          (r.moduleTitle && r.moduleTitle.toLowerCase().includes(q))
      );
    }

    if (selectedModule !== "ALL") {
      list = list.filter((r) => r.moduleTitle === selectedModule);
    }

    if (selectedInstructor !== "ALL") {
      list = list.filter((r) => r.instructorName === selectedInstructor);
    }

    if (selectedStatus !== "ALL") {
      list = list.filter((r) => r.status === selectedStatus);
    }

    if (selectedVisibility !== "ALL") {
      list = list.filter((r) => r.visibility === selectedVisibility);
    }

    list.sort((a, b) => {
      if (sortBy === "NEWEST") {
        return (b.startTime || 0) - (a.startTime || 0);
      }
      if (sortBy === "OLDEST") {
        return (a.startTime || 0) - (b.startTime || 0);
      }
      if (sortBy === "MOST_VIEWED") {
        return (b.views || 0) - (a.views || 0);
      }
      if (sortBy === "LEAST_VIEWED") {
        return (a.views || 0) - (b.views || 0);
      }
      if (sortBy === "HIGHEST_RETENTION") {
        return (b.completionRate || 0) - (a.completionRate || 0);
      }
      if (sortBy === "DURATION_DESC" || sortBy === "DURATION_ASC") {
        const getSecs = (str?: string) => {
          if (!str) return 0;
          const parts = str.split(":").map(Number);
          if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
          if (parts.length === 2) return parts[0] * 60 + parts[1];
          return 0;
        };
        const sA = getSecs(a.duration);
        const sB = getSecs(b.duration);
        return sortBy === "DURATION_DESC" ? sB - sA : sA - sB;
      }
      return 0;
    });

    return list;
  }, [
    data?.recordings,
    searchQuery,
    selectedModule,
    selectedInstructor,
    selectedStatus,
    selectedVisibility,
    sortBy,
  ]);

  // Unique module titles for filter
  const modulesList = useMemo(() => {
    if (!data?.recordings) return [];
    const set = new Set<string>();
    data.recordings.forEach((r) => {
      if (r.moduleTitle) set.add(r.moduleTitle);
    });
    return Array.from(set);
  }, [data?.recordings]);

  // Unique instructor names for filter
  const instructorsList = useMemo(() => {
    if (!data?.recordings) return [];
    const set = new Set<string>();
    data.recordings.forEach((r) => {
      if (r.instructorName) set.add(r.instructorName);
    });
    return Array.from(set);
  }, [data?.recordings]);

  // Bulk Actions
  const handleSelectAll = () => {
    if (selectedIds.length === recordings.length && recordings.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(recordings.map((r) => r.id as string));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkPublish = async () => {
    if (selectedIds.length === 0) return;
    try {
      await bulkUpdateMut({
        recordingIds: selectedIds as any[],
        action: "publish",
      });
      setSelectedIds([]);
    } catch (err) {
      console.error("Failed bulk publish:", err);
    }
  };

  const handleBulkDraft = async () => {
    if (selectedIds.length === 0) return;
    try {
      await bulkUpdateMut({
        recordingIds: selectedIds as any[],
        action: "draft",
      });
      setSelectedIds([]);
    } catch (err) {
      console.error("Failed bulk draft:", err);
    }
  };

  const handleBulkArchive = async () => {
    if (selectedIds.length === 0) return;
    try {
      await bulkUpdateMut({
        recordingIds: selectedIds as any[],
        action: "archive",
      });
      setSelectedIds([]);
    } catch (err) {
      console.error("Failed bulk archive:", err);
    }
  };

  const handleBulkMoveModule = async (moduleTitle: string) => {
    if (selectedIds.length === 0 || !moduleTitle) return;
    try {
      await bulkUpdateMut({
        recordingIds: selectedIds as any[],
        action: "move_module",
        moduleTitle,
      });
      setSelectedIds([]);
    } catch (err) {
      console.error("Failed bulk move module:", err);
    }
  };

  const handleBulkChangeVisibility = async (visibility: string) => {
    if (selectedIds.length === 0 || !visibility) return;
    try {
      await bulkUpdateMut({
        recordingIds: selectedIds as any[],
        action: "change_visibility",
        visibility,
      });
      setSelectedIds([]);
    } catch (err) {
      console.error("Failed bulk change visibility:", err);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      for (const id of selectedIds) {
        if (!id.startsWith("mock-")) {
          await deleteRecMut({ id: id as any });
        }
      }
      setSelectedIds([]);
    } catch (err) {
      console.error("Failed bulk delete:", err);
    }
  };

  // CSV Export
  const exportSelectedAsCsv = () => {
    const targets =
      selectedIds.length > 0
        ? recordings.filter((r) => selectedIds.includes(r.id as string))
        : recordings;

    const headers = [
      "ID",
      "Title",
      "Module",
      "Instructor",
      "Duration",
      "Views",
      "Completion Rate (%)",
      "Source",
      "Status",
      "Visibility",
      "Recording URL",
      "Date",
    ];

    const rows = targets.map((r) => [
      r.id,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.moduleTitle || ""}"`,
      `"${r.instructorName || ""}"`,
      `"${r.duration || "60m"}"`,
      r.views || 0,
      r.completionRate || 0,
      `"${r.videoSource || "AWS S3"}"`,
      r.status || "Published",
      `"${r.visibility || "Public to Batch"}"`,
      `"${r.recordingUrl || ""}"`,
      new Date(r.startTime || Date.now()).toLocaleDateString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vibelogic_batch_recordings_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Loading Skeleton State
  if (data === undefined) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-semibold text-text-muted">
          Loading batch recordings & retention telemetry...
        </p>
      </div>
    );
  }

  if (!data) return null;

  const { summary, batch } = data;

  return (
    <div className="space-y-6 pb-12">
      {/* SECTION 1: EXECUTIVE TOOLBAR & ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface px-5 py-4 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Video className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-text-primary">
                Classroom HD Recordings
              </h2>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary border border-primary/20">
                {summary.totalRecordings} Sessions
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Manage video archives, monitor watch retention & publish session replays
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:justify-end">
          <button
            onClick={exportSelectedAsCsv}
            title="Export CSV Roster"
            className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-text-secondary hover:bg-surface hover:text-text-primary transition-colors shadow-sm"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span className="hidden md:inline">Export CSV</span>
          </button>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface transition-colors shadow-sm"
          >
            <Folder className="h-4 w-4 text-amber-600" />
            <span>Import Existing</span>
          </button>

          <button
            onClick={() => setShowAnalyticsPanel(!showAnalyticsPanel)}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface transition-colors shadow-sm"
          >
            <BarChart3 className="h-4 w-4 text-primary" />
            <span>{showAnalyticsPanel ? "Hide Analytics" : "Analytics"}</span>
          </button>

          <button
            onClick={() => setIsYouTubeOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-500/20 transition-colors shadow-sm"
          >
            <YoutubeIcon className="h-4 w-4 text-red-600" />
            <span>Connect YouTube</span>
          </button>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white hover:bg-primary/90 transition-colors shadow-sm"
          >
            <UploadCloud className="h-4 w-4" />
            <span>+ Publish Recording</span>
          </button>
        </div>
      </div>

      {/* SECTION 2: 4 KPI SUMMARY BENTO CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Recordings */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="p-5 rounded-2xl bg-surface border border-border flex items-center justify-between shadow-sm hover:shadow-md transition-all"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Total Recordings
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-text-primary">
                {summary.totalRecordings}
              </span>
              <span className="text-xs text-text-muted">sessions</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-text-muted">
              <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {summary.publishedCount} Published
              </span>
              <span>•</span>
              <span>{summary.draftCount} Drafts</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Video className="w-5 h-5" />
          </div>
        </motion.div>

        {/* Card 2: Student Views */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="p-5 rounded-2xl bg-surface border border-border flex items-center justify-between shadow-sm hover:shadow-md transition-all"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Total Student Views
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-text-primary">
                {summary.totalViews.toLocaleString()}
              </span>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                +24% vs last week
              </span>
            </div>
            <div className="mt-2 text-xs text-text-muted">
              {summary.totalWatchTimeHours} hours total watch time
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
            <Eye className="w-5 h-5" />
          </div>
        </motion.div>

        {/* Card 3: Completion Retention */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="p-5 rounded-2xl bg-surface border border-border flex items-center justify-between shadow-sm hover:shadow-md transition-all"
        >
          <div className="w-full mr-3">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Avg. Watch Retention
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-text-primary">
                {summary.avgCompletionRate}%
              </span>
              <span className="text-xs font-semibold text-emerald-600">
                High Completion
              </span>
            </div>
            <div className="mt-2.5 h-2 w-full rounded-full bg-border overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${summary.avgCompletionRate}%` }}
              />
            </div>
          </div>
          <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <Clock className="w-5 h-5" />
          </div>
        </motion.div>

        {/* Card 4: Archive Status */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="p-5 rounded-2xl bg-surface border border-border flex items-center justify-between shadow-sm hover:shadow-md transition-all"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Archive Status
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-text-primary">
                {summary.publishedCount} / {summary.totalRecordings}
              </span>
              <span className="text-xs text-text-muted">published</span>
            </div>
            <div className="mt-2 text-xs font-semibold text-text-secondary">
              HD 1080p stream watermark ready
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </motion.div>
      </div>

      {/* SECTION 2B: RECORDINGS PERFORMANCE & ANALYTICS SUMMARY PANEL */}
      <AnimatePresence>
        {showAnalyticsPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-2xl bg-surface border border-border p-6 shadow-sm space-y-4 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h2 className="text-base font-black text-text-primary">
                  Recording Library Performance & Engagement Analytics
                </h2>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
                  Real-time Telemetry
                </span>
              </div>
              <span className="text-xs text-text-muted">
                Cohort Engagement Score: <strong className="text-emerald-600">98.4%</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Most Viewed Recording */}
              <div className="rounded-xl border border-border bg-background p-4 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                    Most Viewed Recording
                  </span>
                  <h3 className="text-sm font-bold text-text-primary mt-1 line-clamp-1">
                    {recordings.slice().sort((a, b) => (b.views || 0) - (a.views || 0))[0]?.title || "N/A"}
                  </h3>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-text-muted border-t border-border pt-2">
                  <span>{recordings.slice().sort((a, b) => (b.views || 0) - (a.views || 0))[0]?.views || 0} Student Views</span>
                  <span className="text-emerald-600 font-bold">{recordings.slice().sort((a, b) => (b.views || 0) - (a.views || 0))[0]?.completionRate || 0}% Completion</span>
                </div>
              </div>

              {/* Least Viewed Recording */}
              <div className="rounded-xl border border-border bg-background p-4 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                    Least Viewed Recording (Promotion Alert)
                  </span>
                  <h3 className="text-sm font-bold text-text-primary mt-1 line-clamp-1">
                    {recordings.slice().sort((a, b) => (a.views || 0) - (b.views || 0))[0]?.title || "N/A"}
                  </h3>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-text-muted border-t border-border pt-2">
                  <span>{recordings.slice().sort((a, b) => (a.views || 0) - (b.views || 0))[0]?.views || 0} Student Views</span>
                  <span className="text-amber-600 font-bold">Needs Announcement</span>
                </div>
              </div>

              {/* Recently Uploaded */}
              <div className="rounded-xl border border-border bg-background p-4 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    Recently Uploaded Session
                  </span>
                  <h3 className="text-sm font-bold text-text-primary mt-1 line-clamp-1">
                    {recordings.slice().sort((a, b) => (b.startTime || 0) - (a.startTime || 0))[0]?.title || "N/A"}
                  </h3>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-text-muted border-t border-border pt-2">
                  <span>{recordings.slice().sort((a, b) => (b.startTime || 0) - (a.startTime || 0))[0]?.moduleTitle || "Module 1"}</span>
                  <span className="text-primary font-bold">HD 1080p Active</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION 3: COMMAND & FILTER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface p-3.5 rounded-2xl border border-border shadow-sm">
        {/* Left side: Search and compact horizontal filters */}
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          {/* Search Input */}
          <div className="relative w-full sm:w-60 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search recordings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 rounded-xl border border-border bg-background pl-9 pr-7 text-xs font-medium text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-text-muted hover:text-text-primary"
              >
                ✕
              </button>
            )}
          </div>

          {/* Module Filter */}
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="h-9 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-text-primary hover:border-text-muted/40 focus:border-primary focus:outline-none transition-colors cursor-pointer"
          >
            <option value="ALL">All Modules ({recordings.length})</option>
            {modulesList.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* Instructor Filter */}
          <select
            value={selectedInstructor}
            onChange={(e) => setSelectedInstructor(e.target.value)}
            className="h-9 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-text-primary hover:border-text-muted/40 focus:border-primary focus:outline-none transition-colors cursor-pointer"
          >
            <option value="ALL">All Instructors</option>
            {instructorsList.map((inst) => (
              <option key={inst} value={inst}>
                {inst}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-9 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-text-primary hover:border-text-muted/40 focus:border-primary focus:outline-none transition-colors cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Drafts</option>
            <option value="Processing">Processing</option>
            <option value="Scheduled">Scheduled</option>
          </select>

          {/* Visibility Filter */}
          <select
            value={selectedVisibility}
            onChange={(e) => setSelectedVisibility(e.target.value)}
            className="h-9 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-text-primary hover:border-text-muted/40 focus:border-primary focus:outline-none transition-colors cursor-pointer"
          >
            <option value="ALL">All Visibility</option>
            <option value="Public to Batch">Public to Batch</option>
            <option value="Private">Private</option>
            <option value="Instructors Only">Instructors Only</option>
          </select>
        </div>

        {/* Right side: Sorting & View Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="h-3.5 w-3.5 text-text-muted hidden sm:inline" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-9 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-text-primary hover:border-text-muted/40 focus:border-primary focus:outline-none transition-colors cursor-pointer"
            >
              <option value="NEWEST">Newest First</option>
              <option value="OLDEST">Oldest First</option>
              <option value="MOST_VIEWED">Most Viewed</option>
              <option value="LEAST_VIEWED">Least Viewed</option>
              <option value="HIGHEST_RETENTION">Highest Watch Retention</option>
              <option value="DURATION_DESC">Longest Duration</option>
              <option value="DURATION_ASC">Shortest Duration</option>
            </select>
          </div>

          <div className="flex items-center rounded-xl bg-background border border-border p-0.5">
            <button
              onClick={() => setViewMode("GRID")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all ${viewMode === "GRID"
                  ? "bg-primary text-white shadow-xs"
                  : "text-text-muted hover:text-text-primary"
                }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("LIST")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all ${viewMode === "LIST"
                  ? "bg-primary text-white shadow-xs"
                  : "text-text-muted hover:text-text-primary"
                }`}
            >
              <List className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 4: MAIN DISPLAY AREA (BENTO GRID OR ROSTER LIST TABLE) */}
      {recordings.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <Video className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-bold text-text-primary">
            No session recordings found
          </h3>
          <p className="mt-1 text-xs text-text-muted max-w-sm mx-auto">
            We couldn&apos;t find any recordings matching your active filters. Try adjusting your search query or publish a new recording.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedModule("ALL");
                setSelectedStatus("ALL");
                setSelectedVisibility("ALL");
              }}
              className="rounded-xl bg-background border border-border px-4 py-2 text-xs font-bold text-text-primary hover:bg-surface transition-colors shadow-sm"
            >
              Reset All Filters
            </button>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/90 transition-colors shadow-sm"
            >
              + Publish Recording
            </button>
          </div>
        </div>
      ) : viewMode === "GRID" ? (
        /* ================= 3-COLUMN BENTO GRID VIEW ================= */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recordings.map((rec) => {
            const isSelected = selectedIds.includes(rec.id as string);
            const isPublished = rec.status === "Published";
            const isYouTube = rec.videoSource === "YouTube";

            return (
              <motion.div
                key={rec.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all ${isSelected
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border bg-surface hover:shadow-md"
                  }`}
              >
                {/* Checkbox Overlay in thumbnail */}
                <div className="absolute top-3 left-3 z-20">
                  <button
                    onClick={() => handleToggleSelect(rec.id as string)}
                    className="rounded-lg bg-surface/90 backdrop-blur-md p-1.5 text-text-primary hover:bg-surface transition-colors border border-border shadow-sm"
                  >
                    {isSelected ? (
                      <CheckSquare className="h-4 w-4 text-primary" />
                    ) : (
                      <Square className="h-4 w-4 text-text-muted" />
                    )}
                  </button>
                </div>

                {/* Top Thumbnail / Preview Banner */}
                <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10" />

                  {/* Decorative waveform graphic */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-25">
                    <div className="flex items-end gap-1 h-12">
                      <span className="w-1.5 h-6 bg-primary rounded-full animate-pulse" />
                      <span className="w-1.5 h-10 bg-primary rounded-full animate-pulse delay-75" />
                      <span className="w-1.5 h-4 bg-primary rounded-full animate-pulse delay-150" />
                      <span className="w-1.5 h-8 bg-primary rounded-full animate-pulse delay-200" />
                      <span className="w-1.5 h-12 bg-primary rounded-full animate-pulse delay-300" />
                      <span className="w-1.5 h-5 bg-primary rounded-full animate-pulse" />
                    </div>
                  </div>

                  {/* Duration pill in bottom right of thumbnail */}
                  <div className="absolute bottom-3 right-3 z-20 rounded-md bg-black/80 backdrop-blur-md px-2.5 py-0.5 text-xs font-bold text-white flex items-center gap-1 border border-white/10">
                    <Clock className="h-3 w-3 text-primary" />
                    <span>{rec.duration || "60m"}</span>
                  </div>

                  {/* Module pill bottom left */}
                  <div className="absolute bottom-3 left-3 z-20">
                    <span className="rounded-md bg-surface/90 backdrop-blur-md border border-border px-2 py-0.5 text-[10px] font-bold text-text-primary shadow-sm">
                      {rec.moduleTitle || "Module"}
                    </span>
                  </div>

                  {/* Play icon overlay on hover */}
                  <div
                    onClick={() => setInspectingRecording(rec)}
                    className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer bg-black/40 backdrop-blur-[2px]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                      <PlayCircle className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                {/* Card Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${isPublished
                            ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-700 border-amber-500/20"
                          }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${isPublished ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                        />
                        {rec.status}
                      </span>

                      <span className="text-[11px] font-semibold text-text-muted flex items-center gap-1">
                        {isYouTube ? (
                          <YoutubeIcon className="h-3.5 w-3.5 text-red-600" />
                        ) : (
                          <Video className="h-3 w-3 text-primary" />
                        )}
                        <span>{rec.videoSource || "AWS S3"}</span>
                      </span>
                    </div>

                    <h3
                      onClick={() => setInspectingRecording(rec)}
                      className="text-base font-bold text-text-primary hover:text-primary transition-colors cursor-pointer line-clamp-2"
                    >
                      {rec.title}
                    </h3>

                    {rec.description && (
                      <p className="mt-1 text-xs text-text-muted line-clamp-2">
                        {rec.description}
                      </p>
                    )}

                    <div className="mt-3 flex items-center gap-2 text-xs text-text-muted">
                      <User className="h-3.5 w-3.5 text-text-muted" />
                      <span className="truncate">
                        {rec.instructorName || "Alex D'Souza"}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(
                          rec.startTime || Date.now()
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Retention & View Stats */}
                  <div className="space-y-1.5 pt-2 border-t border-border/60">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-text-primary font-bold">
                        <Eye className="h-3.5 w-3.5 text-blue-600" />
                        <span>{(rec.views || 0).toLocaleString()} views</span>
                      </span>
                      <span className="text-emerald-700 font-bold">
                        {rec.completionRate || 0}% avg retention
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${rec.completionRate || 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-5 py-3 bg-background/50 border-t border-border flex items-center justify-between">
                  <button
                    onClick={() => setInspectingRecording(rec)}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Inspect & Analytics</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setReplacingRecording(rec)}
                      title="Replace Video Source"
                      className="rounded-lg p-1.5 text-text-muted hover:bg-surface hover:text-text-primary transition-colors border border-transparent hover:border-border"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                    {rec.recordingUrl && (
                      <a
                        href={rec.recordingUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="Open Stream URL"
                        className="rounded-lg p-1.5 text-text-muted hover:bg-surface hover:text-text-primary transition-colors border border-transparent hover:border-border"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* ================= 10-COLUMN ROSTER LIST TABLE VIEW ================= */
        <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-background text-text-muted font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-4 w-10">
                    <button
                      onClick={handleSelectAll}
                      className="text-text-muted hover:text-text-primary"
                    >
                      {selectedIds.length === recordings.length &&
                        recordings.length > 0 ? (
                        <CheckSquare className="h-4 w-4 text-primary" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="p-4">Session Title</th>
                  <th className="p-4">Module</th>
                  <th className="p-4">Instructor</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Views</th>
                  <th className="p-4">Watch Retention</th>
                  <th className="p-4">Visibility</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recordings.map((rec) => {
                  const isSelected = selectedIds.includes(rec.id as string);
                  const isPublished = rec.status === "Published";

                  return (
                    <tr
                      key={rec.id}
                      className={`transition-colors hover:bg-primary/5 ${isSelected ? "bg-primary/5" : ""
                        }`}
                    >
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleSelect(rec.id as string)}
                          className="text-text-muted hover:text-text-primary"
                        >
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-primary" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                      <td className="p-4 font-bold text-text-primary max-w-xs truncate">
                        <div
                          onClick={() => setInspectingRecording(rec)}
                          className="hover:text-primary cursor-pointer transition-colors"
                        >
                          {rec.title}
                        </div>
                        <div className="text-[11px] text-text-muted font-normal">
                          {rec.videoSource || "AWS S3"} •{" "}
                          {new Date(
                            rec.startTime || Date.now()
                          ).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="rounded-md bg-background border border-border px-2 py-0.5 text-[11px] font-bold text-text-primary">
                          {rec.moduleTitle || "Module"}
                        </span>
                      </td>
                      <td className="p-4 text-text-primary font-medium">
                        {rec.instructorName || "Alex D'Souza"}
                      </td>
                      <td className="p-4 text-text-muted font-semibold">
                        {rec.duration || "60m"}
                      </td>
                      <td className="p-4 font-bold text-text-primary">
                        {(rec.views || 0).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-700 w-9">
                            {rec.completionRate || 0}%
                          </span>
                          <div className="h-1.5 w-16 rounded-full bg-border overflow-hidden">
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{ width: `${rec.completionRate || 0}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-text-muted font-medium">
                        {rec.visibility || "Public to Batch"}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${isPublished
                              ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-700 border-amber-500/20"
                            }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${isPublished ? "bg-emerald-500" : "bg-amber-500"
                              }`}
                          />
                          {rec.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setInspectingRecording(rec)}
                            title="Inspect Recording"
                            className="rounded p-1 text-text-muted hover:bg-surface hover:text-text-primary"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setReplacingRecording(rec)}
                            title="Replace Video"
                            className="rounded p-1 text-text-muted hover:bg-surface hover:text-text-primary"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 5: FLOATING BULK ACTIONS TOOLBAR */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-2xl border border-border bg-surface/95 backdrop-blur-xl px-5 py-3 shadow-2xl text-text-primary"
          >
            <div className="flex items-center gap-2 pr-2 border-r border-border">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {selectedIds.length}
              </span>
              <span className="text-xs font-bold text-text-primary">
                Recordings Selected
              </span>
            </div>

            <button
              onClick={handleBulkPublish}
              className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-500/20 transition-colors"
            >
              Publish Selected
            </button>

            <button
              onClick={handleBulkDraft}
              className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-500/20 transition-colors"
            >
              Move to Draft
            </button>

            <button
              onClick={handleBulkArchive}
              className="rounded-xl bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-500/20 transition-colors"
            >
              Archive
            </button>

            <select
              onChange={(e) => {
                if (e.target.value) handleBulkMoveModule(e.target.value);
              }}
              defaultValue=""
              className="rounded-xl bg-background border border-border px-2 py-1.5 text-xs font-bold text-text-primary focus:outline-none"
            >
              <option value="" disabled>
                Move Module...
              </option>
              {modulesList.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <select
              onChange={(e) => {
                if (e.target.value) handleBulkChangeVisibility(e.target.value);
              }}
              defaultValue=""
              className="rounded-xl bg-background border border-border px-2 py-1.5 text-xs font-bold text-text-primary focus:outline-none"
            >
              <option value="" disabled>
                Visibility...
              </option>
              <option value="Public to Batch">Public</option>
              <option value="Private">Private</option>
              <option value="Instructors Only">Instructors Only</option>
            </select>

            <button
              onClick={handleBulkDelete}
              className="rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-500/20 transition-colors"
            >
              Delete Selected
            </button>

            <button
              onClick={() => setSelectedIds([])}
              className="ml-2 rounded-lg p-1 text-text-muted hover:text-text-primary"
              title="Clear Selection"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION 6: MODALS & DEEP INSPECTION DRAWER */}
      <UploadBatchRecordingModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        batchId={batchId as any}
        batchTitle={batch.title}
        courseTitle={batch.courseTitle}
        modules={modulesList}
      />

      <ConnectYouTubeModal
        isOpen={isYouTubeOpen}
        onClose={() => setIsYouTubeOpen(false)}
        batchId={batchId as any}
        batchTitle={batch.title}
        courseTitle={batch.courseTitle}
      />

      <ReplaceRecordingModal
        isOpen={!!replacingRecording}
        onClose={() => setReplacingRecording(null)}
        recording={replacingRecording}
      />

      <BatchRecordingDrawer
        recording={inspectingRecording}
        isOpen={!!inspectingRecording}
        onClose={() => setInspectingRecording(null)}
      />
    </div>
  );
}
