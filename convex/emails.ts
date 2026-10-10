import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getPendingEmailJob = query({
  args: {
    purchaseId: v.id("purchases"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("emailJobs")
      .withIndex("by_purchase_id", (q) => q.eq("purchaseId", args.purchaseId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .first();
  },
});

export const claimPendingJobForPurchase = mutation({
  args: {
    purchaseId: v.id("purchases"),
  },
  handler: async (ctx, args) => {
    const purchase = await ctx.db.get(args.purchaseId);
    if (!purchase || purchase.paymentStatus !== "verified") {
      throw new Error("Purchase is not verified for email dispatch");
    }

    const job = await ctx.db
      .query("emailJobs")
      .withIndex("by_purchase_id", (q) => q.eq("purchaseId", args.purchaseId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .first();

    if (!job) return null;

    const course = await ctx.db.get(purchase.courseId);

    await ctx.db.patch(job._id, {
      status: "processing",
      attempts: job.attempts + 1,
      lastAttemptAt: Date.now(),
    });

    return {
      ...job,
      courseTitle: course?.title ?? "VibeLogic Bootcamp",
    };
  },
});

export const claimNextPendingJob = mutation({
  args: {},
  handler: async (ctx) => {
    const job = await ctx.db
      .query("emailJobs")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .first();

    if (!job) return null;

    const purchase = await ctx.db.get(job.purchaseId);
    if (!purchase || purchase.paymentStatus !== "verified") {
      // Unverified purchase job should not be sent; mark failed
      await ctx.db.patch(job._id, {
        status: "failed",
        errorMessage: "Associated purchase is not verified",
      });
      return null;
    }

    const course = await ctx.db.get(purchase.courseId);

    await ctx.db.patch(job._id, {
      status: "processing",
      attempts: job.attempts + 1,
      lastAttemptAt: Date.now(),
    });

    return {
      ...job,
      courseTitle: course?.title ?? "VibeLogic Bootcamp",
    };
  },
});

export const markEmailJobProcessing = mutation({
  args: {
    jobId: v.id("emailJobs"),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) throw new Error("Email job not found");

    if (job.status !== "pending") {
      throw new Error("Email job is already processing or completed");
    }

    await ctx.db.patch(job._id, {
      status: "processing",
      attempts: job.attempts + 1,
      lastAttemptAt: Date.now(),
    });
  },
});

export const markEmailJobSent = mutation({
  args: {
    jobId: v.id("emailJobs"),
    resendMessageId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) throw new Error("Email job not found");

    // Remove the rawRecoveryToken once the email is sent to avoid keeping raw tokens around
    await ctx.db.patch(job._id, {
      status: "sent",
      resendMessageId: args.resendMessageId,
      rawRecoveryToken: undefined,
    });
  },
});

export const markEmailJobFailed = mutation({
  args: {
    jobId: v.id("emailJobs"),
    errorMessage: v.string(),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) throw new Error("Email job not found");

    await ctx.db.patch(job._id, {
      status: job.attempts >= 5 ? "failed" : "pending", // retry if under 5 attempts
      errorMessage: args.errorMessage,
    });
  },
});
