"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  UploadCloud,
  Video,
  Clock,
  User,
  Folder,
  Lock,
  Globe,
  Shield,
  FileText,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { extractYouTubeVideoId, getYouTubeEmbedUrl, isYouTubeUrl } from "@/lib/youtube";

interface UploadBatchRecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchId: Id<"batches">;
  batchTitle?: string;
  courseTitle?: string;
  modules?: string[];
  defaultModule?: string;
  onSuccess?: () => void;
}

const DEFAULT_MODULE_OPTIONS = [
  "Module 1: Foundations & Setup",
  "Module 2: Advanced Patterns & Architecture",
  "Module 3: Full-Stack Integration & APIs",
  "Module 4: Database Modeling & Deployment",
  "Bonus Workgroups & Q&A",
];

const DURATION_PRESETS = [
  "45m",
  "60m",
  "75m",
  "90m",
  "120m",
  "150m",
];

export default function UploadBatchRecordingModal({
  isOpen,
  onClose,
  batchId,
  batchTitle,
  courseTitle,
  modules,
  defaultModule,
  onSuccess,
}: UploadBatchRecordingModalProps) {
  const createRecMut = useMutation(api.admin.createBatchRecordingExtended);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [recordingUrl, setRecordingUrl] = useState("");
  const [videoSource, setVideoSource] = useState<"AWS S3" | "YouTube" | "Vimeo" | "Zoom">(
    "AWS S3"
  );
  const [moduleTitle, setModuleTitle] = useState(
    defaultModule || "Module 1: Foundations & Setup"
  );
  const [instructorName, setInstructorName] = useState("Alex D'Souza");
  const [duration, setDuration] = useState("60m");
  const [status, setStatus] = useState<"Published" | "Draft">("Published");
  const [visibility, setVisibility] = useState<
    "Public to Batch" | "Private" | "Instructors Only"
  >("Public to Batch");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const moduleOptions = modules && modules.length > 0 ? modules : DEFAULT_MODULE_OPTIONS;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !recordingUrl.trim()) {
      setErrorMessage("Please enter a valid session title and recording stream URL.");
      return;
    }

    const vid = extractYouTubeVideoId(recordingUrl);
    const isYt = isYouTubeUrl(recordingUrl) || videoSource === "YouTube";
    if (videoSource === "YouTube" && !vid) {
      setErrorMessage("Invalid YouTube URL. Please enter a valid YouTube share link (e.g. https://youtu.be/...) or watch URL.");
      return;
    }

    const finalVideoSource = isYt ? "YouTube" : videoSource;
    const finalYoutubeVideoId = vid || undefined;
    const finalRecordingUrl = vid ? (getYouTubeEmbedUrl(recordingUrl) || recordingUrl.trim()) : recordingUrl.trim();

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await createRecMut({
        batchId: batchId as any,
        title: title.trim(),
        recordingUrl: finalRecordingUrl,
        duration,
        moduleTitle,
        instructorName: instructorName.trim() || "Alex D'Souza",
        description: description.trim() || undefined,
        status,
        visibility,
        videoSource: finalVideoSource,
        youtubeVideoId: finalYoutubeVideoId,
      });

      setTitle("");
      setDescription("");
      setRecordingUrl("");
      setDuration("60m");
      setIsSubmitting(false);

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Failed to publish recording:", err);
      setErrorMessage(
        err?.message || "Failed to publish recording. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-2xl text-text-primary z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UploadCloud className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-text-primary">
                  Publish Session Recording
                </h3>
                <p className="text-xs text-text-muted">
                  Add HD class replay for <strong className="text-text-primary">{courseTitle || "Cohort"} {batchTitle ? `• ${batchTitle}` : ""}</strong>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-text-muted hover:bg-background hover:text-text-primary transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {errorMessage && (
              <div className="flex items-center gap-2 rounded-xl bg-error/10 border border-error/20 p-3 text-xs font-bold text-error">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">
                Session Title <span className="text-error">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Masterclass #7: Advanced Auth & Role Systems"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
              />
            </div>

            {/* URL & Source */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-text-primary mb-1">
                  HD Recording Stream URL <span className="text-error">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://cdn.vibelogic.studio/stream/..."
                  value={recordingUrl}
                  onChange={(e) => setRecordingUrl(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Video CDN Source
                </label>
                <select
                  value={videoSource}
                  onChange={(e) => setVideoSource(e.target.value as any)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none"
                >
                  <option value="AWS S3">AWS S3 / CloudFront</option>
                  <option value="YouTube">YouTube Live</option>
                  <option value="Vimeo">Vimeo Enterprise</option>
                  <option value="Zoom">Zoom Cloud</option>
                </select>
              </div>
            </div>

            {/* Module & Instructor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Target Module
                </label>
                <select
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none"
                >
                  {moduleOptions.map((mod) => (
                    <option key={mod} value={mod}>
                      {mod}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Instructor Name
                </label>
                <input
                  type="text"
                  placeholder="Alex D'Souza"
                  value={instructorName}
                  onChange={(e) => setInstructorName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Duration Presets */}
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1.5">
                Session Duration
              </label>
              <div className="flex flex-wrap gap-1.5">
                {DURATION_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setDuration(p)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      duration === p
                        ? "bg-primary text-white shadow-sm"
                        : "bg-background border border-border text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">
                Session Description &amp; Timestamps (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="00:00 Introduction & Review&#10;15:30 Building the Authentication Router&#10;45:00 Q&A and Assignments..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-border bg-background p-3 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
              />
            </div>

            {/* Status & Visibility */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Initial Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none"
                >
                  <option value="Published">Published immediately</option>
                  <option value="Draft">Save as Draft</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Access Level
                </label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none"
                >
                  <option value="Public to Batch">Public to Batch</option>
                  <option value="Private">Private</option>
                  <option value="Instructors Only">Instructors Only</option>
                </select>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
              >
                <UploadCloud className="h-4 w-4" />
                <span>
                  {isSubmitting
                    ? "Publishing Recording..."
                    : "Publish to Classroom"}
                </span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
