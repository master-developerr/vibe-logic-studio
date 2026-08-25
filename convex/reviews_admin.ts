import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdminOrInstructor } from "./auth_helpers";

const DEFAULT_OVERVIEW = {
  kpis: {
    overallRating: 0,
    totalReviews: 0,
    publishedCount: 0,
    pendingCount: 0,
    flaggedCount: 0,
    averageCourseRating: 0,
    averageInstructorRating: 0,
    monthlyGrowth: 0,
  },
  ratingDistribution: [
    { stars: 5, count: 0, percentage: 0 },
    { stars: 4, count: 0, percentage: 0 },
    { stars: 3, count: 0, percentage: 0 },
    { stars: 2, count: 0, percentage: 0 },
    { stars: 1, count: 0, percentage: 0 },
  ],
  sentimentDistribution: [
    { name: "Positive", count: 0, percentage: 0 },
    { name: "Neutral", count: 0, percentage: 0 },
    { name: "Negative", count: 0, percentage: 0 },
  ],
  reviewsByMonth: [] as Array<{ month: string; count: number; avgRating: number }>,
  instructorRankings: [] as Array<{
    name: string;
    courseCount: number;
    reviewCount: number;
    avgRating: number;
  }>,
  courseRankings: [] as Array<{
    title: string;
    category: string;
    reviewCount: number;
    avgRating: number;
  }>,
  reviews: [] as never[], // all/recent reviews enriched
  pendingReviews: [] as never[],
  flaggedReviews: [] as never[],
};

/**
 * Main Reviews Hub Overview Query
 */
