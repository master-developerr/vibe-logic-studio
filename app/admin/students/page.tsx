"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "motion/react";
import { Id } from "@/convex/_generated/dataModel";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminCard } from "@/components/admin/AdminCard";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { PromoteRoleModal } from "@/components/admin/PromoteRoleModal";
import { MessageStudentModal } from "@/components/admin/MessageStudentModal";
import { StudentDrawer, DrawerStudentRow } from "@/components/admin/students/drawer";

import {
  Users,
  UserPlus,
  Filter,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  X,
  Check,
  Eye,
  Pencil,
  Trash2,
  Award,
  CreditCard,
  BookOpen,
  Layers,
  TrendingUp,
  GraduationCap,
  Activity,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  SlidersHorizontal,
  Mail,
  Phone,
  Calendar,
  Clock,
  BarChart2,
  Loader2,
  XCircle,
  CheckCircle2,
  Send,
  FileText,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════ */
type StudentRow = DrawerStudentRow;

type EnrollForm = {
  studentEmail: string;
  courseId: string;
  batchId: string;
};

type SortField = "name" | "enrolledAt" | "progress" | "paymentStatus" | "createdAt";
type SortDir = "asc" | "desc";

/* ══════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════ */
import { Avatar } from "@/components/admin/Avatar";
import { PaymentChip } from "@/components/admin/PaymentChip";

function ProgressRing({ pct }: { pct: number }) {
  const r = 14;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color =
    pct >= 80 ? "stroke-success" : pct >= 50 ? "stroke-info" : pct >= 25 ? "stroke-warning" : "stroke-error";

  return (
    <div className="flex items-center gap-2">
      <svg width="36" height="36" viewBox="0 0 36 36" className="-rotate-90">
        <circle cx="18" cy="18" r={r} fill="none" stroke="var(--color-border)" strokeWidth="3" />
        <circle
          cx="18"
          cy="18"
          r={r}
          fill="none"
          strokeWidth="3"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          className={cn("transition-all duration-500", color)}
          style={{ stroke: "currentColor" }}
        />
      </svg>
      <span className="text-[12px] font-semibold text-text-primary">{pct}%</span>
    </div>
  );
}

const PAGE_SIZE = 10;

/* ══════════════════════════════════════════════════════════
   SKELETON ROW (loading state)
══════════════════════════════════════════════════════════ */
function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-border">
      <td className="py-3.5 px-4"><div className="w-4 h-4 bg-border rounded" /></td>
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-border" />
          <div className="space-y-1.5">
            <div className="h-3 w-28 bg-border rounded" />
            <div className="h-2.5 w-36 bg-border rounded" />
          </div>
        </div>
      </td>
      <td className="py-3.5 px-4"><div className="h-3 w-32 bg-border rounded" /></td>
      <td className="py-3.5 px-4"><div className="h-3 w-24 bg-border rounded" /></td>
      <td className="py-3.5 px-4"><div className="h-5 w-16 bg-border rounded-full" /></td>
      <td className="py-3.5 px-4"><div className="h-3 w-20 bg-border rounded" /></td>
      <td className="py-3.5 px-4"><div className="w-9 h-9 bg-border rounded-full" /></td>
      <td className="py-3.5 px-4"><div className="h-5 w-16 bg-border rounded-full" /></td>
      <td className="py-3.5 px-4"><div className="h-6 w-8 bg-border rounded" /></td>
    </tr>
  );
}

/* ══════════════════════════════════════════════════════════
   STUDENT PROFILE DRAWER (Imported from components/)
══════════════════════════════════════════════════════════ */
// Using the imported StudentDrawer component.

