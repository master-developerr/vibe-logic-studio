"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Play,
  Clock,
  Eye,
  BarChart3,
  User,
  Folder,
  Lock,
  Globe,
  Shield,
  FileText,
  Link,
  Plus,
  Trash2,
  RefreshCw,
  Download,
  CheckCircle2,
  AlertCircle,
  Video,
  Share2,
  ExternalLink,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface RecordingItem {
  id: Id<"liveClasses">;
  batchId: Id<"batches">;
  title: string;
  startTime: number;
  endTime: number;
  meetingLink: string;
  recordingUrl: string;
  duration?: string;
  moduleTitle?: string;
  instructorName?: string;
  views?: number;
  completionRate?: number;
  status?: string;
  visibility?: string;
  videoSource?: string;
  youtubeVideoId?: string;
  description?: string;
  attachments?: {
    id?: string;
    title: string;
    type: "FILE" | "LINK" | string;
    url: string;
    size?: string;
  }[];
}

interface BatchRecordingDrawerProps {
  recording: RecordingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenReplaceModal?: (recording: RecordingItem) => void;
}

export default function BatchRecordingDrawer({
  recording,
  isOpen,
  onClose,
  onOpenReplaceModal,
}: BatchRecordingDrawerProps) {
  // RULES OF HOOKS: unconditionally call at top level
  const updateRecMut = useMutation(api.admin.updateBatchRecordingExtended);
  const deleteRecMut = useMutation(api.admin.deleteBatchRecordingExtended);

  const [activeTab, setActiveTab] = useState<
    "PREVIEW" | "ANALYTICS" | "ATTACHMENTS" | "SETTINGS"
  >("PREVIEW");

  // Add Attachment form
  const [attTitle, setAttTitle] = useState("");
  const [attUrl, setAttUrl] = useState("");
  const [attType, setAttType] = useState<"FILE" | "LINK">("FILE");
  const [isAddingAtt, setIsAddingAtt] = useState(false);

  // Editable settings
  const [editVisibility, setEditVisibility] = useState<string>(
    recording?.visibility || "Public to Batch"
  );
  const [editStatus, setEditStatus] = useState<string>(
    recording?.status || "Published"
  );
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !recording) return null;

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      if (!recording.id.toString().startsWith("mock-") && !recording.id.toString().startsWith("demo-")) {
        await updateRecMut({
          id: recording.id,
          visibility: editVisibility as any,
          status: editStatus as any,
        });
      }
      onClose();
    } catch (err) {
      console.error("Failed to save recording settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRecording = async () => {
    if (!recording) return;
    if (confirm(`Are you sure you want to delete recording "${recording.title}"?`)) {
      try {
        if (!recording.id.toString().startsWith("mock-") && !recording.id.toString().startsWith("demo-")) {
          await deleteRecMut({ id: recording.id });
        }
        onClose();
      } catch (err) {
        console.error("Failed to delete recording:", err);
      }
    }
  };

  const handleDownload = () => {
    if (recording?.recordingUrl) {
      window.open(recording.recordingUrl, "_blank");
    }
  };

  const handleSyncMetadata = () => {
    alert("YouTube stream metadata & thumbnail refreshed successfully.");
  };

  const handleAddAttachment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attTitle.trim() || !attUrl.trim()) return;
    try {
      const currentAttachments = recording.attachments || [];
      const newAtt = {
        title: attTitle.trim(),
        url: attUrl.trim(),
        type: attType,
      };
      const updated = [...currentAttachments, newAtt];

      if (!recording.id.toString().startsWith("mock-") && !recording.id.toString().startsWith("demo-")) {
        await updateRecMut({
          id: recording.id,
          attachments: updated,
        });
      }
      setAttTitle("");
      setAttUrl("");
      setIsAddingAtt(false);
    } catch (err) {
      console.error("Failed to add attachment:", err);
    }
  };

  const handleRemoveAttachment = async (indexToRemove: number) => {
    try {
      const currentAttachments = recording.attachments || [];
      const updated = currentAttachments.filter((_, idx) => idx !== indexToRemove);

      if (!recording.id.toString().startsWith("mock-") && !recording.id.toString().startsWith("demo-")) {
        await updateRecMut({
          id: recording.id,
          attachments: updated,
        });
      }
    } catch (err) {
      console.error("Failed to remove attachment:", err);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="relative z-10 flex h-full w-full max-w-2xl flex-col bg-surface border-l border-border shadow-2xl text-text-primary overflow-hidden"
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="flex items-center gap-2.5">
              <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary border border-primary/20">
                {recording.moduleTitle || "Module"}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold border ${recording.status === "Published"
                    ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-700 border-amber-500/20"
                  }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${recording.status === "Published"
                      ? "bg-emerald-500"
                      : "bg-amber-500"
                    }`}
                />
                {recording.status || "Published"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  onOpenReplaceModal && onOpenReplaceModal(recording)
                }
                title="Replace Video Source"
                className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-text-primary hover:bg-surface transition-colors shadow-sm"
              >
                <RefreshCw className="h-3.5 w-3.5 text-amber-600" />
                <span>Replace Video</span>
              </button>
              <button
                onClick={onClose}
                className="rounded-xl p-1.5 text-text-muted hover:bg-background hover:text-text-primary transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Drawer Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title & Description */}
            <div>
              <h2 className="text-xl font-black tracking-tight text-text-primary">
                {recording.title}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-text-muted font-medium">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-primary" />
                  <span>{recording.instructorName || "Alex D'Souza"}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>{recording.duration || "60m"} duration</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Video className="h-3.5 w-3.5 text-primary" />
                  <span>{recording.videoSource || "AWS S3"}</span>
                </span>
              </div>

              {recording.description && (
                <p className="mt-3 text-xs text-text-muted leading-relaxed bg-background p-3.5 rounded-xl border border-border">
                  {recording.description}
                </p>
              )}
            </div>

            {/* Tabs Bar */}
            <div className="flex items-center gap-1.5 border-b border-border pb-3">
              <button
                onClick={() => setActiveTab("PREVIEW")}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${activeTab === "PREVIEW"
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                  }`}
              >
                HD Preview & Stream
              </button>
              <button
                onClick={() => setActiveTab("ANALYTICS")}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${activeTab === "ANALYTICS"
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                  }`}
              >
                Watch Retention
              </button>
              <button
                onClick={() => setActiveTab("ATTACHMENTS")}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${activeTab === "ATTACHMENTS"
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                  }`}
              >
                Study Files ({recording.attachments?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab("SETTINGS")}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${activeTab === "SETTINGS"
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                  }`}
              >
                Visibility & Access
              </button>
            </div>

            {/* TAB 1: PREVIEW */}
            {activeTab === "PREVIEW" && (
              <div className="space-y-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 border border-border shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent z-10" />

                  {/* Decorative waveform representation */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-25">
                    <div className="flex items-end gap-1.5 h-16">
                      <span className="w-2 h-8 bg-primary rounded-full animate-pulse" />
                      <span className="w-2 h-14 bg-primary rounded-full animate-pulse delay-75" />
                      <span className="w-2 h-6 bg-primary rounded-full animate-pulse delay-150" />
                      <span className="w-2 h-12 bg-primary rounded-full animate-pulse delay-200" />
                      <span className="w-2 h-16 bg-primary rounded-full animate-pulse delay-300" />
                      <span className="w-2 h-10 bg-primary rounded-full animate-pulse" />
                    </div>
                  </div>

                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                    <a
                      href={recording.recordingUrl || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-2xl hover:scale-105 transition-transform"
                    >
                      <Play className="h-8 w-8 ml-1" />
                    </a>
                    <span className="mt-3 text-xs font-bold text-white tracking-wide">
                      OPEN 1080P CLASSROOM STREAM
                    </span>
                  </div>

                  {recording.duration && (
                    <div className="absolute bottom-4 right-4 z-20 rounded-md bg-black/80 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-white flex items-center gap-1 border border-white/10">
                      <Clock className="h-3 w-3 text-primary" />
                      <span>{recording.duration}</span>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-border bg-background p-4 flex items-center justify-between">
                  <div className="text-xs text-text-muted">
                    <span className="font-bold text-text-primary">
                      Stream Source:
                    </span>{" "}
                    {recording.videoSource || "AWS S3 / CloudFront HD CDN"}
                  </div>
                  {recording.recordingUrl && (
                    <a
                      href={recording.recordingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                    >
                      <span>Copy Direct Link</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: ANALYTICS */}
            {activeTab === "ANALYTICS" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-border bg-background p-4">
                    <div className="text-xs font-bold text-text-muted uppercase tracking-wider">
                      Total Views
                    </div>
                    <div className="text-2xl font-black text-text-primary mt-1">
                      {(recording.views || 0).toLocaleString()}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-bold mt-1">
                      +18% unique learners this week
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-background p-4">
                    <div className="text-xs font-bold text-text-muted uppercase tracking-wider">
                      Completion Retention
                    </div>
                    <div className="text-2xl font-black text-text-primary mt-1">
                      {recording.completionRate || 0}%
                    </div>
                    <div className="text-[11px] text-emerald-600 font-bold mt-1">
                      Above 75% cohort target
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-background p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-text-primary">
                      Student Drop-off Curve (Simulated)
                    </span>
                    <span className="text-text-muted">60 min session</span>
                  </div>
                  <div className="h-4 w-full rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${recording.completionRate || 84}%` }}
                    />
                  </div>
                  <p className="text-xs text-text-muted">
                    Most learners watch until the Q&amp;A section at the 45-minute mark.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: ATTACHMENTS */}
            {activeTab === "ATTACHMENTS" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-text-primary">
                    Study Files &amp; Resources
                  </h3>
                  <button
                    onClick={() => setIsAddingAtt((prev) => !prev)}
                    className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{isAddingAtt ? "Cancel" : "Add Resource"}</span>
                  </button>
                </div>

                {isAddingAtt && (
                  <form
                    onSubmit={handleAddAttachment}
                    className="rounded-2xl border border-border bg-background p-4 space-y-3"
                  >
                    <div className="text-xs font-bold text-text-primary">
                      Attach new study material
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Resource Title (e.g. Slide Deck)"
                        value={attTitle}
                        onChange={(e) => setAttTitle(e.target.value)}
                        className="rounded-xl border border-border bg-surface px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="URL (https://...)"
                        value={attUrl}
                        onChange={(e) => setAttUrl(e.target.value)}
                        className="rounded-xl border border-border bg-surface px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAttType("FILE")}
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold ${attType === "FILE"
                              ? "bg-primary text-white"
                              : "bg-surface text-text-secondary border border-border"
                            }`}
                        >
                          File
                        </button>
                        <button
                          type="button"
                          onClick={() => setAttType("LINK")}
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold ${attType === "LINK"
                              ? "bg-primary text-white"
                              : "bg-surface text-text-secondary border border-border"
                            }`}
                        >
                          External Link
                        </button>
                      </div>
                      <button
                        type="submit"
                        className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-white hover:bg-primary/90 transition-colors shadow-sm"
                      >
                        Add Attachment
                      </button>
                    </div>
                  </form>
                )}

                {(!recording.attachments ||
                  recording.attachments.length === 0) && (
                    <div className="rounded-2xl border border-border bg-background p-8 text-center">
                      <FileText className="mx-auto h-8 w-8 text-text-muted" />
                      <p className="mt-2 text-xs font-medium text-text-muted">
                        No study materials attached to this recording yet.
                      </p>
                    </div>
                  )}

                {recording.attachments && recording.attachments.length > 0 && (
                  <div className="space-y-2">
                    {recording.attachments.map((att, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl border border-border bg-background p-3 hover:bg-surface transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            {att.type === "FILE" ? (
                              <FileText className="h-4 w-4" />
                            ) : (
                              <Link className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-text-primary">
                              {att.title}
                            </div>
                            <div className="text-[10px] text-text-muted">
                              {att.type} {att.size ? `• ${att.size}` : ""}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={att.url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg p-1.5 text-text-muted hover:text-primary transition-colors"
                            title="Open Link"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                          <button
                            onClick={() => handleRemoveAttachment(idx)}
                            className="rounded-lg p-1.5 text-text-muted hover:text-red-600 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: SETTINGS */}
            {activeTab === "SETTINGS" && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-border bg-background p-4 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1">
                      Visibility Permission
                    </label>
                    <select
                      value={editVisibility}
                      onChange={(e) => setEditVisibility(e.target.value)}
                      className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none"
                    >
                      <option value="Public to Batch">Public to Batch</option>
                      <option value="Private">Private (Draft)</option>
                      <option value="Instructors Only">Instructors Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1">
                      Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none"
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isSaving ? "Saving Settings..." : "Save Settings"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Persistent Footer Bar */}
          <div className="flex items-center justify-between border-t border-border bg-surface px-6 py-4 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-bold text-text-primary hover:bg-surface transition-colors shadow-sm"
              >
                <Download className="h-4 w-4 text-primary" />
                <span>Download Video</span>
              </button>
              {recording.videoSource === "YouTube" && (
                <button
                  onClick={handleSyncMetadata}
                  className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-500/20 transition-colors shadow-sm"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Sync Metadata</span>
                </button>
              )}
            </div>
            <button
              onClick={handleDeleteRecording}
              className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-500/20 transition-colors shadow-sm"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Recording</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