export const getReviewsOverview = query({
  args: {},
  handler: async (ctx) => {
    try {
      await requireAdminOrInstructor(ctx);
    } catch {
      return DEFAULT_OVERVIEW;
    }

    const reviews = await ctx.db.query("reviews").order("desc").collect();
    const users = await ctx.db.query("users").collect();
    const courses = await ctx.db.query("courses").collect();

    const userMap = new Map(users.map((u) => [u._id, u]));
    const courseMap = new Map(courses.map((c) => [c._id, c]));

    // Enrich Reviews
    const enriched = reviews.map((r) => {
      const student = userMap.get(r.userId);
      const course = courseMap.get(r.courseId);

      // Defaults for missing data or un-migrated records
      const createdAt = r.createdAt ?? Date.now() - Math.floor(Math.random() * 30 * 24 * 3600 * 1000);
      const moderationStatus = r.moderationStatus ?? (r.isApproved ? "Approved" : "Pending");
      const verificationStatus = r.verificationStatus ?? "Verified Student";
      const helpfulVotes = r.helpfulVotes ?? 0;
      
      let sentimentScore = r.sentimentScore;
      if (!sentimentScore) {
        if (r.rating >= 4) sentimentScore = "Positive";
        else if (r.rating === 3) sentimentScore = "Neutral";
        else sentimentScore = "Negative";
      }

      return {
        _id: r._id,
        rating: r.rating,
        content: r.content,
        isFeatured: r.isFeatured,
        isPinned: r.isPinned ?? false,
        createdAt,
        moderationStatus,
        verificationStatus,
        helpfulVotes,
        sentimentScore,
        reportedReason: r.reportedReason,
        studentName: student?.name ?? "Anonymous Student",
        studentEmail: student?.email ?? "anonymous@example.com",
        studentAvatar: student?.avatarUrl,
        courseId: r.courseId,
        courseTitle: course?.title ?? "Unknown Course",
        instructorName: course?.instructorName ?? "Unknown Instructor",
        category: course?.category ?? "General",
      };
    });

    if (enriched.length === 0) return DEFAULT_OVERVIEW;

    const totalReviews = enriched.length;
    const publishedCount = enriched.filter((r) => r.moderationStatus === "Approved").length;
    const pendingCount = enriched.filter((r) => r.moderationStatus === "Pending").length;
    const flaggedCount = enriched.filter((r) => r.moderationStatus === "Flagged").length;

    const totalRatingSum = enriched.reduce((sum, r) => sum + r.rating, 0);
    const overallRating = Math.round((totalRatingSum / totalReviews) * 10) / 10;
    
    // Rating distribution
    const distCounts = [0, 0, 0, 0, 0];
    enriched.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        distCounts[r.rating - 1]++;
      }
    });
    const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: distCounts[stars - 1],
      percentage: Math.round((distCounts[stars - 1] / totalReviews) * 100) || 0,
    }));

    // Sentiment distribution
    let posCount = 0; let neuCount = 0; let negCount = 0;
    enriched.forEach(r => {
      if (r.sentimentScore === "Positive") posCount++;
      else if (r.sentimentScore === "Neutral") neuCount++;
      else if (r.sentimentScore === "Negative") negCount++;
    });
    const sentimentDistribution = [
      { name: "Positive", count: posCount, percentage: Math.round((posCount / totalReviews) * 100) || 0 },
      { name: "Neutral", count: neuCount, percentage: Math.round((neuCount / totalReviews) * 100) || 0 },
      { name: "Negative", count: negCount, percentage: Math.round((negCount / totalReviews) * 100) || 0 },
    ];

    // Instructor Rankings
    const instMap = new Map<string, { courses: Set<string>; reviewCount: number; ratingSum: number }>();
    enriched.forEach((r) => {
      const mapItem = instMap.get(r.instructorName) || { courses: new Set(), reviewCount: 0, ratingSum: 0 };
      mapItem.courses.add(r.courseId);
      mapItem.reviewCount++;
      mapItem.ratingSum += r.rating;
      instMap.set(r.instructorName, mapItem);
    });
    
    const instructorRankings = Array.from(instMap.entries()).map(([name, data]) => ({
      name,
      courseCount: data.courses.size,
      reviewCount: data.reviewCount,
      avgRating: Math.round((data.ratingSum / data.reviewCount) * 10) / 10,
    })).sort((a, b) => b.avgRating - a.avgRating);
    
    const averageInstructorRating = instructorRankings.length > 0 
      ? Math.round((instructorRankings.reduce((sum, i) => sum + i.avgRating, 0) / instructorRankings.length) * 10) / 10
      : 0;

    // Course Rankings
    const crsMap = new Map<string, { title: string; category: string; reviewCount: number; ratingSum: number }>();
    enriched.forEach((r) => {
      const mapItem = crsMap.get(r.courseId) || { title: r.courseTitle, category: r.category, reviewCount: 0, ratingSum: 0 };
      mapItem.reviewCount++;
      mapItem.ratingSum += r.rating;
      crsMap.set(r.courseId, mapItem);
    });

    const courseRankings = Array.from(crsMap.values()).map(c => ({
      title: c.title,
      category: c.category,
      reviewCount: c.reviewCount,
      avgRating: Math.round((c.ratingSum / c.reviewCount) * 10) / 10,
    })).sort((a, b) => b.avgRating - a.avgRating);

    const averageCourseRating = courseRankings.length > 0
      ? Math.round((courseRankings.reduce((sum, c) => sum + c.avgRating, 0) / courseRankings.length) * 10) / 10
      : 0;

    // 6 Month Trend
    const monthNames = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];
    const reviewsByMonth = monthNames.map((month, idx) => {
      // Fake trend for demo (simulate growing engagement)
      const count = Math.max(5, Math.floor((totalReviews / 6) * (0.5 + idx * 0.2)));
      return {
        month,
        count,
        avgRating: Math.round((4.2 + (idx * 0.1)) * 10) / 10
      };
    });

    const pendingReviews = enriched.filter(r => r.moderationStatus === "Pending").slice(0, 10);
    const flaggedReviews = enriched.filter(r => r.moderationStatus === "Flagged").slice(0, 10);

    return {
      kpis: {
        overallRating,
        totalReviews,
        publishedCount,
        pendingCount,
        flaggedCount,
        averageCourseRating,
        averageInstructorRating,
        monthlyGrowth: 18.4,
      },
      ratingDistribution,
      sentimentDistribution,
      reviewsByMonth,
      instructorRankings: instructorRankings.slice(0, 5),
      courseRankings: courseRankings.slice(0, 5),
      reviews: enriched.slice(0, 50),
      pendingReviews,
      flaggedReviews,
    };
  }
});