/* ══════════════════════════════════════════════════════════
   ADD STUDENT MODAL (Manual Enroll)
══════════════════════════════════════════════════════════ */
function AddStudentModal({
  open,
  onClose,
  courses,
}: {
  open: boolean;
  onClose: () => void;
  courses: { id: string; title: string }[];
}) {
  const manualEnroll = useMutation(api.admin.manualEnrollStudent);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, watch } = useForm<EnrollForm>();

  const onSubmit = async (values: EnrollForm) => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await manualEnroll({
        studentEmail: values.studentEmail,
        courseId: values.courseId as Id<"courses">,
        batchId: values.batchId as Id<"batches">,
      });
      setSuccess(`Enrolled ${(result as any)?.studentName || values.studentEmail} successfully!`);
      reset();
      setTimeout(() => { onClose(); setSuccess(null); }, 2000);
    } catch (err: any) {
      setError(err?.message ?? "Enrollment failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="bg-surface rounded-2xl shadow-xl border border-border w-full max-w-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div>
                <h2 className="text-[17px] font-bold text-text-primary">Enroll Student</h2>
                <p className="text-[12px] text-text-muted mt-0.5">Manually enroll a student without payment</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:bg-background transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {error && (
                <div className="flex items-center gap-2 px-3 py-3 bg-error/10 border border-error/20 rounded-lg text-error text-[12px] font-medium">
                  <XCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 px-3 py-3 bg-success/10 border border-success/20 rounded-lg text-success text-[12px] font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {success}
                </div>
              )}

              {[
                { key: "studentEmail", label: "Student Email", type: "email", placeholder: "student@example.com" },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key} className="space-y-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                    {label} *
                  </label>
                  <input
                    {...register(key as keyof EnrollForm, { required: true })}
                    type={type}
                    placeholder={placeholder}
                    className="w-full h-10 px-3 bg-background border border-border rounded-lg text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
                  />
                </div>
              ))}

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                  Course *
                </label>
                <select
                  {...register("courseId", { required: true })}
                  className="w-full h-10 px-3 bg-background border border-border rounded-lg text-[13px] text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                >
                  <option value="">Select a course…</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                  Batch ID *
                </label>
                <input
                  {...register("batchId", { required: true })}
                  className="w-full h-10 px-3 bg-background border border-border rounded-lg text-[13px] text-text-primary font-mono placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary/40"
                  placeholder="Paste Batch ID from Convex"
                />
                <p className="text-[11px] text-text-muted">Find Batch IDs in your Convex dashboard.</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-9 px-4 rounded-full text-[13px] font-semibold text-text-secondary hover:bg-background transition-all border border-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-9 px-5 bg-primary text-white rounded-full text-[13px] font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all active:scale-[0.98] flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {submitting ? "Enrolling…" : "Enroll Student"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════
   REMOVE STUDENTS MODAL
══════════════════════════════════════════════════════════ */
function RemoveStudentsModal({
  open,
  onClose,
  selectedCount,
  onConfirm,
  submitting,
}: {
  open: boolean;
  onClose: () => void;
  selectedCount: number;
  onConfirm: () => void;
  submitting: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="bg-surface rounded-2xl shadow-xl border border-border w-full max-w-sm overflow-hidden"
          >
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h2 className="text-[17px] font-bold text-text-primary mb-2">Remove Students?</h2>
              <p className="text-[13px] text-text-secondary leading-relaxed">
                You are about to remove <span className="font-semibold text-text-primary">{selectedCount}</span> student{selectedCount !== 1 && "s"}. Their enrollments will be dropped and they will be archived from the directory. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-3 p-4 bg-background border-t border-border">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 h-9 rounded-full text-[13px] font-semibold text-text-secondary hover:bg-surface border border-border transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={submitting}
                className="flex-1 h-9 rounded-full bg-error text-white text-[13px] font-semibold hover:bg-error/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {submitting ? "Removing..." : "Remove"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════
   ROW ACTION MENU
══════════════════════════════════════════════════════════ */
function RowActions({ student, onView, onPromote, onMessage, onRemove }: { student: StudentRow; onView: () => void; onPromote: () => void; onMessage: () => void; onRemove: () => void; }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex justify-end">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-7 h-7 inline-flex items-center justify-center rounded-md text-text-muted hover:bg-background hover:text-text-secondary transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 top-8 z-20 w-44 bg-surface rounded-xl shadow-lg border border-border py-1 overflow-hidden"
            >
              {[
                { icon: Eye,       label: "View Profile",  action: () => { onView(); setOpen(false); } },
                { icon: ShieldCheck,label: "Manage Role",   action: () => { onPromote(); setOpen(false); } },
                { icon: Send,      label: "Send Message",  action: () => { onMessage(); setOpen(false); } },
                { icon: Pencil,    label: "Edit Student",  action: () => setOpen(false) },
                { icon: Award,     label: "Issue Certificate", action: () => setOpen(false) },
                { icon: CreditCard, label: "Payment History", action: () => setOpen(false) },
                { icon: Trash2,    label: "Remove",        action: () => { onRemove(); setOpen(false); }, danger: true },
              ].map(({ icon: Icon, label, action, danger }) => (
                <button
                  key={label}
                  onClick={action}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-medium transition-colors",
                    danger
                      ? "text-error hover:bg-error/10"
                      : "text-text-secondary hover:bg-background hover:text-text-primary"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SORT HEADER
══════════════════════════════════════════════════════════ */
function SortHeader({
  label,
  field,
  current,
  dir,
  onClick,
}: {
  label: string;
  field: SortField;
  current: SortField;
  dir: SortDir;
  onClick: (f: SortField) => void;
}) {
  const active = current === field;
  return (
    <th
      className="py-3 px-4 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted cursor-pointer hover:text-text-secondary select-none"
      onClick={() => onClick(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {active ? (
          dir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
        ) : (
          <ArrowUpDown className="w-3 h-3 opacity-30" />
        )}
      </div>
    </th>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */
export default function AdminStudentsPage() {
  const studentsRaw = useQuery(api.admin.getAllStudents);
  const coursesRaw = useQuery(api.admin.getAllCourses);

  /* ─── State ─── */
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [drawerStudent, setDrawerStudent] = useState<StudentRow | null>(null);
  const [promoteStudent, setPromoteStudent] = useState<StudentRow | null>(null);
  const [messageStudent, setMessageStudent] = useState<StudentRow | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const removeStudents = useMutation(api.admin.removeStudents);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [studentsToRemove, setStudentsToRemove] = useState<Set<string>>(new Set());
  const [removing, setRemoving] = useState(false);

  const handleBulkRemoveClick = () => {
    setStudentsToRemove(selectedIds);
    setShowRemoveModal(true);
  };

  const handleSingleRemoveClick = (studentId: string) => {
    setStudentsToRemove(new Set([studentId]));
    setShowRemoveModal(true);
  };

  const handleConfirmRemove = async () => {
    setRemoving(true);
    try {
      await removeStudents({ studentIds: Array.from(studentsToRemove) as Id<"users">[] });
      setSelectedIds(new Set());
      setShowRemoveModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to remove students");
    } finally {
      setRemoving(false);
    }
  };

  const isLoading = studentsRaw === undefined;
  const students: StudentRow[] = (studentsRaw ?? []) as StudentRow[];
  const courses = (coursesRaw ?? []) as { id: string; title: string }[];

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

  /* ─── Derived stats ─── */
  const stats = useMemo(() => {
    const total = students.length;
    const active = students.filter((s) => s.enrollmentStatus === "active").length;
    const avgProgress = total > 0 ? Math.round(students.reduce((a, s) => a + s.progress, 0) / total) : 0;
    const paid = students.filter((s) => ["successful", "paid"].includes(s.paymentStatus.toLowerCase())).length;
    const pending = students.filter((s) => ["pending", "partial", "unpaid"].includes(s.paymentStatus.toLowerCase())).length;
    const completed = students.filter((s) => s.enrollmentStatus === "completed").length;
    return { total, active, avgProgress, paid, pending, completed };
  }, [students]);

  /* ─── Filtering + sorting ─── */
  const filtered = useMemo(() => {
    let list = [...students];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.courseName.toLowerCase().includes(q) ||
          s.batchName.toLowerCase().includes(q)
      );
    }
    if (courseFilter) list = list.filter((s) => s.courseName === courseFilter);
    if (paymentFilter) list = list.filter((s) => s.paymentStatus.toLowerCase() === paymentFilter);
    if (statusFilter) list = list.filter((s) => s.enrollmentStatus.toLowerCase() === statusFilter);

    list.sort((a, b) => {
      let av: any = a[sortField];
      let bv: any = b[sortField];
      if (sortField === "enrolledAt" || sortField === "createdAt") {
        av = av ? new Date(av).getTime() : 0;
        bv = bv ? new Date(bv).getTime() : 0;
      }
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [students, search, courseFilter, paymentFilter, statusFilter, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* ─── Bulk select ─── */
  const allOnPageSelected = paginated.length > 0 && paginated.every((s) => selectedIds.has(s.id));
  const toggleAll = () => {
    if (allOnPageSelected) {
      const next = new Set(selectedIds);
      paginated.forEach((s) => next.delete(s.id));
      setSelectedIds(next);
    } else {
      const next = new Set(selectedIds);
      paginated.forEach((s) => next.add(s.id));
      setSelectedIds(next);
    }
  };
  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const hasFilters = !!(search || courseFilter || paymentFilter || statusFilter);
  const uniqueCourses = [...new Set(students.map((s) => s.courseName).filter((c) => c !== "—"))];

  const handleExport = (exportList: StudentRow[]) => {
    if (exportList.length === 0) return;
    const headers = ["ID", "Name", "Email", "Course", "Batch", "Progress", "Payment Status", "Enrollment Status", "Role", "Joined Date"];
    const csvContent = exportList.map(s => 
      [
        s.id,
        `"${s.name.replace(/"/g, '""')}"`,
        s.email,
        `"${s.courseName.replace(/"/g, '""')}"`,
        `"${s.batchName.replace(/"/g, '""')}"`,
        s.progress,
        s.paymentStatus,
        s.enrollmentStatus,
        s.role || "student",
        new Date(s.createdAt).toISOString()
      ].join(",")
    );
    const csvData = [headers.join(","), ...csvContent].join("\n");
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `students_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ══════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════ */
  return (
    <div className="flex flex-col gap-6 pb-12">

      {/* ── Page Header ──────────────────────────── */}
      <AdminPageHeader
        title="Student Directory"
        subtitle="Manage enrollments, track progress, and communicate with learners."
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 h-9 px-4 bg-primary text-white rounded-full text-[13px] font-semibold hover:bg-primary/90 transition-all active:scale-[0.98] shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add Student
          </button>
        }
        controls={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={cn(
                "inline-flex items-center gap-1.5 h-9 px-3.5 border rounded-lg text-[13px] font-semibold transition-all",
                showFilters
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border bg-surface text-text-secondary hover:border-primary/30 hover:text-text-primary"
              )}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter
              {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </button>
            <button 
              onClick={() => handleExport(filtered)}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 border border-border rounded-lg bg-surface text-[13px] font-semibold text-text-secondary hover:border-primary/30 hover:text-text-primary transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        }
      />

      {/* ── Stats Row ────────────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-lg p-5 h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard label="Total Students" value={stats.total.toLocaleString()} icon={<Users className="w-4 h-4" />} trend="+48 this month" trendPositive />
          <StatCard label="Active Now" value={stats.active.toLocaleString()} icon={<Activity className="w-4 h-4" />} />
          <StatCard label="Avg. Progress" value={`${stats.avgProgress}%`} icon={<TrendingUp className="w-4 h-4" />} />
          <StatCard label="Paid Students" value={stats.paid.toLocaleString()} icon={<CreditCard className="w-4 h-4" />} badgeColor="success" />
          <StatCard label="Pending Payments" value={stats.pending.toLocaleString()} icon={<AlertCircle className="w-4 h-4" />} badge={stats.pending > 0 ? "Action" : undefined} badgeColor="warning" />
          <StatCard label="Completions" value={stats.completed.toLocaleString()} icon={<GraduationCap className="w-4 h-4" />} badgeColor="info" />
        </div>
      )}

      {/* ── Filters Panel ────────────────────────── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-surface border border-border rounded-lg p-4 flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search students, courses, batches…"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full h-9 pl-9 pr-3 bg-background border border-border rounded-lg text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
              </div>

              {/* Course filter */}
              <select
                value={courseFilter}
                onChange={(e) => { setCourseFilter(e.target.value); setPage(1); }}
                className="h-9 px-3 bg-background border border-border rounded-lg text-[13px] text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/40 min-w-[140px]"
              >
                <option value="">All Courses</option>
                {uniqueCourses.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>

              {/* Payment filter */}
              <select
                value={paymentFilter}
                onChange={(e) => { setPaymentFilter(e.target.value); setPage(1); }}
                className="h-9 px-3 bg-background border border-border rounded-lg text-[13px] text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/40 min-w-[140px]"
              >
                <option value="">All Payments</option>
                <option value="successful">Paid</option>
                <option value="pending">Pending</option>
                <option value="unpaid">Unpaid</option>
              </select>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="h-9 px-3 bg-background border border-border rounded-lg text-[13px] text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/40 min-w-[140px]"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="dropped">Dropped</option>
              </select>

              {/* Clear */}
              {hasFilters && (
                <button
                  onClick={() => { setSearch(""); setCourseFilter(""); setPaymentFilter(""); setStatusFilter(""); setPage(1); }}
                  className="h-9 px-3 border border-border rounded-lg text-[12px] font-semibold text-error hover:bg-error/10 transition-all flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bulk Action Bar ───────────────────────── */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-lg px-4 py-2.5"
          >
            <span className="text-[12px] font-semibold text-primary">
              {selectedIds.size} selected
            </span>
            <div className="flex items-center gap-2 ml-2">
              {[
                { icon: ShieldCheck, label: "Promote Role", action: () => alert("Bulk promotion coming soon") },
                { icon: Layers, label: "Assign Batch" },
                { icon: Send, label: "Announce" },
                { icon: Award, label: "Certificates" },
                { icon: Download, label: "Export", action: () => handleExport(students.filter(s => selectedIds.has(s.id))) },
                { icon: Trash2, label: "Remove", danger: true, action: handleBulkRemoveClick },
              ].map(({ icon: Icon, label, danger, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className={cn(
                    "inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-[11px] font-semibold border transition-all",
                    danger
                      ? "border-error/30 text-error hover:bg-error/10"
                      : "border-border text-text-secondary hover:bg-background hover:text-text-primary"
                  )}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="ml-auto w-6 h-6 flex items-center justify-center rounded text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Table Card ───────────────────────────── */}
      <AdminCard padding="none">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected && paginated.length > 0}
                    onChange={toggleAll}
                    className="w-3.5 h-3.5 rounded accent-primary cursor-pointer"
                    disabled={isLoading || paginated.length === 0}
                  />
                </th>
                <SortHeader label="Student" field="name" current={sortField} dir={sortDir} onClick={handleSort} />
                <th className="py-3 px-4 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">Enrollment</th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">Progress</th>
                <th className="py-3 px-4 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">Payment</th>
                <SortHeader label="Status" field="paymentStatus" current={sortField} dir={sortDir} onClick={handleSort} />
                <SortHeader label="Enrolled" field="enrolledAt" current={sortField} dir={sortDir} onClick={handleSort} />
                <th className="py-3 pl-4 pr-10 text-right text-[11px] font-semibold uppercase tracking-wider text-text-muted">Actions</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonRow key={i} />)
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16">
                    {hasFilters ? (
                      <AdminEmptyState
                        title="No students match your filters"
                        description="Try adjusting your search or filter criteria."
                        action={
                          <button
                            onClick={() => { setSearch(""); setCourseFilter(""); setPaymentFilter(""); setStatusFilter(""); }}
                            className="h-9 px-4 border border-border rounded-full text-[13px] font-semibold text-text-secondary hover:bg-background transition-all"
                          >
                            Clear Filters
                          </button>
                        }
                      />
                    ) : (
                      <AdminEmptyState
                        title="No students yet"
                        description="Students will appear here once they enroll in a course."
                        action={
                          <button
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center gap-2 h-9 px-4 bg-primary text-white rounded-full text-[13px] font-semibold hover:bg-primary/90 transition-all"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            Enroll First Student
                          </button>
                        }
                      />
                    )}
                  </td>
                </tr>
              ) : (
                paginated.map((student, idx) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className={cn(
                      "border-b border-border hover:bg-background/60 transition-colors group",
                      selectedIds.has(student.id) && "bg-primary/5"
                    )}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(student.id)}
                        onChange={() => toggleOne(student.id)}
                        className="w-3.5 h-3.5 rounded accent-primary cursor-pointer"
                      />
                    </td>

                    {/* Student */}
                    <td className="py-3.5 px-4">
                      <button
                        className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
                        onClick={() => setDrawerStudent(student)}
                      >
                        <Avatar name={student.name} url={student.avatarUrl} size={9} />
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-text-primary truncate max-w-[160px]">
                            {student.name}
                          </p>
                          <p className="text-[11px] text-text-muted truncate max-w-[160px]">
                            {student.email}
                          </p>
                        </div>
                      </button>
                    </td>

                    {/* Enrollment */}
                    <td className="py-3.5 px-4">
                      <p className="text-[12px] font-semibold text-primary truncate max-w-[160px]">
                        {student.courseName}
                      </p>
                      <p className="text-[11px] text-text-muted truncate max-w-[160px]">
                        {student.batchName}
                      </p>
                    </td>

                    {/* Progress */}
                    <td className="py-3.5 px-4">
                      <ProgressRing pct={student.progress} />
                    </td>

                    {/* Payment */}
                    <td className="py-3.5 px-4">
                      <PaymentChip status={student.paymentStatus} />
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={student.enrollmentStatus} />
                    </td>

                    {/* Enrolled date */}
                    <td className="py-3.5 px-4">
                      <span className="text-[12px] text-text-secondary">
                        {student.enrolledAt
                          ? new Date(student.enrolledAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                          : "—"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 pl-4 pr-10 text-right">
                      <RowActions
                        student={student}
                        onView={() => setDrawerStudent(student)}
                        onPromote={() => setPromoteStudent(student)}
                        onMessage={() => setMessageStudent(student)}
                        onRemove={() => handleSingleRemoveClick(student.id)}
                      />
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ────────────────────────────── */}
        {!isLoading && filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-border">
            <p className="text-[12px] text-text-muted">
              Showing{" "}
              <span className="font-semibold text-text-primary">
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-text-primary">{filtered.length.toLocaleString()}</span>{" "}
              students
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-secondary disabled:opacity-30 hover:bg-background hover:border-primary/30 hover:text-text-primary transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p: number;
                if (totalPages <= 5) p = i + 1;
                else if (page <= 3) p = i + 1;
                else if (page >= totalPages - 2) p = totalPages - 4 + i;
                else p = page - 2 + i;

                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-lg border text-[12px] font-semibold transition-all",
                      page === p
                        ? "border-primary bg-primary text-white shadow-sm"
                        : "border-border text-text-secondary hover:bg-background hover:border-primary/30 hover:text-text-primary"
                    )}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-secondary disabled:opacity-30 hover:bg-background hover:border-primary/30 hover:text-text-primary transition-all"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </AdminCard>

      {/* ── Modals & Drawers ─────────────────────── */}
      <AnimatePresence>
        {drawerStudent && (
          <StudentDrawer student={drawerStudent} onClose={() => setDrawerStudent(null)} />
        )}
      </AnimatePresence>

      <AddStudentModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        courses={courses}
      />

      {promoteStudent && (
        <PromoteRoleModal
          open={!!promoteStudent}
          onClose={() => setPromoteStudent(null)}
          studentId={promoteStudent.id as Id<"users">}
          studentName={promoteStudent.name}
          currentRole={promoteStudent.role || "student"}
          currentPermissions={promoteStudent.permissions || []}
        />
      )}

      {messageStudent && (
        <MessageStudentModal
          open={!!messageStudent}
          onClose={() => setMessageStudent(null)}
          studentName={messageStudent.name}
        />
      )}

      <RemoveStudentsModal
        open={showRemoveModal}
        onClose={() => setShowRemoveModal(false)}
        selectedCount={studentsToRemove.size}
        onConfirm={handleConfirmRemove}
        submitting={removing}
      />
    </div>
  );
}
