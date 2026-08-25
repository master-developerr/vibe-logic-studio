"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  Video,
  User,
  BookOpen,
  Paperclip,
  Bell,
  CheckSquare,
  Globe,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Plus,
  AlertCircle,
  Share2,
  Layers,
  Award,
  CalendarDays,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type EventType =
  | "Live Class"
  | "Workshop"
  | "Exam"
  | "Assignment Deadline"
  | "Office Hours"
  | "Holiday"
  | "Guest Session"
  | "Practice Session"
  | "Cancelled Session"
  | "Completed Session";

export type PublishStatus = "Draft" | "Scheduled" | "Published" | "Cancelled";

export interface BatchCalendarEvent {
  id: string;
  title: string;
  eventType: EventType;
  description?: string;
  dateStr: string; // YYYY-MM-DD
  startTime: string; // HH:mm (e.g., 18:00)
  endTime: string; // HH:mm
  durationMins: number;
  timezone: string;
  leadInstructor: string;
  assistantInstructor?: string;
  meetingLink: string;
  module?: string;
  lesson?: string;
  objectives: string[];
  studyMaterials: { name: string; url: string }[];
  assignmentUrl?: string;
  recordingUrl?: string;
  externalLinks: { title: string; url: string }[];
  notifyStudents: boolean;
  whatsappReminder: boolean;
  emailReminder: boolean;
  attendanceRequired: boolean;
  publishStatus: PublishStatus;
  colorCategory: string;
}

export const EVENT_TYPE_COLORS: Record<
  EventType,
  { bg: string; text: string; border: string; dot: string; label: string }
> = {
  "Live Class": {
    bg: "bg-blue-500/10",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-500/20",
    dot: "bg-blue-500",
    label: "Live Class",
  },
  Workshop: {
    bg: "bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-500/20",
    dot: "bg-amber-500",
    label: "Workshop",
  },
  Exam: {
    bg: "bg-red-500/10",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-500/20",
    dot: "bg-red-500",
    label: "Exam",
  },
  "Assignment Deadline": {
    bg: "bg-purple-500/10",
    text: "text-purple-700 dark:text-purple-400",
    border: "border-purple-500/20",
    dot: "bg-purple-500",
    label: "Assignment Deadline",
  },
  "Office Hours": {
    bg: "bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-500/20",
    dot: "bg-emerald-500",
    label: "Office Hours",
  },
  Holiday: {
    bg: "bg-slate-500/10",
    text: "text-slate-700 dark:text-slate-400",
    border: "border-slate-500/20",
    dot: "bg-slate-500",
    label: "Holiday",
  },
  "Guest Session": {
    bg: "bg-indigo-500/10",
    text: "text-indigo-700 dark:text-indigo-400",
    border: "border-indigo-500/20",
    dot: "bg-indigo-500",
    label: "Guest Session",
  },
  "Practice Session": {
    bg: "bg-teal-500/10",
    text: "text-teal-700 dark:text-teal-400",
    border: "border-teal-500/20",
    dot: "bg-teal-500",
    label: "Practice Session",
  },
  "Cancelled Session": {
    bg: "bg-stone-500/10",
    text: "text-stone-500 dark:text-stone-400 line-through",
    border: "border-stone-500/20",
    dot: "bg-stone-400",
    label: "Cancelled Session",
  },
  "Completed Session": {
    bg: "bg-green-500/10",
    text: "text-green-700 dark:text-green-400",
    border: "border-green-500/20",
    dot: "bg-green-500",
    label: "Completed Session",
  },
};

interface BatchEventDrawerProps {
  event: BatchCalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedEvent: BatchCalendarEvent) => void;
  onDelete: (eventId: string) => void;
  onDuplicate: (event: BatchCalendarEvent) => void;
}

