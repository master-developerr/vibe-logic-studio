import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdminOrInstructor } from "./auth_helpers";

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

export const getEmailStatusForEnrollment = query({
  args: {
    enrollmentId: v.id("enrollments"),
  },
  handler: async (ctx, args) => {
    const enrollment = await ctx.db.get(args.enrollmentId);
    if (!enrollment) return null;

    const job = await ctx.db
      .query("emailJobs")
      .withIndex("by_enrollment_id", (q) => q.eq("enrollmentId", args.enrollmentId))
      .order("desc")
      .first();

    return {
      status: enrollment.onboardingEmailStatus || job?.status || "pending",
      sentAt: enrollment.onboardingEmailSentAt || job?.lastAttemptAt,
      lastError: enrollment.onboardingEmailLastError || job?.errorMessage,
      retryCount: enrollment.onboardingEmailRetryCount || job?.attempts || 0,
      resendMessageId: enrollment.onboardingEmailMessageId || job?.resendMessageId,
      jobId: job?._id,
    };
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

    // Idempotency check: Has an onboarding email already been sent for this purchase?
    const alreadySentJob = await ctx.db
      .query("emailJobs")
      .withIndex("by_purchase_id", (q) => q.eq("purchaseId", args.purchaseId))
      .filter((q) => q.eq(q.field("status"), "sent"))
      .first();

    if (alreadySentJob) {
      console.log(`[ONBOARDING] Duplicate email prevented for purchase ${args.purchaseId} (${purchase.buyerEmail})`);
      return { alreadySent: true as const, recipientEmail: purchase.buyerEmail };
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
      alreadySent: false as const,
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

    let courseTitle = "VibeLogic Bootcamp";

    if (job.purchaseId) {
      const purchase = await ctx.db.get(job.purchaseId);
      if (!purchase || purchase.paymentStatus !== "verified") {
        await ctx.db.patch(job._id, {
          status: "failed",
          errorMessage: "Associated purchase is not verified",
        });
        return null;
      }
      const course = await ctx.db.get(purchase.courseId);
      if (course?.title) courseTitle = course.title;
    } else if (job.courseId) {
      const course = await ctx.db.get(job.courseId);
      if (course?.title) courseTitle = course.title;
    }

    await ctx.db.patch(job._id, {
      status: "processing",
      attempts: job.attempts + 1,
      lastAttemptAt: Date.now(),
    });

    return {
      ...job,
      courseTitle,
    };
  },
});

export const claimJobById = mutation({
  args: {
    jobId: v.id("emailJobs"),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) return null;

    if (job.status === "sent") {
      console.log(`[ONBOARDING] Duplicate email prevented for job ${args.jobId} (${job.recipientEmail})`);
      return { ...job, alreadySent: true as const, courseTitle: "VibeLogic Bootcamp" };
    }

    let courseTitle = "VibeLogic Bootcamp";
    if (job.courseId) {
      const course = await ctx.db.get(job.courseId);
      if (course?.title) courseTitle = course.title;
    } else if (job.purchaseId) {
      const purchase = await ctx.db.get(job.purchaseId);
      if (purchase?.courseId) {
        const course = await ctx.db.get(purchase.courseId);
        if (course?.title) courseTitle = course.title;
      }
    }

    await ctx.db.patch(job._id, {
      status: "processing",
      attempts: job.attempts + 1,
      lastAttemptAt: Date.now(),
    });

    return {
      ...job,
      alreadySent: false,
      courseTitle,
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

    const now = Date.now();

    await ctx.db.patch(job._id, {
      status: "sent",
      resendMessageId: args.resendMessageId,
      rawRecoveryToken: undefined,
      lastAttemptAt: now,
    });

    // Synchronize status to linked enrollment if present
    if (job.enrollmentId) {
      await ctx.db.patch(job.enrollmentId, {
        onboardingEmailStatus: "sent",
        onboardingEmailSentAt: now,
        onboardingEmailMessageId: args.resendMessageId,
        onboardingEmailLastError: undefined,
      });
    } else if (job.purchaseId) {
      // Look up any enrollment matching this purchase
      const purchase = await ctx.db.get(job.purchaseId);
      if (purchase?.claimedByUserId && purchase.batchId) {
        const enrollment = await ctx.db
          .query("enrollments")
          .withIndex("by_user_course_batch", (q) =>
            q.eq("userId", purchase.claimedByUserId!).eq("courseId", purchase.courseId).eq("batchId", purchase.batchId)
          )
          .first();
        if (enrollment) {
          await ctx.db.patch(enrollment._id, {
            onboardingEmailStatus: "sent",
            onboardingEmailSentAt: now,
            onboardingEmailMessageId: args.resendMessageId,
            onboardingEmailLastError: undefined,
          });
        }
      }
    }
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

    const willRetry = job.attempts < 5;
    const now = Date.now();

    await ctx.db.patch(job._id, {
      status: willRetry ? "pending" : "failed",
      errorMessage: args.errorMessage,
      lastAttemptAt: now,
    });

    if (job.enrollmentId) {
      await ctx.db.patch(job.enrollmentId, {
        onboardingEmailStatus: "failed",
        onboardingEmailLastError: args.errorMessage,
        onboardingEmailRetryCount: job.attempts,
      });
    }
  },
});

export const resendDashboardAccessEmail = mutation({
  args: {
    enrollmentId: v.optional(v.id("enrollments")),
    purchaseId: v.optional(v.id("purchases")),
    studentId: v.optional(v.id("users")),
    batchId: v.optional(v.id("batches")),
  },
  handler: async (ctx, args) => {
    await requireAdminOrInstructor(ctx);

    let enrollment = args.enrollmentId ? await ctx.db.get(args.enrollmentId) : null;
    let purchase = args.purchaseId ? await ctx.db.get(args.purchaseId) : null;
    let student = args.studentId ? await ctx.db.get(args.studentId) : null;

    if (!enrollment && student && args.batchId) {
      enrollment = await ctx.db
        .query("enrollments")
        .withIndex("by_batch_id", (q) => q.eq("batchId", args.batchId!))
        .filter((q) => q.eq(q.field("userId"), student!._id))
        .first();
    }

    if (enrollment && !student) {
      student = await ctx.db.get(enrollment.userId);
    }

    const recipientEmail = student?.email || purchase?.buyerEmail;
    const recipientName = student?.name || purchase?.buyerName || "Student";

    if (!recipientEmail) {
      throw new Error("Unable to resolve recipient email address for resend");
    }

    const now = Date.now();

    // Check if an existing job exists for this enrollment or purchase
    let job = null;
    if (enrollment) {
      job = await ctx.db
        .query("emailJobs")
        .withIndex("by_enrollment_id", (q) => q.eq("enrollmentId", enrollment!._id))
        .first();
    }
    if (!job && purchase) {
      job = await ctx.db
        .query("emailJobs")
        .withIndex("by_purchase_id", (q) => q.eq("purchaseId", purchase!._id))
        .first();
    }

    let jobId;
    if (job) {
      await ctx.db.patch(job._id, {
        status: "pending",
        attempts: 0,
        errorMessage: undefined,
        lastAttemptAt: now,
      });
      jobId = job._id;
    } else {
      jobId = await ctx.db.insert("emailJobs", {
        enrollmentId: enrollment?._id,
        purchaseId: purchase?._id,
        userId: student?._id,
        batchId: enrollment?.batchId || purchase?.batchId,
        courseId: enrollment?.courseId || purchase?.courseId,
        recipientEmail,
        recipientName,
        type: "welcome_access",
        status: "pending",
        attempts: 0,
        createdAt: now,
      });
    }

    if (enrollment) {
      await ctx.db.patch(enrollment._id, {
        onboardingEmailStatus: "pending",
        onboardingEmailLastError: undefined,
        onboardingEmailRetryCount: (enrollment.onboardingEmailRetryCount || 0) + 1,
      });
    }

    console.log(`[ONBOARDING] Admin re-queued dashboard access email for ${recipientEmail}`);

    return {
      success: true,
      jobId,
      recipientEmail,
      recipientName,
      purchaseId: purchase?._id,
    };
  },
});

