"use client";

import React, { useState, useMemo } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  FileText,
  ExternalLink,
  PlayCircle,
  CheckCircle2,
  Check,
  Download,
  Bookmark,
  Database,
  File,
  Monitor,
  Search,
  Lock,
  Eye,
  BookOpen,
} from "lucide-react";
import { format } from "date-fns";

// ─── Types ───────────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StudyMaterial = any;

type FilterTab = "All" | "Documents" | "Slides" | "Datasets" | "Links" | "Reference" | "Other";
type SortOption = "newest" | "oldest" | "az" | "za";

// ─── Material Type System ─────────────────────────────────────────────────────

function getMaterialCategory(material: StudyMaterial): FilterTab {
  const t = (material.fileFormat || material.type || "").toLowerCase();
  if (["pdf", "document", "doc", "docx", "txt"].includes(t)) return "Documents";
  if (["slide", "slides", "pptx", "ppt", "keynote"].includes(t)) return "Slides";
  if (["csv", "xlsx", "xls", "dataset", "json", "data"].includes(t)) return "Datasets";
  if (["link", "url", "external"].includes(t)) return "Links";
  if (["reference", "bookmark", "guide", "cheatsheet"].includes(t)) return "Reference";
  return "Other";
}

function getMaterialMeta(category: FilterTab) {
  switch (category) {
    case "Documents":
      return {
        label: "DOCUMENT",
        icon: <FileText className="w-5 h-5 text-orange-500" />,
        containerClass: "bg-orange-50",
        badgeClass: "text-orange-500",
      };
    case "Slides":
      return {
        label: "SLIDES",
        icon: <Monitor className="w-5 h-5 text-blue-500" />,
        containerClass: "bg-blue-50",
        badgeClass: "text-blue-500",
      };
    case "Datasets":
      return {
        label: "DATASET",
        icon: <Database className="w-5 h-5 text-emerald-500" />,
        containerClass: "bg-emerald-50",
        badgeClass: "text-emerald-500",
      };
    case "Links":
      return {
        label: "LINK",
        icon: <ExternalLink className="w-5 h-5 text-gray-500" />,
        containerClass: "bg-gray-100",
        badgeClass: "text-gray-500",
      };
    case "Reference":
      return {
        label: "REFERENCE",
        icon: <Bookmark className="w-5 h-5 text-purple-500" />,
        containerClass: "bg-purple-50",
        badgeClass: "text-purple-500",
      };
    default:
      return {
        label: "OTHER",
        icon: <File className="w-5 h-5 text-gray-400" />,
        containerClass: "bg-gray-100",
        badgeClass: "text-gray-400",
      };
  }
}

function isLocked(material: StudyMaterial): boolean {
  const v = material.visibility;
  return v === "Draft" || v === "Archived";
}

// ─── Filter Tabs ──────────────────────────────────────────────────────────────
const FILTER_TABS: FilterTab[] = ["All", "Documents", "Slides", "Datasets", "Links", "Reference", "Other"];

// ─── Material Card ────────────────────────────────────────────────────────────

