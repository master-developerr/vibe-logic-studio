"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Star, MessageSquare, AlertTriangle, Shield, Settings, CheckCircle, Database } from "lucide-react";

import { ReviewsKPIGrid } from "./ReviewsKPIGrid";
import { RatingAnalyticsSection } from "./RatingAnalyticsSection";
import { ReviewsTable } from "./ReviewsTable";
import { ReviewDetailModal } from "./ReviewDetailModal";
import { Id } from "@/convex/_generated/dataModel";

export function ReviewsClient() {
  const [activeTab, setActiveTab] = useState<"overview" | "all" | "pending" | "flagged">("overview");
  const [selectedReview, setSelectedReview] = useState<any | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Queries
  const data = useQuery(api.reviews_admin.getReviewsOverview);
  
  // Mutations
  const moderateReview = useMutation(api.reviews_admin.moderateReview);
  const seedSampleReviews = useMutation(api.reviews_admin.seedSampleReviews);
  const clearSampleReviews = useMutation(api.reviews_admin.clearSampleReviews);

  const isLoading = data === undefined;

  const handleModerate = async (reviewId: string, status: string, isFeatured?: boolean, isPinned?: boolean) => {
    try {
      await moderateReview({
        reviewId: reviewId as Id<"reviews">,
        moderationStatus: status,
        isFeatured,
        isPinned,
      });
    } catch (error) {
      console.error("Failed to moderate review", error);
      alert("Failed to update review status.");
    }
  };

  const handleSeedData = async () => {
    if (window.confirm("This will generate sample reviews for the first course found. Continue?")) {
      setIsSeeding(true);
      try {
        await seedSampleReviews();
        alert("Sample reviews generated successfully.");
      } catch (error) {
        console.error(error);
        alert("Failed to generate reviews. Make sure you have at least one course.");
      } finally {
        setIsSeeding(false);
      }
    }
  };

  const handleClearData = async () => {
    if (window.confirm("WARNING: This will delete ALL reviews in the database. Are you sure?")) {
      setIsSeeding(true);
      try {
        await clearSampleReviews();
        alert("All reviews cleared.");
      } catch (error) {
        console.error(error);
        alert("Failed to clear reviews.");
      } finally {
        setIsSeeding(false);
      }
    }
  };

  const renderContent = () => {
    if (activeTab === "overview") {
      return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ReviewsKPIGrid 
            kpis={data?.kpis || {
              overallRating: 0, totalReviews: 0, publishedCount: 0, pendingCount: 0, 
              flaggedCount: 0, averageCourseRating: 0, averageInstructorRating: 0, monthlyGrowth: 0
            }} 
            isLoading={isLoading} 
          />
          <RatingAnalyticsSection 
            ratingDistribution={data?.ratingDistribution || []}
            sentimentDistribution={data?.sentimentDistribution || []}
            reviewsByMonth={data?.reviewsByMonth || []}
            instructorRankings={data?.instructorRankings || []}
            courseRankings={data?.courseRankings || []}
            isLoading={isLoading}
          />
        </div>
      );
    }

    if (activeTab === "all") {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ReviewsTable 
            reviews={data?.reviews || []} 
            isLoading={isLoading}
            onModerate={handleModerate}
            onViewDetail={setSelectedReview}
          />
        </div>
      );
    }

    if (activeTab === "pending") {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ReviewsTable 
            reviews={data?.pendingReviews || []} 
            isLoading={isLoading}
            onModerate={handleModerate}
            onViewDetail={setSelectedReview}
          />
        </div>
      );
    }

    if (activeTab === "flagged") {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ReviewsTable 
            reviews={data?.flaggedReviews || []} 
            isLoading={isLoading}
            onModerate={handleModerate}
            onViewDetail={setSelectedReview}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary flex items-center gap-3">
            Reviews & Testimonials
          </h1>
          <p className="text-text-muted mt-1 text-sm max-w-2xl">
            Monitor student satisfaction, moderate feedback, and curate featured testimonials to drive platform growth.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleClearData}
            disabled={isSeeding}
            className="flex items-center gap-2 px-4 py-2 bg-background border border-error/50 hover:bg-error/10 text-error rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
          >
            Clear All Reviews
          </button>
          <button 
            onClick={handleSeedData}
            disabled={isSeeding}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border hover:border-primary/50 text-text-primary hover:text-primary rounded-lg text-sm font-semibold transition-all disabled:opacity-50 shadow-sm"
          >
            <Database className={`w-4 h-4 ${isSeeding ? "animate-spin" : ""}`} />
            {isSeeding ? "Seeding..." : "Seed Mock Data"}
          </button>
          <button className="p-2 bg-surface border border-border rounded-lg text-text-muted hover:text-text-primary transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "overview" ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text-primary hover:border-border"
          }`}
        >
          <Star className="w-4 h-4" /> Overview
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "all" ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text-primary hover:border-border"
          }`}
        >
          <MessageSquare className="w-4 h-4" /> All Reviews
          {!isLoading && data?.kpis.totalReviews ? (
            <span className="bg-surface px-2 py-0.5 rounded-full text-[10px] ml-1">{data.kpis.totalReviews}</span>
          ) : null}
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "pending" ? "border-warning text-warning" : "border-transparent text-text-muted hover:text-text-primary hover:border-border"
          }`}
        >
          <Shield className="w-4 h-4" /> Pending
          {!isLoading && data?.kpis.pendingCount && data.kpis.pendingCount > 0 ? (
            <span className="bg-warning/10 text-warning px-2 py-0.5 rounded-full text-[10px] ml-1">{data.kpis.pendingCount}</span>
          ) : null}
        </button>
        <button
          onClick={() => setActiveTab("flagged")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "flagged" ? "border-error text-error" : "border-transparent text-text-muted hover:text-text-primary hover:border-border"
          }`}
        >
          <AlertTriangle className="w-4 h-4" /> Flagged
          {!isLoading && data?.kpis.flaggedCount && data.kpis.flaggedCount > 0 ? (
            <span className="bg-error/10 text-error px-2 py-0.5 rounded-full text-[10px] ml-1">{data.kpis.flaggedCount}</span>
          ) : null}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[500px]">
        {renderContent()}
      </div>

      {/* Detail Modal */}
      <ReviewDetailModal
        review={selectedReview}
        isOpen={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        onModerate={(id, status, isFeatured, isPinned) => {
          handleModerate(id, status, isFeatured, isPinned);
          if (selectedReview) {
            setSelectedReview({ ...selectedReview, moderationStatus: status, isFeatured, isPinned });
          }
        }}
      />
    </div>
  );
}
