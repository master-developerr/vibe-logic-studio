"use client";

import React, { useState } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, X, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadQueueItem {
  id: string;
  name: string;
  size: string;
  progress: number; // 0-100
  status: "uploading" | "completed" | "error";
  errorMessage?: string;
}

interface BatchMaterialsDropzoneProps {
  onFileUploaded: (fileInfo: {
    title: string;
    type: string;
    fileUrl: string;
    fileSize: string;
    fileFormat: string;
  }) => void;
  defaultExpanded?: boolean;
}

export function BatchMaterialsDropzone({
  onFileUploaded,
  defaultExpanded = false,
}: BatchMaterialsDropzoneProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isDragging, setIsDragging] = useState(false);
  const [queue, setQueue] = useState<UploadQueueItem[]>([]);

  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} MB`;
    if (bytes >= 1000) return `${Math.round(bytes / 1000)} KB`;
    return `${bytes} B`;
  };

  const getFileFormat = (fileName: string): { format: string; type: string } => {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    if (ext === "pdf") return { format: "PDF", type: "pdf" };
    if (ext === "mp4" || ext === "mov" || ext === "webm")
      return { format: "MP4", type: "video" };
    if (ext === "docx" || ext === "doc")
      return { format: "DOCX", type: "pdf" };
    if (ext === "pptx" || ext === "ppt")
      return { format: "PPTX", type: "pdf" };
    if (ext === "zip" || ext === "rar" || ext === "tar")
      return { format: "ZIP", type: "pdf" };
    if (ext === "ts" || ext === "tsx" || ext === "js" || ext === "py")
      return { format: "CODE", type: "pdf" };
    return { format: ext.toUpperCase() || "FILE", type: "pdf" };
  };

  const simulateFileUpload = (file: File) => {
    const id = `${Date.now()}-${file.name}`;
    const sizeStr = formatFileSize(file.size);
    const { format, type } = getFileFormat(file.name);

    const initialItem: UploadQueueItem = {
      id,
      name: file.name,
      size: sizeStr,
      progress: 0,
      status: "uploading",
    };

    setQueue((prev) => [initialItem, ...prev]);

    // Animate upload progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 25;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setQueue((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, progress: 100, status: "completed" }
              : item
          )
        );
        // Call parent handler
        onFileUploaded({
          title: file.name.replace(/\.[^/.]+$/, ""), // Strip extension for clean title
          type,
          fileUrl: `https://vibelogic.studio/cdn/assets/${encodeURIComponent(
            file.name
          )}`,
          fileSize: sizeStr,
          fileFormat: format,
        });
      } else {
        setQueue((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, progress: currentProgress } : item
          )
        );
      }
    }, 350);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => simulateFileUpload(file));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    files.forEach((file) => simulateFileUpload(file));
  };

  const dismissQueueItem = (id: string) => {
    setQueue((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="mb-6">
      {/* Dock Header */}
      <div className="flex items-center justify-between bg-surface border border-border rounded-t-2xl px-5 py-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Upload className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">
              Quick Drop Asset Dock
            </h3>
            <p className="text-xs text-text-muted">
              Drag & drop PDFs, slide decks, ZIP archives, or code starter files for instant cohort distribution.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {queue.length > 0 && (
            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              {queue.filter((i) => i.status === "uploading").length} Uploading •{" "}
              {queue.filter((i) => i.status === "completed").length} Done
            </span>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-background text-xs font-semibold text-text-primary hover:bg-surface transition-colors"
          >
            {isExpanded ? (
              <>
                <span>Collapse Dock</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Expand Upload Area</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Dropzone Body */}
      {isExpanded && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
          className={`bg-surface border-x border-b border-border rounded-b-2xl p-6 transition-all ${
            isDragging
              ? "bg-primary/5 border-primary border-dashed"
              : "border-dashed"
          }`}
        >
          <div className="py-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Upload className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-text-primary">
              Drag and drop files here, or{" "}
              <label className="text-primary hover:underline cursor-pointer">
                click to browse
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </h4>
            <p className="text-xs text-text-muted mt-1 max-w-md mx-auto">
              Support for PDF, DOCX, PPTX, ZIP, MP4, and code starter files up to
              500 MB per file. High-speed global edge distribution enabled.
            </p>

            {/* Supported format badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              {["PDF", "DOCX", "PPTX", "ZIP", "MP4", "CODE", "LINK"].map(
                (format) => (
                  <span
                    key={format}
                    className="px-2.5 py-0.5 rounded-md border border-border/80 bg-background text-[11px] font-bold tracking-wider uppercase text-text-secondary"
                  >
                    {format}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Real-time Upload Queue */}
          {queue.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Upload Queue & Processing History
                </h5>
                <button
                  onClick={() => setQueue([])}
                  className="text-xs font-semibold text-text-muted hover:text-text-primary"
                >
                  Clear History
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {queue.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-background border border-border"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0">
                        {item.status === "uploading" ? (
                          <Loader2 className="w-4 h-4 text-primary animate-spin" />
                        ) : item.status === "completed" ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-text-primary truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-text-muted">
                          {item.size} •{" "}
                          {item.status === "uploading"
                            ? `Uploading (${item.progress}%)`
                            : item.status === "completed"
                            ? "Published & Enrolled"
                            : item.errorMessage || "Upload Failed"}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => dismissQueueItem(item.id)}
                      className="text-text-muted hover:text-text-primary p-1 rounded-lg hover:bg-surface transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
