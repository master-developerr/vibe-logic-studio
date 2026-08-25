"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  UserPlus,
  ArrowRightLeft,
  Download,
  CheckSquare,
  Square,
  Search,
  Filter,
  SlidersHorizontal,
  TrendingUp,
  Calendar,
  Award,
  BookOpen,
  DollarSign,
  Clock,
  AlertTriangle,
  MoreVertical,
  Eye,
  FileText,
  Trash2,
  CheckCircle2,
  Mail,
  Phone,
  Send,
  MessageSquare,
  Loader2,
  ChevronDown,
  X,
  History,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import {
  BatchStudentProfileDrawer,
  BatchStudentExtendedItem,
} from "@/components/admin/BatchStudentProfileDrawer";
import { InviteStudentModal } from "@/components/admin/InviteStudentModal";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";

export default function BatchStudentsTab() {
  const params = useParams();
  const batchId = params.batchId as any;

  const workspace = useQuery(api.admin.getBatchStudentsExtended, { batchId });

  const transferMutation = useMutation(api.admin.transferBatchStudent);
  const removeMutation = useMutation(api.admin.removeBatchStudent);
  const updateStatusMutation = useMutation(api.admin.updateBatchStudentStatus);
  const bulkActionMutation = useMutation(api.admin.bulkBatchStudentAction);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  // Saved filter chip
  const [activeChip, setActiveChip] = useState<
    "all" | "at_risk" | "cert_eligible" | "top_performers" | "pending_payment"
  >("all");

  // Dropdown filters
  const [attendanceFilter, setAttendanceFilter] = useState("all");
  const [progressFilter, setProgressFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [certificateFilter, setCertificateFilter] = useState("all");
  const [activityFilter, setActivityFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "progress" | "attendance" | "date">("name");

  // Open modals & drawers
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [drawerStudent, setDrawerStudent] = useState<BatchStudentExtendedItem | null>(null);

  // Transfer modal state
  const [transferStudentItem, setTransferStudentItem] = useState<BatchStudentExtendedItem | null>(
    null
  );
  const [targetBatchId, setTargetBatchId] = useState<string>("");
  const [transferError, setTransferError] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);

  // Bulk action feedback
  const [bulkFeedback, setBulkFeedback] = useState<string | null>(null);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Extract students safely for unconditional hook call
  const students = workspace?.students || [];

  // Filter and sort students list (MUST be called unconditionally before early returns)
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        // Search filter (Name, Email, Phone)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = s.name.toLowerCase().includes(q);
          const matchesEmail = s.email.toLowerCase().includes(q);
          const matchesPhone = s.phone.toLowerCase().includes(q);
          if (!matchesName && !matchesEmail && !matchesPhone) return false;
        }

        // Chip filter
        if (activeChip === "at_risk" && !s.isAtRisk) return false;
        if (
          activeChip === "cert_eligible" &&
          s.certificateStatus !== "Eligible" &&
          s.certificateStatus !== "Issued"
        )
          return false;
        if (activeChip === "top_performers" && s.progress < 80) return false;
        if (activeChip === "pending_payment" && s.paymentStatus !== "Pending") return false;

        // Attendance filter
        if (attendanceFilter === "high" && s.attendancePercentage < 80) return false;
        if (
          attendanceFilter === "normal" &&
          (s.attendancePercentage < 50 || s.attendancePercentage >= 80)
        )
          return false;
        if (attendanceFilter === "low" && s.attendancePercentage >= 50) return false;

        // Progress filter
        if (progressFilter === "high" && s.progress < 80) return false;
        if (progressFilter === "normal" && (s.progress < 30 || s.progress >= 80)) return false;
        if (progressFilter === "low" && s.progress >= 30) return false;

        // Payment filter
        if (paymentFilter !== "all" && s.paymentStatus.toLowerCase() !== paymentFilter)
          return false;

        // Certificate filter
        if (certificateFilter !== "all" && s.certificateStatus.toLowerCase() !== certificateFilter)
          return false;

        // Activity filter
        if (activityFilter !== "all" && s.activityStatus.toLowerCase() !== activityFilter)
          return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "progress") return b.progress - a.progress;
        if (sortBy === "attendance") return b.attendancePercentage - a.attendancePercentage;
        if (sortBy === "date") {
          return new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime();
        }
        return 0;
      });
  }, [
    students,
    searchQuery,
    activeChip,
    attendanceFilter,
    progressFilter,
    paymentFilter,
    certificateFilter,
    activityFilter,
    sortBy,
  ]);

  // Check if data is loading
  if (workspace === undefined) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-64 bg-border/40 rounded-xl animate-pulse" />
          <div className="flex gap-2">
            <div className="h-10 w-28 bg-border/40 rounded-xl animate-pulse" />
            <div className="h-10 w-28 bg-border/40 rounded-xl animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-surface rounded-2xl border border-border/40 animate-pulse"
            />
          ))}
        </div>
        <div className="h-96 bg-surface rounded-2xl border border-border/40 animate-pulse" />
      </div>
    );
  }

  if (workspace === null) {
    return (
      <AdminEmptyState
        title="Cohort Batch Not Found"
        description="We could not locate this cohort batch. It may have been removed."
      />
    );
  }

  const { batch, course, availableBatches, summaryStats } = workspace;

  // Checkbox handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredStudents.length && filteredStudents.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredStudents.map((s) => s.enrollmentId)));
    }
  };

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  // CSV Export
  const handleExportCSV = (listToExport: BatchStudentExtendedItem[]) => {
    if (listToExport.length === 0) return;

    const headers = [
      "Student Name",
      "Email",
      "Phone",
      "Status",
      "Course Progress (%)",
      "Attendance (%)",
      "Assignment Completion (%)",
      "Payment Status",
      "Certificate Status",
      "Last Active",
      "Enrolled At",
    ];

    const rows = listToExport.map((s) => [
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.email}"`,
      `"${s.phone}"`,
      s.status,
      s.progress,
      s.attendancePercentage,
      s.assignmentCompletion,
      s.paymentStatus,
      s.certificateStatus,
      `"${s.activityStatus}"`,
      new Date(s.enrolledAt).toLocaleDateString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `vibelogic_batch_${batch.title.replace(/\s+/g, "_").toLowerCase()}_students.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Transfer Handler
  const handleTransferSubmit = async () => {
    if (!transferStudentItem || !targetBatchId) return;
    setIsTransferring(true);
    setTransferError("");
    try {
      await transferMutation({
        enrollmentId: transferStudentItem.enrollmentId as any,
        targetBatchId: targetBatchId as any,
      });
      setTransferStudentItem(null);
      setTargetBatchId("");
    } catch (err: any) {
      setTransferError(err.message || "Transfer failed.");
    } finally {
      setIsTransferring(false);
    }
  };

  // Remove Handler
  const handleRemoveStudent = async (studentItem: BatchStudentExtendedItem) => {
    if (
      !window.confirm(
        `Are you sure you want to remove ${studentItem.name} from cohort ${batch.title}?`
      )
    )
      return;
    try {
      await removeMutation({ enrollmentId: studentItem.enrollmentId as any });
      if (drawerStudent?.enrollmentId === studentItem.enrollmentId) {
        setDrawerStudent(null);
      }
    } catch (err) {
      console.error("Remove failed:", err);
    }
  };

  // Bulk action handlers
  const handleBulkAction = async (action: string, payload?: string) => {
    if (selectedIds.size === 0) return;
    setIsBulkProcessing(true);
    setBulkFeedback(null);
    try {
      const idsArray = Array.from(selectedIds) as any[];
      await bulkActionMutation({
        enrollmentIds: idsArray,
        action,
        value: payload,
      });
      setBulkFeedback(
        `Successfully applied action (${action.replace(/_/g, " ")}) to ${idsArray.length} students.`
      );
      setSelectedIds(new Set());
      setTimeout(() => setBulkFeedback(null), 3500);
    } catch (err: any) {
      setBulkFeedback(`Bulk error: ${err.message}`);
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const openDrawerWithTab = (studentItem: BatchStudentExtendedItem) => {
    setDrawerStudent(studentItem);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* 1. PAGE HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary">
            Cohort Enrolled Students ({students.length})
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Manage and monitor every student enrolled in {batch.title} ({course?.title || "Course"}).
          </p>
        </div>

        {/* Primary and Secondary Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsInviteOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm shadow-primary/20"
          >
            <UserPlus className="w-4 h-4" />
            + Invite Student
          </button>

          <button
            onClick={() => {
              if (students.length > 0) {
                setTransferStudentItem(students[0]);
              }
            }}
            disabled={students.length === 0}
            className="px-4 py-2.5 rounded-xl border border-border hover:bg-surface text-text-primary text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <ArrowRightLeft className="w-4 h-4 text-text-muted" />
            Transfer Student
          </button>

          <button
            onClick={() => handleExportCSV(filteredStudents)}
            disabled={filteredStudents.length === 0}
            className="px-4 py-2.5 rounded-xl border border-border hover:bg-surface text-text-primary text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-text-muted" />
            Export CSV
          </button>

          <button
            onClick={() => {
              if (selectedIds.size > 0) {
                setSelectedIds(new Set());
              } else {
                toggleSelectAll();
              }
            }}
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              selectedIds.size > 0
                ? "bg-primary/10 border-primary/30 text-primary"
                : "border-border hover:bg-surface text-text-primary"
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            {selectedIds.size > 0 ? `Deselect All (${selectedIds.size})` : "Bulk Actions"}
          </button>
        </div>
      </div>

      {/* 2. SUMMARY KPI STATS SECTION (10 Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Students */}
        <div className="p-4 rounded-2xl bg-surface border border-border hover:border-border-hover transition-colors shadow-sm">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-medium">Total Students</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-text-primary">{summaryStats.totalStudents}</p>
          <p className="text-[11px] text-text-muted mt-1">Total active registrations</p>
        </div>

        {/* Seats Filled */}
        <div className="p-4 rounded-2xl bg-surface border border-border hover:border-border-hover transition-colors shadow-sm">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-medium">Seats Filled</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-text-primary">
            {summaryStats.seatsFilled}
            <span className="text-xs font-normal text-text-muted"> / {batch.capacity}</span>
          </p>
          <div className="w-full bg-border h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-blue-500"
              style={{
                width: `${Math.min(100, Math.round((summaryStats.seatsFilled / (batch.capacity || 1)) * 100))}%`,
              }}
            />
          </div>
        </div>

        {/* Seats Remaining */}
        <div className="p-4 rounded-2xl bg-surface border border-border hover:border-border-hover transition-colors shadow-sm">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-medium">Seats Remaining</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
              Capacity
            </span>
          </div>
          <p className="text-2xl font-bold text-text-primary">{summaryStats.seatsRemaining}</p>
          <p className="text-[11px] text-text-muted mt-1">Available batch slots</p>
        </div>

        {/* Average Attendance */}
        <div className="p-4 rounded-2xl bg-surface border border-border hover:border-border-hover transition-colors shadow-sm">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-medium">Avg Attendance</span>
            <Calendar className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-text-primary">{summaryStats.averageAttendance}%</p>
          <p className="text-[11px] text-text-muted mt-1">Cohort live sessions</p>
        </div>

        {/* Average Course Progress */}
        <div className="p-4 rounded-2xl bg-surface border border-border hover:border-border-hover transition-colors shadow-sm">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-medium">Avg Progress</span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-text-primary">{summaryStats.averageProgress}%</p>
          <p className="text-[11px] text-text-muted mt-1">Syllabus completion</p>
        </div>

        {/* Certificates Eligible */}
        <div className="p-4 rounded-2xl bg-surface border border-border hover:border-border-hover transition-colors shadow-sm">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-medium">Certificates Eligible</span>
            <Award className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-text-primary">{summaryStats.certificatesEligible}</p>
          <p className="text-[11px] text-text-muted mt-1">Completed threshold</p>
        </div>

        {/* Assignments Completed */}
        <div className="p-4 rounded-2xl bg-surface border border-border hover:border-border-hover transition-colors shadow-sm">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-medium">Assignments Done</span>
            <BookOpen className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-text-primary">
            {summaryStats.assignmentsCompleted}%
          </p>
          <p className="text-[11px] text-text-muted mt-1">Avg homework score</p>
        </div>

        {/* Active Today */}
        <div className="p-4 rounded-2xl bg-surface border border-border hover:border-border-hover transition-colors shadow-sm">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-medium">Active Today</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-text-primary">{summaryStats.activeToday}</p>
          <p className="text-[11px] text-text-muted mt-1">Learners online recently</p>
        </div>

        {/* Pending Reviews */}
        <div className="p-4 rounded-2xl bg-surface border border-border hover:border-border-hover transition-colors shadow-sm">
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-medium">Pending Reviews</span>
            <FileText className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-text-primary">{summaryStats.pendingReviews}</p>
          <p className="text-[11px] text-text-muted mt-1">Course review queue</p>
        </div>

        {/* Students At Risk */}
        <div
          className={`p-4 rounded-2xl border transition-colors shadow-sm ${
            summaryStats.studentsAtRisk > 0
              ? "bg-red-500/5 border-red-500/30"
              : "bg-surface border-border hover:border-border-hover"
          }`}
        >
          <div className="flex items-center justify-between text-text-muted mb-2">
            <span className="text-xs font-medium">Students At Risk</span>
            <AlertTriangle
              className={`w-4 h-4 ${summaryStats.studentsAtRisk > 0 ? "text-red-500" : "text-text-muted"}`}
            />
          </div>
          <p
            className={`text-2xl font-bold ${
              summaryStats.studentsAtRisk > 0 ? "text-red-600" : "text-text-primary"
            }`}
          >
            {summaryStats.studentsAtRisk}
          </p>
          <p className="text-[11px] text-text-muted mt-1">Low attendance or progress</p>
        </div>
      </div>

      {/* 3. ROSTER FILTER TOOLBAR & SAVED FILTER CHIPS */}
      <div className="space-y-4">
        {/* Saved Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveChip("all")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap ${
              activeChip === "all"
                ? "bg-primary text-white border-primary"
                : "bg-surface border-border text-text-primary hover:bg-background"
            }`}
          >
            All Students ({students.length})
          </button>

          <button
            onClick={() => setActiveChip("at_risk")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeChip === "at_risk"
                ? "bg-red-600 text-white border-red-600"
                : "bg-surface border-border text-red-600 hover:bg-red-50"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            At Risk ({summaryStats.studentsAtRisk})
          </button>

          <button
            onClick={() => setActiveChip("cert_eligible")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeChip === "cert_eligible"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-surface border-border text-blue-600 hover:bg-blue-50"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Certificate Eligible ({summaryStats.certificatesEligible})
          </button>

          <button
            onClick={() => setActiveChip("top_performers")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeChip === "top_performers"
                ? "bg-green-600 text-white border-green-600"
                : "bg-surface border-border text-green-700 hover:bg-green-50"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Top Performers ({students.filter((s) => s.progress >= 80).length})
          </button>

          <button
            onClick={() => setActiveChip("pending_payment")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeChip === "pending_payment"
                ? "bg-amber-600 text-white border-amber-600"
                : "bg-surface border-border text-amber-700 hover:bg-amber-50"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            Pending Payment ({students.filter((s) => s.paymentStatus === "Pending").length})
          </button>
        </div>

        {/* Filter Toolbar Box */}
        <div className="p-4 rounded-2xl bg-surface border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Keyword Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, email, or phone..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-background border border-border text-xs text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-text-muted hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Dropdown Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Attendance Filter */}
            <select
              value={attendanceFilter}
              onChange={(e) => setAttendanceFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-background border border-border text-xs font-medium text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="all">Attendance: All</option>
              <option value="high">High (≥ 80%)</option>
              <option value="normal">Normal (50 - 80%)</option>
              <option value="low">Low (&lt; 50%)</option>
            </select>

            {/* Progress Filter */}
            <select
              value={progressFilter}
              onChange={(e) => setProgressFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-background border border-border text-xs font-medium text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="all">Progress: All</option>
              <option value="high">High (≥ 80%)</option>
              <option value="normal">Active (30 - 80%)</option>
              <option value="low">Behind (&lt; 30%)</option>
            </select>

            {/* Payment Filter */}
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-background border border-border text-xs font-medium text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="all">Payment: All</option>
              <option value="paid">paid</option>
              <option value="pending">pending</option>
              <option value="partial">partial</option>
            </select>

            {/* Certificate Filter */}
            <select
              value={certificateFilter}
              onChange={(e) => setCertificateFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-background border border-border text-xs font-medium text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="all">Certificate: All</option>
              <option value="eligible">eligible</option>
              <option value="issued">issued</option>
              <option value="pending">pending</option>
              <option value="downloaded">downloaded</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-background border border-border text-xs font-medium text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="name">Sort: Name (A-Z)</option>
              <option value="progress">Sort: Progress (High - Low)</option>
              <option value="attendance">Sort: Attendance (High - Low)</option>
              <option value="date">Sort: Enrolled Date (Newest)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. ROSTER DATA TABLE */}
      {filteredStudents.length === 0 ? (
        <AdminEmptyState
          title="No Students Enrolled"
          description="There are no students matching your selected filters or search query in this batch."
          action={
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveChip("all");
                setAttendanceFilter("all");
                setProgressFilter("all");
                setPaymentFilter("all");
                setCertificateFilter("all");
              }}
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              Clear All Filters
            </button>
          }
        />
      ) : (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background/80 border-b border-border text-xs font-semibold text-text-muted">
                  <th className="py-3 px-4 w-10 text-center">
                    <button
                      onClick={toggleSelectAll}
                      className="text-text-muted hover:text-text-primary"
                    >
                      {selectedIds.size === filteredStudents.length && filteredStudents.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-primary" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Attendance</th>
                  <th className="py-3 px-4">Learning Progress</th>
                  <th className="py-3 px-4">Assignments</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Certificate</th>
                  <th className="py-3 px-4">Last Active</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {filteredStudents.map((studentItem) => {
                  const isSelected = selectedIds.has(studentItem.enrollmentId);
                  return (
                    <tr
                      key={studentItem.enrollmentId}
                      className={`hover:bg-background/60 transition-colors ${
                        isSelected ? "bg-primary/5" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => toggleSelectRow(studentItem.enrollmentId)}
                          className="text-text-muted hover:text-text-primary"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-primary" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Student Profile Info */}
                      <td className="py-3.5 px-4">
                        <div
                          onClick={() => openDrawerWithTab(studentItem)}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden shrink-0">
                            {studentItem.avatarUrl ? (
                              <img
                                src={studentItem.avatarUrl}
                                alt={studentItem.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>{studentItem.name.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-text-primary group-hover:text-primary transition-colors">
                                {studentItem.name}
                              </span>
                              {studentItem.isAtRisk && (
                                <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-text-muted">{studentItem.email}</p>
                            <p className="text-[10px] text-text-muted/80">{studentItem.phone}</p>
                          </div>
                        </div>
                      </td>

                      {/* Attendance % */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-border h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                studentItem.attendancePercentage >= 80
                                  ? "bg-green-500"
                                  : studentItem.attendancePercentage >= 60
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${studentItem.attendancePercentage}%` }}
                            />
                          </div>
                          <span className="font-semibold text-text-primary">
                            {studentItem.attendancePercentage}%
                          </span>
                        </div>
                      </td>

                      {/* Learning Progress % */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-border h-1.5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${studentItem.progress}%` }}
                            />
                          </div>
                          <span className="font-semibold text-text-primary">
                            {studentItem.progress}%
                          </span>
                        </div>
                      </td>

                      {/* Assignment Completion */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-text-primary">
                          {studentItem.assignmentCompletion}%
                        </span>
                      </td>

                      {/* Payment Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            studentItem.paymentStatus === "Paid"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {studentItem.paymentStatus}
                        </span>
                      </td>

                      {/* Certificate Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                            studentItem.certificateStatus === "Issued" ||
                            studentItem.certificateStatus === "Downloaded"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : studentItem.certificateStatus === "Eligible"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-gray-100 text-gray-700 border-gray-200"
                          }`}
                        >
                          {studentItem.certificateStatus}
                        </span>
                      </td>

                      {/* Last Active */}
                      <td className="py-3.5 px-4">
                        <span className="text-text-muted font-medium">
                          {studentItem.activityStatus}
                        </span>
                      </td>

                      {/* Row Actions Menu */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openDrawerWithTab(studentItem)}
                            className="p-1.5 rounded-lg hover:bg-border/60 text-text-muted hover:text-text-primary transition-colors"
                            title="View Student Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setTransferStudentItem(studentItem)}
                            className="p-1.5 rounded-lg hover:bg-border/60 text-text-muted hover:text-text-primary transition-colors"
                            title="Transfer Student"
                          >
                            <ArrowRightLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveStudent(studentItem)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-600 transition-colors"
                            title="Remove Student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-border bg-background/50 flex items-center justify-between text-xs text-text-muted">
            <span>
              Showing {filteredStudents.length} of {students.length} enrolled students
            </span>
            <span>Batch Capacity: {batch.capacity} seats</span>
          </div>
        </div>
      )}

      {/* 5. FLOATING BULK ACTIONS SELECTION BAR */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-surface border border-border shadow-2xl rounded-2xl px-6 py-3.5 flex items-center gap-4 flex-wrap max-w-4xl w-full mx-auto"
          >
            <div className="flex items-center gap-2 pr-4 border-r border-border shrink-0">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                {selectedIds.size}
              </span>
              <span className="text-xs font-bold text-text-primary">Students Selected</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <button
                onClick={() => handleBulkAction("mark_attendance", "100")}
                disabled={isBulkProcessing}
                className="px-3 py-1.5 rounded-xl bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 font-semibold transition-colors flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                Mark 100% Attendance
              </button>

              <button
                onClick={() => handleBulkAction("issue_certificates")}
                disabled={isBulkProcessing}
                className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-semibold transition-colors flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5" />
                Issue Certificates
              </button>

              <button
                onClick={() => {
                  const selectedItems = students.filter((s) => selectedIds.has(s.enrollmentId));
                  handleExportCSV(selectedItems);
                }}
                className="px-3 py-1.5 rounded-xl bg-surface border border-border hover:bg-background text-text-primary font-semibold transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-text-muted" />
                Export Selected
              </button>

              <button
                onClick={() => handleBulkAction("remove")}
                disabled={isBulkProcessing}
                className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-semibold transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove Selected
              </button>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setSelectedIds(new Set())}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary transition-colors"
                title="Deselect All"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {bulkFeedback && (
              <div className="w-full mt-2 p-2 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary font-medium text-center">
                {bulkFeedback}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. SLIDE-IN STUDENT INSPECTION DRAWER */}
      <BatchStudentProfileDrawer
        isOpen={drawerStudent !== null}
        onClose={() => setDrawerStudent(null)}
        student={drawerStudent}
        batchTitle={batch.title}
        onUpdateStatus={async (enrollmentId, updates) => {
          await updateStatusMutation({
            enrollmentId: enrollmentId as any,
            ...updates,
          });
        }}
        onTransferStudent={(studentItem) => {
          setDrawerStudent(null);
          setTransferStudentItem(studentItem);
        }}
        onRemoveStudent={(studentItem) => {
          setDrawerStudent(null);
          handleRemoveStudent(studentItem);
        }}
      />

      {/* 7. INVITE STUDENT MODAL */}
      <InviteStudentModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        batchId={batch.id}
        courseId={batch.courseId}
        batchTitle={batch.title}
      />

      {/* 8. TRANSFER STUDENT DIALOG */}
      <AnimatePresence>
        {transferStudentItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTransferStudentItem(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-md rounded-3xl bg-surface border border-border shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-bold">
                    <ArrowRightLeft className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text-primary">
                      Transfer Student to Another Cohort
                    </h3>
                    <p className="text-xs text-text-muted">
                      Move {transferStudentItem.name} to a different batch
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setTransferStudentItem(null)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-text-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1.5">
                  Select Target Cohort Batch ({availableBatches.length} batches available)
                </label>
                <select
                  value={targetBatchId}
                  onChange={(e) => setTargetBatchId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-sm text-text-primary focus:outline-none focus:border-primary"
                >
                  <option value="">— Select destination batch —</option>
                  {availableBatches.map((b) => (
                    <option
                      key={b.id}
                      value={b.id}
                      disabled={b.id === batch.id || b.enrolledCount >= b.capacity}
                    >
                      {b.title} ({b.enrolledCount} / {b.capacity} seats) — {b.status}
                    </option>
                  ))}
                </select>
              </div>

              {transferError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{transferError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setTransferStudentItem(null)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-background text-text-primary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransferSubmit}
                  disabled={!targetBatchId || isTransferring}
                  className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isTransferring ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Transferring...
                    </>
                  ) : (
                    "Confirm Transfer"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
