import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth_helpers";

export const createPurchaseSession = mutation({
  args: {
    buyerName: v.string(),
    buyerEmail: v.string(),
    courseId: v.id("courses"),
    batchId: v.id("batches"),
    sessionToken: v.string(),
    recoveryTokenHash: v.string(),
    rawRecoveryToken: v.string(),
  },
  handler: async (ctx, args) => {
    const course = await ctx.db.get(args.courseId);
    if (!course) throw new Error("Course not found");

    const batch = await ctx.db.get(args.batchId);
    if (!batch || batch.courseId !== args.courseId) {
      throw new Error("Invalid batch selected for this course");
    }

    if (batch.enrolledCount >= batch.capacity) {
      throw new Error("Selected batch is full");
    }

    const normalizedEmail = args.buyerEmail.trim().toLowerCase();
    const normalizedName = args.buyerName.trim();

    if (normalizedName.length < 2) {
      throw new Error("Name must be at least 2 characters");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      throw new Error("Invalid email address format");
    }

    const now = Date.now();
    const sessionTokenExpiresAt = now + 7 * 24 * 60 * 60 * 1000; // 7 days
    const recoveryTokenExpiresAt = now + 7 * 24 * 60 * 60 * 1000; // 7 days

    const purchaseId = await ctx.db.insert("purchases", {
      buyerName: normalizedName,
      buyerEmail: normalizedEmail,
      courseId: args.courseId,
      batchId: args.batchId,
      amount: course.price,
      currency: "INR",
      originalPrice: course.price,
      paymentStatus: "pending",
      claimStatus: "unclaimed",
      entitlementStatus: "pending_claim",
      sessionToken: args.sessionToken,
      sessionTokenExpiresAt,
      recoveryTokenHash: args.recoveryTokenHash,
      recoveryTokenExpiresAt,
      detailsConfirmed: false,
      whatsappJoined: false,
      onboardingCompleted: false,
      createdAt: now,
      updatedAt: now,
    });

    // Create a draft email job that will be activated upon verified payment
    await ctx.db.insert("emailJobs", {
      purchaseId,
      recipientEmail: normalizedEmail,
      recipientName: normalizedName,
      type: "welcome_access",
      status: "draft",
      attempts: 0,
      rawRecoveryToken: args.rawRecoveryToken,
      createdAt: now,
    });

    return {
      purchaseId,
      sessionToken: args.sessionToken,
      amount: course.price,
      courseSlug: course.slug,
    };
  },
});

export const getPurchaseForCheckout = query({
  args: {
    purchaseId: v.id("purchases"),
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    const purchase = await ctx.db.get(args.purchaseId);
    if (!purchase) return null;

    if (purchase.sessionToken !== args.sessionToken) {
      return null;
    }

    if (purchase.sessionTokenExpiresAt < Date.now()) {
      return null;
    }

    const course = await ctx.db.get(purchase.courseId);
    const batch = await ctx.db.get(purchase.batchId);

    if (!course || !batch) return null;

    return {
      purchaseId: purchase._id,
      buyerName: purchase.buyerName,
      buyerEmail: purchase.buyerEmail,
      amount: purchase.amount,
      originalPrice: purchase.originalPrice,
      discountAmount: purchase.discountAmount ?? 0,
      couponCode: purchase.couponCode,
      currency: purchase.currency,
      paymentStatus: purchase.paymentStatus,
      course: {
        id: course._id,
        title: course.title,
        slug: course.slug,
        category: course.category,
      },
      batch: {
        id: batch._id,
        title: batch.title,
        startDate: batch.startDate,
        capacity: batch.capacity,
        enrolledCount: batch.enrolledCount,
      },
    };
  },
});

