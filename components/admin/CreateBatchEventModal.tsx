"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  Video,
  User,
  Plus,
  Check,
  Upload,
  Download,
  FileSpreadsheet,
  FileText,
  AlertCircle,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  EventType,
  PublishStatus,
  BatchCalendarEvent,
  EVENT_TYPE_COLORS,
} from "./BatchEventDrawer";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface CreateBatchEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newEvent: Partial<BatchCalendarEvent>) => void;
  defaultDate?: string;
}

export function CreateBatchEventModal({
  isOpen,
  onClose,
  onCreate,
  defaultDate,
}: CreateBatchEventModalProps) {
  // STRICT RULES OF HOOKS: Unconditional top-level hooks
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState<EventType>("Live Class");
  const [dateStr, setDateStr] = useState(defaultDate || "2026-08-15");
  const [startTime, setStartTime] = useState("18:00");
  const [endTime, setEndTime] = useState("19:30");
  const [durationMins, setDurationMins] = useState(90);
  const [leadInstructor, setLeadInstructor] = useState("Instructor");
  const eligibleInstructors = useQuery(api.admin.getEligibleInstructors);

  React.useEffect(() => {
    if (eligibleInstructors && eligibleInstructors.length > 0 && leadInstructor === "Instructor") {
      setLeadInstructor(eligibleInstructors[0].name);
    }
  }, [eligibleInstructors]);
  const [meetingLink, setMeetingLink] = useState(
    "https://meet.google.com/vibe-logic-live"
  );
  const [description, setDescription] = useState("");
  const [publishStatus, setPublishStatus] = useState<PublishStatus>("Published");
  const [loading, setLoading] = useState(false);

  // Synchronize defaultDate when modal opens
  React.useEffect(() => {
    if (defaultDate) {
      setDateStr(defaultDate);
    }
  }, [defaultDate, isOpen]);

  const handleDurationPreset = (mins: number) => {
    setDurationMins(mins);
    try {
      const [sh, sm] = startTime.split(":").map(Number);
      const startTotal = (sh || 0) * 60 + (sm || 0);
      const endTotal = startTotal + mins;
      const eh = Math.floor(endTotal / 60) % 24;
      const em = endTotal % 60;
      setEndTime(
        `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`
      );
    } catch (e) {
      // Ignore parse error
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dateStr) return;

    setLoading(true);
    setTimeout(() => {
      onCreate({
        title: title.trim(),
        eventType,
        dateStr,
        startTime,
        endTime,
        durationMins,
        timezone: "America/New_York (EST)",
        leadInstructor,
        meetingLink: meetingLink.trim() || "https://meet.google.com/vibe-logic-live",
        description:
          description.trim() ||
          `${eventType} session led by ${leadInstructor}.`,
        objectives: [
          "Master key concepts in this session",
          "Complete practical lab exercises",
        ],
        studyMaterials: [],
        externalLinks: [],
        notifyStudents: true,
        whatsappReminder: true,
        emailReminder: true,
        attendanceRequired: true,
        publishStatus,
        colorCategory: EVENT_TYPE_COLORS[eventType].label,
      });

      setTitle("");
      setDescription("");
      setLoading(false);
      onClose();
    }, 400);
  };

  if (!isOpen) return null;

  const currentTypeColor = EVENT_TYPE_COLORS[eventType];

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
            className="fixed inset-0 z-50 bg-secondary/40 backdrop-blur-xs flex items-center justify-center p-4"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-background/50">
              <div>
                <h3 className="text-lg font-bold text-text-primary">
                  Schedule New Cohort Session
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Select session type, date, and instructor for this batch
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-border/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Event Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
                  Session Title *
                </label>
                <Input
                  placeholder="e.g. Masterclass #5: Enterprise Auth with Clerk & Next.js"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Event Type Grid */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
                  Session Type *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
                  {Object.keys(EVENT_TYPE_COLORS).map((type) => {
                    const c = EVENT_TYPE_COLORS[type as EventType];
                    const selected = eventType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setEventType(type as EventType)}
                        className={`p-2 rounded-xl border text-left text-xs font-semibold transition-all flex items-center gap-2 ${
                          selected
                            ? `${c.bg} ${c.text} ${c.border} ring-2 ring-primary/30 shadow-xs`
                            : "bg-background border-border text-text-primary hover:border-text-secondary"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                        <span className="truncate">{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
                    Start Time
                  </label>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
                    End Time
                  </label>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Duration Preset Chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold text-text-muted mr-1">
                  Quick Duration:
                </span>
                {[45, 60, 90, 120, 180].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => handleDurationPreset(mins)}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
                      durationMins === mins
                        ? "bg-primary text-white border-primary"
                        : "bg-surface border-border text-text-primary hover:bg-background"
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>

              {/* Instructor & Meeting Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
                    Lead Instructor
                  </label>
                  <select
                    value={leadInstructor}
                    onChange={(e) => setLeadInstructor(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-surface border border-border text-sm text-text-primary focus:outline-none"
                  >
                    {eligibleInstructors && eligibleInstructors.length > 0 ? (
                      eligibleInstructors.map((u) => (
                        <option key={u._id} value={u.name}>
                          {u.name} ({u.role || "Instructor"})
                        </option>
                      ))
                    ) : (
                      <option value={leadInstructor || "Instructor"}>
                        {leadInstructor || "Instructor"}
                      </option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
                    Meeting URL
                  </label>
                  <Input
                    placeholder="https://meet.google.com/..."
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
                  Description / Agenda Notes
                </label>
                <Input
                  placeholder="Brief summary of session agenda..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Publishing Status */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-text-secondary">
                    Initial Status:
                  </span>
                  {(["Published", "Scheduled", "Draft"] as PublishStatus[]).map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setPublishStatus(st)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                          publishStatus === st
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-surface border-border text-text-muted hover:text-text-primary"
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>

                <div className="flex items-center gap-2">
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
                    disabled={loading}
                    className="text-xs font-semibold bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20 gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Create {eventType}
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

interface ImportScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (importedEvents: Partial<BatchCalendarEvent>[]) => void;
}

export function ImportScheduleModal({
  isOpen,
  onClose,
  onImport,
}: ImportScheduleModalProps) {
  // STRICT RULES OF HOOKS: Unconditional top-level hooks
  const [csvText, setCsvText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImportSample = () => {
    const sample = `2026-08-16,18:00,19:30,Live Class,Next.js API Routes & Server Actions,Markus Keren,https://meet.google.com/vib-api-web
2026-08-18,10:00,12:00,Exam,Module 1 Assessment: Advanced Web & TypeScript,Dr. Sarah Jenkins,https://meet.google.com/vib-exam-01
2026-08-19,15:00,16:30,Workshop,Hands-On Lab: Auth.js Integration,Elena Rostova,https://meet.google.com/vib-auth-lab`;
    setCsvText(sample);
  };

  const handleProcessImport = () => {
    if (!csvText.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const lines = csvText.trim().split("\n");
      const imported: Partial<BatchCalendarEvent>[] = lines.map((line) => {
        const [dateStr, start, end, typeStr, title, instructor, link] =
          line.split(",").map((s) => s.trim());
        const eType = (
          EVENT_TYPE_COLORS[typeStr as EventType]
            ? typeStr
            : "Live Class"
        ) as EventType;
        return {
          title: title || "Imported Session",
          eventType: eType,
          dateStr: dateStr || "2026-08-20",
          startTime: start || "18:00",
          endTime: end || "19:30",
          durationMins: 90,
          timezone: "America/New_York (EST)",
          leadInstructor: instructor || "Markus Keren",
          meetingLink: link || "https://meet.google.com/vibe-logic-live",
          objectives: ["Imported from schedule CSV"],
          studyMaterials: [],
          externalLinks: [],
          notifyStudents: true,
          whatsappReminder: true,
          emailReminder: true,
          attendanceRequired: true,
          publishStatus: "Published" as PublishStatus,
          colorCategory: eType,
        };
      });

      onImport(imported);
      setCsvText("");
      setLoading(false);
      onClose();
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-secondary/40 backdrop-blur-xs flex items-center justify-center p-4"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-border flex items-center justify-between bg-background/50">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="text-lg font-bold text-text-primary">
                    Import Cohort Schedule
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    Paste CSV lines or use sample format to schedule in bulk
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-text-muted hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-text-secondary">
                  Format:{" "}
                  <code className="text-[11px] bg-background px-1.5 py-0.5 rounded border border-border">
                    Date,Start,End,Type,Title,Instructor,MeetingURL
                  </code>
                </label>
                <button
                  type="button"
                  onClick={handleImportSample}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Load Sample Data
                </button>
              </div>

              <textarea
                rows={6}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="2026-08-16,18:00,19:30,Live Class,Next.js API Routes,Markus Keren,https://meet.google.com/..."
                className="w-full p-3 rounded-xl bg-background border border-border text-xs font-mono text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="outline" onClick={onClose} className="text-xs">
                  Cancel
                </Button>
                <Button
                  onClick={handleProcessImport}
                  disabled={loading || !csvText.trim()}
                  className="text-xs font-semibold bg-primary hover:bg-primary/90 text-white gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  Import Schedule Now
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface ExportCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: BatchCalendarEvent[];
  batchName: string;
}

export function ExportCalendarModal({
  isOpen,
  onClose,
  events,
  batchName,
}: ExportCalendarModalProps) {
  // STRICT RULES OF HOOKS: Unconditional top-level hooks
  const [exportFormat, setExportFormat] = useState<"ics" | "csv">("ics");
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyFeedUrl = () => {
    navigator.clipboard.writeText(
      `https://calendar.vibelogic.studio/feed/batch-aiw-2608.ics`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownload = () => {
    if (exportFormat === "csv") {
      const headers = "ID,Date,Start,End,Type,Title,Instructor,MeetingLink\n";
      const rows = events
        .map(
          (e) =>
            `${e.id},${e.dateStr},${e.startTime},${e.endTime},${e.eventType},"${e.title}",${e.leadInstructor},${e.meetingLink}`
        )
        .join("\n");
      const blob = new Blob([headers + rows], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vibelogic-batch-schedule.csv`;
      a.click();
    } else {
      const icsHeader = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//VibeLogic Studio//Batch Calendar//EN\n`;
      const icsEvents = events
        .map(
          (e) =>
            `BEGIN:VEVENT\nSUMMARY:${e.title} [${e.eventType}]\nDESCRIPTION:${e.description || ""}\nLOCATION:${e.meetingLink}\nEND:VEVENT`
        )
        .join("\n");
      const icsFooter = `\nEND:VCALENDAR`;
      const blob = new Blob([icsHeader + icsEvents + icsFooter], {
        type: "text/calendar",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vibelogic-batch-calendar.ics`;
      a.click();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-secondary/40 backdrop-blur-xs flex items-center justify-center p-4"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-border flex items-center justify-between bg-background/50">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="text-lg font-bold text-text-primary">
                    Export Cohort Calendar
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    Download for Google Calendar, Outlook, or Excel
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-text-muted hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Format Select */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                  Select File Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setExportFormat("ics")}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      exportFormat === "ics"
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background border-border text-text-primary"
                    }`}
                  >
                    <Calendar className="w-5 h-5" />
                    <div>
                      <p className="text-xs font-bold">iCal Feed (.ics)</p>
                      <p className="text-[10px] text-text-muted">
                        Google Calendar, Outlook
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setExportFormat("csv")}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      exportFormat === "csv"
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background border-border text-text-primary"
                    }`}
                  >
                    <FileSpreadsheet className="w-5 h-5" />
                    <div>
                      <p className="text-xs font-bold">CSV Spreadsheet</p>
                      <p className="text-[10px] text-text-muted">
                        Excel, Airtable, Notion
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Subscribe Link Feed */}
              <div className="p-3.5 rounded-xl bg-background border border-border space-y-2">
                <p className="text-xs font-semibold text-text-primary flex items-center justify-between">
                  <span>Live iCal Subscribe Feed URL</span>
                  <span className="text-[10px] text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full font-bold">
                    SYNC ACTIVE
                  </span>
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value="https://calendar.vibelogic.studio/feed/batch-aiw-2608.ics"
                    className="text-xs h-9 bg-surface font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleCopyFeedUrl}
                    className="h-9 px-3 rounded-xl bg-surface border border-border hover:bg-background text-text-primary font-semibold text-xs flex items-center gap-1.5 shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5 text-text-muted" />
                    {copiedLink ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="outline" onClick={onClose} className="text-xs">
                  Cancel
                </Button>
                <Button
                  onClick={handleDownload}
                  className="text-xs font-semibold bg-primary hover:bg-primary/90 text-white gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  Download .{exportFormat} File
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
