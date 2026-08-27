"use client";

import React, { useState } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Paperclip,
  Eye,
  Send,
  Calendar,
  Save,
  Loader2,
  X,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnnouncementAttachmentItem } from "./AnnouncementAttachmentModal";

interface BatchAnnouncementComposerProps {
  batchId: string;
  batchTitle: string;
  audienceCounts: Record<string, number>;
  onPublish: (data: {
    title: string;
    content: string;
    status: string;
    targetAudience: string;
    scheduledAt?: number;
    isPinned: boolean;
    allowComments: boolean;
    attachments: AnnouncementAttachmentItem[];
  }) => Promise<void>;
  onOpenAttachmentModal: () => void;
  onOpenPreview: (data: {
    title: string;
    content: string;
    targetAudience: string;
    isPinned: boolean;
    allowComments: boolean;
    attachments: AnnouncementAttachmentItem[];
  }) => void;
  attachments: AnnouncementAttachmentItem[];
  onRemoveAttachment: (index: number) => void;
}

export function BatchAnnouncementComposer({
  batchId,
  batchTitle,
  audienceCounts,
  onPublish,
  onOpenAttachmentModal,
  onOpenPreview,
  attachments,
  onRemoveAttachment,
}: BatchAnnouncementComposerProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetAudience, setTargetAudience] = useState("Entire Batch");
  const [scheduleMode, setScheduleMode] = useState("Immediately");
  const [customDate, setCustomDate] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [allowComments, setAllowComments] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState("Last auto-saved just now");

  const estimatedReach = audienceCounts[targetAudience] ?? audienceCounts["Entire Batch"] ?? 0;

  const insertFormatting = (tag: string) => {
    if (tag === "B") setContent((prev) => prev + " **Bold Text** ");
    if (tag === "I") setContent((prev) => prev + " *Italic Text* ");
    if (tag === "S") setContent((prev) => prev + " ~~Strikethrough~~ ");
    if (tag === "UL") setContent((prev) => prev + "\n- Bullet item\n- Bullet item");
    if (tag === "OL") setContent((prev) => prev + "\n1. First item\n2. Second item");
    if (tag === "LINK") setContent((prev) => prev + " [Link Title](https://example.com) ");
    if (tag === "CODE") setContent((prev) => prev + " `code snippet` ");
  };

  const handleSaveDraft = async () => {
    if (!title.trim() && !content.trim()) return;
    setLoading(true);
    try {
      await onPublish({
        title: title.trim() || "Untitled Draft",
        content: content.trim() || "Draft announcement content...",
        status: "Draft",
        targetAudience,
        isPinned: false,
        allowComments,
        attachments,
      });
      setTitle("");
      setContent("");
      setLastSaved(`Draft saved at ${new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePostOrSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      let statusVal = "Published";
      let scheduledAtTimestamp: number | undefined = undefined;

      if (scheduleMode !== "Immediately") {
        statusVal = "Scheduled";
        if (scheduleMode === "1hour") {
          scheduledAtTimestamp = Date.now() + 3600000;
        } else if (scheduleMode === "tomorrow") {
          scheduledAtTimestamp = Date.now() + 86400000;
        } else if (scheduleMode === "custom" && customDate) {
          scheduledAtTimestamp = new Date(customDate).getTime();
        } else {
          scheduledAtTimestamp = Date.now() + 3600000;
        }
      } else if (isPinned) {
        statusVal = "Pinned";
      }

      await onPublish({
        title: title.trim(),
        content: content.trim(),
        status: statusVal,
        targetAudience,
        scheduledAt: scheduledAtTimestamp,
        isPinned,
        allowComments,
        attachments,
      });

      setTitle("");
      setContent("");
      setIsPinned(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-1 border-b border-border/60">
        <div>
          <h3 className="font-bold text-base text-text-primary">
            Create Announcement
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Broadcast updates to {batchTitle} learners across all channels
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSaveDraft}
          disabled={loading}
          className="text-xs gap-1.5 h-8 font-semibold"
        >
          <Save className="w-3.5 h-3.5" />
          Save Draft
        </Button>
      </div>

      <form onSubmit={handlePostOrSchedule} className="space-y-4">
        {/* Title Input */}
        <div>
          <label className="block text-xs font-semibold uppercase text-text-secondary mb-1.5 tracking-wider">
            Title
          </label>
          <Input
            placeholder="e.g. New Live Session Added for Nov Cohort"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="h-11 bg-background text-sm text-text-primary font-medium"
          />
        </div>

        {/* Content Box with Formatting Toolbar */}
        <div>
          <label className="block text-xs font-semibold uppercase text-text-secondary mb-1.5 tracking-wider">
            Content
          </label>
          <div className="border border-border rounded-xl overflow-hidden bg-background">
            {/* Formatting Toolbar */}
            <div className="flex items-center gap-1 p-2 bg-surface/60 border-b border-border flex-wrap">
              <button
                type="button"
                onClick={() => insertFormatting("B")}
                className="p-1.5 rounded hover:bg-background text-text-secondary hover:text-text-primary transition-colors"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting("I")}
                className="p-1.5 rounded hover:bg-background text-text-secondary hover:text-text-primary transition-colors"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting("S")}
                className="p-1.5 rounded hover:bg-background text-text-secondary hover:text-text-primary transition-colors"
                title="Strikethrough"
              >
                <Strikethrough className="w-4 h-4" />
              </button>
              <span className="w-px h-4 bg-border mx-1" />
              <button
                type="button"
                onClick={() => insertFormatting("UL")}
                className="p-1.5 rounded hover:bg-background text-text-secondary hover:text-text-primary transition-colors"
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting("OL")}
                className="p-1.5 rounded hover:bg-background text-text-secondary hover:text-text-primary transition-colors"
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <span className="w-px h-4 bg-border mx-1" />
              <button
                type="button"
                onClick={() => insertFormatting("LINK")}
                className="p-1.5 rounded hover:bg-background text-text-secondary hover:text-text-primary transition-colors"
                title="Link"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting("CODE")}
                className="p-1.5 rounded hover:bg-background text-text-secondary hover:text-text-primary transition-colors"
                title="Code"
              >
                <Code className="w-4 h-4" />
              </button>
              <span className="w-px h-4 bg-border mx-1" />
              <button
                type="button"
                onClick={onOpenAttachmentModal}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-all ml-auto"
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span>+ Attach Resource</span>
              </button>
            </div>

            {/* Textarea */}
            <textarea
              rows={5}
              placeholder="Write your announcement message here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full p-3.5 bg-transparent text-sm text-text-primary focus:outline-none resize-y min-h-[120px]"
            />
          </div>
        </div>

        {/* Attached Items Row */}
        {attachments.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {attachments.map((att, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-semibold text-text-primary"
              >
                <Paperclip className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate max-w-[180px]">{att.title}</span>
                <span className="px-1.5 py-0.2 rounded bg-surface text-[10px] text-text-muted uppercase">
                  {att.type}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveAttachment(idx)}
                  className="p-0.5 hover:text-red-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Audience & Scheduling Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-text-secondary mb-1.5 tracking-wider">
              Target Audience
            </label>
            <div className="relative">
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full h-10 px-3 pr-8 rounded-lg border border-border bg-background text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Entire Batch">Entire Batch ({audienceCounts["Entire Batch"] ?? 0} Learners)</option>
                <option value="Instructors">Instructors Only</option>
              </select>
              <div className="absolute right-3 top-2.5 pointer-events-none text-text-muted">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[11px] text-text-muted mt-1">
              Estimated immediate reach: <span className="font-bold text-primary">{estimatedReach} learners</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-text-secondary mb-1.5 tracking-wider">
              Scheduled Date
            </label>
            <div className="flex gap-2">
              <select
                value={scheduleMode}
                onChange={(e) => setScheduleMode(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Immediately">Immediately (Publish Now)</option>
                <option value="1hour">In 1 Hour</option>
                <option value="tomorrow">Tomorrow Morning (9:00 AM)</option>
                <option value="custom">Custom Date & Time...</option>
              </select>
              {scheduleMode === "custom" && (
                <Input
                  type="datetime-local"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="h-10 text-xs w-44"
                />
              )}
            </div>
          </div>
        </div>

        {/* Checkbox Options Row */}
        <div className="flex items-center gap-6 pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text-primary">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
            />
            <span>Pin to top of feed</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text-primary">
            <input
              type="checkbox"
              checked={allowComments}
              onChange={(e) => setAllowComments(e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
            />
            <span>Allow student comments</span>
          </label>
        </div>

        {/* Bottom Toolbar */}
        <div className="flex items-center justify-between pt-3 border-t border-border/60">
          <span className="text-xs text-text-muted font-medium">{lastSaved}</span>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                onOpenPreview({
                  title,
                  content,
                  targetAudience,
                  isPinned,
                  allowComments,
                  attachments,
                })
              }
              className="text-xs gap-1.5 h-9 font-semibold"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="text-xs gap-2 h-9 font-bold px-5 shadow-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : scheduleMode === "Immediately" ? (
                <Send className="w-4 h-4" />
              ) : (
                <Calendar className="w-4 h-4" />
              )}
              {scheduleMode === "Immediately" ? "Post Now" : "Schedule Broadcast"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
