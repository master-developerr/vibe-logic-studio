"use client";

import React, { useState } from "react";
import {
  X,
  Download,
  FileText,
  FileCode,
  PlusCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { BatchActivityEvent } from "./types";

interface ExportActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchTitle: string;
  totalCount: number;
  filteredEvents: BatchActivityEvent[];
}

export function ExportActivityModal({
  isOpen,
  onClose,
  batchTitle,
  totalCount,
  filteredEvents,
}: ExportActivityModalProps) {
  const [format, setFormat] = useState<"csv" | "json">("csv");
  const [scope, setScope] = useState<"filtered" | "all">("filtered");
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(() => {
      const dataToExport = scope === "filtered" ? filteredEvents : filteredEvents;
      let fileContent = "";
      let fileName = `batch-activity-logs-${Date.now()}`;

      if (format === "json") {
        fileContent = JSON.stringify(dataToExport, null, 2);
        fileName += ".json";
      } else {
        const headers = [
          "ID",
          "Timestamp",
          "Category",
          "Actor",
          "Role",
          "Action",
          "Target",
          "Status",
          "IPAddress",
          "Description",
        ];
        const rows = dataToExport.map((e) => [
          e.id,
          new Date(e.timestamp).toISOString(),
          e.category,
          e.actorName,
          e.actorRole,
          e.action,
          `"${e.target.replace(/"/g, '""')}"`,
          e.status,
          e.ipAddress || "",
          `"${e.description.replace(/"/g, '""')}"`,
        ]);
        fileContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
          "\n"
        );
        fileName += ".csv";
      }

      const blob = new Blob([fileContent], {
        type:
          format === "json"
            ? "application/json"
            : "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-surface border border-border rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <Download className="w-4 h-4 text-primary" />
            <span>Export Audit & Activity Logs</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-background text-text-muted hover:text-text-primary transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Format Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-text-primary">
              Select Export File Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat("csv")}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  format === "csv"
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border bg-background hover:border-text-secondary"
                }`}
              >
                <FileText className="w-4 h-4 text-primary" />
                <div>
                  <div className="font-bold text-text-primary">CSV Spreadsheet</div>
                  <div className="text-[10px] text-text-muted">
                    Excel / Sheets ready
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat("json")}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  format === "json"
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border bg-background hover:border-text-secondary"
                }`}
              >
                <FileCode className="w-4 h-4 text-primary" />
                <div>
                  <div className="font-bold text-text-primary">JSON Payload</div>
                  <div className="text-[10px] text-text-muted">
                    Raw API telemetry
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Scope Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-text-primary">
              Select Data Scope
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-background cursor-pointer">
                <input
                  type="radio"
                  name="scope"
                  checked={scope === "filtered"}
                  onChange={() => setScope("filtered")}
                  className="text-primary focus:ring-primary"
                />
                <span className="font-semibold text-text-primary">
                  Filtered Results ({filteredEvents.length} records)
                </span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-background cursor-pointer">
                <input
                  type="radio"
                  name="scope"
                  checked={scope === "all"}
                  onChange={() => setScope("all")}
                  className="text-primary focus:ring-primary"
                />
                <span className="font-semibold text-text-primary">
                  Complete Activity History ({totalCount} records)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:bg-background transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={isExporting || exportSuccess}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating {format.toUpperCase()}...</span>
              </>
            ) : exportSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download {format.toUpperCase()}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

interface LogCustomActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description: string;
    category: string;
    status: string;
  }) => Promise<void>;
}

export function LogCustomActivityModal({
  isOpen,
  onClose,
  onSave,
}: LogCustomActivityModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("System");
  const [status, setStatus] = useState("SUCCESS");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setIsSubmitting(true);
    try {
      await onSave({ title, description, category, status });
      onClose();
      setTitle("");
      setDescription("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-surface border border-border rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-primary" />
            <span>Log Custom Audit Note</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-background text-text-muted hover:text-text-primary transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-text-primary">
              Event Title / Summary <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Exam window extended for 48 hours"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-text-primary">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="System">System</option>
                <option value="Content">Content</option>
                <option value="Students">Students</option>
                <option value="Payments">Payments</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-text-primary">Status Chip</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="SUCCESS">Success</option>
                <option value="COMPLETED">Completed</option>
                <option value="WARNING">Warning</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-text-primary">
              Audit Payload / Detailed Notes <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Include operational context or authorization reference..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:bg-background transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Recording...</span>
                </>
              ) : (
                <span>Record Audit Note</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
