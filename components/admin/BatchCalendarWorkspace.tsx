"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Upload,
  Download,
  Filter,
  Video,
  Clock,
  User,
  ExternalLink,
  MoreHorizontal,
  Search,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  Loader2,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BatchCalendarEvent,
  EventType,
  PublishStatus,
  EVENT_TYPE_COLORS,
  BatchEventDrawer,
} from "./BatchEventDrawer";
import {
  CreateBatchEventModal,
  ImportScheduleModal,
  ExportCalendarModal,
} from "./CreateBatchEventModal";

export type CalendarViewMode = "Month" | "Week" | "Day" | "Agenda";

export type QuickFilterChip =
  | "All Events"
  | "Upcoming"
  | "Only Live Classes"
  | "Only Assignments"
  | "Only Exams"
  | "Completed"
  | "Cancelled";

export const DEFAULT_BATCH_EVENTS: BatchCalendarEvent[] = [];

interface BatchCalendarWorkspaceProps {
  batchId: string;
  batchName?: string;
}

export function BatchCalendarWorkspace({
  batchId,
  batchName = "AI Web Development Bootcamp - August 2026",
}: BatchCalendarWorkspaceProps) {
  // STRICT RULES OF HOOKS: All useState / useMemo hooks unconditionally at top
  const recordingsData = useQuery(api.admin.getBatchRecordingsExtended, {
    batchId: batchId as any,
  });
  const batchSettingsData = useQuery(api.admin.getBatchSettingsExtended, {
    batchId: batchId as any,
  });
  const eligibleInstructors = useQuery(api.admin.getEligibleInstructors);
  const createRecMut = useMutation(api.admin.createBatchRecordingExtended);
  const updateRecMut = useMutation(api.admin.updateBatchRecordingExtended);
  const deleteRecMut = useMutation(api.admin.deleteBatchRecordingExtended);

  const leadInstructorDefault = batchSettingsData?.settings?.instructorName || "Instructor";

  const backendEvents: BatchCalendarEvent[] = useMemo(() => {
    if (!recordingsData?.recordings) return [];
    return recordingsData.recordings.map((rec: any) => {
      const d = new Date(rec.startTime || Date.now());
      const dateStr = d.toISOString().slice(0, 10);
      const startHours = String(d.getHours()).padStart(2, "0");
      const startMins = String(d.getMinutes()).padStart(2, "0");
      const endTimeDate = new Date(rec.endTime || Date.now() + 7200000);
      const endHours = String(endTimeDate.getHours()).padStart(2, "0");
      const endMins = String(endTimeDate.getMinutes()).padStart(2, "0");
      return {
        id: rec.id,
        title: rec.title,
        eventType: (rec.eventType as EventType) || "Live Class",
        dateStr,
        startTime: `${startHours}:${startMins}`,
        endTime: `${endHours}:${endMins}`,
        durationMins: Math.round(((rec.endTime || 0) - (rec.startTime || 0)) / 60000) || 120,
        timezone: "Asia/Kolkata (IST)",
        leadInstructor: rec.instructorName || leadInstructorDefault,
        meetingLink: rec.meetingLink || "",
        module: rec.moduleTitle || "General",
        lesson: rec.title,
        objectives: [],
        studyMaterials: [],
        recordingUrl: rec.recordingUrl,
        externalLinks: [],
        notifyStudents: true,
        whatsappReminder: true,
        emailReminder: true,
        attendanceRequired: true,
        publishStatus: rec.status || "Published",
        colorCategory: "Live Class",
      };
    });
  }, [recordingsData, leadInstructorDefault]);

  const [events, setEvents] = useState<BatchCalendarEvent[]>(DEFAULT_BATCH_EVENTS);

  useEffect(() => {
    if (recordingsData?.recordings) {
      setEvents(backendEvents);
    }
  }, [recordingsData, backendEvents]);

  const [currentMonth, setCurrentMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });
  const [viewMode, setViewMode] = useState<CalendarViewMode>("Month");
  const [selectedChip, setSelectedChip] = useState<QuickFilterChip>("All Events");
  const [instructorFilter, setInstructorFilter] = useState("All Instructors");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const [selectedEvent, setSelectedEvent] = useState<BatchCalendarEvent | null>(
    null
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createDefaultDate, setCreateDefaultDate] = useState(new Date().toISOString().slice(0, 10));
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // Dynamic Instructors List
  const availableInstructors = useMemo(() => {
    const set = new Set<string>();
    if (leadInstructorDefault && leadInstructorDefault !== "Instructor") {
      set.add(leadInstructorDefault);
    }
    if (eligibleInstructors && eligibleInstructors.length > 0) {
      eligibleInstructors.forEach((u) => set.add(u.name));
    }
    events.forEach((e) => {
      if (e.leadInstructor) set.add(e.leadInstructor);
    });
    return Array.from(set);
  }, [leadInstructorDefault, eligibleInstructors, events]);

  // Next Live Session (Dynamic)
  const nextLiveSession = useMemo(() => {
    const sorted = [...events]
      .filter((e) => e.eventType === "Live Class" || e.eventType === "Workshop")
      .sort((a, b) => new Date(`${a.dateStr}T${a.startTime}`).getTime() - new Date(`${b.dateStr}T${b.startTime}`).getTime());
    return sorted[0] || null;
  }, [events]);

  // Critical Milestones & Exams (Dynamic)
  const criticalMilestones = useMemo(() => {
    return events.filter(
      (e) => e.eventType === "Exam" || e.eventType === "Assignment Deadline"
    );
  }, [events]);

  // Instructor Workload (Dynamic)
  const instructorWorkload = useMemo(() => {
    const map = new Map<string, number>();
    events.forEach((e) => {
      const inst = e.leadInstructor || leadInstructorDefault;
      const hours = Math.round((e.durationMins || 120) / 60);
      map.set(inst, (map.get(inst) || 0) + hours);
    });
    if (map.size === 0 && leadInstructorDefault && leadInstructorDefault !== "Instructor") {
      map.set(leadInstructorDefault, 0);
    }
    return Array.from(map.entries()).map(([name, hours]) => ({ name, hours }));
  }, [events, leadInstructorDefault]);

  // Month navigation helpers
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  const handleToday = () => {
    setCurrentMonth({ year: 2026, month: 7 }); // Jump to August 2026
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      // 1. Quick Chip Filter
      if (selectedChip === "Upcoming" && evt.publishStatus === "Cancelled")
        return false;
      if (selectedChip === "Only Live Classes" && evt.eventType !== "Live Class")
        return false;
      if (
        selectedChip === "Only Assignments" &&
        evt.eventType !== "Assignment Deadline"
      )
        return false;
      if (selectedChip === "Only Exams" && evt.eventType !== "Exam")
        return false;
      if (selectedChip === "Completed" && evt.eventType !== "Completed Session")
        return false;
      if (selectedChip === "Cancelled" && evt.eventType !== "Cancelled Session")
        return false;

      // 2. Instructor Filter
      if (
        instructorFilter !== "All Instructors" &&
        evt.leadInstructor !== instructorFilter
      )
        return false;

      // 3. Event Type Filter
      if (typeFilter !== "All Types" && evt.eventType !== typeFilter)
        return false;

      // 4. Status Filter
      if (
        statusFilter !== "All Statuses" &&
        evt.publishStatus !== statusFilter
      )
        return false;

      return true;
    });
  }, [events, selectedChip, instructorFilter, typeFilter, statusFilter]);

  // Compute Calendar Grid Days for Month View
  const calendarDays = useMemo(() => {
    const { year, month } = currentMonth;
    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const cells: {
      dateStr: string;
      dayNum: number;
      isCurrentMonth: boolean;
      isToday: boolean;
    }[] = [];

    // Previous month filler days
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const m = month === 0 ? 12 : month;
      const y = month === 0 ? year - 1 : year;
      const dStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({
        dateStr: dStr,
        dayNum: d,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const isToday = dStr === "2026-08-15"; // Simulated 'Today'
      cells.push({
        dateStr: dStr,
        dayNum: d,
        isCurrentMonth: true,
        isToday,
      });
    }

    // Next month filler days to complete 35 or 42 cells
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      const m = month === 11 ? 1 : month + 2;
      const y = month === 11 ? year + 1 : year;
      const dStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({
        dateStr: dStr,
        dayNum: d,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return cells;
  }, [currentMonth]);

  // CRUD handlers
  const handleOpenEventDrawer = (evt: BatchCalendarEvent) => {
    setSelectedEvent(evt);
    setIsDrawerOpen(true);
  };

  const handleSaveEvent = async (updated: BatchCalendarEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e))
    );

    if (!updated.id.startsWith("evt-") && !updated.id.startsWith("mock-")) {
      const startMs = new Date(`${updated.dateStr}T${updated.startTime}:00`).getTime();
      const endMs = new Date(`${updated.dateStr}T${updated.endTime}:00`).getTime();

      try {
        await updateRecMut({
          id: updated.id as any,
          title: updated.title,
          meetingLink: updated.meetingLink,
          instructorName: updated.leadInstructor,
          status: updated.publishStatus,
          description: updated.description,
          startTime: isNaN(startMs) ? undefined : startMs,
          endTime: isNaN(endMs) ? undefined : endMs,
          duration: `${updated.durationMins || 90} Mins`,
        });
      } catch (err) {
        console.error("Failed to persist session update to Convex:", err);
      }
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm("Remove this session from the cohort schedule?")) {
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      setIsDrawerOpen(false);
      setSelectedEvent(null);

      if (!eventId.startsWith("evt-") && !eventId.startsWith("mock-")) {
        try {
          await deleteRecMut({ id: eventId as any });
        } catch (err) {
          console.error("Failed to delete session from Convex:", err);
        }
      }
    }
  };

  const handleDuplicateEvent = (evt: BatchCalendarEvent) => {
    const dupe: BatchCalendarEvent = {
      ...evt,
      id: `evt-${Date.now()}`,
      title: `${evt.title} (Copy)`,
      dateStr: evt.dateStr,
    };
    setEvents((prev) => [dupe, ...prev]);
    setSelectedEvent(dupe);
  };

  const handleCreateNewEvent = async (newEvent: Partial<BatchCalendarEvent>) => {
    const dateStr = newEvent.dateStr || new Date().toISOString().slice(0, 10);
    const startTimeStr = newEvent.startTime || "18:00";
    const endTimeStr = newEvent.endTime || "19:30";

    const startMs = new Date(`${dateStr}T${startTimeStr}:00`).getTime();
    const endMs = new Date(`${dateStr}T${endTimeStr}:00`).getTime();

    const full: BatchCalendarEvent = {
      id: `evt-${Date.now()}`,
      title: newEvent.title || "Untitled Session",
      eventType: newEvent.eventType || "Live Class",
      description: newEvent.description || "",
      dateStr,
      startTime: startTimeStr,
      endTime: endTimeStr,
      durationMins: newEvent.durationMins || 90,
      timezone: newEvent.timezone || "America/New_York (EST)",
      leadInstructor: newEvent.leadInstructor || leadInstructorDefault,
      meetingLink:
        newEvent.meetingLink || "https://meet.google.com/vibe-logic-live",
      objectives: newEvent.objectives || [],
      studyMaterials: newEvent.studyMaterials || [],
      externalLinks: newEvent.externalLinks || [],
      notifyStudents: true,
      whatsappReminder: true,
      emailReminder: true,
      attendanceRequired: true,
      publishStatus: newEvent.publishStatus || "Published",
      colorCategory:
        EVENT_TYPE_COLORS[newEvent.eventType || "Live Class"].label,
    };

    setEvents((prev) => [...prev, full]);

    if (!batchId.toString().startsWith("mock-") && !batchId.toString().startsWith("demo-")) {
      try {
        await createRecMut({
          batchId: batchId as any,
          title: newEvent.title || "Untitled Session",
          meetingLink: newEvent.meetingLink || "https://meet.google.com/vibe-logic-live",
          instructorName: newEvent.leadInstructor || leadInstructorDefault,
          status: newEvent.publishStatus || "Published",
          description: newEvent.description || "",
          startTime: isNaN(startMs) ? Date.now() : startMs,
          endTime: isNaN(endMs) ? Date.now() + 5400000 : endMs,
          duration: `${newEvent.durationMins || 90} Mins`,
        });
      } catch (err) {
        console.error("Failed to persist new session to Convex:", err);
      }
    }
  };

  const handleImportEvents = (imported: Partial<BatchCalendarEvent>[]) => {
    const fulls: BatchCalendarEvent[] = imported.map((imp, idx) => ({
      id: `evt-imp-${Date.now()}-${idx}`,
      title: imp.title || "Imported Session",
      eventType: imp.eventType || "Live Class",
      dateStr: imp.dateStr || "2026-08-20",
      startTime: imp.startTime || "18:00",
      endTime: imp.endTime || "19:30",
      durationMins: imp.durationMins || 90,
      timezone: imp.timezone || "America/New_York (EST)",
      leadInstructor: imp.leadInstructor || "Markus Keren",
      meetingLink: imp.meetingLink || "https://meet.google.com/vibe-logic-live",
      objectives: imp.objectives || [],
      studyMaterials: [],
      externalLinks: [],
      notifyStudents: true,
      whatsappReminder: true,
      emailReminder: true,
      attendanceRequired: true,
      publishStatus: "Published",
      colorCategory: imp.eventType || "Live Class",
    }));
    setEvents((prev) => [...prev, ...fulls]);
  };

  // KPI Calculations
  const stats = useMemo(() => {
    const totalSessions = events.length;
    const totalHours = events.reduce(
      (acc, e) => acc + (e.durationMins || 0) / 60,
      0
    );
    const liveCount = events.filter((e) => e.eventType === "Live Class").length;
    const assignmentCount = events.filter(
      (e) => e.eventType === "Assignment Deadline"
    ).length;
    return {
      totalSessions,
      totalHours: Math.round(totalHours * 10) / 10,
      liveCount,
      assignmentCount,
    };
  }, [events]);

  return (
    <div className="space-y-6">
      {/* HEADER CONTROL BAR (Month Nav + View Mode Switcher + Action Buttons) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-4 rounded-2xl border border-border shadow-xs">
        {/* Month Navigation & Current Month Label */}
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold tracking-tight text-text-primary min-w-36">
            {monthNames[currentMonth.month]} {currentMonth.year}
          </h2>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl border border-border hover:bg-background text-text-primary transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="px-3 py-1.5 rounded-xl border border-border hover:bg-background text-text-primary text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Today
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl border border-border hover:bg-background text-text-primary transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Mode Switcher (Month | Week | Day | Agenda) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-background p-1 rounded-xl border border-border">
            {(["Month", "Week", "Day", "Agenda"] as CalendarViewMode[]).map(
              (mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === mode
                      ? "bg-surface text-primary shadow-xs"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  {mode}
                </button>
              )
            )}
          </div>

          {/* Action Buttons: Create Class, Import Schedule, Export Calendar */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsImportModalOpen(true)}
              className="text-xs font-semibold gap-1.5 hidden sm:inline-flex"
            >
              <Upload className="w-3.5 h-3.5" />
              Import Schedule
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsExportModalOpen(true)}
              className="text-xs font-semibold gap-1.5 hidden sm:inline-flex"
            >
              <Download className="w-3.5 h-3.5" />
              Export Calendar
            </Button>

            <Button
              onClick={() => {
                setCreateDefaultDate("2026-08-15");
                setIsCreateModalOpen(true);
              }}
              className="text-xs font-semibold gap-1.5 bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
            >
              <Plus className="w-4 h-4" />
              Create Class
            </Button>
          </div>
        </div>
      </div>

      {/* FILTER CHIPS & DROPDOWN FILTER BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-surface p-3.5 rounded-2xl border border-border">
        {/* Quick Chip System */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-text-muted mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Quick Filters:
          </span>
          {(
            [
              "All Events",
              "Upcoming",
              "Only Live Classes",
              "Only Assignments",
              "Only Exams",
              "Completed",
              "Cancelled",
            ] as QuickFilterChip[]
          ).map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setSelectedChip(chip)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedChip === chip
                  ? "bg-primary text-white shadow-xs"
                  : "bg-background border border-border text-text-secondary hover:text-text-primary"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Dropdown Filters (Instructor, Event Type, Status) */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={instructorFilter}
            onChange={(e) => setInstructorFilter(e.target.value)}
            className="h-8 px-2.5 rounded-lg bg-background border border-border text-xs font-medium text-text-primary focus:outline-none"
          >
            <option value="All Instructors">All Instructors</option>
            {availableInstructors.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-8 px-2.5 rounded-lg bg-background border border-border text-xs font-medium text-text-primary focus:outline-none"
          >
            <option value="All Types">All Types</option>
            {Object.keys(EVENT_TYPE_COLORS).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 px-2.5 rounded-lg bg-background border border-border text-xs font-medium text-text-primary focus:outline-none"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Draft">Draft</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* MAIN 2-COLUMN CLASSROOM OS LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: CALENDAR VIEWS (xl:col-span-9) */}
        <div className="xl:col-span-9 bg-surface border border-border rounded-2xl p-4 shadow-sm min-h-[640px]">
          {/* VIEW 1: MONTH VIEW (7-Column Calendar Grid) */}
          {viewMode === "Month" && (
            <div>
              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 border-b border-border pb-2 mb-2 text-center text-xs font-bold uppercase tracking-wider text-text-muted">
                {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(
                  (day) => (
                    <div key={day}>{day}</div>
                  )
                )}
              </div>

              {/* Month Cell Grid (6 Rows x 7 Columns = 42 cells) */}
              <div className="grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden border border-border">
                {calendarDays.map((cell, idx) => {
                  const dayEvents = filteredEvents.filter(
                    (e) => e.dateStr === cell.dateStr
                  );

                  return (
                    <div
                      key={idx}
                      onClick={(e) => {
                        // If user clicks the empty cell space, open CreateModal prefilled with this date
                        if (e.target === e.currentTarget) {
                          setCreateDefaultDate(cell.dateStr);
                          setIsCreateModalOpen(true);
                        }
                      }}
                      className={`min-h-28 p-2 bg-surface hover:bg-background/80 transition-colors cursor-pointer flex flex-col justify-between ${
                        !cell.isCurrentMonth ? "opacity-40" : ""
                      }`}
                    >
                      {/* Top Row: Date Number & Badge */}
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                            cell.isToday
                              ? "bg-primary text-white shadow-xs"
                              : "text-text-primary"
                          }`}
                        >
                          {cell.dayNum}
                        </span>
                        {dayEvents.length > 0 && (
                          <span className="text-[10px] font-bold text-text-muted bg-background px-1.5 py-0.5 rounded-full border border-border">
                            {dayEvents.length}
                          </span>
                        )}
                      </div>

                      {/* Event Pills Container */}
                      <div className="space-y-1.5 flex-1 overflow-y-auto max-h-28 pr-0.5">
                        {dayEvents.map((evt) => {
                          const c = EVENT_TYPE_COLORS[evt.eventType];
                          return (
                            <div
                              key={evt.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEventDrawer(evt);
                              }}
                              className={`p-1.5 rounded-lg border text-left transition-all hover:scale-[1.02] shadow-2xs group ${c.bg} ${c.text} ${c.border}`}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-[10px] font-bold truncate">
                                  {evt.title}
                                </span>
                                {evt.publishStatus === "Cancelled" && (
                                  <span className="text-[9px] uppercase font-bold text-red-600 bg-red-100 px-1 rounded">
                                    CANC
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center justify-between text-[10px] opacity-80 mt-0.5">
                                <span>{evt.startTime}</span>
                                <span className="font-semibold">
                                  {evt.leadInstructor.split(" ")[0]}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW 2: WEEK VIEW (7-Day Horizontal Time-Grid) */}
          {viewMode === "Week" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-text-primary">
                  Week of August 10 — August 16, 2026
                </h3>
                <span className="text-xs text-text-muted">
                  Showing 7 scheduled cohort events
                </span>
              </div>

              <div className="grid grid-cols-7 gap-3">
                {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(
                  (day, dayIdx) => {
                    const dateStr = `2026-08-${String(10 + dayIdx).padStart(2, "0")}`;
                    const dayEvents = filteredEvents.filter(
                      (e) => e.dateStr === dateStr
                    );

                    return (
                      <div
                        key={day}
                        className="bg-background border border-border rounded-xl p-3 min-h-96 flex flex-col gap-2"
                      >
                        <div className="border-b border-border pb-2 text-center">
                          <p className="text-[10px] font-bold text-text-muted">
                            {day}
                          </p>
                          <p className="text-sm font-bold text-text-primary">
                            Aug {10 + dayIdx}
                          </p>
                        </div>

                        <div className="space-y-2 flex-1 overflow-y-auto">
                          {dayEvents.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-[11px] text-text-muted italic">
                              Free Day
                            </div>
                          ) : (
                            dayEvents.map((evt) => {
                              const c = EVENT_TYPE_COLORS[evt.eventType];
                              return (
                                <div
                                  key={evt.id}
                                  onClick={() => handleOpenEventDrawer(evt)}
                                  className={`p-2 rounded-xl border text-xs cursor-pointer hover:shadow-sm transition-all ${c.bg} ${c.text} ${c.border}`}
                                >
                                  <p className="font-bold leading-tight">
                                    {evt.title}
                                  </p>
                                  <p className="text-[10px] mt-1 opacity-80">
                                    {evt.startTime} – {evt.endTime}
                                  </p>
                                  <p className="text-[10px] mt-1 font-semibold truncate">
                                    {evt.leadInstructor}
                                  </p>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {/* VIEW 3: DAY VIEW (Hourly Single-Day Timeline) */}
          {viewMode === "Day" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-text-primary">
                  Today's Schedule — Saturday, August 15, 2026
                </h3>
                <span className="text-xs text-text-muted font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                  Independence Day Holiday
                </span>
              </div>

              <div className="space-y-3">
                {filteredEvents
                  .filter((e) => e.dateStr === "2026-08-15" || e.dateStr === "2026-08-17")
                  .map((evt) => {
                    const c = EVENT_TYPE_COLORS[evt.eventType];
                    return (
                      <div
                        key={evt.id}
                        onClick={() => handleOpenEventDrawer(evt)}
                        className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:shadow-md transition-all ${c.bg} ${c.text} ${c.border}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-surface/80 border border-border flex flex-col items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-text-primary">
                              {evt.startTime.split(":")[0]}:
                              {evt.startTime.split(":")[1]}
                            </span>
                            <span className="text-[9px] uppercase font-semibold text-text-muted">
                              EST
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                                {evt.eventType}
                              </span>
                              <span>•</span>
                              <span className="text-xs font-semibold">
                                {evt.durationMins} Mins
                              </span>
                            </div>
                            <h4 className="text-base font-bold mt-0.5">
                              {evt.title}
                            </h4>
                            <p className="text-xs mt-1 opacity-90">
                              Lead: {evt.leadInstructor}{" "}
                              {evt.assistantInstructor
                                ? ` | TA: ${evt.assistantInstructor}`
                                : ""}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={evt.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-4 py-2 rounded-xl bg-primary text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:bg-primary/90 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Join Session
                          </a>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* VIEW 4: AGENDA VIEW (Chronological Roster List) */}
          {viewMode === "Agenda" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-text-primary">
                  Cohort Chronological Agenda — August 2026
                </h3>
                <span className="text-xs font-bold text-text-muted">
                  {filteredEvents.length} Total Sessions
                </span>
              </div>

              {filteredEvents.length === 0 ? (
                <div className="py-16 text-center bg-background rounded-2xl border border-dashed border-border">
                  <CalendarIcon className="w-10 h-10 text-text-muted mx-auto mb-2" />
                  <p className="text-sm font-bold text-text-primary">
                    No matching sessions found
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    Try clearing filter chips or scheduling a new session above.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredEvents.map((evt) => {
                    const c = EVENT_TYPE_COLORS[evt.eventType];
                    return (
                      <div
                        key={evt.id}
                        onClick={() => handleOpenEventDrawer(evt)}
                        className="p-4 rounded-xl bg-background border border-border hover:border-primary/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs border ${c.bg} ${c.text} ${c.border}`}
                          >
                            {evt.dateStr.split("-")[2]} AUG
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${c.bg} ${c.text} ${c.border}`}
                              >
                                {evt.eventType}
                              </span>
                              <span className="text-xs font-semibold text-text-muted">
                                {evt.startTime} – {evt.endTime} (
                                {evt.durationMins}m)
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-text-primary mt-1">
                              {evt.title}
                            </h4>
                            <p className="text-xs text-text-muted mt-0.5">
                              Instructor:{" "}
                              <span className="font-semibold text-text-primary">
                                {evt.leadInstructor}
                              </span>{" "}
                              {evt.module ? `• ${evt.module}` : ""}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={evt.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-4 py-2 rounded-xl bg-primary text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:bg-primary/90 transition-colors"
                          >
                            <Video className="w-3.5 h-3.5" />
                            Join
                          </a>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEventDrawer(evt);
                            }}
                            className="p-2 rounded-xl border border-border hover:bg-surface text-text-muted hover:text-text-primary transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: SIDEBAR INSIGHTS & WIDGETS (xl:col-span-3) */}
        <div className="xl:col-span-3 space-y-5">
          {/* WIDGET 1: NEXT LIVE CLASS & TODAY'S SESSIONS */}
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                <Video className="w-4 h-4 text-primary" />
                Next Live Session
              </h3>
              {nextLiveSession && (
                <span className="text-[10px] font-bold text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full">
                  READY
                </span>
              )}
            </div>

            {nextLiveSession ? (
              <div className="p-4 rounded-xl bg-background border border-border space-y-3">
                <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 text-[10px] font-bold uppercase">
                  {nextLiveSession.eventType} • {nextLiveSession.dateStr}
                </span>
                <h4 className="text-sm font-bold text-text-primary">
                  {nextLiveSession.title}
                </h4>
                <p className="text-xs text-text-muted">
                  {nextLiveSession.dateStr} • {nextLiveSession.startTime} – {nextLiveSession.endTime}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-semibold text-text-primary">
                    {nextLiveSession.leadInstructor}
                  </span>
                  {nextLiveSession.meetingLink && (
                    <a
                      href={nextLiveSession.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Join Room
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-background border border-border text-center text-xs text-text-muted">
                No upcoming live sessions scheduled.
              </div>
            )}
          </div>

          {/* WIDGET 2: UPCOMING EXAMS & ASSIGNMENT DEADLINES */}
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
              <Award className="w-4 h-4 text-red-500" />
              Critical Milestones & Exams
            </h3>
            {criticalMilestones.length > 0 ? (
              <div className="space-y-2">
                {criticalMilestones.map((m) => (
                  <div key={m.id} className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-red-600">
                        {m.title}
                      </p>
                      <p className="text-[11px] text-text-muted">
                        {m.dateStr} • {m.startTime} ({m.durationMins} mins)
                      </p>
                    </div>
                    <span className="text-xs font-bold text-red-600">{m.leadInstructor}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-background border border-border text-center text-xs text-text-muted">
                No critical milestones or exams scheduled.
              </div>
            )}
          </div>

          {/* WIDGET 3: INSTRUCTOR AVAILABILITY & WORKLOAD */}
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Instructor Workload
            </h3>
            {instructorWorkload.length > 0 ? (
              <div className="space-y-2">
                {instructorWorkload.map((iw, idx) => (
                  <div key={iw.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-green-500' : idx === 1 ? 'bg-blue-500' : 'bg-amber-500'}`} />
                      <span className="font-semibold text-text-primary">
                        {iw.name}
                      </span>
                    </div>
                    <span className="text-text-muted font-bold">{iw.hours} hrs sched</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-background border border-border text-center text-xs text-text-muted">
                No scheduled instructor workload.
              </div>
            )}
          </div>

          {/* WIDGET 4: CALENDAR STATISTICS & KPIS */}
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Cohort Schedule KPIs
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-background border border-border">
                <p className="text-[11px] font-semibold text-text-muted">
                  Total Sessions
                </p>
                <p className="text-lg font-extrabold text-text-primary mt-0.5">
                  {stats.totalSessions}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-background border border-border">
                <p className="text-[11px] font-semibold text-text-muted">
                  Total Live Hours
                </p>
                <p className="text-lg font-extrabold text-text-primary mt-0.5">
                  {stats.totalHours} hrs
                </p>
              </div>
              <div className="p-3 rounded-xl bg-background border border-border">
                <p className="text-[11px] font-semibold text-text-muted">
                  Live Classes
                </p>
                <p className="text-lg font-extrabold text-blue-600 mt-0.5">
                  {stats.liveCount}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-background border border-border">
                <p className="text-[11px] font-semibold text-text-muted">
                  Assignments
                </p>
                <p className="text-lg font-extrabold text-purple-600 mt-0.5">
                  {stats.assignmentCount}
                </p>
              </div>
            </div>
          </div>

          {/* WIDGET 5: RECENT SCHEDULE CHANGES */}
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
              <Clock className="w-4 h-4 text-text-muted" />
              Recent Modifications
            </h3>
            {events.length > 0 ? (
              <div className="space-y-2 text-xs">
                {events.slice(0, 3).map((ev) => (
                  <p key={ev.id} className="text-text-muted">
                    <span className="font-bold text-text-primary">{ev.leadInstructor}</span>{" "}
                    scheduled <span className="italic">{ev.title}</span>
                  </p>
                ))}
              </div>
            ) : (
              <div className="p-3 text-center text-xs text-text-muted">
                No recent schedule modifications.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALS & DRAWERS */}
      <BatchEventDrawer
        event={selectedEvent}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        onDuplicate={handleDuplicateEvent}
      />

      <CreateBatchEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateNewEvent}
        defaultDate={createDefaultDate}
      />

      <ImportScheduleModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportEvents}
      />

      <ExportCalendarModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        events={events}
        batchName={batchName}
      />
    </div>
  );
}
