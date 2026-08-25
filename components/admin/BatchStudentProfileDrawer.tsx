"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BookOpen,
  Award,
  DollarSign,
  FileText,
  MessageSquare,
  Send,
  Share2,
  Edit3,
  Trash2,
  ArrowRightLeft,
  Loader2,
  TrendingUp,
  Activity,
  ShieldCheck,
  ExternalLink,
  History,
} from "lucide-react";

export interface BatchStudentExtendedItem {
  enrollmentId: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  status: string;
  progress: number;
  attendancePercentage: number;
  assignmentCompletion: number;
  paymentStatus: string;
  certificateStatus: string;
  activityStatus: string;
  isAtRisk: boolean;
  notes: string;
  enrolledAt: string;
}

interface BatchStudentProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  student: BatchStudentExtendedItem | null;
  batchTitle?: string;
  onUpdateStatus?: (
    enrollmentId: string,
    updates: {
      status?: string;
      certificateStatus?: string;
      notes?: string;
      attendancePercentage?: number;
      progress?: number;
    }
  ) => Promise<void>;
  onTransferStudent?: (student: BatchStudentExtendedItem) => void;
  onRemoveStudent?: (student: BatchStudentExtendedItem) => void;
}

export function BatchStudentProfileDrawer({
  isOpen,
  onClose,
  student,
  batchTitle = "Cohort Batch",
  onUpdateStatus,
  onTransferStudent,
  onRemoveStudent,
}: BatchStudentProfileDrawerProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "attendance" | "assignments" | "payment" | "notes" | "timeline"
  >("overview");

  const [notesText, setNotesText] = useState("");
  const [attendanceVal, setAttendanceVal] = useState<number>(0);
  const [progressVal, setProgressVal] = useState<number>(0);
  const [certStatus, setCertStatus] = useState("Pending");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const [milestones, setMilestones] = useState([
    { id: 1, title: "Complete Portfolio Project Phase 1", done: false },
    { id: 2, title: "Final Assessment (September 12)", done: false },
    { id: 3, title: "Complete Capstone Presentation", done: false },
  ]);

  const toggleMilestone = (id: number) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, done: !m.done } : m))
    );
  };

  useEffect(() => {
    if (student) {
      setNotesText(student.notes || "");
      setAttendanceVal(student.attendancePercentage || 0);
      setProgressVal(student.progress || 0);
      setCertStatus(student.certificateStatus || "Pending");
    }
  }, [student]);

  if (!student) return null;

  const handleSaveNotes = async () => {
    if (!onUpdateStatus) return;
    setIsSaving(true);
    setSaveMsg(null);
    try {
      await onUpdateStatus(student.enrollmentId, { notes: notesText });
      setSaveMsg("Internal notes updated successfully.");
      setTimeout(() => setSaveMsg(null), 3000);
    } catch (err) {
      console.error("Failed to update notes:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateMetrics = async () => {
    if (!onUpdateStatus) return;
    setIsSaving(true);
    setSaveMsg(null);
    try {
      await onUpdateStatus(student.enrollmentId, {
        attendancePercentage: attendanceVal,
        progress: progressVal,
        certificateStatus: certStatus,
      });
      setSaveMsg("Student progress & certificate status updated.");
      setTimeout(() => setSaveMsg(null), 3000);
    } catch (err) {
      console.error("Failed to update metrics:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const openWhatsApp = () => {
    const cleanPhone = student.phone.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `Hi ${student.name}, regarding your enrollment in ${batchTitle} at VibeLogic Studio...`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
  };

  const openEmail = () => {
    const subject = encodeURIComponent(`VibeLogic Studio — ${batchTitle} Update`);
    window.location.href = `mailto:${student.email}?subject=${subject}`;
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "attendance", label: "Attendance", icon: Calendar },
    { id: "assignments", label: "Assignments", icon: BookOpen },
    { id: "payment", label: "Payment & Certificate", icon: Award },
    { id: "notes", label: "Internal Notes", icon: FileText },
    { id: "timeline", label: "Activity Timeline", icon: History },
  ] as const;

  const simulatedSessions = [
    { id: 1, title: "Session #1 — Cohort Kickoff & System Architecture", date: "Jul 15, 2026", status: "Present" },
    { id: 2, title: "Session #2 — Advanced React & Next.js App Router", date: "Jul 18, 2026", status: "Present" },
    { id: 3, title: "Session #3 — Convex Cloud & Real-Time Sync", date: "Jul 22, 2026", status: attendanceVal >= 70 ? "Present" : "Late" },
    { id: 4, title: "Session #4 — Full-Stack Auth with Clerk", date: "Jul 25, 2026", status: attendanceVal >= 60 ? "Present" : "Absent" },
    { id: 5, title: "Session #5 — AI Agents & Performance Optimization", date: "Jul 29, 2026", status: attendanceVal >= 80 ? "Present" : "Absent" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Slide-in Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-2xl bg-surface border-l border-border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-border bg-background/50 flex items-start justify-between gap-4 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xl overflow-hidden shrink-0">
                  {student.avatarUrl ? (
                    <img
                      src={student.avatarUrl}
                      alt={student.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{student.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold tracking-tight text-text-primary">
                      {student.name}
                    </h2>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        student.status === "active"
                          ? "bg-green-50 border-green-200 text-green-700"
                          : student.status === "completed"
                            ? "bg-blue-50 border-blue-200 text-blue-700"
                            : "bg-red-50 border-red-200 text-red-700"
                      }`}
                    >
                      {student.status.toUpperCase()}
                    </span>
                    {student.isAtRisk && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 border border-red-500/30 text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        At Risk
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    Student ID: <span className="font-mono font-medium text-text-primary">#STU-{student.enrollmentId.slice(-8).toUpperCase()}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-border/50 text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Side-by-Side Contact Information Cards (Image 2 style) */}
            <div className="px-6 py-3 bg-background/30 border-b border-border grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
              <div className="p-3 rounded-xl bg-surface border border-border">
                <p className="text-[10px] font-bold tracking-wider text-text-muted uppercase">
                  Email Address
                </p>
                <p className="text-xs font-semibold text-text-primary truncate mt-0.5">
                  {student.email}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-border">
                <p className="text-[10px] font-bold tracking-wider text-text-muted uppercase">
                  Phone Number
                </p>
                <p className="text-xs font-semibold text-text-primary truncate mt-0.5">
                  {student.phone || "+1 (555) 000-0000"}
                </p>
              </div>
            </div>

            {/* Quick Communication Bar */}
            <div className="px-6 py-3 bg-surface border-b border-border flex items-center justify-between gap-2 flex-wrap text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={openWhatsApp}
                  className="px-3 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 font-medium flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  WhatsApp
                </button>
                <button
                  onClick={openEmail}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Email Student
                </button>
              </div>

              <div className="flex items-center gap-2">
                {onTransferStudent && (
                  <button
                    onClick={() => onTransferStudent(student)}
                    className="px-3 py-1.5 rounded-lg border border-border hover:bg-background text-text-primary font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 text-text-muted" />
                    Transfer
                  </button>
                )}
                {onRemoveStudent && (
                  <button
                    onClick={() => onRemoveStudent(student)}
                    className="px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Tabs Bar */}
            <div className="px-6 border-b border-border bg-background/30 flex items-center gap-1 overflow-x-auto shrink-0">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-text-muted hover:text-text-primary"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Body Content */}
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              {saveMsg && (
                <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{saveMsg}</span>
                </div>
              )}

              {/* OVERVIEW TAB */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {student.isAtRisk && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-red-600">
                          Student Attention Required — Low Engagement
                        </h4>
                        <p className="text-xs text-red-700/80 mt-1">
                          This student has course progress below 30% or attendance below 60%.
                          Consider scheduling a 1-on-1 check-in or sending a WhatsApp reminder.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-background border border-border">
                      <p className="text-xs text-text-muted font-medium">Overall Progress</p>
                      <div className="flex items-end justify-between mt-1.5">
                        <span className="text-xl font-bold text-text-primary">{student.progress}%</span>
                        <span className="text-[11px] text-text-muted">8 / 10 mod</span>
                      </div>
                      <div className="w-full bg-border h-1.5 rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-background border border-border">
                      <p className="text-xs text-text-muted font-medium">Attendance %</p>
                      <div className="flex items-end justify-between mt-1.5">
                        <span className="text-xl font-bold text-text-primary">{student.attendancePercentage}%</span>
                        <span className="text-[11px] text-text-muted">Live sessions</span>
                      </div>
                      <div className="w-full bg-border h-1.5 rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full bg-green-500 transition-all duration-500"
                          style={{ width: `${student.attendancePercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-background border border-border">
                      <p className="text-xs text-text-muted font-medium">Assignments</p>
                      <div className="flex items-end justify-between mt-1.5">
                        <span className="text-xl font-bold text-text-primary">{Math.round((student.assignmentCompletion * 15) / 100)} / 15</span>
                        <span className="text-[11px] text-text-muted">{student.assignmentCompletion}%</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-background border border-border">
                      <p className="text-xs text-text-muted font-medium">Videos Watched</p>
                      <div className="flex items-end justify-between mt-1.5">
                        <span className="text-xl font-bold text-text-primary">24 / 28</span>
                        <span className="text-[11px] text-green-600 font-semibold">Streak 7d</span>
                      </div>
                    </div>
                  </div>

                  {/* Next Milestones Interactive Checkable Widget (Image 2 style) */}
                  <div className="p-5 rounded-2xl bg-surface border border-border space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary" />
                        Next Milestones
                      </h4>
                      <span className="text-xs text-text-muted font-medium">
                        {milestones.filter(m => m.done).length} of {milestones.length} completed
                      </span>
                    </div>
                    <div className="space-y-2">
                      {milestones.map((m) => (
                        <label
                          key={m.id}
                          className="flex items-center gap-3 p-3 rounded-xl bg-background hover:bg-background/80 cursor-pointer transition-colors border border-border"
                        >
                          <input
                            type="checkbox"
                            checked={m.done}
                            onChange={() => toggleMilestone(m.id)}
                            className="w-4 h-4 rounded text-primary focus:ring-primary border-border"
                          />
                          <span className={`text-xs font-medium ${m.done ? "line-through text-text-muted" : "text-text-primary"}`}>
                            {m.title}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Administrative Quick Editor */}
                  <div className="p-5 rounded-2xl bg-background border border-border space-y-4">
                    <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-primary" />
                      Quick Admin Progress & Certificate Override
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-text-muted mb-1">
                          Attendance %
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={attendanceVal}
                          onChange={(e) => setAttendanceVal(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-sm text-text-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-muted mb-1">
                          Course Progress %
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={progressVal}
                          onChange={(e) => setProgressVal(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-sm text-text-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-muted mb-1">
                          Certificate Status
                        </label>
                        <select
                          value={certStatus}
                          onChange={(e) => setCertStatus(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-sm text-text-primary"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Eligible">Eligible</option>
                          <option value="Issued">Issued</option>
                          <option value="Downloaded">Downloaded</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleUpdateMetrics}
                        disabled={isSaving}
                        className="px-4 py-2 rounded-xl bg-primary text-white font-semibold text-xs hover:bg-primary/90 transition-colors flex items-center gap-2"
                      >
                        {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                        Save Progress Overrides
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ATTENDANCE TAB */}
              {activeTab === "attendance" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-text-primary">
                        Live Class Attendance Log
                      </h3>
                      <p className="text-xs text-text-muted">
                        Recorded attendance for cohort live sessions
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                      Overall: {student.attendancePercentage}%
                    </span>
                  </div>

                  <div className="border border-border rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-background border-b border-border text-text-muted">
                          <th className="py-2.5 px-4 font-semibold">Session Title</th>
                          <th className="py-2.5 px-4 font-semibold">Date</th>
                          <th className="py-2.5 px-4 font-semibold text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {simulatedSessions.map((session) => (
                          <tr key={session.id} className="hover:bg-background/50">
                            <td className="py-3 px-4 font-medium text-text-primary">
                              {session.title}
                            </td>
                            <td className="py-3 px-4 text-text-muted">{session.date}</td>
                            <td className="py-3 px-4 text-right">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  session.status === "Present"
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : session.status === "Late"
                                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                                      : "bg-red-50 text-red-700 border border-red-200"
                                }`}
                              >
                                {session.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ASSIGNMENTS TAB */}
              {activeTab === "assignments" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-text-primary">
                    Assignments & Study Materials Access
                  </h3>
                  <div className="p-4 rounded-2xl bg-background border border-border space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-text-primary">
                        Assignment 1: Responsive Layout Build
                      </span>
                      <span className="px-2 py-0.5 rounded bg-green-50 text-green-700 font-semibold">
                        Submitted
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-text-primary">
                        Assignment 2: Next.js App Router API Integration
                      </span>
                      <span className="px-2 py-0.5 rounded bg-green-50 text-green-700 font-semibold">
                        Submitted
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-text-primary">
                        Assignment 3: Convex Schema & Auth Guard
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-semibold ${
                          student.assignmentCompletion > 75
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {student.assignmentCompletion > 75 ? "Submitted" : "Pending Review"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* PAYMENT & CERTIFICATE TAB */}
              {activeTab === "payment" && (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-background border border-border space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-text-primary">Payment Status</h4>
                        <p className="text-xs text-text-muted mt-0.5">
                          Cohort enrollment billing details
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          student.paymentStatus === "Paid"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {student.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-background border border-border space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-text-primary">
                          VibeLogic Studio Certificate
                        </h4>
                        <p className="text-xs text-text-muted mt-0.5">
                          Certificate of Completion for {batchTitle}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          student.certificateStatus === "Issued" ||
                          student.certificateStatus === "Downloaded"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : student.certificateStatus === "Eligible"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {student.certificateStatus}
                      </span>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => {
                          setCertStatus("Issued");
                          handleUpdateMetrics();
                        }}
                        className="px-4 py-2 rounded-xl bg-primary text-white font-semibold text-xs hover:bg-primary/90 transition-colors flex items-center gap-1.5"
                      >
                        <Award className="w-3.5 h-3.5" />
                        Issue Certificate Now
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* NOTES TAB */}
              {activeTab === "notes" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">
                      Administrator Internal Notes
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5">
                      Private notes visible only to VibeLogic Studio administrators
                    </p>
                  </div>
                  <textarea
                    rows={6}
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    placeholder="Add notes about student check-ins, payment plans, attendance exceptions, or performance..."
                    className="w-full p-4 rounded-2xl bg-background border border-border text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-primary"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveNotes}
                      disabled={isSaving}
                      className="px-4 py-2 rounded-xl bg-primary text-white font-semibold text-xs hover:bg-primary/90 transition-colors flex items-center gap-1.5"
                    >
                      {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                      Save Notes
                    </button>
                  </div>
                </div>
              )}

              {/* TIMELINE TAB */}
              {activeTab === "timeline" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-text-primary">Activity Timeline</h3>
                  <div className="space-y-4 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                    <div className="relative">
                      <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-primary border-2 border-surface" />
                      <p className="text-xs font-semibold text-text-primary">
                        Last Active ({student.activityStatus})
                      </p>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        Accessed course video lessons and cohort study materials
                      </p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-green-500 border-2 border-surface" />
                      <p className="text-xs font-semibold text-text-primary">
                        Attendance Status Verified
                      </p>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        Recorded {student.attendancePercentage}% live session participation
                      </p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-surface" />
                      <p className="text-xs font-semibold text-text-primary">
                        Enrolled in Cohort Batch
                      </p>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        {new Date(student.enrolledAt).toLocaleDateString("en-US", {
                          dateStyle: "medium",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Drawer Footer with Quick Actions */}
            <div className="p-4 border-t border-border bg-surface flex flex-col gap-3 shrink-0 shadow-lg">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={openWhatsApp}
                    className="px-3.5 py-2 rounded-xl bg-primary text-white font-semibold text-xs hover:bg-primary/90 transition-colors flex items-center gap-1.5 shadow-sm shadow-primary/20"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Send Message
                  </button>
                  <button
                    onClick={() => setActiveTab("overview")}
                    className="px-3.5 py-2 rounded-xl bg-primary text-white font-semibold text-xs hover:bg-primary/90 transition-colors flex items-center gap-1.5 shadow-sm shadow-primary/20"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    Review Progress
                  </button>
                  <button
                    onClick={() => setActiveTab("payment")}
                    className="px-3 py-2 rounded-xl border border-border hover:bg-background text-text-primary font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5 text-primary" />
                    Issue Certificate
                  </button>
                  <button
                    onClick={() => {
                      setAttendanceVal((prev) => Math.min(100, prev + 5));
                      handleUpdateMetrics();
                    }}
                    className="px-3 py-2 rounded-xl border border-border hover:bg-background text-text-primary font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-green-600" />
                    Mark Attendance
                  </button>
                </div>
                <button
                  onClick={onClose}
                  className="px-3 py-2 rounded-xl bg-border hover:bg-border/80 text-text-primary font-semibold text-xs transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
