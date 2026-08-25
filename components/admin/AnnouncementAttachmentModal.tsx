"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Video,
  Link as LinkIcon,
  BookOpen,
  Plus,
  X,
  CheckCircle2,
} from "lucide-react";

export interface AnnouncementAttachmentItem {
  id?: string;
  type: "file" | "material" | "recording" | "link";
  title: string;
  url: string;
}

interface AnnouncementAttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAttachment: (attachment: AnnouncementAttachmentItem) => void;
  existingStudyMaterials?: Array<{
    id: string;
    title: string;
    type: string;
    fileUrl: string;
  }>;
  existingRecordings?: Array<{
    id: string;
    title: string;
    recordingUrl?: string;
  }>;
}

export function AnnouncementAttachmentModal({
  isOpen,
  onClose,
  onAddAttachment,
  existingStudyMaterials = [],
  existingRecordings = [],
}: AnnouncementAttachmentModalProps) {
  const [activeTab, setActiveTab] = useState<"link" | "material" | "recording" | "file">("link");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (activeTab === "material" && selectedId) {
      const mat = existingStudyMaterials.find((m) => m.id === selectedId);
      if (!mat) {
        setErrorMsg("Please select a valid study material.");
        return;
      }
      onAddAttachment({
        id: mat.id,
        type: "material",
        title: mat.title,
        url: mat.fileUrl || "#",
      });
      resetAndClose();
      return;
    }

    if (activeTab === "recording" && selectedId) {
      const rec = existingRecordings.find((r) => r.id === selectedId);
      if (!rec) {
        setErrorMsg("Please select a valid live session recording.");
        return;
      }
      onAddAttachment({
        id: rec.id,
        type: "recording",
        title: rec.title,
        url: rec.recordingUrl || "#",
      });
      resetAndClose();
      return;
    }

    if (!title.trim() || !url.trim()) {
      setErrorMsg("Please provide both a title and a valid URL/link.");
      return;
    }

    onAddAttachment({
      type: activeTab,
      title: title.trim(),
      url: url.trim(),
    });
    resetAndClose();
  };

  const resetAndClose = () => {
    setTitle("");
    setUrl("");
    setSelectedId("");
    setErrorMsg("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={resetAndClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-lg rounded-3xl bg-surface border border-border shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-border bg-background/50 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Attach Resource to Announcement
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Attach study materials, session recordings, files, or external links for learners.
              </p>
            </div>
            <button
              type="button"
              onClick={resetAndClose}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Tab Selector */}
            <div className="grid grid-cols-4 gap-2 bg-background p-1.5 rounded-xl border border-border">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("link");
                  setSelectedId("");
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "link"
                    ? "bg-surface text-primary shadow-sm border border-border"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Link</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("material");
                  setTitle("");
                  setUrl("");
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "material"
                    ? "bg-surface text-primary shadow-sm border border-border"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Material</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("recording");
                  setTitle("");
                  setUrl("");
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "recording"
                    ? "bg-surface text-primary shadow-sm border border-border"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Recording</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("file");
                  setSelectedId("");
                }}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "file"
                    ? "bg-surface text-primary shadow-sm border border-border"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>File</span>
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4 pt-1">
              {errorMsg && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {activeTab === "material" && (
                <div>
                  <label className="block text-xs font-semibold uppercase text-text-secondary mb-1.5">
                    Select Study Material from Cohort Library
                  </label>
                  <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">-- Choose existing study material --</option>
                    {existingStudyMaterials.map((mat) => (
                      <option key={mat.id} value={mat.id}>
                        {mat.title} ({mat.type})
                      </option>
                    ))}
                    {existingStudyMaterials.length === 0 && (
                      <option value="" disabled>
                        No materials uploaded in this cohort yet
                      </option>
                    )}
                  </select>
                </div>
              )}

              {activeTab === "recording" && (
                <div>
                  <label className="block text-xs font-semibold uppercase text-text-secondary mb-1.5">
                    Select Session Recording from Cohort Library
                  </label>
                  <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">-- Choose existing live session recording --</option>
                    {existingRecordings.map((rec) => (
                      <option key={rec.id} value={rec.id}>
                        {rec.title}
                      </option>
                    ))}
                    {existingRecordings.length === 0 && (
                      <option value="" disabled>
                        No session recordings available in this cohort yet
                      </option>
                    )}
                  </select>
                </div>
              )}

              {(activeTab === "link" || activeTab === "file") && (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-text-secondary mb-1.5">
                      {activeTab === "link" ? "External Link Title *" : "Document / File Title *"}
                    </label>
                    <Input
                      placeholder={
                        activeTab === "link"
                          ? "e.g. Capstone Project Starter Repository (GitHub)"
                          : "e.g. November Cohort Exam Syllabus PDF"
                      }
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-text-secondary mb-1.5">
                      {activeTab === "link" ? "Destination URL *" : "File Download / Storage URL *"}
                    </label>
                    <Input
                      placeholder="https://..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetAndClose}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" className="gap-2 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  Attach to Announcement
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
