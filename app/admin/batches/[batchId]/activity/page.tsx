"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  BatchActivityToolbar,
  BatchActivityKPIs,
  BatchActivityFilters,
  BatchActivityFeed,
  BatchActivitySidebar,
  ExportActivityModal,
  LogCustomActivityModal,
  ActivityFilterState,
  BatchActivityEvent,
  BatchActivityGroup,
} from "@/components/admin/activity";

export default function BatchActivityTab() {
  const params = useParams();
  const batchId = params.batchId as any;

  // Unconditional top-level Convex hooks (100% Rules of Hooks compliance)
  const data = useQuery(api.admin.getBatchActivityExtended, { batchId });
  const logActivityMut = useMutation(api.admin.logBatchActivityExtended);

  // Local state for filters and modals
  const [filters, setFilters] = useState<ActivityFilterState>({
    search: "",
    category: "All",
    eventType: "ALL",
    dateRange: "ALL",
    status: "ALL",
    selectedDay: null,
  });

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isLogNoteModalOpen, setIsLogNoteModalOpen] = useState(false);

  // Update filters patch
  const handleFilterChange = (patch: Partial<ActivityFilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      category: "All",
      eventType: "ALL",
      dateRange: "ALL",
      status: "ALL",
      selectedDay: null,
    });
  };

  const handleJumpToToday = () => {
    setFilters((prev) => ({
      ...prev,
      dateRange: "TODAY",
      selectedDay: 22, // Today's highlighted day in calendar
    }));
    window.scrollTo({ top: 350, behavior: "smooth" });
  };

  // Filter events dynamically based on search and filters
  const filteredEvents = useMemo(() => {
    if (!data?.events) return [];
    const now = Date.now();
    const oneDay = 86400000;

    return data.events.filter((ev) => {
      // Category filter
      if (
        filters.category !== "All" &&
        ev.category !== filters.category
      ) {
        return false;
      }

      // Event type filter
      if (filters.eventType !== "ALL") {
        if (filters.eventType === "recording" && !ev.action.includes("recording")) {
          return false;
        } else if (
          filters.eventType !== "recording" &&
          ev.type !== filters.eventType
        ) {
          return false;
        }
      }

      // Status filter
      if (filters.status !== "ALL" && ev.status !== filters.status) {
        return false;
      }

      // Date Range filter
      if (filters.dateRange !== "ALL") {
        const diffDays = Math.floor((now - ev.timestamp) / oneDay);
        if (filters.dateRange === "TODAY" && diffDays !== 0) return false;
        if (filters.dateRange === "YESTERDAY" && diffDays !== 1) return false;
        if (filters.dateRange === "LAST_7" && diffDays > 7) return false;
        if (filters.dateRange === "LAST_30" && diffDays > 30) return false;
      }

      // Selected Calendar Day filter
      if (filters.selectedDay !== null && filters.selectedDay !== undefined) {
        const evDate = new Date(ev.timestamp);
        if (evDate.getDate() !== filters.selectedDay) {
          return false;
        }
      }

      // Global Search filter
      if (filters.search.trim() !== "") {
        const q = filters.search.toLowerCase();
        const matchesName = ev.actorName.toLowerCase().includes(q);
        const matchesAction = ev.action.toLowerCase().includes(q);
        const matchesTarget = ev.target.toLowerCase().includes(q);
        const matchesDesc = ev.description.toLowerCase().includes(q);
        const matchesIp = ev.ipAddress?.toLowerCase().includes(q) || false;
        const matchesDetails = ev.details?.toLowerCase().includes(q) || false;
        if (
          !matchesName &&
          !matchesAction &&
          !matchesTarget &&
          !matchesDesc &&
          !matchesIp &&
          !matchesDetails
        ) {
          return false;
        }
      }

      return true;
    });
  }, [data?.events, filters]);

  // Group filtered events by date header ("TODAY", "YESTERDAY", "AUGUST 20, 2026")
  const groupedFilteredEvents = useMemo(() => {
    if (!filteredEvents.length) return [];
    const now = Date.now();
    const oneDay = 86400000;
    const groupMap = new Map<string, BatchActivityEvent[]>();

    filteredEvents.forEach((ev) => {
      const diffDays = Math.floor((now - ev.timestamp) / oneDay);
      let groupTitle = "EARLIER";
      if (diffDays === 0) {
        groupTitle = "TODAY";
      } else if (diffDays === 1) {
        groupTitle = "YESTERDAY";
      } else {
        const d = new Date(ev.timestamp);
        groupTitle = d
          .toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
          .toUpperCase();
      }

      if (!groupMap.has(groupTitle)) {
        groupMap.set(groupTitle, []);
      }
      groupMap.get(groupTitle)!.push(ev);
    });

    const result: BatchActivityGroup[] = [];
    groupMap.forEach((items, groupTitle) => {
      result.push({
        groupTitle,
        dateKey: items[0]
          ? new Date(items[0].timestamp).toISOString().slice(0, 10)
          : "earlier",
        items,
      });
    });

    return result;
  }, [filteredEvents]);

  // Handle saving custom audit note
  const handleSaveCustomNote = async (noteData: {
    title: string;
    description: string;
    category: string;
    status: string;
  }) => {
    await logActivityMut({
      batchId,
      title: noteData.title,
      description: noteData.description,
      type: "admin",
      category: noteData.category,
      status: noteData.status,
    });
  };

  if (data === undefined) {
    return (
      <div className="flex h-[45vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (data === null) {
    return (
      <div className="p-8 text-center bg-surface border border-border rounded-2xl">
        <h3 className="text-base font-bold text-text-primary">
          Cohort Activity Center Not Found
        </h3>
        <p className="text-xs text-text-secondary mt-1">
          This batch could not be located or has been deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Executive Activity Toolbar */}
      <BatchActivityToolbar
        batchTitle={data.batch.title}
        totalEvents={data.kpis.totalEvents}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenLogNote={() => setIsLogNoteModalOpen(true)}
      />

      {/* 5-Card Bento KPI Grid & Horizon Stats */}
      <BatchActivityKPIs
        kpis={data.kpis}
        selectedCategory={filters.category}
        onSelectCategory={(cat) => handleFilterChange({ category: cat })}
      />

      {/* Search, Filter Dropdowns, Presets, and Quick Chips */}
      <BatchActivityFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        totalFilteredCount={filteredEvents.length}
      />

      {/* 2-Column Responsive Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Activity Timeline Feed (7 cols) */}
        <div className="lg:col-span-7 xl:col-span-8">
          <BatchActivityFeed
            groups={groupedFilteredEvents}
            onResetFilters={handleResetFilters}
            onExportSelected={() => setIsExportModalOpen(true)}
          />
        </div>

        {/* Right Column: Operations Dashboard Sidebar (5 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
          <BatchActivitySidebar
            activitySummary={data.activitySummary}
            topContributors={data.topContributors}
            recentAlerts={data.recentAlerts}
            calendarDates={data.calendarDates}
            selectedDay={filters.selectedDay}
            onSelectDay={(day) => handleFilterChange({ selectedDay: day })}
            onJumpToToday={handleJumpToToday}
          />
        </div>
      </div>

      {/* Export CSV/JSON Modal */}
      <ExportActivityModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        batchTitle={data.batch.title}
        totalCount={data.kpis.totalEvents}
        filteredEvents={filteredEvents}
      />

      {/* Log Custom Note Modal */}
      <LogCustomActivityModal
        isOpen={isLogNoteModalOpen}
        onClose={() => setIsLogNoteModalOpen(false)}
        onSave={handleSaveCustomNote}
      />
    </div>
  );
}
