"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  X,
  BookOpen,
  Layers,
  Megaphone,
  ImageIcon,
  Sparkles,
  Loader2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface QuickCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TabType = "course" | "batch" | "announcement" | "media";

export function QuickCreateModal({ open, onOpenChange }: QuickCreateModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("course");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const courses = useQuery(api.admin.getAllCourses, open ? {} : "skip");
  const createCourse = useMutation(api.admin.createCourse);
  const createBatch = useMutation(api.admin.createBatch);
  const createAnnouncement = useMutation(api.admin.createAnnouncement);

  // Course Form State
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCategory, setCourseCategory] = useState("Full-Stack");
  const [coursePrice, setCoursePrice] = useState("24999");
  const [courseDescription, setCourseDescription] = useState("");

  // Batch Form State
  const [batchTitle, setBatchTitle] = useState("");
  const [batchCourseId, setBatchCourseId] = useState("");
  const [batchStartDate, setBatchStartDate] = useState("");
  const [batchCapacity, setBatchCapacity] = useState("30");
  const [batchWhatsapp, setBatchWhatsapp] = useState("");

  // Announcement Form State
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");

  if (!open) return null;

  const handleClose = () => {
    setSuccessMsg("");
    onOpenChange(false);
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;
    setLoading(true);
    try {
      const slug = courseTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      await createCourse({
        title: courseTitle,
        slug: slug || `course-${Date.now()}`,
        category: courseCategory,
        description: courseDescription || "Advanced curriculum for modern builders.",
        price: Number(coursePrice) || 19999,
        coverImageId: "placeholder",
        coverImageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop",
        instructorName: "Sarah Connor",
        instructorRole: "Lead Engineering Instructor",
        instructorBio: "Staff Engineer with 12+ years building distributed systems.",
        syllabus: ["Module 1: Foundations", "Module 2: Advanced Patterns", "Module 3: Production Deployments"],
      });

      setSuccessMsg(`Course "${courseTitle}" created as draft!`);
      setTimeout(() => {
        handleClose();
        router.push("/admin/courses");
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchTitle.trim() || !batchCourseId) return;
    setLoading(true);
    try {
      const startMs = batchStartDate ? new Date(batchStartDate).getTime() : Date.now() + 86400000 * 7;
      const endMs = startMs + 86400000 * 60; // 60 days duration default

      await createBatch({
        courseId: batchCourseId as any,
        title: batchTitle,
        startDate: startMs,
        endDate: endMs,
        capacity: Number(batchCapacity) || 30,
        whatsappLink: batchWhatsapp.trim() || "https://chat.whatsapp.com/invite-placeholder",
      });

      setSuccessMsg(`Cohort "${batchTitle}" created successfully!`);
      setTimeout(() => {
        handleClose();
        router.push("/admin/batches");
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    setLoading(true);
    try {
      await createAnnouncement({
        title: annTitle,
        content: annContent,
        batchId: undefined, // Platform wide announcement
      });

      setSuccessMsg("Global announcement published instantly!");
      setTimeout(() => {
        handleClose();
        router.push("/admin/announcements");
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-background">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-text-primary">
                Quick Create Command
              </h2>
              <p className="text-xs text-text-muted">
                Spawn platform cohorts, courses, and announcements instantly.
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-border bg-surface px-6 pt-2">
          {[
            { id: "course", label: "New Course", icon: BookOpen },
            { id: "batch", label: "New Cohort Batch", icon: Layers },
            { id: "announcement", label: "Announcement", icon: Megaphone },
            { id: "media", label: "Upload Media", icon: ImageIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSuccessMsg("");
                  setActiveTab(tab.id as TabType);
                }}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-semibold transition-all ${
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {successMsg ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-500 mb-3 animate-bounce" />
              <h3 className="text-lg font-bold text-text-primary">{successMsg}</h3>
              <p className="text-sm text-text-muted mt-1">Redirecting to workspace...</p>
            </div>
          ) : (
            <>
              {activeTab === "course" && (
                <form onSubmit={handleCreateCourse} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-text-secondary mb-1">
                      Course Title *
                    </label>
                    <Input
                      placeholder="e.g. Next.js 16 & Convex Advanced System Architecture"
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-text-secondary mb-1">
                        Category
                      </label>
                      <select
                        value={courseCategory}
                        onChange={(e) => setCourseCategory(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="Full-Stack">Full-Stack Engineering</option>
                        <option value="System Design">System Design</option>
                        <option value="AI Engineering">AI & LLM Engineering</option>
                        <option value="Product UX">Product UX & Motion</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-text-secondary mb-1">
                        Price (₹ INR)
                      </label>
                      <Input
                        type="number"
                        value={coursePrice}
                        onChange={(e) => setCoursePrice(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-text-secondary mb-1">
                      Short Overview / Subheadline
                    </label>
                    <textarea
                      rows={3}
                      placeholder="High-impact technical description of the course..."
                      value={courseDescription}
                      onChange={(e) => setCourseDescription(e.target.value)}
                      className="w-full p-3 rounded-lg border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="pt-2 flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Create Course Draft
                    </Button>
                  </div>
                </form>
              )}

              {activeTab === "batch" && (
                <form onSubmit={handleCreateBatch} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-text-secondary mb-1">
                      Select Parent Course *
                    </label>
                    <select
                      value={batchCourseId}
                      onChange={(e) => setBatchCourseId(e.target.value)}
                      required
                      className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">-- Choose Course --</option>
                      {courses?.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title} (₹{c.price.toLocaleString("en-IN")})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-text-secondary mb-1">
                      Cohort Batch Name *
                    </label>
                    <Input
                      placeholder="e.g. October 2026 Elite Cohort (Batch 04)"
                      value={batchTitle}
                      onChange={(e) => setBatchTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-text-secondary mb-1">
                        Start Date
                      </label>
                      <Input
                        type="date"
                        value={batchStartDate}
                        onChange={(e) => setBatchStartDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-text-secondary mb-1">
                        Max Seat Capacity
                      </label>
                      <Input
                        type="number"
                        value={batchCapacity}
                        onChange={(e) => setBatchCapacity(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-text-secondary mb-1">
                      WhatsApp Community Group URL
                    </label>
                    <Input
                      placeholder="https://chat.whatsapp.com/..."
                      value={batchWhatsapp}
                      onChange={(e) => setBatchWhatsapp(e.target.value)}
                    />
                  </div>
                  <div className="pt-2 flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Spawn Cohort Batch
                    </Button>
                  </div>
                </form>
              )}

              {activeTab === "announcement" && (
                <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-text-secondary mb-1">
                      Announcement Title *
                    </label>
                    <Input
                      placeholder="e.g. System Upgraded: Live Recording Auto-Sync Now Available!"
                      value={annTitle}
                      onChange={(e) => setAnnTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-text-secondary mb-1">
                      Message Content *
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Type your message to all enrolled students..."
                      value={annContent}
                      onChange={(e) => setAnnContent(e.target.value)}
                      required
                      className="w-full p-3 rounded-lg border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="pt-2 flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Publish Announcement
                    </Button>
                  </div>
                </form>
              )}

              {activeTab === "media" && (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text-primary">
                      Central Asset & Media Library
                    </h3>
                    <p className="text-xs text-text-muted max-w-sm mt-1">
                      Upload course covers, study materials, and PDFs via our high-speed UploadThing asset pipeline.
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      handleClose();
                      router.push("/admin/media");
                    }}
                    className="gap-2"
                  >
                    Open Media Library
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
