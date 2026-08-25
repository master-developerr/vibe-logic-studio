"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Upload,
  BookOpen,
  DollarSign,
  User,
  Layers,
  FileText,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export interface CourseEditItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  price: number;
  coverImageId: string;
  coverImageUrl: string;
  instructorName: string;
  instructorRole: string;
  instructorBio: string;
  syllabus: string[];
  difficulty: string;
  duration: string;
  status: string;
  isActive: boolean;
}

interface CourseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  courseToEdit?: CourseEditItem | null;
  onSave: (values: {
    title: string;
    slug: string;
    category: string;
    difficulty: string;
    duration: string;
    status: string;
    price: number;
    description: string;
    instructorName: string;
    instructorRole: string;
    instructorBio: string;
    syllabus: string[];
    coverImageId: string;
    coverImageUrl: string;
  }) => Promise<void>;
  isSaving?: boolean;
}

export function CourseDrawer({
  isOpen,
  onClose,
  courseToEdit,
  onSave,
  isSaving = false,
}: CourseDrawerProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [category, setCategory] = useState("Full-Stack Engineering");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [duration, setDuration] = useState("4 Weeks");
  const [status, setStatus] = useState("Draft");
  const [price, setPrice] = useState("24999");
  const [description, setDescription] = useState("");
  const [instructorName, setInstructorName] = useState("Alex D'Souza");
  const [instructorRole, setInstructorRole] = useState("AI Engineering Lead");
  const [instructorBio, setInstructorBio] = useState("");
  const [syllabusText, setSyllabusText] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverImageId, setCoverImageId] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Sync state when drawer opens or courseToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (courseToEdit) {
        setTitle(courseToEdit.title || "");
        setSlug(courseToEdit.slug || "");
        setSlugEdited(true);
        setCategory(courseToEdit.category || "Full-Stack Engineering");
        setDifficulty(courseToEdit.difficulty || "Intermediate");
        setDuration(courseToEdit.duration || "4 Weeks");
        setStatus(courseToEdit.status || (courseToEdit.isActive ? "Published" : "Draft"));
        setPrice(String(courseToEdit.price ?? 24999));
        setDescription(courseToEdit.description || "");
        setInstructorName(courseToEdit.instructorName || "Alex D'Souza");
        setInstructorRole(courseToEdit.instructorRole || "AI Engineering Lead");
        setInstructorBio(courseToEdit.instructorBio || "");
        setSyllabusText((courseToEdit.syllabus || []).join("\n"));
        setCoverImageUrl(courseToEdit.coverImageUrl || "");
        setCoverImageId(courseToEdit.coverImageId || "");
      } else {
        // Default new course values
        setTitle("");
        setSlug("");
        setSlugEdited(false);
        setCategory("Full-Stack Engineering");
        setDifficulty("Intermediate");
        setDuration("4 Weeks");
        setStatus("Draft");
        setPrice("24999");
        setDescription("");
        setInstructorName("Alex D'Souza");
        setInstructorRole("AI Engineering Lead");
        setInstructorBio("Senior Systems Engineer & Tech Lead.");
        setSyllabusText(
          "Module 1: Foundations & Architecture\nModule 2: Core Implementation\nModule 3: Advanced Patterns & Scalability\nModule 4: Production & Deployment"
        );
        setCoverImageUrl("");
        setCoverImageId("");
      }
      setError(null);
    }
  }, [isOpen, courseToEdit]);

  // Auto-generate slug from title if user hasn't manually edited slug
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugEdited) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      setSlug(generated);
    }
  };

  const handleSlugChange = (val: string) => {
    setSlugEdited(true);
    setSlug(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Course title is required.");
      return;
    }
    if (!slug.trim()) {
      setError("URL slug is required.");
      return;
    }
    if (!coverImageUrl) {
      setError("Please upload a cover image.");
      return;
    }
    setError(null);

    const syllabusArray = syllabusText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      await onSave({
        title: title.trim(),
        slug: slug.trim(),
        category,
        difficulty,
        duration: duration.trim() || "4 Weeks",
        status,
        price: Number(price) || 0,
        description: description.trim(),
        instructorName: instructorName.trim(),
        instructorRole: instructorRole.trim(),
        instructorBio: instructorBio.trim(),
        syllabus: syllabusArray,
        coverImageId,
        coverImageUrl,
      });
    } catch (err: any) {
      setError(err?.message || "Failed to save course.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 32 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-xl bg-surface border-l border-border flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary">
                    {courseToEdit ? "Edit Course Catalog Item" : "Create New Course"}
                  </h3>
                  <p className="text-xs text-text-muted">
                    {courseToEdit
                      ? `Updating details for "${courseToEdit.title}"`
                      : "Add a new curriculum course to VibeLogic Studio"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface border border-transparent hover:border-border transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {error && (
                <div className="p-3.5 bg-error/10 border border-error/30 rounded-xl flex items-center gap-2.5 text-error text-xs font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Cover Image Section */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Course Thumbnail & Cover Image *
                </label>
                {coverImageUrl ? (
                  <div className="relative group rounded-2xl overflow-hidden border border-border bg-background h-44">
                    <img
                      src={coverImageUrl}
                      alt="Course cover"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setCoverImageUrl("");
                          setCoverImageId("");
                        }}
                        className="px-4 py-2 bg-error text-white text-xs font-semibold rounded-lg hover:bg-error/90 transition-colors flex items-center gap-1.5 shadow-lg"
                      >
                        <X className="w-3.5 h-3.5" />
                        Remove / Replace
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border hover:border-primary/50 rounded-2xl p-6 bg-background/50 transition-colors flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-text-primary mb-1">
                      Upload Course Thumbnail
                    </p>
                    <p className="text-xs text-text-muted mb-4">
                      Recommended: 1280x720 (16:9 ratio). Max 4MB.
                    </p>
                    <UploadButton<OurFileRouter, "courseMediaUploader">
                      endpoint="courseMediaUploader"
                      onClientUploadComplete={(res) => {
                        if (res?.[0]) {
                          setCoverImageUrl(res[0].ufsUrl || res[0].url);
                          setCoverImageId(res[0].key);
                        }
                      }}
                      onUploadError={(e) => setError(e.message)}
                      appearance={{
                        button:
                          "bg-primary text-white hover:bg-primary/90 text-xs font-semibold rounded-xl px-4 py-2.5 transition-all shadow-sm",
                        allowedContent: "hidden",
                      }}
                      content={{
                        button: ({ ready }) =>
                          ready ? (
                            <>
                              <Upload className="w-4 h-4 inline mr-2" />
                              Select Image File
                            </>
                          ) : (
                            "Preparing upload..."
                          ),
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Basic Info Group */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. AI & LLM Systems Engineering Masterclass"
                    className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      placeholder="ai-llm-masterclass"
                      className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="Full-Stack Engineering">Full-Stack Engineering</option>
                      <option value="System Design">System Design</option>
                      <option value="AI & LLM Engineering">AI & LLM Engineering</option>
                      <option value="Product UX & Motion">Product UX & Motion</option>
                      <option value="Cloud & DevOps">Cloud & DevOps</option>
                      <option value="Data & Analytics">Data & Analytics</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                      Difficulty Level
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-border bg-background text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="4 Weeks"
                      className="w-full h-11 px-3.5 rounded-xl border border-border bg-background text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-border bg-background text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                      <option value="Upcoming">Upcoming</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    Tuition Price (₹ INR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm font-semibold">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="24999"
                      className="w-full h-11 pl-8 pr-3.5 rounded-xl border border-border bg-background text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                  Course Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive breakdown of what students will master..."
                  className="w-full p-3.5 rounded-xl border border-border bg-background text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>

              {/* Instructor Information */}
              <div className="p-4 bg-background/50 border border-border rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-text-primary uppercase tracking-wider">
                  <User className="w-4 h-4 text-primary" />
                  <span>Instructor Information</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      Instructor Name
                    </label>
                    <input
                      type="text"
                      required
                      value={instructorName}
                      onChange={(e) => setInstructorName(e.target.value)}
                      placeholder="Alex D'Souza"
                      className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      Instructor Title / Role
                    </label>
                    <input
                      type="text"
                      value={instructorRole}
                      onChange={(e) => setInstructorRole(e.target.value)}
                      placeholder="AI Engineering Lead"
                      className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Short Instructor Bio
                  </label>
                  <input
                    type="text"
                    value={instructorBio}
                    onChange={(e) => setInstructorBio(e.target.value)}
                    placeholder="Short bio shown on catalog cards and detail pages..."
                    className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              {/* Syllabus */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                  Curriculum Syllabus (One line per module) *
                </label>
                <textarea
                  required
                  rows={5}
                  value={syllabusText}
                  onChange={(e) => setSyllabusText(e.target.value)}
                  placeholder={"Module 1: Introduction\nModule 2: Core Components\nModule 3: Scalability"}
                  className="w-full p-3.5 rounded-xl border border-border bg-background text-sm font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none leading-relaxed"
                />
              </div>

              {/* Drawer Footer Actions */}
              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl border border-border text-text-secondary hover:text-text-primary hover:bg-background text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !title || !slug || !coverImageUrl}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 text-sm font-semibold transition-all shadow-md hover:shadow-primary/20 active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : courseToEdit ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Update Course
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Create Course
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
