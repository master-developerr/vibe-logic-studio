"use client";

import React, { useState } from "react";
import { Search, Filter, MoreHorizontal, Star, CheckCircle, XCircle, EyeOff, Flag, ThumbsUp, Pin } from "lucide-react";
import Image from "next/image";

interface Review {
  _id: string;
  rating: number;
  content: string;
  isFeatured: boolean;
  isPinned: boolean;
  createdAt: number;
  moderationStatus: string;
  verificationStatus: string;
  helpfulVotes: number;
  sentimentScore: string;
  reportedReason?: string;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  courseTitle: string;
}

interface ReviewsTableProps {
  reviews: Review[];
  isLoading: boolean;
  onModerate: (reviewId: string, status: string, isFeatured?: boolean, isPinned?: boolean) => void;
  onViewDetail: (review: Review) => void;
}

export function ReviewsTable({ reviews, isLoading, onModerate, onViewDetail }: ReviewsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || r.moderationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 space-y-4">
        <div className="h-10 w-full bg-background animate-pulse rounded-lg" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 w-full bg-background animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by student, course, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg">
            <Filter className="w-4 h-4 text-text-muted" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-sm text-text-primary focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Flagged">Flagged</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background border-b border-border">
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Student</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Course</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Rating</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider w-1/3">Review</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredReviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                  No reviews match your filters.
                </td>
              </tr>
            ) : (
              filteredReviews.map((review) => {
                const dateStr = new Date(review.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                });

                return (
                  <tr key={review._id} className="hover:bg-background/50 transition-colors group">
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-background relative shrink-0">
                          {review.studentAvatar ? (
                            <Image src={review.studentAvatar} alt={review.studentName} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xs">
                              {review.studentName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-text-primary truncate">{review.studentName}</p>
                          <p className="text-xs text-text-muted truncate">{review.studentEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <p className="text-sm font-medium text-text-primary line-clamp-2">{review.courseTitle}</p>
                      <p className="text-[10px] text-text-muted mt-1">{dateStr}</p>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${star <= review.rating ? "text-warning fill-warning" : "text-border fill-background"}`}
                          />
                        ))}
                      </div>
                      {review.helpfulVotes > 0 && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-text-muted">
                          <ThumbsUp className="w-3 h-3" /> {review.helpfulVotes}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top max-w-sm">
                      <p className="text-sm text-text-secondary line-clamp-2" title={review.content}>
                        {review.content}
                      </p>
                      {review.isFeatured && (
                        <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase">
                          <Star className="w-3 h-3 fill-primary" /> Featured
                        </span>
                      )}
                      {review.isPinned && (
                        <span className="inline-flex items-center gap-1 mt-2 ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-info/10 text-info uppercase">
                          <Pin className="w-3 h-3 fill-info" /> Pinned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                        ${review.moderationStatus === "Approved" ? "bg-success/10 text-success" :
                          review.moderationStatus === "Pending" ? "bg-warning/10 text-warning" :
                          review.moderationStatus === "Flagged" ? "bg-error/10 text-error" :
                          "bg-surface text-text-muted"
                        }
                      `}>
                        {review.moderationStatus}
                      </span>
                      {review.moderationStatus === "Flagged" && review.reportedReason && (
                        <p className="text-[10px] text-error mt-1 truncate max-w-[120px]" title={review.reportedReason}>
                          {review.reportedReason}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {review.moderationStatus !== "Approved" && (
                          <button
                            onClick={() => onModerate(review._id, "Approved")}
                            className="p-1.5 text-success hover:bg-success/10 rounded-md transition-colors"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {review.moderationStatus !== "Rejected" && (
                          <button
                            onClick={() => onModerate(review._id, "Rejected")}
                            className="p-1.5 text-error hover:bg-error/10 rounded-md transition-colors"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onViewDetail(review)}
                          className="px-3 py-1.5 text-xs font-medium text-text-primary bg-background border border-border hover:border-primary/50 hover:bg-surface rounded-md transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