export const getPurchaseForOnboarding = query({
  args: {
    purchaseId: v.id("purchases"),
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    const purchase = await ctx.db.get(args.purchaseId);
    if (!purchase) return null;

    if (purchase.sessionToken !== args.sessionToken) {
      return null;
    }

    const course = await ctx.db.get(purchase.courseId);
    const batch = await ctx.db.get(purchase.batchId);

    return {
      purchaseId: purchase._id,
      buyerName: purchase.buyerName,
      buyerEmail: purchase.buyerEmail,
      paymentStatus: purchase.paymentStatus,
      claimStatus: purchase.claimStatus,
      detailsConfirmed: purchase.detailsConfirmed ?? false,
      whatsappJoined: purchase.whatsappJoined ?? false,
      onboardingCompleted: purchase.onboardingCompleted ?? false,
      course: course ? { title: course.title, slug: course.slug } : null,
      batch: batch ? { title: batch.title, whatsappLink: batch.whatsappLink } : null,
    };
  },
});

export const updateBuyerDetails = mutation({
  args: {
    purchaseId: v.id("purchases"),
    sessionToken: v.string(),
    buyerName: v.string(),
    buyerEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const purchase = await ctx.db.get(args.purchaseId);
    if (!purchase) throw new Error("Purchase not found");

    if (purchase.sessionToken !== args.sessionToken) {
      throw new Error("Unauthorized purchase session");
    }

    if (purchase.claimStatus === "claimed") {
      throw new Error("Cannot alter buyer details after purchase has been claimed");
    }

    const normalizedEmail = args.buyerEmail.trim().toLowerCase();
    const normalizedName = args.buyerName.trim();

    if (normalizedName.length < 2) {
      throw new Error("Name must be at least 2 characters");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      throw new Error("Invalid email format");
    }

    const emailHistory = purchase.emailHistory ?? [];
    if (normalizedEmail !== purchase.buyerEmail) {
      emailHistory.push({
        email: purchase.buyerEmail,
        changedAt: Date.now(),
      });
    }

    await ctx.db.patch(purchase._id, {
      buyerName: normalizedName,
      buyerEmail: normalizedEmail,
      emailHistory,
      detailsConfirmed: true,
      updatedAt: Date.now(),
    });

    // Update payment customerEmail & customerName if already created
    const payment = await ctx.db
      .query("payments")
      .withIndex("by_purchase_id", (q) => q.eq("purchaseId", purchase._id))
      .first();

    if (payment) {
      await ctx.db.patch(payment._id, {
        customerEmail: normalizedEmail,
        customerName: normalizedName,
      });
    }

    // Update pending email jobs to target the updated email address
    const pendingJobs = await ctx.db
      .query("emailJobs")
      .withIndex("by_purchase_id", (q) => q.eq("purchaseId", purchase._id))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();

    for (const job of pendingJobs) {
      await ctx.db.patch(job._id, {
        recipientEmail: normalizedEmail,
        recipientName: normalizedName,
      });
    }

    return { success: true };
  },
});

export const updateOnboardingProgress = mutation({
  args: {
    purchaseId: v.id("purchases"),
    sessionToken: v.string(),
    whatsappJoined: v.optional(v.boolean()),
    onboardingCompleted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const purchase = await ctx.db.get(args.purchaseId);
    if (!purchase) throw new Error("Purchase not found");

    if (purchase.sessionToken !== args.sessionToken) {
      throw new Error("Unauthorized purchase session");
    }

    const updates: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.whatsappJoined !== undefined) updates.whatsappJoined = args.whatsappJoined;
    if (args.onboardingCompleted !== undefined) updates.onboardingCompleted = args.onboardingCompleted;

    await ctx.db.patch(purchase._id, updates);
    return { success: true };
  },
});

