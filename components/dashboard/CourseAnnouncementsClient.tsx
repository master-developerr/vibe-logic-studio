"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Search,
  Paperclip,
  Info,
  MessageSquare,
  ArrowRight,
  X
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

interface CourseAnnouncementsClientProps {
  batchId: Id<"batches">;
  clerkId: string;
}

export function CourseAnnouncementsClient({ batchId, clerkId }: CourseAnnouncementsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Unread" | "Read">("All");
  
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any | null>(null);

  const rawAnnouncements = useQuery(api.student.getAnnouncementsData, {
    batchId
  });

  const markRead = useMutation(api.student.markAnnouncementRead);

  const isLoading = rawAnnouncements === undefined;

  // Derive stats
  const stats = useMemo(() => {
    if (!rawAnnouncements) return { total: 0, thisMonth: 0, unread: 0 };
    
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    
    const total = rawAnnouncements.length;
    const thisMonth = rawAnnouncements.filter(a => a.createdAt >= thirtyDaysAgo).length;
    const unread = rawAnnouncements.filter(a => !a.isRead).length;
    
    return { total, thisMonth, unread };
  }, [rawAnnouncements]);

  // Filter
  const filteredAnnouncements = useMemo(() => {
    if (!rawAnnouncements) return [];
    
    return rawAnnouncements.filter(a => {
      // Search
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        a.title.toLowerCase().includes(q) || 
        a.content.toLowerCase().includes(q) ||
        (a.authorName && a.authorName.toLowerCase().includes(q));
        
      if (!matchesSearch) return false;
      
      // Status
      if (statusFilter === "Unread" && a.isRead) return false;
      if (statusFilter === "Read" && !a.isRead) return false;
      
      return true;
    });
  }, [rawAnnouncements, searchQuery, statusFilter]);

  const handleReadMore = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    if (!announcement.isRead) {
      markRead({ batchId, announcementId: announcement._id }).catch(console.error);
    }
  };

  const closeModal = () => setSelectedAnnouncement(null);

  function getInitials(name: string) {
    if (!name) return "A";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  }

  function formatTime(timestamp: number) {
    const date = new Date(timestamp);
    const now = new Date();
    
    const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    const isYesterday = new Date(now.getTime() - 86400000).getDate() === date.getDate() && new Date(now.getTime() - 86400000).getMonth() === date.getMonth() && new Date(now.getTime() - 86400000).getFullYear() === date.getFullYear();
    
    const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    
    if (isToday) return `Today, ${timeStr}`;
    if (isYesterday) return `Yesterday, ${timeStr}`;
    
    return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  }

  return (
    <div className="w-full max-w-[1250px] mx-auto font-sans pb-24">
      {/* PAGE HEADER */}
      <div className="flex flex-col items-start text-left mb-8">
        <h2 className="text-[36px] md:text-[40px] font-extrabold text-text-primary leading-tight mb-3 tracking-tight">
          Announcements
        </h2>
        <p className="text-[15px] md:text-[16px] text-text-secondary max-w-2xl leading-relaxed">
          Stay updated with important information from your instructors.
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_280px] lg:grid-cols-[minmax(0,1fr)_320px] gap-7 md:gap-8 items-start">
        
        {/* LEFT COLUMN: Feed */}
        <div className="w-full flex flex-col gap-5 min-w-0">
          
          {/* FILTER ROW (Strictly left aligned inside left column) */}
          <div className="flex flex-col md:flex-row gap-[12px] items-start md:items-center justify-start bg-transparent mb-2 w-full">
            {/* Search */}
            <div className="relative w-full md:w-[340px] shrink-0">
              <Search 
                className="w-[17px] h-[17px] text-[#8A9199] absolute left-[16px] top-1/2 -translate-y-1/2" 
                strokeWidth={1.5}
              />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[46px] pl-[44px] pr-8 bg-[#FFFFFF] border border-[#E2E5E9] rounded-[10px] text-[14px] font-medium text-text-primary placeholder:text-text-muted focus:outline-none focus:border-[#FF5A1F] focus:shadow-[0_0_0_3px_rgba(255,90,31,0.08)] transition-all text-left"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center p-1 bg-[#FFFFFF] border border-[#E2E5E9] rounded-[10px] h-[46px] shrink-0">
              {(["All", "Unread", "Read"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 h-full text-[13px] font-semibold rounded-[8px] transition-all ${
                    statusFilter === status
                      ? "bg-[#FF5A1F] text-white shadow-sm"
                      : "bg-transparent text-[#4B5563] hover:text-[#111827]"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          {isLoading ? (
            <div className="animate-pulse flex flex-col gap-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-surface rounded-[16px] border border-border" />
              ))}
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="bg-surface border border-border rounded-[16px] p-10 flex flex-col items-start shadow-sm text-left">
              <h3 className="text-xl font-bold text-text-primary mb-2">No announcements found</h3>
              <p className="text-text-secondary">
                {searchQuery || statusFilter !== "All" 
                  ? "Try adjusting your search or filters." 
                  : "There are no announcements for this course yet."}
              </p>
            </div>
          ) : (
            filteredAnnouncements.map((ann) => (
              <div 
                key={ann._id} 
                className={`bg-surface border rounded-[16px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all flex flex-col relative overflow-hidden group cursor-pointer ${
                  !ann.isRead ? "border-l-[3px] border-l-[#FF5A1F] border-t-border border-r-border border-b-border" : "border-border"
                }`}
                onClick={() => handleReadMore(ann)}
              >
                {/* Header Row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {getInitials(ann.authorName || "Admin")}
                    </div>
                    <div className="flex items-center gap-2 text-[13px]">
                      <span className="font-bold text-text-primary">{ann.authorName || "Admin Team"}</span>
                      <span className="text-text-muted">•</span>
                      <span className="text-text-secondary">{formatTime(ann.createdAt)}</span>
                    </div>
                  </div>
                  
                  {!ann.isRead && (
                    <span className="text-[#FF5A1F] text-[10px] font-bold uppercase tracking-wider">
                      NEW
                    </span>
                  )}
                </div>

                {/* Content */}
                <h3 className="text-[18px] md:text-[20px] font-bold text-text-primary leading-tight mb-2 group-hover:text-primary transition-colors">
                  {ann.title}
                </h3>
                <p className="text-[14px] text-text-secondary leading-relaxed line-clamp-2 mb-5">
                  {ann.content}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-text-muted">
                    {ann.attachments && ann.attachments.length > 0 && (
                      <span className="flex items-center gap-1.5 hover:text-text-primary transition-colors">
                        <Paperclip className="w-3.5 h-3.5" />
                        {ann.attachments.length} attachment{ann.attachments.length !== 1 && 's'}
                      </span>
                    )}
                  </div>
                  <span className="text-[13px] font-bold text-primary flex items-center gap-1 group-hover:underline">
                    Read more <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT COLUMN: Sidebar */}
        <div className="w-full flex flex-col gap-5 sticky top-[100px] min-w-0">
          
          {/* Card 1: Need Help? */}
          <div className="bg-surface border border-border rounded-[16px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="w-10 h-10 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center text-primary mb-4">
              <Info className="w-5 h-5" />
            </div>
            <h3 className="text-[17px] font-bold text-text-primary mb-2">Need Help?</h3>
            <p className="text-[14px] text-text-secondary leading-relaxed mb-6">
              If you have questions about any announcement, please post in the #general Slack channel or reach out to your TA.
            </p>
            <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-background border border-border hover:bg-gray-50 rounded-lg text-sm font-bold text-text-primary transition-colors">
              <MessageSquare className="w-4 h-4" />
              Go to Slack
            </button>
          </div>

          {/* Card 2: Announcement Activity */}
          <div className="bg-surface border border-border rounded-[16px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <h3 className="text-[17px] font-bold text-text-primary mb-5">Announcement Activity</h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-text-secondary">Total Published</span>
                <span className="text-[15px] font-bold text-text-primary">{stats.total}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border/50 pt-4">
                <span className="text-[14px] text-text-secondary">This Month</span>
                <span className="text-[15px] font-bold text-text-primary">{stats.thisMonth}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border/50 pt-4">
                <span className="text-[14px] text-text-secondary">Unread</span>
                <div className="flex items-center gap-2">
                  {stats.unread > 0 ? (
                    <span className="px-1.5 py-0.5 bg-orange-50 text-[#FF5A1F] text-[11px] font-bold rounded">
                      {stats.unread} New
                    </span>
                  ) : (
                    <span className="text-[15px] font-bold text-text-primary">0</span>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ANNOUNCEMENT DETAIL MODAL */}
      <AnimatePresence>
        {selectedAnnouncement && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-surface border border-border rounded-[24px] shadow-2xl z-50 overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[12px] font-bold shrink-0">
                    {getInitials(selectedAnnouncement.authorName || "Admin")}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-text-primary text-[14px]">
                      {selectedAnnouncement.authorName || "Admin Team"}
                    </span>
                    <span className="text-[12px] text-text-secondary">
                      {formatTime(selectedAnnouncement.createdAt)}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-text-muted hover:text-text-primary transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto">
                <h2 className="text-[24px] font-extrabold text-text-primary leading-tight mb-6">
                  {selectedAnnouncement.title}
                </h2>
                <div className="text-[15px] text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {selectedAnnouncement.content}
                </div>

                {selectedAnnouncement.attachments && selectedAnnouncement.attachments.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-border">
                    <h4 className="text-[13px] font-bold text-text-primary mb-4 uppercase tracking-wider">Attachments</h4>
                    <div className="flex flex-col gap-3">
                      {selectedAnnouncement.attachments.map((att: any, idx: number) => (
                        <a 
                          key={idx}
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-4 bg-background border border-border rounded-xl hover:border-primary/40 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center text-text-muted group-hover:text-primary transition-colors">
                            <Paperclip className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[14px] font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                              {att.title}
                            </span>
                            <span className="text-[12px] text-text-secondary uppercase">
                              {att.type || "Document"}
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
