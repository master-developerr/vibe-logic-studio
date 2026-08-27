"use client";

import React, { useState, useMemo, use } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  Users,
  Eye,
  MessageSquare,
  Pin,
  Archive,
  Trash2,
  Copy,
  Calendar,
  Clock,
  Send,
  Share2,
  Paperclip,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Smartphone,
  Mail,
  Bell,
  Sparkles,
  FileText,
  ExternalLink,
  Save,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BatchAnnouncementComposer } from "@/components/admin/BatchAnnouncementComposer";
import { BatchAnnouncementDrawer, ExtendedAnnouncementItem } from "@/components/admin/BatchAnnouncementDrawer";
import { BatchAnnouncementPreviewModal } from "@/components/admin/BatchAnnouncementPreviewModal";
import {
  AnnouncementAttachmentModal,
  AnnouncementAttachmentItem,
} from "@/components/admin/AnnouncementAttachmentModal";

export default function BatchAnnouncementsPage({
  params,
}: {
  params: Promise<{ batchId: string }> | { batchId: string };
}) {
  // Unconditionally unwrap params
  const resolvedParams = "then" in params ? use(params) : params;
  const batchId = resolvedParams.batchId;

  // State Declarations - ALL TOP LEVEL
  const [showComposer, setShowComposer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [audienceFilter, setAudienceFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "readRate">("newest");

  // Modals & Drawers state
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<ExtendedAnnouncementItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<{
    title: string;
    content: string;
    targetAudience: string;
    isPinned: boolean;
    allowComments: boolean;
    attachments: AnnouncementAttachmentItem[];
  }>({
    title: "",
    content: "",
    targetAudience: "Entire Batch",
    isPinned: false,
    allowComments: true,
    attachments: [],
  });
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  const [composerAttachments, setComposerAttachments] = useState<AnnouncementAttachmentItem[]>([]);

  // Convex Queries
  const batches = useQuery(api.admin.getAllBatches) || [];
  const activeBatch = batches.find((b: any) => b._id === batchId);
  const batchTitle = activeBatch?.title || "Cohort Workspace";
  const courseTitle = activeBatch?.courseTitle || "VibeLogic Studio";

  const workspace = useQuery(api.admin.getBatchAnnouncementsExtended, {
    batchId: batchId as any,
  });

  const rawAnnouncements = workspace?.announcements || [];
  const serverAudienceCounts = workspace?.audienceCounts;

  // Convex Mutations
  const createAnnMut = useMutation(api.admin.createBatchAnnouncementExtended);
  const updateAnnMut = useMutation(api.admin.updateBatchAnnouncementExtended);
  const deleteAnnMut = useMutation(api.admin.deleteBatchAnnouncementExtended);

  const announcementsList: ExtendedAnnouncementItem[] = useMemo(() => {
    if (rawAnnouncements && rawAnnouncements.length > 0) {
      return rawAnnouncements.map((item: any) => ({
        id: item.id || item._id,
        title: item.title || "Untitled Announcement",
        content: item.content || "",
        batchId: item.batchId,
        batchTitle: item.batchTitle || batchTitle,
        courseTitle: item.courseTitle || courseTitle,
        status: item.status || "Published",
        targetAudience: item.targetAudience || "Entire Batch",
        scheduledAt: item.scheduledAt ? new Date(item.scheduledAt).toISOString() : null,
        scheduledAtRaw: item.scheduledAt || null,
        isPinned: !!item.isPinned,
        allowComments: item.allowComments !== false,
        authorName: item.authorName || "Admin",
        authorRole: item.authorRole || "Product Admin",
        attachments: item.attachments || [],
        broadcastChannels: item.broadcastChannels || {
          inApp: true,
          whatsapp: !!activeBatch?.whatsappLink,
          email: false,
          push: false,
        },
        engagement: item.engagement || {
          views: 0,
          commentsCount: 0,
          deliveredCount: 0,
          totalReach: 0,
        },
        createdAt: item.createdAt || new Date().toISOString(),
        createdAtRaw: item.createdAtRaw || Date.now(),
      }));
    }
    return [];
  }, [rawAnnouncements, batchTitle, courseTitle, activeBatch]);

  // Real Audience counts from Convex backend
  const audienceCounts: Record<string, number> = useMemo(
    () =>
      serverAudienceCounts || {
        "Entire Batch": workspace?.batch?.enrolledCount || 0,
        "Specific Students": workspace?.batch?.enrolledCount || 0,
        "Students with Pending Payments": 0,
        "Students with Low Attendance": 0,
        "Students Missing Assignments": 0,
        "Instructors": 1,
      },
    [serverAudienceCounts, workspace]
  );

  // Real Database Metrics
  const totalCount = announcementsList.length;
  const draftCount = announcementsList.filter((a) => a.status === "Draft").length;
  const scheduledCount = announcementsList.filter((a) => a.status === "Scheduled").length;
  const publishedCount = announcementsList.filter(
    (a) => a.status === "Published" || a.status === "Pinned" || a.isPinned
  ).length;
  const pinnedCount = announcementsList.filter((a) => a.isPinned || a.status === "Pinned").length;

  // Filtered & Sorted Announcements
  const filteredAnnouncements = useMemo(() => {
    let list = [...announcementsList];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q) ||
          a.authorName.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "ALL") {
      if (statusFilter === "Pinned") {
        list = list.filter((a) => a.isPinned || a.status === "Pinned");
      } else {
        list = list.filter((a) => a.status === statusFilter);
      }
    }

    if (audienceFilter !== "ALL") {
      list = list.filter((a) => a.targetAudience === audienceFilter);
    }

    list.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        const rateA = a.engagement.deliveredCount > 0 ? a.engagement.views / a.engagement.deliveredCount : 0;
        const rateB = b.engagement.deliveredCount > 0 ? b.engagement.views / b.engagement.deliveredCount : 0;
        return rateB - rateA;
      }
    });

    return list;
  }, [announcementsList, searchQuery, statusFilter, audienceFilter, sortBy]);

  // Handler functions with Convex mutations
  const handlePublishAnnouncement = async (data: {
    title: string;
    content: string;
    status: string;
    targetAudience: string;
    scheduledAt?: number;
    isPinned: boolean;
    allowComments: boolean;
    attachments: AnnouncementAttachmentItem[];
  }) => {
    try {
      await createAnnMut({
        batchId: batchId as any,
        title: data.title,
        content: data.content,
        status: data.status,
        targetAudience: data.targetAudience,
        scheduledAt: data.scheduledAt,
        isPinned: data.isPinned,
        allowComments: data.allowComments,
        attachments: data.attachments,
      });
      setShowComposer(false);
      setComposerAttachments([]);
    } catch (err) {
      console.error("Failed to publish announcement:", err);
      alert("Failed to save announcement. Please check server permissions.");
    }
  };

  const handleTogglePin = async (id: string, newPinState: boolean) => {
    try {
      await updateAnnMut({
        id: id as any,
        isPinned: newPinState,
        status: newPinState ? "Pinned" : "Published",
      });
    } catch (err) {
      console.error("Failed to toggle pin:", err);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await updateAnnMut({
        id: id as any,
        status: "Archived",
      });
      if (selectedAnnouncement?.id === id) {
        setIsDrawerOpen(false);
      }
    } catch (err) {
      console.error("Failed to archive:", err);
    }
  };

  const handleDuplicate = async (id: string) => {
    const orig = announcementsList.find((a) => a.id === id);
    if (!orig) return;
    try {
      await createAnnMut({
        batchId: batchId as any,
        title: `${orig.title} (Copy)`,
        content: orig.content,
        status: "Draft",
        targetAudience: orig.targetAudience,
        isPinned: false,
        allowComments: orig.allowComments,
        attachments: orig.attachments,
      });
    } catch (err) {
      console.error("Failed to duplicate:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this announcement?")) return;
    try {
      await deleteAnnMut({ id: id as any });
      if (selectedAnnouncement?.id === id) {
        setIsDrawerOpen(false);
      }
    } catch (err) {
      console.error("Failed to delete announcement:", err);
    }
  };

  const handlePublishNowFromDrawer = async (id: string) => {
    try {
      await updateAnnMut({
        id: id as any,
        status: "Published",
      });
      setIsDrawerOpen(false);
    } catch (err) {
      console.error("Failed to publish draft:", err);
    }
  };

  const isFiltersActive = searchQuery.trim() !== "" || statusFilter !== "ALL" || audienceFilter !== "ALL";

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-text-primary">
              Cohort Announcements
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
              Live Feed
            </span>
          </div>
          <p className="text-sm text-text-muted mt-1">
            Broadcast updates, announcements, and notices for <strong className="text-text-primary">{batchTitle}</strong>.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setStatusFilter("Draft");
              setShowComposer(false);
            }}
            className="text-xs font-semibold gap-2 bg-background hover:bg-surface border-border h-10"
          >
            <span>View Drafts</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-500/10 text-slate-600 font-bold text-[11px]">
              {draftCount}
            </span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setShowComposer(true);
            }}
            className="text-xs font-semibold gap-1.5 bg-background hover:bg-surface border-border h-10"
          >
            <Calendar className="w-4 h-4 text-primary" />
            <span>Schedule Broadcast</span>
          </Button>
          <Button
            type="button"
            onClick={() => setShowComposer((prev) => !prev)}
            className="text-xs font-bold gap-2 h-10 px-4 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{showComposer ? "Close Composer" : "Create Announcement"}</span>
          </Button>
        </div>
      </div>

      {/* 2. Real Database Summary Metrics (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-border flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Total Announcements
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-text-primary">{totalCount}</span>
              <span className="text-xs text-text-muted">
                ({publishedCount} published, {draftCount} drafts)
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Megaphone className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Published & Pinned
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-text-primary">{publishedCount}</span>
              <span className="text-xs text-amber-600 font-bold">({pinnedCount} pinned)</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <Pin className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Scheduled Broadcasts
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-text-primary">{scheduledCount}</span>
              <span className="text-xs text-text-muted">upcoming</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Draft Announcements
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-text-primary">{draftCount}</span>
              <span className="text-xs text-text-muted">unpublished</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center text-slate-600">
            <Save className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Composer, Filter Bar, and Announcements Feed */}
        <div className="lg:col-span-8 space-y-6">
          {/* Expandable Composer */}
          {showComposer && (
            <BatchAnnouncementComposer
              batchId={batchId}
              batchTitle={batchTitle}
              audienceCounts={audienceCounts}
              onPublish={handlePublishAnnouncement}
              onOpenAttachmentModal={() => setIsAttachmentModalOpen(true)}
              onOpenPreview={(data) => {
                setPreviewData(data);
                setIsPreviewOpen(true);
              }}
              attachments={composerAttachments}
              onRemoveAttachment={(idx) =>
                setComposerAttachments((prev) => prev.filter((_, i) => i !== idx))
              }
            />
          )}

          {/* Search, Status Filter, Audience Filter & Sorting Bar */}
          <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-3" />
                <Input
                  placeholder="Search announcements by title, keyword, or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 bg-background text-xs text-text-primary"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-border bg-background text-xs font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Published">Published</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Draft">Drafts</option>
                  <option value="Pinned">Pinned Only</option>
                </select>

                <select
                  value={audienceFilter}
                  onChange={(e) => setAudienceFilter(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-border bg-background text-xs font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="ALL">All Audiences</option>
                  <option value="Entire Batch">Entire Batch</option>
                  <option value="Specific Students">Specific Students</option>
                  <option value="Students with Pending Payments">Pending Payments</option>
                  <option value="Students with Low Attendance">Low Attendance</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="h-10 px-3 rounded-lg border border-border bg-background text-xs font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Announcements Feed List */}
          <div className="space-y-4">
            {filteredAnnouncements.length === 0 ? (
              <div className="py-16 text-center bg-surface border border-dashed border-border rounded-2xl p-8">
                <Megaphone className="w-12 h-12 mx-auto text-text-muted mb-3 opacity-40" />
                {isFiltersActive ? (
                  <>
                    <h3 className="font-bold text-base text-text-primary">No announcements match your filters</h3>
                    <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
                      Try adjusting your search keywords, status filter, or audience criteria.
                    </p>
                    <Button
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("ALL");
                        setAudienceFilter("ALL");
                      }}
                      variant="outline"
                      size="sm"
                      className="mt-4 text-xs font-semibold"
                    >
                      Clear Filters
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="font-bold text-base text-text-primary">No announcements yet</h3>
                    <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
                      Create an announcement to communicate with your cohort.
                    </p>
                    <Button
                      onClick={() => setShowComposer(true)}
                      size="sm"
                      className="mt-4 text-xs font-bold gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Announcement</span>
                    </Button>
                  </>
                )}
              </div>
            ) : (
              filteredAnnouncements.map((ann) => {
                const isPinnedCard = ann.isPinned || ann.status === "Pinned";

                return (
                  <div
                    key={ann.id}
                    className={`bg-surface border rounded-2xl overflow-hidden transition-all shadow-sm hover:shadow-md ${
                      isPinnedCard ? "border-amber-500/40 bg-amber-500/[0.02]" : "border-border"
                    }`}
                  >
                    {/* Pinned Header Strip */}
                    {isPinnedCard && (
                      <div className="bg-amber-500/10 border-b border-amber-500/20 px-5 py-1.5 flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400">
                        <div className="flex items-center gap-1.5">
                          <Pin className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>Pinned to top of cohort feed</span>
                        </div>
                        <span className="text-[10px] uppercase font-semibold">Priority Notice</span>
                      </div>
                    )}

                    <div className="p-6 space-y-4">
                      {/* Top Author + Badges Row */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">
                            {ann.authorName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-text-primary">
                                {ann.authorName}
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-background border border-border text-[10px] font-semibold text-text-muted">
                                {ann.authorRole}
                              </span>
                            </div>
                            <p className="text-xs text-text-muted mt-0.5">
                              {new Date(ann.createdAt).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Status & Audience Badges */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              ann.status === "Scheduled"
                                ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                                : ann.status === "Draft"
                                ? "bg-slate-500/10 text-slate-600 border border-slate-500/20"
                                : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            }`}
                          >
                            {ann.status}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                            {ann.targetAudience}
                          </span>
                        </div>
                      </div>

                      {/* Headline & Body Text */}
                      <div
                        className="space-y-2 cursor-pointer group"
                        onClick={() => {
                          setSelectedAnnouncement(ann);
                          setIsDrawerOpen(true);
                        }}
                      >
                        <h2 className="font-bold text-base text-text-primary group-hover:text-primary transition-colors">
                          {ann.title}
                        </h2>
                        <p className="text-sm text-text-secondary leading-relaxed line-clamp-3 whitespace-pre-line">
                          {ann.content}
                        </p>
                      </div>

                      {/* Attachments Chips */}
                      {ann.attachments && ann.attachments.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap pt-1">
                          {ann.attachments.map((att, idx) => (
                            <a
                              key={idx}
                              href={att.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background border border-border hover:border-primary/40 text-xs font-semibold text-text-primary transition-all group"
                            >
                              <Paperclip className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span className="group-hover:text-primary transition-colors">
                                {att.title}
                              </span>
                              <ExternalLink className="w-3 h-3 text-text-muted ml-1" />
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Footer Toolbar: Action Buttons */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border/60">
                        <div className="flex items-center gap-3 text-xs text-text-muted">
                          <span>Audience: <strong className="text-text-primary">{ann.targetAudience}</strong></span>
                        </div>

                        {/* Right Action Buttons */}
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedAnnouncement(ann);
                              setIsDrawerOpen(true);
                            }}
                            className="text-xs h-8 px-3 font-semibold"
                          >
                            Inspect Details
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setPreviewData({
                                title: ann.title,
                                content: ann.content,
                                targetAudience: ann.targetAudience,
                                isPinned: ann.isPinned,
                                allowComments: ann.allowComments,
                                attachments: ann.attachments,
                              });
                              setIsPreviewOpen(true);
                            }}
                            className="text-xs h-8 px-2.5 font-semibold gap-1"
                            title="Preview student view"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleTogglePin(ann.id, !ann.isPinned)}
                            className="text-xs h-8 px-2"
                            title={ann.isPinned ? "Unpin Announcement" : "Pin Announcement"}
                          >
                            <Pin
                              className={`w-3.5 h-3.5 ${
                                ann.isPinned ? "text-amber-500 fill-amber-500" : ""
                              }`}
                            />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDuplicate(ann.id)}
                            className="text-xs h-8 px-2"
                            title="Duplicate Announcement"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(ann.id)}
                            className="text-xs h-8 px-2 text-text-muted hover:text-red-600"
                            title="Delete Announcement"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Sidebar (4 cols): Broadcast Channels & Audience Reach Breakdown */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Genuine Broadcast Channels Integration Status */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
                <Share2 className="w-4 h-4 text-primary" />
                Broadcast Channels
              </h3>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                1 Active
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-background border border-border flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="font-bold text-text-primary block">In-App Dashboard Feed</span>
                    <span className="text-[10px] text-text-muted">Convex Real-Time Sync</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                  Active
                </span>
              </div>

              <div className="p-3 rounded-xl bg-background border border-border flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-text-muted" />
                  <div>
                    <span className="font-bold text-text-primary block">WhatsApp Community</span>
                    <span className="text-[10px] text-text-muted">
                      {activeBatch?.whatsappLink ? "Group Link Configured" : "Batch Group Link"}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    activeBatch?.whatsappLink
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-slate-500/10 text-slate-500"
                  }`}
                >
                  {activeBatch?.whatsappLink ? "Configured" : "Not Configured"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-background border border-border flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-text-muted" />
                  <div>
                    <span className="font-bold text-text-primary block">Email Notifications</span>
                    <span className="text-[10px] text-text-muted">SMTP / Resend Integration</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-500/10 text-slate-500 text-[10px] font-bold">
                  Not Configured
                </span>
              </div>

              <div className="p-3 rounded-xl bg-background border border-border flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-text-muted" />
                  <div>
                    <span className="font-bold text-text-primary block">Mobile Push Queue</span>
                    <span className="text-[10px] text-text-muted">Expo Push Notifications</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-500/10 text-slate-500 text-[10px] font-bold">
                  Not Configured
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Audience Segment Reach (Calculated from Real DB Enrollments) */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-text-primary flex items-center gap-2 pb-2 border-b border-border/60">
              <BarChart3 className="w-4 h-4 text-primary" />
              Audience Segment Reach
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-text-secondary">Entire Batch (All Learners)</span>
                  <span className="font-bold text-text-primary">
                    {audienceCounts["Entire Batch"] || 0} learners
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-background overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: audienceCounts["Entire Batch"] > 0 ? "100%" : "0%",
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-text-secondary">Pending Fee Installments</span>
                  <span className="font-bold text-text-primary">
                    {audienceCounts["Students with Pending Payments"] || 0} learners
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-background overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{
                      width:
                        audienceCounts["Entire Batch"] > 0
                          ? `${Math.round(
                              ((audienceCounts["Students with Pending Payments"] || 0) /
                                audienceCounts["Entire Batch"]) *
                                100
                            )}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-text-secondary">Low Attendance (&lt; 75%)</span>
                  <span className="font-bold text-text-primary">
                    {audienceCounts["Students with Low Attendance"] || 0} learners
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-background overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{
                      width:
                        audienceCounts["Entire Batch"] > 0
                          ? `${Math.round(
                              ((audienceCounts["Students with Low Attendance"] || 0) /
                                audienceCounts["Entire Batch"]) *
                                100
                            )}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-text-secondary">Missing Assignments</span>
                  <span className="font-bold text-text-primary">
                    {audienceCounts["Students Missing Assignments"] || 0} learners
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-background overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width:
                        audienceCounts["Entire Batch"] > 0
                          ? `${Math.round(
                              ((audienceCounts["Students Missing Assignments"] || 0) /
                                audienceCounts["Entire Batch"]) *
                                100
                            )}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: AI Engagement Insights (State when no data) */}
          <div className="bg-gradient-to-br from-primary/5 via-surface to-surface border border-primary/20 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm text-text-primary">
                AI Engagement Insights
              </h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              {totalCount > 0
                ? `Active broadcast engine currently syncing ${totalCount} announcement${
                    totalCount > 1 ? "s" : ""
                  } across ${batchTitle} learners.`
                : "Engagement & timing insights will appear once announcements have been broadcasted to cohort learners."}
            </p>
          </div>
        </div>
      </div>

      {/* Modals & Drawers */}
      <AnnouncementAttachmentModal
        isOpen={isAttachmentModalOpen}
        onClose={() => setIsAttachmentModalOpen(false)}
        onAddAttachment={(att) => setComposerAttachments((prev) => [...prev, att])}
        existingStudyMaterials={[]}
        existingRecordings={[]}
      />

      <BatchAnnouncementPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={previewData.title}
        content={previewData.content}
        targetAudience={previewData.targetAudience}
        isPinned={previewData.isPinned}
        allowComments={previewData.allowComments}
        attachments={previewData.attachments}
        batchTitle={batchTitle}
      />

      <BatchAnnouncementDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        announcement={selectedAnnouncement}
        onTogglePin={handleTogglePin}
        onArchive={handleArchive}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onPublishNow={handlePublishNowFromDrawer}
      />
    </div>
  );
}
