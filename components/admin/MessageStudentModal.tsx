"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Mail, MessageSquare, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

type MessageStudentModalProps = {
  open: boolean;
  onClose: () => void;
  studentName: string;
};

const CHANNELS = [
  { id: "email", label: "Email", icon: Mail },
  { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
  { id: "notification", label: "In-App Notification", icon: Bell },
];

export function MessageStudentModal({ open, onClose, studentName }: MessageStudentModalProps) {
  const [selectedChannel, setSelectedChannel] = useState("email");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setSubmitting(true);
    // Mocking send functionality
    setTimeout(() => {
      setSubmitting(false);
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-surface rounded-2xl shadow-xl border border-border w-full max-w-lg overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-background/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold text-text-primary">Message Student</h2>
                  <p className="text-[12px] text-text-muted mt-0.5">Send a message to {studentName}</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:bg-background transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-6">
              
              {/* Channel */}
              <div className="space-y-3">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Channel</label>
                <div className="flex items-center gap-3">
                  {CHANNELS.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelectedChannel(id)}
                      className={cn(
                        "flex-1 h-10 rounded-xl border flex items-center justify-center gap-2 text-[12px] font-semibold transition-all",
                        selectedChannel === id
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-background text-text-secondary border-border hover:border-primary/30 hover:text-text-primary"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject (Email Only) */}
              {selectedChannel === "email" && (
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Action Required: Missing Assignment"
                    className="w-full h-10 px-3 bg-background border border-border rounded-xl text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
                  />
                </div>
              )}

              {/* Message */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full h-32 px-3 py-3 bg-background border border-border rounded-xl text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
                />
              </div>

            </form>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-background/50">
              <button type="button" onClick={onClose} className="h-9 px-4 rounded-full text-[13px] font-semibold text-text-secondary hover:bg-background border border-border transition-all">
                Cancel
              </button>
              <button
                onClick={onSubmit}
                disabled={submitting || !message.trim()}
                className="h-9 px-5 bg-primary text-white rounded-full text-[13px] font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {submitting ? "Sending..." : "Send Message"}
                <Send className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
