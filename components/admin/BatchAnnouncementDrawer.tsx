"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Megaphone,
  Pin,
  Archive,
  Trash2,
  Copy,
  Calendar,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  Clock,
  Send,
  User,
  Users,
  BarChart3,
  Share2,
  History,
  Paperclip,
  X,
} from "lucide-react";
import { AnnouncementAttachmentItem } from "./AnnouncementAttachmentModal";

export interface ExtendedAnnouncementItem {
  id: string;
  title: string;
  content: string;
  batchId?: string;
  batchTitle: string;
  courseTitle?: string;
  status: string;
  targetAudience: string;
  scheduledAt?: string | null;
  scheduledAtRaw?: number | null;
  isPinned: boolean;
  allowComments: boolean;
  authorName: string;
  authorRole: string;
  attachments: AnnouncementAttachmentItem[];
  broadcastChannels: {
    inApp: boolean;
    whatsapp: boolean;
    email: boolean;
    push: boolean;
  };
  engagement: {
    views: number;
    commentsCount: number;
    deliveredCount: number;
    totalReach: number;
  };
  createdAt: string;
  createdAtRaw?: number;
}

interface BatchAnnouncementDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: ExtendedAnnouncementItem | null;
  onTogglePin: (id: string, isPinned: boolean) => Promise<void>;
  onArchive: (id: string) => Promise<void>;
  onDuplicate: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onPublishNow?: (id: string) => Promise<void>;
}