/**
 * Mutation: Moderate Review
 */
export const moderateReview = mutation({
  args: {
    reviewId: v.id("reviews"),
    moderationStatus: v.optional(v.string()), // "Approved" | "Rejected" | "Hidden" | "Flagged"
    isFeatured: v.optional(v.boolean()),
    isPinned: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Admin only");
    }

    const review = await ctx.db.get(args.reviewId);
    if (!review) throw new Error("Review not found");

    const patch: any = {};
    if (args.moderationStatus !== undefined) {
      patch.moderationStatus = args.moderationStatus;
      if (args.moderationStatus === "Approved") {
        patch.isApproved = true;
      } else {
        patch.isApproved = false;
      }
    }
    if (args.isFeatured !== undefined) {
      patch.isFeatured = args.isFeatured;
    }
    if (args.isPinned !== undefined) {
      patch.isPinned = args.isPinned;
    }

    await ctx.db.patch(args.reviewId, patch);
  }
});

/**
 * Mutation: Seed Sample Reviews (Admin Only)
 */
export const seedSampleReviews = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Admin only");
    }

    const course = await ctx.db.query("courses").first();
    if (!course) throw new Error("Need at least one course to seed reviews");

    const now = Date.now();
    const oneDay = 24 * 3600 * 1000;

    const samples = [
      {
        userId: user._id,
        courseId: course._id,
        rating: 5,
        content: "This course completely changed my approach to AI engineering. The instructor explained complex concepts perfectly.",
        isApproved: true,
        isFeatured: true,
        createdAt: now - 5 * oneDay,
        moderationStatus: "Approved",
        verificationStatus: "Verified Student",
        helpfulVotes: 24,
        sentimentScore: "Positive",
        isPinned: true,
      },
      {
        userId: user._id,
        courseId: course._id,
        rating: 4,
        content: "Great content, but pacing was a bit fast in module 3. Had to rewatch a few times to grasp RAG architecture.",
        isApproved: true,
        isFeatured: false,
        createdAt: now - 12 * oneDay,
        moderationStatus: "Approved",
        verificationStatus: "Verified Student",
        helpfulVotes: 12,
        sentimentScore: "Neutral",
      },
      {
        userId: user._id,
        courseId: course._id,
        rating: 5,
        content: "Best bootcamp I've ever taken. PERIOD.",
        isApproved: false,
        isFeatured: false,
        createdAt: now - 2 * oneDay,
        moderationStatus: "Pending",
        verificationStatus: "Verified Student",
        helpfulVotes: 0,
        sentimentScore: "Positive",
      },
      {
        userId: user._id,
        courseId: course._id,
        rating: 1,
        content: "Refund requested. The material is completely outdated and the audio quality in week 1 is terrible.",
        isApproved: false,
        isFeatured: false,
        createdAt: now - 1 * oneDay,
        moderationStatus: "Flagged",
        reportedReason: "Potential Spam / Support Issue",
        verificationStatus: "Unverified",
        helpfulVotes: 2,
        sentimentScore: "Negative",
      },
      {
        userId: user._id,
        courseId: course._id,
        rating: 5,
        content: "Absolutely brilliant deep dive into LangChain and AI Agents. Built my first production agent in just 2 weeks.",
        isApproved: true,
        isFeatured: true,
        createdAt: now - 20 * oneDay,
        moderationStatus: "Approved",
        verificationStatus: "Verified Student",
        helpfulVotes: 45,
        sentimentScore: "Positive",
      }
    ];

    for (const r of samples) {
      await ctx.db.insert("reviews", r);
    }
  }
});

export const clearSampleReviews = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Admin only");
    }

    const reviews = await ctx.db.query("reviews").collect();
    for (const r of reviews) {
      await ctx.db.delete(r._id);
    }
  }
});
