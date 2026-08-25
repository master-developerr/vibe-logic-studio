"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Megaphone,
  Smartphone,
  Monitor,
  ExternalLink,
  MessageSquare,
  X,
  Paperclip,
} from "lucide-react";

interface BatchAnnouncementPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  targetAudience: string;
  isPinned: boolean;
  allowComments: boolean;
  authorName?: string;
  authorRole?: string;
  attachments?: Array<{
    type: string;
    title: string;
    url: string;
  }>;
  batchTitle?: string;
}

export function BatchAnnouncementPreviewModal({
  isOpen,
  onClose,
  title,
  content,
  targetAudience,
  isPinned,
  allowComments,
  authorName = "Alex D'Souza",
  authorRole = "Product Admin",
  attachments = [],
  batchTitle = "November Cohort",
}: BatchAnnouncementPreviewModalProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "whatsapp">("desktop");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-2xl rounded-3xl bg-surface border border-border shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-border bg-background/50 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-primary" />
                Student-Facing Announcement Preview
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Preview how this announcement will look in learners&apos; dashboards and mobile broadcast queues.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-background p-1 rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => setViewMode("desktop")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    viewMode === "desktop"
                      ? "bg-primary text-white shadow-sm"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Dashboard Feed</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("whatsapp")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    viewMode === "whatsapp"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>WhatsApp Mobile</span>
                </button>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 max-h-[75vh] overflow-y-auto">
            {/* View Mode: Learner Dashboard Feed */}
            {viewMode === "desktop" ? (
              <div className="p-6 rounded-2xl bg-background border border-border space-y-4 my-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">
                      {authorName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-text-primary">
                          {authorName}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] text-text-muted">
                          {authorRole}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-muted">
                        {batchTitle} • Just now
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isPinned && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold uppercase tracking-wider">
                        Pinned to Top
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                      {targetAudience}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-base text-text-primary">
                    {title || "Untitled Announcement Headline"}
                  </h3>
                  <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                    {content || "No announcement content provided yet."}
                  </div>
                </div>

                {/* Attachments */}
                {attachments.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-border/60">
                    <p className="text-[11px] font-semibold uppercase text-text-muted tracking-wider">
                      Attached Study Resources ({attachments.length})
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {attachments.map((att, index) => (
                        <a
                          key={index}
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-surface border border-border hover:border-primary/40 flex items-center justify-between text-xs transition-all group"
                        >
                          <div className="flex items-center gap-2">
                            <Paperclip className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="font-semibold text-text-primary group-hover:text-primary transition-colors">
                              {att.title}
                            </span>
                            <span className="px-1.5 py-0.2 rounded bg-background text-[10px] text-text-muted uppercase">
                              {att.type}
                            </span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-text-muted group-hover:text-primary transition-colors" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Comments Bar */}
                {allowComments && (
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-text-muted">
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-primary" />
                      <span>Student comments & Q&A enabled</span>
                    </div>
                    <span>0 comments</span>
                  </div>
                )}
              </div>
            ) : (
              /* View Mode: WhatsApp Business Mobile Broadcast */
              <div className="p-6 rounded-2xl bg-[#ECE5DD] dark:bg-[#0b141a] border border-border my-2 flex justify-center">
                <div className="w-[340px] rounded-2xl bg-[#DCF8C6] dark:bg-[#005c4b] p-4 shadow-sm text-xs space-y-2 text-slate-900 dark:text-white">
                  <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-1.5">
                    <span className="font-bold text-[11px] text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
                      VibeLogic Studio • {batchTitle}
                    </span>
                    <span className="text-[10px] opacity-70">10:45 AM</span>
                  </div>
                  <p className="font-bold text-sm">
                    📢 {title || "Untitled Announcement Headline"}
                  </p>
                  <p className="text-xs leading-relaxed whitespace-pre-line opacity-90">
                    {content || "No announcement message provided yet."}
                  </p>
                  {attachments.length > 0 && (
                    <div className="pt-2 border-t border-black/10 dark:border-white/10 space-y-1">
                      <p className="text-[10px] font-bold uppercase opacity-80">
                        Attached Links:
                      </p>
                      {attachments.map((att, idx) => (
                        <div key={idx} className="text-blue-600 dark:text-blue-300 underline truncate text-[11px]">
                          🔗 {att.title}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="text-[10px] text-right opacity-60 pt-1">
                    ✓✓ Read by {targetAudience}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-border bg-background/50 flex justify-end">
            <Button onClick={onClose} className="w-full sm:w-auto text-xs font-semibold">
              Close Preview
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
