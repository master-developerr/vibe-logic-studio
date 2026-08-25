"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "motion/react";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { CourseDrawer, type CourseEditItem } from "@/components/admin/CourseDrawer";
import {
  BookOpen,
  Plus,
  Filter,
  Download,
  Search,
  MoreHorizontal,
  X,
  Check,
  Eye,
  Pencil,
  Trash2,
  Award,
  CreditCard,
  Layers,
  TrendingUp,
  Activity,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  SlidersHorizontal,
  Calendar,
  Clock,
  BarChart2,
  Loader2,
  XCircle,
  CheckCircle2,
  FileText,
  LayoutGrid,
  List,
  Copy,
  Star,
  User,
  CopyCheck,
  Share2,
  BookMarked,
  Archive,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

type SortField =
  | "createdAt"
  | "title"
  | "price"
  | "enrolledStudents"
  | "averageRating"
  | "revenue";
type SortDir = "asc" | "desc";

/* ─── Difficulty Chip ─── */
function DifficultyChip({ difficulty }: { difficulty?: string }) {
  const level = difficulty?.toLowerCase() || "intermediate";
  const colorClass =
    level === "beginner"
      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      : level === "advanced"
        ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
        : "bg-blue-500/10 text-blue-500 border-blue-500/20";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider border",
        colorClass
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {difficulty || "Intermediate"}
    </span>
  );
}