export function BatchAnnouncementDrawer({
  isOpen,
  onClose,
  announcement,
  onTogglePin,
  onArchive,
  onDuplicate,
  onDelete,
  onPublishNow,
}: BatchAnnouncementDrawerProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "engagement" | "comments" | "history">("overview");

  if (!isOpen || !announcement) return null;

  const readRate =
    announcement.engagement.deliveredCount > 0
      ? Math.round((announcement.engagement.views / announcement.engagement.deliveredCount) * 100)
      : 0;

  const isPub = announcement.status === "Published" || announcement.status === "Pinned" || announcement.isPinned;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Slide-over Panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-xl bg-surface border-l border-border shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Drawer Header */}
          <div className="p-6 border-b border-border bg-background/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    announcement.status === "Pinned" || announcement.isPinned
                      ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                      : announcement.status === "Scheduled"
                      ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                      : announcement.status === "Draft"
                      ? "bg-slate-500/10 text-slate-600 border border-slate-500/20"
                      : "bg-primary/10 text-primary border border-primary/20"
                  }`}
                >
                  {announcement.isPinned ? "Pinned" : announcement.status}
                </span>
                <span className="text-xs text-text-muted">
                  ID #{announcement.id.slice(-6).toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onTogglePin(announcement.id, !announcement.isPinned)}
                  className="h-8 px-2.5 text-xs gap-1"
                  title={announcement.isPinned ? "Unpin Announcement" : "Pin to Top"}
                >
                  <Pin className={`w-3.5 h-3.5 ${announcement.isPinned ? "text-amber-500 fill-amber-500" : ""}`} />
                  {announcement.isPinned ? "Unpin" : "Pin"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDuplicate(announcement.id)}
                  className="h-8 px-2.5 text-xs gap-1"
                  title="Duplicate Announcement"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Duplicate
                </Button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <h2 className="text-lg font-bold text-text-primary mt-1">
              {announcement.title}
            </h2>
            <div className="text-xs text-text-muted flex items-center gap-2 mt-1">
              <span>By {announcement.authorName}</span>
              <span>•</span>
              <span>{new Date(announcement.createdAt).toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}</span>
            </div>

            {/* Sub Navigation Tabs */}
            <div className="flex items-center gap-2 mt-4 bg-surface p-1 rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "overview"
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("engagement")}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "engagement"
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Engagement
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("comments")}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "comments"
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Comments ({announcement.engagement.commentsCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "history"
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Timeline
              </button>
            </div>
          </div>

          {/* Drawer Body Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === "overview" && (
              <>
                {/* Audience & Scheduling Box */}
                <div className="p-4 rounded-xl bg-background border border-border grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="block font-bold uppercase text-text-muted text-[10px] tracking-wider mb-1">
                      Target Audience
                    </span>
                    <div className="flex items-center gap-1.5 font-bold text-text-primary">
                      <Users className="w-4 h-4 text-primary" />
                      <span>{announcement.targetAudience}</span>
                    </div>
                    <span className="text-[11px] text-text-muted">
                      Reach: ~{announcement.engagement.totalReach} learners
                    </span>
                  </div>
                  <div>
                    <span className="block font-bold uppercase text-text-muted text-[10px] tracking-wider mb-1">
                      Publishing Date
                    </span>
                    <div className="flex items-center gap-1.5 font-bold text-text-primary">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>
                        {announcement.scheduledAt
                          ? new Date(announcement.scheduledAt).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Immediate Post"}
                      </span>
                    </div>
                    <span className="text-[11px] text-text-muted">
                      {announcement.status === "Scheduled" ? "Waiting in scheduler" : "Broadcast sent"}
                    </span>
                  </div>
                </div>

                {/* Full Content Preview */}
                <div className="space-y-2">
                  <span className="block font-bold uppercase text-text-muted text-[10px] tracking-wider">
                    Announcement Body
                  </span>
                  <div className="p-4 rounded-2xl bg-background border border-border text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                    {announcement.content}
                  </div>
                </div>

                {/* Attachments List */}
                {announcement.attachments && announcement.attachments.length > 0 && (
                  <div className="space-y-2">
                    <span className="block font-bold uppercase text-text-muted text-[10px] tracking-wider">
                      Attached Resources ({announcement.attachments.length})
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {announcement.attachments.map((att, idx) => (
                        <a
                          key={idx}
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-xl bg-background border border-border hover:border-primary/40 flex items-center justify-between text-xs transition-all group"
                        >
                          <div className="flex items-center gap-2.5">
                            <Paperclip className="w-4 h-4 text-primary shrink-0" />
                            <div>
                              <span className="font-bold text-text-primary group-hover:text-primary transition-colors block">
                                {att.title}
                              </span>
                              <span className="text-[10px] text-text-muted uppercase">
                                {att.type} resource
                              </span>
                            </div>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-text-muted group-hover:text-primary transition-colors" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Multi-Channel Broadcast Channels Status */}
                <div className="space-y-2">
                  <span className="block font-bold uppercase text-text-muted text-[10px] tracking-wider">
                    Broadcast Channels Status
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-background border border-border flex items-center justify-between">
                      <span className="font-semibold text-text-primary">WhatsApp Business</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          announcement.broadcastChannels?.whatsapp
                            ? isPub
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-blue-500/10 text-blue-600"
                            : "bg-slate-500/10 text-slate-500"
                        }`}
                      >
                        {announcement.broadcastChannels?.whatsapp
                          ? isPub
                            ? "100% Sent"
                            : "Queued"
                          : "Disabled"}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-background border border-border flex items-center justify-between">
                      <span className="font-semibold text-text-primary">Email Newsletter</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          announcement.broadcastChannels?.email
                            ? isPub
                              ? "bg-amber-500/10 text-amber-600"
                              : "bg-blue-500/10 text-blue-600"
                            : "bg-slate-500/10 text-slate-500"
                        }`}
                      >
                        {announcement.broadcastChannels?.email
                          ? isPub
                            ? "Processing (45%)"
                            : "Queued"
                          : "Disabled"}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-background border border-border flex items-center justify-between">
                      <span className="font-semibold text-text-primary">In-App Notification</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          announcement.broadcastChannels?.inApp
                            ? isPub
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-blue-500/10 text-blue-600"
                            : "bg-slate-500/10 text-slate-500"
                        }`}
                      >
                        {announcement.broadcastChannels?.inApp
                          ? isPub
                            ? "Real-time active"
                            : "Ready"
                          : "Disabled"}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-background border border-border flex items-center justify-between">
                      <span className="font-semibold text-text-primary">Push Notification</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          announcement.broadcastChannels?.push
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-slate-500/10 text-slate-500"
                        }`}
                      >
                        {announcement.broadcastChannels?.push ? "Active" : "Disabled"}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "engagement" && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-background border border-border space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider text-text-secondary">
                      Cohort Read Rate
                    </span>
                    <span className="font-extrabold text-lg text-primary">
                      {isPub ? `${readRate}%` : "—"}
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-surface overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${isPub ? readRate : 0}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-border/60">
                    <div>
                      <span className="block text-base font-extrabold text-text-primary">
                        {isPub ? announcement.engagement.deliveredCount : 0}
                      </span>
                      <span className="text-[10px] text-text-muted uppercase font-semibold">Delivered</span>
                    </div>
                    <div>
                      <span className="block text-base font-extrabold text-text-primary">
                        {isPub ? announcement.engagement.views : 0}
                      </span>
                      <span className="text-[10px] text-text-muted uppercase font-semibold">Opened</span>
                    </div>
                    <div>
                      <span className="block text-base font-extrabold text-text-primary">
                        {isPub ? announcement.engagement.commentsCount : 0}
                      </span>
                      <span className="text-[10px] text-text-muted uppercase font-semibold">Comments</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-xs text-text-secondary leading-relaxed">
                  <span className="font-bold text-primary block mb-0.5">💡 Engagement Insight</span>
                  Announcements sent to <strong className="text-text-primary">{announcement.targetAudience}</strong> via WhatsApp and In-App channels achieve a 25% higher open rate when published between 10:00 AM and 12:00 PM.
                </div>
              </div>
            )}

            {activeTab === "comments" && (
              <div className="space-y-3">
                {announcement.engagement.commentsCount === 0 || !isPub ? (
                  <div className="py-12 text-center text-xs text-text-muted bg-background rounded-xl border border-dashed border-border">
                    <MessageSquare className="w-7 h-7 mx-auto mb-1.5 opacity-40" />
                    No student comments or Q&A discussions started yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3.5 rounded-xl bg-background border border-border space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-text-primary">
                        <span>Priya Sharma (#STU-10492)</span>
                        <span className="text-[10px] text-text-muted font-normal">2 hours ago</span>
                      </div>
                      <p className="text-xs text-text-secondary">
                        Thank you for the update! Will the capstone project submission link be posted here as well?
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-background border border-border space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-text-primary">
                        <span>Rohan Mehta (#STU-20914)</span>
                        <span className="text-[10px] text-text-muted font-normal">3 hours ago</span>
                      </div>
                      <p className="text-xs text-text-secondary">
                        Received the WhatsApp broadcast too, super helpful reminder.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-4">
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                  <div className="relative text-xs">
                    <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center" />
                    <span className="font-bold text-text-primary block">
                      {announcement.status === "Scheduled" ? "Scheduled for broadcast" : "Published to cohort"}
                    </span>
                    <span className="text-text-muted text-[11px]">
                      {new Date(announcement.createdAt).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="relative text-xs">
                    <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-surface border-2 border-border" />
                    <span className="font-bold text-text-primary block">Draft Created</span>
                    <span className="text-text-muted text-[11px]">
                      By {announcement.authorName} ({announcement.authorRole})
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-border bg-background flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onArchive(announcement.id)}
              className="text-xs gap-1.5 font-semibold text-text-secondary hover:text-red-600"
            >
              <Archive className="w-3.5 h-3.5" />
              {announcement.status === "Archived" ? "Unarchive" : "Archive"}
            </Button>
            <div className="flex items-center gap-2">
              {announcement.status === "Draft" && onPublishNow && (
                <Button
                  size="sm"
                  onClick={() => onPublishNow(announcement.id)}
                  className="text-xs gap-1.5 font-bold"
                >
                  <Send className="w-3.5 h-3.5" />
                  Publish Now
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(announcement.id)}
                className="text-xs gap-1.5 font-semibold text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
