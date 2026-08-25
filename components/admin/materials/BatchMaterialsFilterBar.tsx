"use client";

import React from "react";
import { Search, Filter, ArrowUpDown, LayoutGrid, List, Eye, Layers } from "lucide-react";

interface BatchMaterialsFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFormat: string;
  onSelectFormat: (format: string) => void;
  selectedVisibility: string;
  onSelectVisibility: (visibility: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: "table" | "grid";
  onViewModeChange: (mode: "table" | "grid") => void;
  totalFilteredCount: number;
}

export function BatchMaterialsFilterBar({
  searchQuery,
  onSearchChange,
  selectedFormat,
  onSelectFormat,
  selectedVisibility,
  onSelectVisibility,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalFilteredCount,
}: BatchMaterialsFilterBarProps) {
  const formats = [
    { label: "All Formats", value: "all" },
    { label: "PDF", value: "PDF" },
    { label: "DOCX", value: "DOCX" },
    { label: "PPTX", value: "PPTX" },
    { label: "ZIP", value: "ZIP" },
    { label: "Video", value: "MP4" },
    { label: "Code", value: "CODE" },
    { label: "Link", value: "LINK" },
  ];

  const visibilities = [
    { label: "All Visibility", value: "all" },
    { label: "Public", value: "Public" },
    { label: "Students Only", value: "Students Only" },
    { label: "Draft", value: "Draft" },
    { label: "Archived", value: "Archived" },
  ];

  const sortOptions = [
    { label: "Curated Order (0 → 9)", value: "order" },
    { label: "Title (A → Z)", value: "title" },
    { label: "Most Downloaded", value: "downloads" },
    { label: "Recently Updated", value: "updated" },
  ];

  return (
    <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm mb-6 space-y-3">
      {/* First Row: Search input + View Mode + Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search study materials by title, format, or collection..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-xs text-text-primary placeholder:text-text-muted font-medium outline-none focus:border-primary transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-text-muted hover:text-text-primary uppercase"
            >
              Clear
            </button>
          )}
        </div>

        {/* Right controls: View Toggle + Sort Dropdown + Filtered Badge */}
        <div className="flex items-center gap-2.5 self-end md:self-auto">
          <span className="text-xs font-bold text-text-muted">
            {totalFilteredCount} {totalFilteredCount === 1 ? "Item" : "Items"}
          </span>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-background border border-border rounded-xl p-0.5">
            <button
              onClick={() => onViewModeChange("table")}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "table"
                  ? "bg-surface text-primary shadow-sm"
                  : "text-text-muted hover:text-text-primary"
              }`}
              title="Table view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "grid"
                  ? "bg-surface text-primary shadow-sm"
                  : "text-text-muted hover:text-text-primary"
              }`}
              title="Grid cards view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-background border border-border rounded-xl px-2.5 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-text-muted shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-text-primary outline-none cursor-pointer pr-1"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Second Row: Format & Visibility Pill Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/60">
        {/* Format Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-text-muted mr-1">
            Format:
          </span>
          {formats.map((fmt) => (
            <button
              key={fmt.value}
              onClick={() => onSelectFormat(fmt.value)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                selectedFormat === fmt.value
                  ? "bg-text-primary text-background shadow-sm"
                  : "bg-background text-text-secondary hover:text-text-primary border border-border/80"
              }`}
            >
              {fmt.label}
            </button>
          ))}
        </div>

        {/* Visibility Pills */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-text-muted mr-1">
            Access:
          </span>
          {visibilities.map((vis) => (
            <button
              key={vis.value}
              onClick={() => onSelectVisibility(vis.value)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                selectedVisibility === vis.value
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "bg-background text-text-secondary hover:text-text-primary border border-border/80"
              }`}
            >
              {vis.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