export function BatchEventDrawer({
  event,
  isOpen,
  onClose,
  onSave,
  onDelete,
  onDuplicate,
}: BatchEventDrawerProps) {
  // STRICT RULES OF HOOKS: Declare ALL state unconditionally at top of component body
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState<EventType>("Live Class");
  const [description, setDescription] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [startTime, setStartTime] = useState("18:00");
  const [endTime, setEndTime] = useState("19:30");
  const [durationMins, setDurationMins] = useState(90);
  const [timezone, setTimezone] = useState("America/New_York (EST)");
  const [leadInstructor, setLeadInstructor] = useState("Markus Keren");
  const [assistantInstructor, setAssistantInstructor] = useState("None");
  const [meetingLink, setMeetingLink] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [lessonName, setLessonName] = useState("");
  const [objectives, setObjectives] = useState<string[]>([]);
  const [newObjective, setNewObjective] = useState("");
  const [studyMaterials, setStudyMaterials] = useState<
    { name: string; url: string }[]
  >([]);
  const [newMatName, setNewMatName] = useState("");
  const [newMatUrl, setNewMatUrl] = useState("");
  const [assignmentUrl, setAssignmentUrl] = useState("");
  const [recordingUrl, setRecordingUrl] = useState("");
  const [externalLinks, setExternalLinks] = useState<
    { title: string; url: string }[]
  >([]);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [notifyStudents, setNotifyStudents] = useState(true);
  const [whatsappReminder, setWhatsappReminder] = useState(true);
  const [emailReminder, setEmailReminder] = useState(true);
  const [attendanceRequired, setAttendanceRequired] = useState(true);
  const [publishStatus, setPublishStatus] = useState<PublishStatus>("Published");

  const [copiedLink, setCopiedLink] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);

  // Synchronize state when event prop changes
  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
      setEventType(event.eventType || "Live Class");
      setDescription(
        event.description ||
          "Interactive live cohort session covering key module objectives."
      );
      setDateStr(event.dateStr || "2026-08-15");
      setStartTime(event.startTime || "18:00");
      setEndTime(event.endTime || "19:30");
      setDurationMins(event.durationMins || 90);
      setTimezone(event.timezone || "America/New_York (EST)");
      setLeadInstructor(event.leadInstructor || "Markus Keren");
      setAssistantInstructor(event.assistantInstructor || "None");
      setMeetingLink(
        event.meetingLink || "https://meet.google.com/vibe-logic-live"
      );
      setModuleName(event.module || "Module 9: Advanced AI Agents");
      setLessonName(event.lesson || "Lesson 4: Multi-Agent Workflows");
      setObjectives(
        event.objectives || [
          "Understand multi-agent message routing",
          "Build resilient Convex mutations",
          "Implement real-time classroom sync",
        ]
      );
      setStudyMaterials(
        event.studyMaterials || [
          {
            name: "Cohort Lesson Slides (PDF)",
            url: "https://vibelogic.studio/docs/module-9-slides.pdf",
          },
        ]
      );
      setAssignmentUrl(
        event.assignmentUrl ||
          "https://github.com/vibelogic/assignment-ai-agents-v1"
      );
      setRecordingUrl(
        event.recordingUrl ||
          "https://recordings.vibelogic.studio/live-08152026.mp4"
      );
      setExternalLinks(
        event.externalLinks || [
          {
            title: "Convex Realtime Docs",
            url: "https://docs.convex.dev",
          },
        ]
      );
      setNotifyStudents(
        event.notifyStudents !== undefined ? event.notifyStudents : true
      );
      setWhatsappReminder(
        event.whatsappReminder !== undefined ? event.whatsappReminder : true
      );
      setEmailReminder(
        event.emailReminder !== undefined ? event.emailReminder : true
      );
      setAttendanceRequired(
        event.attendanceRequired !== undefined ? event.attendanceRequired : true
      );
      setPublishStatus(event.publishStatus || "Published");
    }
  }, [event]);

  // Handle auto calculation of duration when start or end time changes
  useEffect(() => {
    try {
      const [sh, sm] = startTime.split(":").map(Number);
      const [eh, em] = endTime.split(":").map(Number);
      const startTotal = (sh || 0) * 60 + (sm || 0);
      const endTotal = (eh || 0) * 60 + (em || 0);
      const diff = endTotal - startTotal;
      if (diff > 0) {
        setDurationMins(diff);
      }
    } catch (e) {
      // Ignore parse errors
    }
  }, [startTime, endTime]);

  const handleCopyMeetingLink = () => {
    if (!meetingLink) return;
    navigator.clipboard.writeText(meetingLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddObjective = () => {
    if (!newObjective.trim()) return;
    setObjectives((prev) => [...prev, newObjective.trim()]);
    setNewObjective("");
  };

  const handleRemoveObjective = (idx: number) => {
    setObjectives((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddStudyMaterial = () => {
    if (!newMatName.trim() || !newMatUrl.trim()) return;
    setStudyMaterials((prev) => [
      ...prev,
      { name: newMatName.trim(), url: newMatUrl.trim() },
    ]);
    setNewMatName("");
    setNewMatUrl("");
  };

  const handleRemoveStudyMaterial = (idx: number) => {
    setStudyMaterials((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddExternalLink = () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) return;
    setExternalLinks((prev) => [
      ...prev,
      { title: newLinkTitle.trim(), url: newLinkUrl.trim() },
    ]);
    setNewLinkTitle("");
    setNewLinkUrl("");
  };

  const handleRemoveExternalLink = (idx: number) => {
    setExternalLinks((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmitSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    const updated: BatchCalendarEvent = {
      ...event,
      title: title.trim() || "Untitled Session",
      eventType,
      description,
      dateStr,
      startTime,
      endTime,
      durationMins,
      timezone,
      leadInstructor,
      assistantInstructor,
      meetingLink,
      module: moduleName,
      lesson: lessonName,
      objectives,
      studyMaterials,
      assignmentUrl,
      recordingUrl,
      externalLinks,
      notifyStudents,
      whatsappReminder,
      emailReminder,
      attendanceRequired,
      publishStatus,
      colorCategory: EVENT_TYPE_COLORS[eventType].label,
    };

    onSave(updated);
    setSaveFeedback(true);
    setTimeout(() => {
      setSaveFeedback(false);
      onClose();
    }, 500);
  };

  const handleToggleCancelEvent = () => {
    if (!event) return;
    const newStatus: PublishStatus =
      publishStatus === "Cancelled" ? "Published" : "Cancelled";
    const newType: EventType =
      newStatus === "Cancelled" ? "Cancelled Session" : "Live Class";
    setPublishStatus(newStatus);
    setEventType(newType);
  };

  if (!isOpen || !event) return null;

  const currentTypeColor =
    EVENT_TYPE_COLORS[eventType] || EVENT_TYPE_COLORS["Live Class"];

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
            className="fixed inset-0 z-50 bg-secondary/40 backdrop-blur-xs"
          />

          {/* Slide-In Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-2xl bg-surface border-l border-border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Drawer Header & Quick Actions Bar */}
            <div className="p-6 border-b border-border bg-background/50 flex flex-col gap-4 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${currentTypeColor.bg} ${currentTypeColor.text} ${currentTypeColor.border}`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${currentTypeColor.dot}`}
                    />
                    {currentTypeColor.label}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      publishStatus === "Published"
                        ? "bg-green-500/10 text-green-700 border-green-500/20"
                        : publishStatus === "Scheduled"
                          ? "bg-blue-500/10 text-blue-700 border-blue-500/20"
                          : publishStatus === "Draft"
                            ? "bg-amber-500/10 text-amber-700 border-amber-500/20"
                            : "bg-red-500/10 text-red-700 border-red-500/20"
                    }`}
                  >
                    {publishStatus.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-border/60 text-text-muted hover:text-text-primary transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h2 className="text-xl font-bold text-text-primary">
                  {title || "Edit Scheduled Session"}
                </h2>
                <p className="text-xs text-text-muted mt-1 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    {dateStr}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {startTime} – {endTime} ({durationMins}m)
                  </span>
                </p>
              </div>

              {/* Quick Operational Toolbar */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <button
                  type="button"
                  onClick={() => onDuplicate(event)}
                  className="px-3 py-1.5 rounded-lg bg-surface border border-border hover:bg-background text-text-primary font-medium text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-text-muted" />
                  Duplicate Session
                </button>
                <button
                  type="button"
                  onClick={handleCopyMeetingLink}
                  className="px-3 py-1.5 rounded-lg bg-surface border border-border hover:bg-background text-text-primary font-medium text-xs flex items-center gap-1.5 transition-colors"
                >
                  {copiedLink ? (
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <Video className="w-3.5 h-3.5 text-primary" />
                  )}
                  {copiedLink ? "Link Copied!" : "Copy Meeting Link"}
                </button>
                <button
                  type="button"
                  onClick={handleToggleCancelEvent}
                  className="px-3 py-1.5 rounded-lg bg-surface border border-border hover:bg-background text-text-primary font-medium text-xs flex items-center gap-1.5 transition-colors"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  {publishStatus === "Cancelled"
                    ? "Restore Session"
                    : "Cancel Session"}
                </button>
              </div>
            </div>

            {/* Scrollable Form Content (9 Complete Sections) */}
            <form
              onSubmit={handleSubmitSave}
              className="flex-1 overflow-y-auto p-6 space-y-8"
            >
              {/* SECTION 1: GENERAL */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  1. General Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Event Title *
                    </label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Live Class: Advanced Convex Auth"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Event Type *
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) =>
                        setEventType(e.target.value as EventType)
                      }
                      className="w-full h-10 px-3 rounded-xl bg-surface border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      {Object.keys(EVENT_TYPE_COLORS).map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Description & Agenda
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter session agenda, topics to be covered, and prep notes for students..."
                    className="w-full p-3 rounded-xl bg-surface border border-border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <hr className="border-border" />

              {/* SECTION 2: SCHEDULE */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  2. Schedule & Timezone
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Date *
                    </label>
                    <Input
                      type="date"
                      value={dateStr}
                      onChange={(e) => setDateStr(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Start Time
                    </label>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      End Time
                    </label>
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Duration (Mins)
                    </label>
                    <Input
                      type="number"
                      value={durationMins}
                      onChange={(e) => setDurationMins(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Cohort Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-surface border border-border text-sm text-text-primary focus:outline-none"
                  >
                    <option value="America/New_York (EST)">
                      America/New_York (EST / EDT)
                    </option>
                    <option value="America/Los_Angeles (PST)">
                      America/Los_Angeles (PST / PDT)
                    </option>
                    <option value="Asia/Kolkata (IST)">
                      Asia/Kolkata (IST — UTC+5:30)
                    </option>
                    <option value="Europe/London (GMT)">
                      Europe/London (GMT / BST)
                    </option>
                    <option value="UTC (Coordinated Universal Time)">
                      UTC (Coordinated Universal Time)
                    </option>
                  </select>
                </div>
              </div>

              <hr className="border-border" />

              {/* SECTION 3: INSTRUCTOR */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <User className="w-4 h-4" />
                  3. Instructor Assignment
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Lead Instructor *
                    </label>
                    <select
                      value={leadInstructor}
                      onChange={(e) => setLeadInstructor(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-surface border border-border text-sm text-text-primary focus:outline-none"
                    >
                      <option value="Markus Keren">
                        Markus Keren (Lead Technical Architect)
                      </option>
                      <option value="Dr. Sarah Jenkins">
                        Dr. Sarah Jenkins (Senior AI Engineer)
                      </option>
                      <option value="Alex D'Souza">
                        Alex D'Souza (Product Operations)
                      </option>
                      <option value="Elena Rostova">
                        Elena Rostova (Full-Stack Mentor)
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Assistant Instructor / Teaching Assistant
                    </label>
                    <select
                      value={assistantInstructor}
                      onChange={(e) => setAssistantInstructor(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-surface border border-border text-sm text-text-primary focus:outline-none"
                    >
                      <option value="None">None (Solo Instructor)</option>
                      <option value="Elena Rostova">
                        Elena Rostova (Teaching Assistant)
                      </option>
                      <option value="Alex D'Souza">
                        Alex D'Souza (TA / Moderator)
                      </option>
                      <option value="Vikram Seth">
                        Vikram Seth (Lab Assistant)
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <hr className="border-border" />

              {/* SECTION 4: MEETING */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  4. Virtual Classroom Meeting URL
                </h3>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Google Meet / Zoom URL *
                    </label>
                    <Input
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                      placeholder="https://meet.google.com/..."
                    />
                  </div>
                  <div className="flex items-center gap-2 self-end pb-0.5">
                    <a
                      href={meetingLink || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="h-10 px-4 rounded-xl bg-primary text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Join Classroom
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyMeetingLink}
                      className="h-10 px-4 rounded-xl border border-border hover:bg-background text-text-primary font-semibold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5 text-text-muted" />
                      {copiedLink ? "Copied" : "Copy Link"}
                    </button>
                  </div>
                </div>
              </div>

              <hr className="border-border" />

              {/* SECTION 5: LEARNING */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  5. Curriculum Alignment & Learning Objectives
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Module Assignment
                    </label>
                    <Input
                      value={moduleName}
                      onChange={(e) => setModuleName(e.target.value)}
                      placeholder="e.g. Module 9: Advanced AI Agents"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Lesson Unit
                    </label>
                    <Input
                      value={lessonName}
                      onChange={(e) => setLessonName(e.target.value)}
                      placeholder="e.g. Lesson 4: Multi-Agent Workflows"
                    />
                  </div>
                </div>

                {/* Learning Objectives List */}
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                    Session Learning Objectives
                  </label>
                  <div className="space-y-2">
                    {objectives.map((obj, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-background border border-border text-xs text-text-primary"
                      >
                        <span className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                          {obj}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveObjective(idx)}
                          className="text-text-muted hover:text-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <Input
                        value={newObjective}
                        onChange={(e) => setNewObjective(e.target.value)}
                        placeholder="Add a measurable learning objective..."
                        className="text-xs h-9"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddObjective();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddObjective}
                        className="h-9 px-3 rounded-xl bg-surface border border-border hover:bg-background text-text-primary text-xs font-semibold shrink-0"
                      >
                        + Add Objective
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-border" />

              {/* SECTION 6: RESOURCES */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <Paperclip className="w-4 h-4" />
                  6. Course Resources, Assignments & Recordings
                </h3>

                {/* Study Materials */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-text-secondary">
                    Attached Study Materials & Slides
                  </label>
                  {studyMaterials.map((mat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-background border border-border text-xs"
                    >
                      <a
                        href={mat.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary font-medium hover:underline flex items-center gap-2 truncate"
                      >
                        <FileText className="w-4 h-4 text-primary shrink-0" />
                        {mat.name}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleRemoveStudyMaterial(idx)}
                        className="text-text-muted hover:text-red-600 ml-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Input
                      value={newMatName}
                      onChange={(e) => setNewMatName(e.target.value)}
                      placeholder="Material title (e.g. Slide deck)"
                      className="text-xs h-9"
                    />
                    <Input
                      value={newMatUrl}
                      onChange={(e) => setNewMatUrl(e.target.value)}
                      placeholder="https://..."
                      className="text-xs h-9"
                    />
                    <button
                      type="button"
                      onClick={handleAddStudyMaterial}
                      className="h-9 px-3 rounded-xl bg-surface border border-border hover:bg-background text-text-primary text-xs font-semibold"
                    >
                      + Attach Material
                    </button>
                  </div>
                </div>

                {/* Assignment & Recording URLs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Assignment Repository / Docs URL
                    </label>
                    <Input
                      value={assignmentUrl}
                      onChange={(e) => setAssignmentUrl(e.target.value)}
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Session Video Recording URL
                    </label>
                    <Input
                      value={recordingUrl}
                      onChange={(e) => setRecordingUrl(e.target.value)}
                      placeholder="https://recordings.vibelogic.studio/..."
                    />
                  </div>
                </div>

                {/* External Links */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-text-secondary">
                    External References & Docs
                  </label>
                  {externalLinks.map((link, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-background border border-border text-xs"
                    >
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-text-primary font-medium hover:text-primary flex items-center gap-1.5"
                      >
                        <Globe className="w-3.5 h-3.5 text-text-muted" />
                        {link.title}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleRemoveExternalLink(idx)}
                        className="text-text-muted hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Input
                      value={newLinkTitle}
                      onChange={(e) => setNewLinkTitle(e.target.value)}
                      placeholder="Link title (e.g. Convex Auth API)"
                      className="text-xs h-9"
                    />
                    <Input
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      placeholder="https://..."
                      className="text-xs h-9"
                    />
                    <button
                      type="button"
                      onClick={handleAddExternalLink}
                      className="h-9 px-3 rounded-xl bg-surface border border-border hover:bg-background text-text-primary text-xs font-semibold"
                    >
                      + Add Link
                    </button>
                  </div>
                </div>
              </div>

              <hr className="border-border" />

              {/* SECTION 7: NOTIFICATIONS */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  7. Notification & Reminder Automation
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyStudents}
                      onChange={(e) => setNotifyStudents(e.target.checked)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary border-border"
                    />
                    <div>
                      <p className="text-xs font-bold text-text-primary">
                        Notify Students
                      </p>
                      <p className="text-[11px] text-text-muted">
                        Send in-app bell notification
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border cursor-pointer">
                    <input
                      type="checkbox"
                      checked={whatsappReminder}
                      onChange={(e) => setWhatsappReminder(e.target.checked)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary border-border"
                    />
                    <div>
                      <p className="text-xs font-bold text-text-primary">
                        WhatsApp Reminder
                      </p>
                      <p className="text-[11px] text-text-muted">
                        60 min before start
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailReminder}
                      onChange={(e) => setEmailReminder(e.target.checked)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary border-border"
                    />
                    <div>
                      <p className="text-xs font-bold text-text-primary">
                        Email Reminder
                      </p>
                      <p className="text-[11px] text-text-muted">
                        Calendar iCal invite attached
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <hr className="border-border" />

              {/* SECTION 8: ATTENDANCE */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  8. Classroom Attendance & Tracking
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-background border border-border">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={attendanceRequired}
                      onChange={(e) => setAttendanceRequired(e.target.checked)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary border-border"
                    />
                    <div>
                      <p className="text-sm font-bold text-text-primary">
                        Mandatory Live Attendance Required
                      </p>
                      <p className="text-xs text-text-muted">
                        Students must join within 15 minutes of start time to
                        count towards cohort eligibility
                      </p>
                    </div>
                  </label>

                  <a
                    href={`/admin/batches/active/students?tab=attendance&session=${event.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-surface border border-border hover:bg-background text-text-primary font-semibold text-xs flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <CheckSquare className="w-4 h-4 text-green-600" />
                    Mark Attendance Now
                  </a>
                </div>
              </div>

              <hr className="border-border" />

              {/* SECTION 9: PUBLISHING */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  9. Publishing & Visibility
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(
                    [
                      "Published",
                      "Scheduled",
                      "Draft",
                      "Cancelled",
                    ] as PublishStatus[]
                  ).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setPublishStatus(status)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        publishStatus === status
                          ? "bg-primary/10 border-primary text-primary shadow-xs"
                          : "bg-background border-border text-text-primary hover:border-text-secondary"
                      }`}
                    >
                      <p className="text-xs font-bold">{status}</p>
                      <p className="text-[10px] text-text-muted mt-0.5">
                        {status === "Published"
                          ? "Visible immediately"
                          : status === "Scheduled"
                            ? "Releases on date"
                            : status === "Draft"
                              ? "Instructor only"
                              : "Hidden / Cancelled"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sticky Drawer Footer Panel */}
              <div className="pt-6 border-t border-border flex items-center justify-between gap-3 sticky bottom-0 bg-surface/90 backdrop-blur-md py-4">
                <button
                  type="button"
                  onClick={() => onDelete(event.id)}
                  className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs flex items-center gap-1.5 transition-colors border border-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Session
                </button>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="text-xs font-semibold gap-1.5 bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
                  >
                    {saveFeedback ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : null}
                    {saveFeedback ? "Saved Successfully!" : "Save Changes"}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