function MaterialCard({
  material,
  completedLessons,
  onMarkComplete,
}: {
  material: StudyMaterial;
  completedLessons: Set<string>;
  onMarkComplete: (id: string) => void;
}) {
  const category = getMaterialCategory(material);
  const meta = getMaterialMeta(category);
  const isCompleted = completedLessons.has(material._id);
  const locked = isLocked(material);

  const publishedDate = material.updatedAt
    ? format(new Date(material.updatedAt), "MMM dd, yyyy")
    : null;

  const isVideo = ["video", "mp4", "webm"].includes((material.type || "").toLowerCase());

  return (
    <div
      className={`bg-surface border rounded-2xl p-5 flex flex-col gap-4 transition-shadow hover:shadow-md ${
        locked ? "border-border opacity-70" : "border-border"
      }`}
    >
      {/* Top Row */}
      <div className="flex items-start justify-between">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${meta.containerClass}`}
        >
          {meta.icon}
        </div>
        <span className={`text-[10px] font-extrabold tracking-widest uppercase ${meta.badgeClass}`}>
          {meta.label}
        </span>
      </div>

      {/* Title & Module */}
      <div>
        <h3 className="font-bold text-text-primary text-sm leading-snug mb-1 line-clamp-2">
          {material.title}
        </h3>
        {material.collection && (
          <p className="text-[11px] font-semibold text-primary">Module: {material.collection}</p>
        )}
      </div>

      {/* Description */}
      {material.description ? (
        <p className="text-xs font-medium text-text-secondary leading-relaxed line-clamp-3">
          {material.description}
        </p>
      ) : (
        <p className="text-xs font-medium text-text-muted italic">No description provided.</p>
      )}

      {/* Bottom Row */}
      <div className="flex items-end justify-between mt-auto pt-4 border-t border-border">
        <div className="flex flex-col gap-1">
          {material.fileSize && (
            <span className="text-[10px] font-semibold text-text-muted flex items-center gap-1">
              <File className="w-3 h-3" /> {material.fileSize}
            </span>
          )}
          {category === "Links" && (
            <span className="text-[10px] font-semibold text-text-muted">External</span>
          )}
          {publishedDate && (
            <span className="text-[10px] font-semibold text-text-muted">{publishedDate}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Mark complete */}
          {!locked && category !== "Links" && (
            <button
              onClick={() => onMarkComplete(material._id)}
              disabled={isCompleted}
              title={isCompleted ? "Completed" : "Mark as complete"}
              className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-colors ${
                isCompleted
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                  : "bg-surface border-border text-text-muted hover:bg-gray-50"
              }`}
            >
              {isCompleted ? <Check className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Primary Action */}
          {locked ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-400 text-xs font-bold rounded-lg cursor-not-allowed">
              <Lock className="w-3.5 h-3.5" /> Locked
            </div>
          ) : category === "Links" ? (
            <a
              href={material.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open
            </a>
          ) : isVideo ? (
            <a
              href={material.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover transition-colors"
            >
              <PlayCircle className="w-3.5 h-3.5" /> View
            </a>
          ) : category === "Slides" ? (
            <a
              href={material.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover transition-colors"
            >
              <Eye className="w-3.5 h-3.5" /> View
            </a>
          ) : (
            <a
              href={material.fileUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CourseMaterialsClient({
  studyMaterials,
  completedLessons: initialCompleted,
  batchId,
  courseTitle,
}: {
  studyMaterials: StudyMaterial[];
  completedLessons: string[];
  batchId: string;
  courseTitle?: string;
}) {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set(initialCompleted)
  );
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");

  const handleMarkComplete = async (lessonId: string) => {
    if (completedLessons.has(lessonId)) return;
    const next = new Set(completedLessons);
    next.add(lessonId);
    setCompletedLessons(next);
    try {
      const response = await fetch("/api/student/mark-complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          batchId,
          lessonId,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to sync completed lesson");
      }
    } catch (err) {
      console.error("Failed to mark lesson completed:", err);
      const prev = new Set(completedLessons);
      prev.delete(lessonId);
      setCompletedLessons(prev);
    }
  };

  // ── Filter + Search + Sort ──────────────────────────────────────────────────
  const filteredMaterials = useMemo(() => {
    // Hide archived materials from students
    let result = studyMaterials.filter((m) => m.visibility !== "Archived");

    if (activeFilter !== "All") {
      result = result.filter((m) => getMaterialCategory(m) === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.title?.toLowerCase().includes(q) ||
          m.description?.toLowerCase().includes(q) ||
          m.collection?.toLowerCase().includes(q) ||
          getMaterialCategory(m).toLowerCase().includes(q)
      );
    }

    result = [...result].sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return (b.updatedAt || b._creationTime || 0) - (a.updatedAt || a._creationTime || 0);
        case "oldest":
          return (a.updatedAt || a._creationTime || 0) - (b.updatedAt || b._creationTime || 0);
        case "az":
          return (a.title || "").localeCompare(b.title || "");
        case "za":
          return (b.title || "").localeCompare(a.title || "");
        default:
          return 0;
      }
    });

    return result;
  }, [studyMaterials, activeFilter, searchQuery, sortOption]);

  const tabCounts = useMemo(() => {
    const counts: Partial<Record<FilterTab, number>> = {
      All: studyMaterials.filter((m) => m.visibility !== "Archived").length,
    };
    for (const tab of FILTER_TABS.slice(1)) {
      counts[tab] = studyMaterials
        .filter((m) => m.visibility !== "Archived")
        .filter((m) => getMaterialCategory(m) === tab).length;
    }
    return counts;
  }, [studyMaterials]);

  // Suppress unused import warning — courseTitle is used for breadcrumb context
  void courseTitle;

  return (
    <div className="w-full">
      {/* PAGE HEADER */}
      <div className="flex flex-col items-start text-left mb-6">
        <h2 className="text-4xl md:text-[40px] font-extrabold text-text-primary leading-tight mb-3 tracking-tight">Course Materials</h2>
        <p className="text-sm text-text-secondary max-w-2xl leading-relaxed">
          Access resources, files and supporting materials for this course.
        </p>
      </div>

      {/* TOOLBAR */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] items-center gap-6 mb-[28px]">
        {/* LEFT: Filter tabs */}
        <div className="flex items-center justify-start flex-nowrap overflow-x-auto custom-scrollbar gap-2 w-full">
          {FILTER_TABS.map((tab) => {
            const count = tabCounts[tab] ?? 0;
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`inline-flex items-center whitespace-nowrap gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all border shrink-0 ${
                  activeFilter === tab
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-surface text-text-secondary border-border hover:bg-gray-50 hover:text-text-primary"
                }`}
              >
                {tab}
                {tab !== "All" && count > 0 && (
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                      activeFilter === tab ? "bg-white/20 text-white" : "bg-gray-100 text-text-muted"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* RIGHT: Search + Sort */}
        <div className="flex items-center justify-end gap-3 shrink-0">
          <div className="relative w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-surface border border-border rounded-xl text-sm font-medium text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors shadow-sm"
            />
          </div>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="w-[150px] bg-surface border border-border rounded-xl text-sm font-bold text-text-primary focus:outline-none cursor-pointer py-2.5 pl-4 pr-8 shadow-sm appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: `right 0.75rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.25em 1.25em` }}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A – Z</option>
            <option value="za">Z – A</option>
          </select>
        </div>
      </div>

      {/* MATERIALS GRID */}
      <div className="w-full">
        {filteredMaterials.length === 0 ? (
          <div className="w-full border border-border bg-surface rounded-2xl p-8 min-h-[180px] flex flex-col items-start justify-start text-left">
            {studyMaterials.length === 0 ? (
              <>
                <BookOpen className="w-8 h-8 text-gray-300 mb-4" />
                <h3 className="text-base font-bold text-text-primary mb-1">No materials available yet.</h3>
                <p className="text-sm font-medium text-text-secondary">
                  Your instructor will publish resources here.
                </p>
              </>
            ) : (
              <>
                <Search className="w-8 h-8 text-gray-300 mb-4" />
                <h3 className="text-base font-bold text-text-primary mb-1">
                  No {activeFilter !== "All" ? activeFilter.toLowerCase() : "materials"} found.
                </h3>
                <p className="text-sm font-medium text-text-secondary">
                  Try another filter or search term.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-16">
            {filteredMaterials.map((material) => (
              <MaterialCard
                key={material._id}
                material={material}
                completedLessons={completedLessons}
                onMarkComplete={handleMarkComplete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
