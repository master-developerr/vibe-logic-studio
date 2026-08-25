"use client";

import React from "react";
import { Calendar, Filter, Download } from "lucide-react";

interface AnalyticsGlobalFiltersProps {
  timeRange: string;
  setTimeRange: (range: string) => void;
  onExport: () => void;
}

export function AnalyticsGlobalFilters({ timeRange, setTimeRange, onExport }: AnalyticsGlobalFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-surface border border-border rounded-xl shadow-sm mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-lg">
          <Calendar className="w-4 h-4 text-text-muted" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-transparent text-sm font-medium text-text-primary focus:outline-none"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 3 Months</option>
            <option value="12m">Last 12 Months</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-lg">
          <Filter className="w-4 h-4 text-text-muted" />
          <select className="bg-transparent text-sm font-medium text-text-primary focus:outline-none w-32">
            <option value="all">All Courses</option>
            <option value="active">Active Courses</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-lg">
          <Filter className="w-4 h-4 text-text-muted" />
          <select className="bg-transparent text-sm font-medium text-text-primary focus:outline-none w-32">
            <option value="all">All Instructors</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-background rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>
    </div>
  );
}
