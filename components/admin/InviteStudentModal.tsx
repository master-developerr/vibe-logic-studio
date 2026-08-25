"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  UserPlus,
  Mail,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Shield,
  Info,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface InviteStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchId: string;
  courseId: string;
  batchTitle?: string;
  onSuccess?: () => void;
}

export function InviteStudentModal({
  isOpen,
  onClose,
  batchId,
  courseId,
  batchTitle = "Cohort Batch",
  onSuccess,
}: InviteStudentModalProps) {
  const manualEnroll = useMutation(api.admin.manualEnrollStudent);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid student email address.");
      return;
    }

    setLoading(true);
    try {
      await manualEnroll({
        studentEmail: email.trim(),
        courseId: courseId as any,
        batchId: batchId as any,
      });
      setSuccessMsg(`Successfully enrolled ${email} into ${batchTitle}!`);
      setEmail("");
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 1800);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to enroll student into cohort.");
    } finally {
      setLoading(false);
    }
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
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-md rounded-3xl bg-surface border border-border shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-border bg-background/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold tracking-tight text-text-primary">
                  Invite Student to Cohort
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Direct enrollment into {batchTitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-border/50 text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/15 text-xs text-text-muted flex items-start gap-2.5">
              <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>
                The learner must already have a VibeLogic Studio account registered with this email address. They will gain immediate access to all live classes and study materials.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                Student Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. learner@vibelogic.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-border hover:bg-background text-text-primary text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Enrolling...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    Enroll into Batch
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
