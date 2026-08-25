"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Upload,
  Download,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Users,
  Check,
  Trash2,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface ImportStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchId: string;
  courseId: string;
  batchTitle?: string;
  onSuccess?: () => void;
}

interface ParsedRow {
  name: string;
  email: string;
  phone?: string;
  status: "pending" | "enrolling" | "success" | "error";
  errorMessage?: string;
}

export function ImportStudentsModal({
  isOpen,
  onClose,
  batchId,
  courseId,
  batchTitle = "Cohort Batch",
  onSuccess,
}: ImportStudentsModalProps) {
  const manualEnroll = useMutation(api.admin.manualEnrollStudent);

  const [csvText, setCsvText] = useState("");
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successCount, setSuccessCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"paste" | "upload">("paste");

  const handleDownloadTemplate = () => {
    const templateContent =
      "name,email,phone\nJames Sullivan,james.sull@company.com,+1 555 0123 456\nSarah Nielsen,s.nielsen@gmail.com,+44 7700 900077\nBen Thompson,ben.t@outlook.com,+1 555 987 6543";
    const blob = new Blob([templateContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "vibelogic_students_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseCSVContent = (content: string) => {
    setErrorMsg("");
    const lines = content
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      setErrorMsg("No data found to import.");
      setParsedRows([]);
      return;
    }

    const rows: ParsedRow[] = [];
    // Check if first line is header
    let startIndex = 0;
    const firstLineLower = lines[0].toLowerCase();
    if (
      firstLineLower.includes("email") ||
      firstLineLower.includes("name") ||
      firstLineLower.includes("phone")
    ) {
      startIndex = 1;
    }

    for (let i = startIndex; i < lines.length; i++) {
      const parts = lines[i].split(",").map((p) => p.trim());
      // Handle simple format: email only or name,email,phone
      let email = "";
      let name = "";
      let phone = "";

      if (parts.length === 1) {
        email = parts[0];
        name = email.split("@")[0] || "Student";
      } else if (parts.length >= 2) {
        name = parts[0];
        email = parts[1];
        if (parts[2]) phone = parts[2];
      }

      if (email && email.includes("@")) {
        rows.push({
          name: name || "Student",
          email,
          phone,
          status: "pending",
        });
      }
    }

    if (rows.length === 0) {
      setErrorMsg("Could not find any valid student email addresses.");
    }
    setParsedRows(rows);
    setSuccessCount(0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === "string") {
        setCsvText(text);
        parseCSVContent(text);
      }
    };
    reader.readAsText(file);
  };

  const handleStartImport = async () => {
    if (parsedRows.length === 0) return;
    setIsImporting(true);
    setErrorMsg("");
    let count = 0;

    for (let i = 0; i < parsedRows.length; i++) {
      const row = parsedRows[i];
      // Update status to enrolling
      setParsedRows((prev) =>
        prev.map((r, idx) => (idx === i ? { ...r, status: "enrolling" } : r))
      );

      try {
        await manualEnroll({
          studentEmail: row.email,
          courseId: courseId as any,
          batchId: batchId as any,
        });
        count++;
        setParsedRows((prev) =>
          prev.map((r, idx) => (idx === i ? { ...r, status: "success" } : r))
        );
      } catch (err: any) {
        setParsedRows((prev) =>
          prev.map((r, idx) =>
            idx === i
              ? {
                  ...r,
                  status: "error",
                  errorMessage: err.message || "Failed to enroll",
                }
              : r
          )
        );
      }
    }

    setSuccessCount(count);
    setIsImporting(false);
    if (onSuccess && count > 0) {
      onSuccess();
    }
  };

  const removeRow = (index: number) => {
    setParsedRows((prev) => prev.filter((_, idx) => idx !== index));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/60 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between bg-background/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-text-primary">
                  Import Students to Batch
                </h3>
                <p className="text-xs text-text-muted">
                  Bulk enroll learners into {batchTitle} via CSV text or upload.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isImporting}
              className="p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-background transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Template & Options */}
            <div className="flex items-center justify-between bg-background p-3.5 rounded-xl border border-border">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-text-primary">
                  Need a starting point? Download our CSV template.
                </span>
              </div>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="px-3 py-1.5 rounded-lg bg-surface border border-border hover:bg-background text-text-primary text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-primary" />
                Download Template
              </button>
            </div>

            {/* Tab switch */}
            <div className="flex border-b border-border">
              <button
                type="button"
                onClick={() => setActiveTab("paste")}
                className={`pb-2 px-4 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === "paste"
                    ? "border-primary text-primary"
                    : "border-transparent text-text-muted hover:text-text-primary"
                }`}
              >
                Paste CSV / Email List
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={`pb-2 px-4 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === "upload"
                    ? "border-primary text-primary"
                    : "border-transparent text-text-muted hover:text-text-primary"
                }`}
              >
                Upload CSV File
              </button>
            </div>

            {activeTab === "paste" ? (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-text-primary">
                  Paste rows (format: <code>name,email,phone</code> or just <code>email</code> per line)
                </label>
                <textarea
                  rows={4}
                  value={csvText}
                  onChange={(e) => {
                    setCsvText(e.target.value);
                    parseCSVContent(e.target.value);
                  }}
                  placeholder={`James Sullivan,james.sull@company.com,+1 555 0123 456\nSarah Nielsen,s.nielsen@gmail.com,+44 7700 900077`}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono text-text-primary focus:outline-none focus:border-primary"
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center bg-background hover:bg-background/80 transition-colors">
                <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-xs font-semibold text-text-primary">
                  Select a CSV file to upload
                </p>
                <p className="text-xs text-text-muted mt-0.5 mb-4">
                  File should include columns: name, email, phone
                </p>
                <label className="inline-block px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold cursor-pointer hover:bg-primary/90 transition-colors">
                  Browse Files
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Parsed Rows Preview */}
            {parsedRows.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-primary">
                    Preview: {parsedRows.length} student{parsedRows.length !== 1 ? "s" : ""} ready to import
                  </span>
                  {successCount > 0 && (
                    <span className="text-xs font-semibold text-green-600">
                      Successfully imported {successCount} student{successCount !== 1 ? "s" : ""}!
                    </span>
                  )}
                </div>

                <div className="max-h-48 overflow-y-auto border border-border rounded-xl bg-background divide-y divide-border">
                  {parsedRows.map((row, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-2 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-medium text-text-primary truncate">
                          {row.name}
                        </span>
                        <span className="text-text-muted truncate">
                          ({row.email})
                        </span>
                        {row.phone && (
                          <span className="text-text-muted hidden sm:inline">
                            • {row.phone}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {row.status === "pending" && (
                          <span className="px-2 py-0.5 rounded-full bg-surface border border-border text-[10px] text-text-muted">
                            Ready
                          </span>
                        )}
                        {row.status === "enrolling" && (
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Enrolling
                          </span>
                        )}
                        {row.status === "success" && (
                          <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Enrolled
                          </span>
                        )}
                        {row.status === "error" && (
                          <span
                            className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-semibold"
                            title={row.errorMessage}
                          >
                            Failed
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeRow(idx)}
                          disabled={isImporting}
                          className="text-text-muted hover:text-red-500 transition-colors p-1"
                          title="Remove row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border bg-background/50 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              disabled={isImporting}
              className="px-4 py-2.5 rounded-xl border border-border hover:bg-surface text-text-primary text-xs font-semibold transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleStartImport}
              disabled={isImporting || parsedRows.length === 0}
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Importing ({successCount}/{parsedRows.length})...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Import {parsedRows.length} Student{parsedRows.length !== 1 ? "s" : ""}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