export const bindRazorpayOrder = mutation({
  args: {
    purchaseId: v.id("purchases"),
    sessionToken: v.string(),
    razorpayOrderId: v.string(),
    amount: v.number(),
    couponCode: v.optional(v.string()),
    discountAmount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const purchase = await ctx.db.get(args.purchaseId);
    if (!purchase) throw new Error("Purchase not found");

    if (purchase.sessionToken !== args.sessionToken) {
      throw new Error("Unauthorized purchase session");
    }

    await ctx.db.patch(purchase._id, {
      razorpayOrderId: args.razorpayOrderId,
      amount: args.amount,
      couponCode: args.couponCode,
      discountAmount: args.discountAmount,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Strictly verifies Clerk authenticated identity and matches verified email
 * against purchase.buyerEmail before linking purchase to student profile.
 */
export const claimPurchase = mutation({
  args: {
    purchaseId: v.id("purchases"),
    recoveryTokenHash: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Authentication required to claim course access");
    }

    const purchase = await ctx.db.get(args.purchaseId);
    if (!purchase) {
      throw new Error("Purchase record not found");
    }

    if (purchase.paymentStatus !== "verified") {
      throw new Error("This purchase has not been verified for payment");
    }

    // Oversubscription guard: Do not activate seat if cohort filled before payment
    if (purchase.entitlementStatus === "pending_reconciliation") {
      throw new Error(
        "This cohort reached maximum capacity before checkout was completed. Your payment has been safely verified and recorded. An administrator will assign you to the next available cohort shortly. Please contact support if you need immediate assistance."
      );
    }

    // Ensure Convex user record exists
    let user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      const userId = await ctx.db.insert("users", {
        clerkId: identity.subject,
        email: identity.email ?? "",
        name: identity.name ?? purchase.buyerName,
        avatarUrl: identity.pictureUrl ?? "",
        role: "student",
        createdAt: Date.now(),
      });
      user = await ctx.db.get(userId);
    }
    if (!user) throw new Error("Unable to synchronize authenticated student");

    // Enforce Email Ownership Match
    const userEmail = (identity.email || user.email || "").toLowerCase().trim();
    const purchaseEmail = purchase.buyerEmail.toLowerCase().trim();

    if (!userEmail) {
      throw new Error("Unable to resolve your authenticated email address from Clerk");
    }

    // Reject unverified Clerk email if flag is explicitly false
    if (identity.emailVerified === false) {
      throw new Error("Please verify your email address in your Clerk account before claiming course access.");
    }

    // A purchase claim token or recovery link must never be sufficient to claim a purchase for an unrelated email.
    // The authenticated Clerk email must match the buyer email.
    if (userEmail !== purchaseEmail) {
      throw new Error(
        `This purchase belongs to ${purchase.buyerEmail}. You are currently signed in as ${userEmail}. To claim access, please sign in with ${purchase.buyerEmail} or contact support for assistance.`
      );
    }

    // If a recovery token hash was provided, validate it matches and is not expired
    if (args.recoveryTokenHash && purchase.recoveryTokenHash) {
      if (args.recoveryTokenHash !== purchase.recoveryTokenHash) {
        throw new Error("Invalid or expired recovery token");
      }
      if (purchase.recoveryTokenExpiresAt && purchase.recoveryTokenExpiresAt < Date.now()) {
        throw new Error("The recovery link has expired. Please use account recovery to claim your purchase.");
      }
    }

    // Check if already claimed by another user
    if (purchase.claimStatus === "claimed" && purchase.claimedByUserId) {
      if (purchase.claimedByUserId !== user._id) {
        throw new Error("This purchase has already been claimed by another account");
      }
    }

    // Mark purchase claimed, grant active entitlement, and invalidate single-use recovery token
    await ctx.db.patch(purchase._id, {
      claimStatus: "claimed",
      entitlementStatus: "active",
      claimedByUserId: user._id,
      claimedAt: Date.now(),
      recoveryTokenHash: undefined, // Single-use redemption: invalidate immediately upon claiming
      updatedAt: Date.now(),
    });

    // Link payment record to user if present
    const payment = await ctx.db
      .query("payments")
      .withIndex("by_purchase_id", (q) => q.eq("purchaseId", purchase._id))
      .first();

    if (payment && !payment.userId) {
      await ctx.db.patch(payment._id, { userId: user._id });
    }

    // Idempotently create or activate enrollment
    const existingEnrollment = await ctx.db
      .query("enrollments")
      .withIndex("by_user_course_batch", (q) =>
        q.eq("userId", user._id).eq("courseId", purchase.courseId).eq("batchId", purchase.batchId)
      )
      .first();

    if (existingEnrollment) {
      if (existingEnrollment.status !== "active") {
        await ctx.db.patch(existingEnrollment._id, { status: "active" });
      }
      return { success: true, batchId: purchase.batchId, courseId: purchase.courseId };
    }

    await ctx.db.insert("enrollments", {
      userId: user._id,
      courseId: purchase.courseId,
      batchId: purchase.batchId,
      paymentId: payment?._id,
      status: "active",
      progress: 0,
      enrolledAt: Date.now(),
      completedLessons: [],
    });

    return { success: true, batchId: purchase.batchId, courseId: purchase.courseId };
  },
});

export const getUnclaimedPurchasesForAuthenticatedUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) return [];

    const userEmail = identity.email.toLowerCase().trim();

    const purchases = await ctx.db
      .query("purchases")
      .withIndex("by_buyer_email", (q) => q.eq("buyerEmail", userEmail))
      .filter((q) =>
        q.and(
          q.eq(q.field("paymentStatus"), "verified"),
          q.eq(q.field("claimStatus"), "unclaimed")
        )
      )
      .collect();

    return Promise.all(
      purchases.map(async (p) => {
        const course = await ctx.db.get(p.courseId);
        const batch = await ctx.db.get(p.batchId);
        return {
          _id: p._id,
          courseTitle: course?.title ?? "Course",
          batchTitle: batch?.title ?? "Batch",
          batchId: p.batchId,
          amount: p.amount,
          currency: p.currency,
          buyerEmail: p.buyerEmail,
          createdAt: p.createdAt,
        };
      })
    );
  },
});