export default function AdminCoursesPage() {
  const coursesRaw = useQuery(api.admin.getAllCourses);
  const statsRaw = useQuery(api.admin.getCourseCatalogStats);

  /* ─── Mutations ─── */
  const createCourseMutation = useMutation(api.admin.createCourse);
  const updateCourseMutation = useMutation(api.admin.updateCourse);
  const duplicateCourseMutation = useMutation(api.admin.duplicateCourse);
  const deleteCourseMutation = useMutation(api.admin.deleteCourse);
  const toggleStatusMutation = useMutation(api.admin.toggleCourseStatus);
  const bulkUpdateStatusMutation = useMutation(api.admin.bulkUpdateCourseStatus);
  const bulkDeleteMutation = useMutation(api.admin.bulkDeleteCourses);

  /* ─── State ─── */
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [instructorFilter, setInstructorFilter] = useState("All");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseEditItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const isLoading = coursesRaw === undefined;
  const courses = useMemo(() => coursesRaw ?? [], [coursesRaw]);

  /* ─── Unique Instructors for Filter ─── */
  const uniqueInstructors = useMemo(() => {
    const names = new Set<string>();
    courses.forEach((c) => {
      if (c.instructorName) names.add(c.instructorName);
    });
    return Array.from(names);
  }, [courses]);

  /* ─── Sort handler ─── */
  const handleSort = useCallback((field: SortField) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        return prev;
      }
      setSortDir("asc");
      return field;
    });
    setPage(1);
  }, []);

  /* ─── Filtering & Sorting Logic ─── */
  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // Search filter (title, slug, description, instructor)
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.instructorName?.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (categoryFilter !== "All") {
      result = result.filter(
        (c) => c.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Difficulty filter
    if (difficultyFilter !== "All") {
      result = result.filter(
        (c) =>
          (c.difficulty || "Intermediate").toLowerCase() ===
          difficultyFilter.toLowerCase()
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      result = result.filter((c) => {
        const cStatus = c.status || (c.isActive ? "Published" : "Draft");
        return cStatus.toLowerCase() === statusFilter.toLowerCase();
      });
    }

    // Instructor filter
    if (instructorFilter !== "All") {
      result = result.filter((c) => c.instructorName === instructorFilter);
    }

    // Sorting
    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];
      if (sortField === "createdAt") {
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
      }
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [
    courses,
    search,
    categoryFilter,
    difficultyFilter,
    statusFilter,
    instructorFilter,
    sortField,
    sortDir,
  ]);

  /* ─── Pagination ─── */
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / pageSize));
  const pagedCourses = useMemo(() => {
    if (viewMode === "grid") return filteredCourses; // Grid displays all filtered cards
    const start = (page - 1) * pageSize;
    return filteredCourses.slice(start, start + pageSize);
  }, [filteredCourses, page, viewMode]);

  /* ─── Selection Logic ─── */
  const allSelected =
    pagedCourses.length > 0 &&
    pagedCourses.every((c) => selectedIds.has(c.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      const next = new Set(selectedIds);
      pagedCourses.forEach((c) => next.add(c.id));
      setSelectedIds(next);
    }
  };

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  /* ─── Filter Count Badge ─── */
  const activeFilterCount =
    (categoryFilter !== "All" ? 1 : 0) +
    (difficultyFilter !== "All" ? 1 : 0) +
    (statusFilter !== "All" ? 1 : 0) +
    (instructorFilter !== "All" ? 1 : 0);

  const clearAllFilters = () => {
    setCategoryFilter("All");
    setDifficultyFilter("All");
    setStatusFilter("All");
    setInstructorFilter("All");
    setSearch("");
  };

  /* ─── Copy Slug Helper ─── */
  const handleCopySlug = (slug: string) => {
    navigator.clipboard.writeText(`https://vibelogic.studio/courses/${slug}`);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  /* ─── Drawer Save Handler ─── */
  const handleSaveCourse = async (values: {
    title: string;
    slug: string;
    category: string;
    difficulty: string;
    duration: string;
    status: string;
    price: number;
    description: string;
    instructorName: string;
    instructorRole: string;
    instructorBio: string;
    syllabus: string[];
    coverImageId: string;
    coverImageUrl: string;
  }) => {
    setIsSaving(true);
    try {
      if (editingCourse) {
        await updateCourseMutation({
          courseId: editingCourse.id as Id<"courses">,
          ...values,
        });
      } else {
        await createCourseMutation({
          ...values,
        });
      }
      setDrawerOpen(false);
      setEditingCourse(null);
    } finally {
      setIsSaving(false);
    }
  };

  /* ─── Row Actions ─── */
  const handleEditClick = (course: any) => {
    setEditingCourse({
      id: course.id,
      slug: course.slug,
      title: course.title,
      category: course.category,
      description: course.description || "",
      price: course.price || 0,
      coverImageId: course.coverImageId || "",
      coverImageUrl: course.coverImageUrl || "",
      instructorName: course.instructorName || "Alex D'Souza",
      instructorRole: course.instructorRole || "AI Engineering Lead",
      instructorBio: course.instructorBio || "",
      syllabus: course.syllabus || [],
      difficulty: course.difficulty || "Intermediate",
      duration: course.duration || "4 Weeks",
      status: course.status || (course.isActive ? "Published" : "Draft"),
      isActive: course.isActive,
    });
    setDrawerOpen(true);
    setActiveMenuId(null);
  };

  const handleDuplicate = async (id: string) => {
    await duplicateCourseMutation({ courseId: id as Id<"courses"> });
    setActiveMenuId(null);
  };

  const handleToggleStatus = async (course: any) => {
    const newActive = !course.isActive;
    await toggleStatusMutation({
      courseId: course.id as Id<"courses">,
      isActive: newActive,
    });
    setActiveMenuId(null);
  };

  const handleDeleteCourse = async (id: string, title: string) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete "${title}"? This cannot be undone.`
      )
    ) {
      await deleteCourseMutation({ courseId: id as Id<"courses"> });
    }
    setActiveMenuId(null);
  };

  /* ─── Bulk Actions ─── */
  const handleBulkStatus = async (status: string) => {
    const ids = Array.from(selectedIds) as Id<"courses">[];
    await bulkUpdateStatusMutation({ courseIds: ids, status });
    setSelectedIds(new Set());
  };

  const handleBulkDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete ${selectedIds.size} selected courses?`
      )
    ) {
      const ids = Array.from(selectedIds) as Id<"courses">[];
      await bulkDeleteMutation({ courseIds: ids });
      setSelectedIds(new Set());
    }
  };

  /* ─── CSV Export ─── */
  const handleExportCSV = () => {
    const headers = [
      "Course ID",
      "Title",
      "Slug",
      "Category",
      "Difficulty",
      "Duration",
      "Instructor Name",
      "Tuition Price (INR)",
      "Enrolled Students",
      "Running Batches",
      "Revenue (INR)",
      "Avg Rating",
      "Status",
      "Created At",
    ];

    const rows = filteredCourses.map((c) => [
      c.id,
      `"${c.title.replace(/"/g, '""')}"`,
      c.slug,
      `"${c.category}"`,
      c.difficulty || "Intermediate",
      `"${c.duration || "4 Weeks"}"`,
      `"${c.instructorName || "Alex D'Souza"}"`,
      c.price || 0,
      c.enrolledStudents || 0,
      c.runningBatchesCount || 0,
      c.revenue || 0,
      c.averageRating || 4.8,
      c.status || (c.isActive ? "Published" : "Draft"),
      c.createdAt,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vibelogic_course_catalog.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Page Header */}
      <AdminPageHeader
        title="Course Management"
        subtitle="Create, edit, organize, and monitor curriculum performance across all VibeLogic Studio academies."
        actions={
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-surface border border-border rounded-xl p-1">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                title="Table List View"
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all",
                  viewMode === "list"
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                <List className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                title="Card Grid View"
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all",
                  viewMode === "grid"
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
            </div>

            {/* Toggle Filters Button */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all",
                showFilters || activeFilterCount > 0
                  ? "bg-primary/10 border-primary text-primary"
                  : "border-border text-text-secondary hover:text-text-primary hover:border-border-hover bg-surface"
              )}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Export CSV */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-surface text-text-secondary hover:text-text-primary hover:border-border-hover text-xs font-semibold transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            {/* + Create New Course */}
            <button
              type="button"
              onClick={() => {
                setEditingCourse(null);
                setDrawerOpen(true);
              }}
              className="inline-flex items-center gap-2 bg-primary text-white hover:bg-primary/90 px-5 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-md hover:shadow-primary/20 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Create Course</span>
            </button>
          </div>
        }
      />

      {/* 2. 8-Card KPI Summary Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <StatCard
          label="Total Courses"
          value={statsRaw?.totalCourses ?? courses.length}
          icon={<BookOpen className="w-4 h-4 text-primary" />}
          trend="Total catalog footprint"
          trendPositive={true}
        />
        <StatCard
          label="Published"
          value={
            statsRaw?.publishedCourses ??
            courses.filter((c) => c.isActive || c.status === "Published").length
          }
          icon={<CheckCircle2 className="w-4 h-4 text-success" />}
          trend="Live & enrolling"
          trendPositive={true}
          badgeColor="success"
        />
        <StatCard
          label="Drafts"
          value={
            statsRaw?.draftCourses ??
            courses.filter((c) => !c.isActive || c.status === "Draft").length
          }
          icon={<FileText className="w-4 h-4 text-warning" />}
          trend="In curriculum review"
          trendPositive={true}
          badgeColor="warning"
        />
        <StatCard
          label="Archived"
          value={
            statsRaw?.archivedCourses ??
            courses.filter((c) => c.status === "Archived").length
          }
          icon={<Archive className="w-4 h-4 text-text-muted" />}
          trend="Retired cohorts"
          trendPositive={false}
        />
        <StatCard
          label="Total Revenue"
          value={`₹${((statsRaw?.totalRevenue ?? courses.reduce((s, c) => s + (c.revenue || 0), 0)) / 1000).toFixed(0)}k`}
          icon={<CreditCard className="w-4 h-4 text-emerald-500" />}
          trend="Lifetime tuition"
          trendPositive={true}
        />
        <StatCard
          label="Avg Rating"
          value={statsRaw?.averageRating ?? 4.8}
          icon={<Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
          trend="Student CSAT"
          trendPositive={true}
        />
        <StatCard
          label="Active Students"
          value={
            statsRaw?.activeStudents ??
            courses.reduce((s, c) => s + (c.enrolledStudents || 0), 0)
          }
          icon={<User className="w-4 h-4 text-info" />}
          trend="Unique learners"
          trendPositive={true}
        />
        <StatCard
          label="Running Batches"
          value={
            statsRaw?.runningBatches ??
            courses.reduce((s, c) => s + (c.runningBatchesCount || 0), 0)
          }
          icon={<Layers className="w-4 h-4 text-purple-500" />}
          trend="Active streams"
          trendPositive={true}
        />
      </div>

      {/* 3. Search & Multi-Select Filters Bar */}
      <div className="bg-surface border border-border rounded-2xl p-4 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search courses by title, slug, instructor, or description..."
              className="w-full h-10 pl-10 pr-4 bg-background border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Counts */}
          <div className="flex items-center gap-4 text-xs font-medium text-text-secondary">
            <span>
              Showing{" "}
              <strong className="text-text-primary">{filteredCourses.length}</strong> of{" "}
              <strong className="text-text-primary">{courses.length}</strong> courses
            </span>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-primary hover:underline font-semibold flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Animated Expandable Filters */}
        <AnimatePresence>
          {(showFilters || activeFilterCount > 0) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden pt-3 border-t border-border/60"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Category Filter */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1">
                    Category
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                      setPage(1);
                    }}
                    className="w-full h-9 px-3 rounded-xl border border-border bg-background text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="All">All Categories</option>
                    <option value="Full-Stack Engineering">
                      Full-Stack Engineering
                    </option>
                    <option value="System Design">System Design</option>
                    <option value="AI & LLM Engineering">AI & LLM Engineering</option>
                    <option value="Product UX & Motion">Product UX & Motion</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Data & Analytics">Data & Analytics</option>
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={difficultyFilter}
                    onChange={(e) => {
                      setDifficultyFilter(e.target.value);
                      setPage(1);
                    }}
                    className="w-full h-9 px-3 rounded-xl border border-border bg-background text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="All">All Difficulties</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1">
                    Publication Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                    className="w-full h-9 px-3 rounded-xl border border-border bg-background text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                {/* Instructor Filter */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary mb-1">
                    Instructor
                  </label>
                  <select
                    value={instructorFilter}
                    onChange={(e) => {
                      setInstructorFilter(e.target.value);
                      setPage(1);
                    }}
                    className="w-full h-9 px-3 rounded-xl border border-border bg-background text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="All">All Instructors</option>
                    {uniqueInstructors.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Loading / Empty / Main Views */}
      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 bg-surface border border-border rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs font-semibold text-text-muted">
            Loading course catalog from Convex...
          </p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <AdminCard className="p-12 text-center">
          <AdminEmptyState
            icon={
              courses.length === 0 ? (
                <BookOpen className="w-10 h-10 text-primary" />
              ) : (
                <Search className="w-10 h-10 text-text-muted" />
              )
            }
            title={
              courses.length === 0
                ? "No course catalog items created yet"
                : "No courses match your filter criteria"
            }
            description={
              courses.length === 0
                ? "Get started by creating your first curriculum masterclass or academy course."
                : "Try resetting your category, difficulty, or keyword filters to see more results."
            }
            action={
              courses.length === 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCourse(null);
                    setDrawerOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-semibold transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First Course</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-semibold transition-all shadow-md"
                >
                  <X className="w-4 h-4" />
                  <span>Clear All Filters</span>
                </button>
              )
            }
          />
        </AdminCard>
      ) : viewMode === "list" ? (
        /* ─── TABLE LIST VIEW ─── */
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-background/50 text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                  <th className="py-3.5 pl-4 pr-2 w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="rounded border-border text-primary focus:ring-primary/30"
                    />
                  </th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-text-primary"
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Course Title & Slug</span>
                      <ArrowUpDown className="w-3 h-3 text-text-muted" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Difficulty</th>
                  <th className="py-3.5 px-4">Instructor</th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-text-primary"
                    onClick={() => handleSort("price")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Tuition</span>
                      <ArrowUpDown className="w-3 h-3 text-text-muted" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-text-primary"
                    onClick={() => handleSort("enrolledStudents")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Enrolled</span>
                      <ArrowUpDown className="w-3 h-3 text-text-muted" />
                    </div>
                  </th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-text-primary"
                    onClick={() => handleSort("revenue")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Revenue</span>
                      <ArrowUpDown className="w-3 h-3 text-text-muted" />
                    </div>
                  </th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-text-primary"
                    onClick={() => handleSort("averageRating")}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Rating</span>
                      <ArrowUpDown className="w-3 h-3 text-text-muted" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 pr-4 pl-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {pagedCourses.map((course) => {
                  const isChecked = selectedIds.has(course.id);
                  const statusVal =
                    course.status || (course.isActive ? "Published" : "Draft");

                  return (
                    <tr
                      key={course.id}
                      className={cn(
                        "transition-colors hover:bg-background/80 group",
                        isChecked && "bg-primary/5"
                      )}
                    >
                      {/* Checkbox */}
                      <td className="py-4 pl-4 pr-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectRow(course.id)}
                          className="rounded border-border text-primary focus:ring-primary/30"
                        />
                      </td>

                      {/* Course Thumbnail + Title */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-10 rounded-lg overflow-hidden border border-border bg-background flex-shrink-0 relative">
                            {course.coverImageUrl ? (
                              <img
                                src={course.coverImageUrl}
                                alt={course.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                                <BookOpen className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-text-primary truncate">
                              {course.title}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs font-mono text-text-muted truncate">
                                /{course.slug}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopySlug(course.slug)}
                                className="text-text-muted hover:text-primary transition-colors"
                                title="Copy Course URL"
                              >
                                {copiedSlug === course.slug ? (
                                  <CopyCheck className="w-3 h-3 text-success" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-background border border-border text-text-secondary">
                          {course.category}
                        </span>
                      </td>

                      {/* Difficulty Chip */}
                      <td className="py-4 px-4">
                        <DifficultyChip difficulty={course.difficulty} />
                      </td>

                      {/* Instructor */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-text-primary">
                          {course.instructorName || "Alex D'Souza"}
                        </div>
                        <div className="text-xs text-text-muted">
                          {course.instructorRole || "AI Engineering Lead"}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4 font-mono font-bold text-text-primary">
                        ₹{(course.price ?? 0).toLocaleString("en-IN")}
                      </td>

                      {/* Duration */}
                      <td className="py-4 px-4 text-xs font-medium text-text-secondary">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-text-muted" />
                          <span>{course.duration || "4 Weeks"}</span>
                        </div>
                      </td>

                      {/* Enrolled Students */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-text-primary">
                            {course.enrolledStudents || 0}
                          </span>
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-info/10 text-info">
                            Learners
                          </span>
                        </div>
                      </td>

                      {/* Revenue */}
                      <td className="py-4 px-4 font-mono font-semibold text-emerald-500">
                        ₹{((course.revenue || 0) / 1000).toFixed(1)}k
                      </td>

                      {/* Rating */}
                      <td className="py-4 px-4">
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/10 text-amber-500 font-bold text-xs">
                          <Star className="w-3 h-3 fill-amber-500" />
                          <span>{course.averageRating || 4.8}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={statusVal} />
                        </div>
                      </td>

                      {/* Actions Menu */}
                      <td className="py-4 pr-4 pl-2 text-right relative">
                        <div className="inline-block text-left">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(
                                activeMenuId === course.id ? null : course.id
                              );
                            }}
                            className="p-1.5 rounded-lg hover:bg-background text-text-muted hover:text-text-primary transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>

                          <AnimatePresence>
                            {activeMenuId === course.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                transition={{ duration: 0.12 }}
                                className="absolute right-4 top-12 z-40 w-48 rounded-xl bg-surface border border-border shadow-xl py-1 text-left"
                              >
                                <button
                                  type="button"
                                  onClick={() => handleEditClick(course)}
                                  className="w-full px-3.5 py-2 text-xs font-semibold text-text-primary hover:bg-background flex items-center gap-2"
                                >
                                  <Pencil className="w-3.5 h-3.5 text-primary" />
                                  <span>Edit Course Details</span>
                                </button>
                                <Link
                                  href={`/admin/batches?courseId=${course.id}`}
                                  className="w-full px-3.5 py-2 text-xs font-semibold text-text-primary hover:bg-background flex items-center gap-2"
                                >
                                  <Layers className="w-3.5 h-3.5 text-info" />
                                  <span>View Cohort Batches</span>
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => handleDuplicate(course.id)}
                                  className="w-full px-3.5 py-2 text-xs font-semibold text-text-primary hover:bg-background flex items-center gap-2"
                                >
                                  <Copy className="w-3.5 h-3.5 text-text-muted" />
                                  <span>Duplicate Course</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(course)}
                                  className="w-full px-3.5 py-2 text-xs font-semibold text-text-primary hover:bg-background flex items-center gap-2"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-warning" />
                                  <span>
                                    {course.isActive
                                      ? "Move to Draft"
                                      : "Publish Course"}
                                  </span>
                                </button>
                                <div className="border-t border-border my-1" />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteCourse(course.id, course.title)
                                  }
                                  className="w-full px-3.5 py-2 text-xs font-semibold text-error hover:bg-error/10 flex items-center gap-2"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete Course</span>
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-background/50 text-xs text-text-secondary">
              <span>
                Page <strong className="text-text-primary">{page}</strong> of{" "}
                <strong className="text-text-primary">{totalPages}</strong> (
                {filteredCourses.length} courses)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-border hover:bg-surface disabled:opacity-50 font-medium"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg border border-border hover:bg-surface disabled:opacity-50 font-medium"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ─── CARD GRID VIEW ─── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const statusVal =
              course.status || (course.isActive ? "Published" : "Draft");

            return (
              <AdminCard
                key={course.id}
                className="flex flex-col overflow-hidden hover:border-primary/40 transition-all duration-300 group"
              >
                {/* Cover Image & Overlays */}
                <div className="relative h-44 w-full bg-background overflow-hidden">
                  {course.coverImageUrl ? (
                    <img
                      src={course.coverImageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                      <BookOpen className="w-10 h-10" />
                    </div>
                  )}

                  {/* Top overlay badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <DifficultyChip difficulty={course.difficulty} />
                    <StatusBadge status={statusVal} />
                  </div>

                  {/* Bottom gradient overlay */}
                  <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/80 to-transparent flex items-end px-4 pb-2.5">
                    <span className="text-white font-mono text-xs font-semibold bg-black/40 px-2 py-0.5 rounded backdrop-blur-md">
                      ₹{(course.price ?? 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <span className="font-semibold uppercase tracking-wider text-primary">
                        {course.category}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {course.duration || "4 Weeks"}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-text-primary line-clamp-1 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                      {course.description || "Comprehensive masterclass curriculum."}
                    </p>
                  </div>

                  {/* Instructor & Metrics */}
                  <div className="pt-4 border-t border-border/60 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[11px]">
                          {(course.instructorName || "A")[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-text-primary">
                            {course.instructorName || "Alex D'Souza"}
                          </div>
                          <div className="text-[10px] text-text-muted">
                            {course.instructorRole || "Lead Instructor"}
                          </div>
                        </div>
                      </div>

                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-500/10 text-amber-500 font-bold text-xs">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span>{course.averageRating || 4.8}</span>
                      </div>
                    </div>

                    {/* Stats bar */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-background border border-border text-xs">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-text-muted uppercase font-bold">
                          Enrolled
                        </span>
                        <span className="font-bold text-text-primary">
                          {course.enrolledStudents || 0} learners
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-text-muted uppercase font-bold">
                          Revenue
                        </span>
                        <span className="font-bold text-emerald-500">
                          ₹{((course.revenue || 0) / 1000).toFixed(1)}k
                        </span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center justify-between pt-1">
                      <Link
                        href={`/admin/batches?courseId=${course.id}`}
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        <span>Batches ({course.batchesCount || 0})</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEditClick(course)}
                          className="p-2 rounded-lg hover:bg-background text-text-secondary hover:text-primary transition-colors"
                          title="Edit Course"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(course.id)}
                          className="p-2 rounded-lg hover:bg-background text-text-secondary hover:text-text-primary transition-colors"
                          title="Duplicate Course"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteCourse(course.id, course.title)
                          }
                          className="p-2 rounded-lg hover:bg-error/10 text-text-secondary hover:text-error transition-colors"
                          title="Delete Course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </AdminCard>
            );
          })}
        </div>
      )}

      {/* 5. Floating Bulk Actions Bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-surface border border-border shadow-2xl rounded-2xl px-6 py-3.5 flex items-center gap-6"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                {selectedIds.size}
              </span>
              <span className="text-xs font-bold text-text-primary">
                courses selected
              </span>
            </div>

            <div className="h-4 w-px bg-border" />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleBulkStatus("Published")}
                className="px-3.5 py-1.5 rounded-lg bg-success/10 text-success hover:bg-success/20 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Publish Selected</span>
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatus("Draft")}
                className="px-3.5 py-1.5 rounded-lg bg-warning/10 text-warning hover:bg-warning/20 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Move to Draft</span>
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatus("Archived")}
                className="px-3.5 py-1.5 rounded-lg bg-background border border-border text-text-secondary hover:text-text-primary text-xs font-semibold transition-colors"
              >
                Archive Selected
              </button>
              <button
                type="button"
                onClick={handleBulkDelete}
                className="px-3.5 py-1.5 rounded-lg bg-error/10 text-error hover:bg-error/20 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected</span>
              </button>
            </div>

            <div className="h-4 w-px bg-border" />

            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="text-xs text-text-muted hover:text-text-primary font-semibold"
            >
              Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Slide-in Course Drawer */}
      <CourseDrawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditingCourse(null);
        }}
        courseToEdit={editingCourse}
        onSave={handleSaveCourse}
        isSaving={isSaving}
      />
    </div>
  );
}
