"use client";

import React from "react";
import { X, Star, User, Mail, ShieldCheck, Flag, CheckCircle, XCircle, Pin, EyeOff } from "lucide-react";
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
  instructorName: string;
}

interface ReviewDetailModalProps {
  review: Review;
  isOpen: boolean;
  onClose: () => void;
  onModerate: (reviewId: string, status: string, isFeatured?: boolean, isPinned?: boolean) => void;
}

export function ReviewDetailModal({ review, isOpen, onClose, onModerate }: ReviewDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-surface border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-text-primary">Review Details</h2>
          <button 
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text-primary hover:bg-background rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Top: Student & Status */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-background relative shrink-0">
                {review.studentAvatar ? (
                  <Image src={review.studentAvatar} alt={review.studentName} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-lg">
                    {review.studentName.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary">{review.studentName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-3.5 h-3.5 text-text-muted" />
                  <span className="text-sm text-text-secondary">{review.studentEmail}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-success" />
                  <span className="text-xs font-semibold text-success">{review.verificationStatus}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-start sm:items-end gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                ${review.moderationStatus === "Approved" ? "bg-success/10 text-success" :
                  review.moderationStatus === "Pending" ? "bg-warning/10 text-warning" :
                  review.moderationStatus === "Flagged" ? "bg-error/10 text-error" :
                  "bg-surface text-text-muted border border-border"
                }
              `}>
                {review.moderationStatus}
              </span>
              <span className="text-xs text-text-muted">
                Submitted on {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Middle: Review Content */}
          <div className="bg-background rounded-xl p-5 border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${star <= review.rating ? "text-warning fill-warning" : "text-border fill-background"}`}
                  />
                ))}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-md
                ${review.sentimentScore === "Positive" ? "bg-success/10 text-success" :
                  review.sentimentScore === "Neutral" ? "bg-warning/10 text-warning" :
                  "bg-error/10 text-error"}
              `}>
                {review.sentimentScore} Sentiment
              </span>
            </div>
            <p className="text-base text-text-primary leading-relaxed whitespace-pre-wrap">
              "{review.content}"
            </p>
          </div>

          {/* Context: Course Info & Flags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-surface border border-border">
              <h4 className="text-xs font-bold text-text-muted uppercase mb-2">Context</h4>
              <p className="text-sm font-medium text-text-primary mb-1">{review.courseTitle}</p>
              <p className="text-xs text-text-secondary flex items-center gap-1">
                <User className="w-3 h-3" /> {review.instructorName}
              </p>
            </div>
            
            {(review.moderationStatus === "Flagged" || review.reportedReason) && (
              <div className="p-4 rounded-xl bg-error/10 border border-error/20">
                <h4 className="text-xs font-bold text-error uppercase mb-2 flex items-center gap-1">
                  <Flag className="w-3 h-3" /> Report Reason
                </h4>
                <p className="text-sm font-medium text-error">
                  {review.reportedReason || "Flagged by automated system."}
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-border bg-background flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => onModerate(review._id, review.moderationStatus, !review.isFeatured, review.isPinned)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                review.isFeatured 
                  ? "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20" 
                  : "bg-surface text-text-primary border border-border hover:bg-background"
              }`}
            >
              <Star className={`w-4 h-4 ${review.isFeatured ? "fill-primary" : ""}`} />
              {review.isFeatured ? "Featured" : "Feature"}
            </button>
            <button
              onClick={() => onModerate(review._id, review.moderationStatus, review.isFeatured, !review.isPinned)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                review.isPinned 
                  ? "bg-info/10 text-info border border-info/20 hover:bg-info/20" 
                  : "bg-surface text-text-primary border border-border hover:bg-background"
              }`}
            >
              <Pin className={`w-4 h-4 ${review.isPinned ? "fill-info" : ""}`} />
              {review.isPinned ? "Pinned" : "Pin"}
            </button>
          </div>

          <div className="flex gap-3">
            {review.moderationStatus !== "Rejected" && (
              <button
                onClick={() => {
                  onModerate(review._id, "Rejected");
                  onClose();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-error bg-error/10 hover:bg-error/20 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
            )}
            
            {review.moderationStatus !== "Approved" && (
              <button
                onClick={() => {
                  onModerate(review._id, "Approved");
                  onClose();
                }}
                className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold text-background bg-primary hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