export const getAdminPurchases = query({
  args: {
    statusFilter: v.optional(v.string()), // "all" | "unclaimed" | "claimed"
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const allPurchases = await ctx.db.query("purchases").order("desc").take(50);
    const users = await ctx.db.query("users").collect();
    const courses = await ctx.db.query("courses").collect();
    const batches = await ctx.db.query("batches").collect();

    const userMap = new Map(users.map((u) => [u._id, u]));
    const courseMap = new Map(courses.map((c) => [c._id, c]));
    const batchMap = new Map(batches.map((b) => [b._id, b]));

    const filtered = allPurchases.filter((p) => {
      if (args.statusFilter && args.statusFilter !== "all") {
        return p.claimStatus === args.statusFilter;
      }
      return true;
    });

    return filtered.map((p) => {
      const u = p.claimedByUserId ? userMap.get(p.claimedByUserId) : undefined;
      const c = courseMap.get(p.courseId);
      const b = batchMap.get(p.batchId);

      return {
        ...p,
        claimedUserName: u?.name,
        claimedUserEmail: u?.email,
        courseTitle: c?.title ?? "Course",
        batchTitle: b?.title ?? "Batch",
      };
    });
  },
});

export const reassignPurchaseOwnership = mutation({
  args: {
    purchaseId: v.id("purchases"),
    targetEmail: v.string(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    const purchase = await ctx.db.get(args.purchaseId);
    if (!purchase) throw new Error("Purchase not found");

    if (!args.reason || args.reason.trim().length < 5) {
      throw new Error("A detailed reason (at least 5 characters) is required for ownership reassignment.");
    }

    const normalizedTarget = args.targetEmail.toLowerCase().trim();
    const emailHistory = purchase.emailHistory ?? [];
    emailHistory.push({
      email: purchase.buyerEmail,
      changedAt: Date.now(),
    });

    // Check if target user exists in Convex
    const targetUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", normalizedTarget))
      .first();

    await ctx.db.patch(purchase._id, {
      buyerEmail: normalizedTarget,
      emailHistory,
      claimedByUserId: targetUser?._id,
      claimStatus: targetUser ? "claimed" : "unclaimed",
      entitlementStatus: targetUser ? "active" : "pending_claim",
      reassignedByAdminId: admin._id,
      reassignedReason: args.reason.trim(),
      reassignedAt: Date.now(),
      updatedAt: Date.now(),
    });

    // If target user exists, link enrollment to new owner
    if (targetUser) {
      const existingEnrollment = await ctx.db
        .query("enrollments")
        .withIndex("by_user_course_batch", (q) =>
          q.eq("userId", targetUser._id).eq("courseId", purchase.courseId).eq("batchId", purchase.batchId)
        )
        .first();

      if (!existingEnrollment) {
        await ctx.db.insert("enrollments", {
          userId: targetUser._id,
          courseId: purchase.courseId,
          batchId: purchase.batchId,
          status: "active",
          progress: 0,
          enrolledAt: Date.now(),
          completedLessons: [],
        });
      }
    }

    return { success: true };
  },
});

export const reassignPurchaseBatch = mutation({
  args: {
    purchaseId: v.id("purchases"),
    targetBatchId: v.id("batches"),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    const purchase = await ctx.db.get(args.purchaseId);
    if (!purchase) throw new Error("Purchase not found");

    if (!args.reason || args.reason.trim().length < 5) {
      throw new Error("A reason (at least 5 characters) is required for cohort reassignment");
    }

    const targetBatch = await ctx.db.get(args.targetBatchId);
    if (!targetBatch || targetBatch.courseId !== purchase.courseId) {
      throw new Error("Target cohort not found or does not belong to the same course");
    }

    if (targetBatch.enrolledCount >= targetBatch.capacity) {
      throw new Error("Target cohort is also at maximum capacity");
    }

    // If purchase was already active in the old batch, decrement old batch count
    const oldBatch = await ctx.db.get(purchase.batchId);
    if (
      oldBatch &&
      purchase.entitlementStatus !== "pending_reconciliation" &&
      oldBatch.enrolledCount > 0
    ) {
      await ctx.db.patch(oldBatch._id, {
        enrolledCount: oldBatch.enrolledCount - 1,
      });
    }

    // Increment new batch count
    await ctx.db.patch(targetBatch._id, {
      enrolledCount: targetBatch.enrolledCount + 1,
    });

    // Update purchase record
    await ctx.db.patch(purchase._id, {
      batchId: targetBatch._id,
      entitlementStatus: purchase.claimStatus === "claimed" ? "active" : "pending_claim",
      reassignedByAdminId: admin._id,
      reassignedReason: `REASSIGNED_COHORT: ${args.reason.trim()} (Transferred from ${oldBatch?.title || "previous batch"} to ${targetBatch.title})`,
      reassignedAt: Date.now(),
      updatedAt: Date.now(),
    });

    // If purchase was already claimed and user exists, update or create enrollment table
    if (purchase.claimedByUserId) {
      const existingEnrollment = await ctx.db
        .query("enrollments")
        .withIndex("by_user_course_batch", (q) =>
          q
            .eq("userId", purchase.claimedByUserId!)
            .eq("courseId", purchase.courseId)
            .eq("batchId", purchase.batchId)
        )
        .first();

      if (existingEnrollment) {
        await ctx.db.patch(existingEnrollment._id, {
          batchId: targetBatch._id,
          status: "active",
        });
      } else {
        await ctx.db.insert("enrollments", {
          userId: purchase.claimedByUserId,
          courseId: purchase.courseId,
          batchId: targetBatch._id,
          status: "active",
          progress: 0,
          enrolledAt: Date.now(),
          completedLessons: [],
        });
      }
    }

    return { success: true, targetBatchId: targetBatch._id };
  },
});

