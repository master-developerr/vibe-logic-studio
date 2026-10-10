import {
  internalMutation,
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

type CourseBatchArgs = {
  courseId: Id<"courses">;
  batchId: Id<"batches">;
};

async function requireCourseBatch(
  ctx: QueryCtx | MutationCtx,
  args: CourseBatchArgs
) {
  const [course, batch] = await Promise.all([
    ctx.db.get(args.courseId),
    ctx.db.get(args.batchId),
  ]);

  if (!course) throw new Error("Course not found");
  if (!batch || batch.courseId !== args.courseId) {
    throw new Error("The selected batch does not belong to this course");
  }

  return { course, batch };
}

async function requireCurrentUser(ctx: MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");

  const existingUser = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();

  if (existingUser) return existingUser;

  const userId = await ctx.db.insert("users", {
    clerkId: identity.subject,
    email: identity.email ?? "",
    name: identity.name ?? "User",
    avatarUrl: identity.pictureUrl ?? "",
    role: "student",
    createdAt: Date.now(),
  });

  const user = await ctx.db.get(userId);
  if (!user) throw new Error("Unable to synchronize the authenticated user");
  return user;
}

async function findActiveEnrollment(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  args: CourseBatchArgs
) {
  const exact = await ctx.db
    .query("enrollments")
    .withIndex("by_user_course_batch", (q) =>
      q.eq("userId", userId).eq("courseId", args.courseId).eq("batchId", args.batchId)
    )
    .filter((q) => q.eq(q.field("status"), "active"))
    .first();

  if (exact) return exact;

  const enrollments = await ctx.db
    .query("enrollments")
    .withIndex("by_user_id", (q) => q.eq("userId", userId))
    .filter((q) =>
      q.and(
        q.eq(q.field("courseId"), args.courseId),
        q.eq(q.field("status"), "active")
      )
    )
    .collect();

  return enrollments.sort((a, b) => b.enrolledAt - a.enrolledAt)[0] ?? null;
}

async function findSuccessfulPayment(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  args: CourseBatchArgs
) {
  const matchingPayments = await ctx.db
    .query("payments")
    .withIndex("by_user_id", (q) => q.eq("userId", userId))
    .filter((q) =>
      q.and(
        q.eq(q.field("courseId"), args.courseId),
        q.eq(q.field("status"), "successful")
      )
    )
    .collect();

  const payments = matchingPayments.sort((a, b) => b.createdAt - a.createdAt);
  return payments.find((payment) => payment.batchId === args.batchId)
    ?? payments.find((payment) => payment.batchId === undefined)
    ?? null;
}

async function activateEnrollment(
  ctx: MutationCtx,
  userId: Id<"users">,
  args: CourseBatchArgs & { paymentId: Id<"payments"> }
) {
  const existing = await ctx.db
    .query("enrollments")
    .withIndex("by_user_course_batch", (q) =>
      q.eq("userId", userId).eq("courseId", args.courseId).eq("batchId", args.batchId)
    )
    .first();

  if (existing?.status === "active") {
    if (existing.paymentId !== args.paymentId) {
      await ctx.db.patch(existing._id, { paymentId: args.paymentId });
    }
    return existing._id;
  }

  const batch = await ctx.db.get(args.batchId);
  if (!batch || batch.courseId !== args.courseId) {
    throw new Error("The selected batch does not belong to this course");
  }
  if (batch.enrolledCount >= batch.capacity) {
    throw new Error("The selected batch is full");
  }

  if (existing) {
    await ctx.db.patch(existing._id, {
      status: "active",
      paymentId: args.paymentId,
      enrolledAt: Date.now(),
    });
    await ctx.db.patch(batch._id, { enrolledCount: batch.enrolledCount + 1 });
    return existing._id;
  }

  const enrollmentId = await ctx.db.insert("enrollments", {
    userId,
    courseId: args.courseId,
    batchId: args.batchId,
    paymentId: args.paymentId,
    status: "active",
    progress: 0,
    enrolledAt: Date.now(),
    completedLessons: [],
  });
  await ctx.db.patch(batch._id, { enrolledCount: batch.enrolledCount + 1 });
  return enrollmentId;
}

export const createPendingPayment = mutation({
  args: {
    razorpayOrderId: v.string(),
    amount: v.number(),
    courseId: v.id("courses"),
    batchId: v.id("batches"),
  },
  handler: async (ctx, args) => {
    const [user, { course, batch }] = await Promise.all([
      requireCurrentUser(ctx),
      requireCourseBatch(ctx, args),
    ]);

    if (args.amount !== course.price) {
      throw new Error("Checkout amount does not match the course price");
    }
    if (batch.enrolledCount >= batch.capacity) {
      throw new Error("The selected batch is full");
    }

    const existing = await ctx.db
      .query("payments")
      .filter((q) => q.eq(q.field("razorpayOrderId"), args.razorpayOrderId))
      .first();

    if (existing) {
      if (existing.userId !== user._id || existing.courseId !== args.courseId || existing.batchId !== args.batchId) {
        throw new Error("Payment order does not match this checkout");
      }
      return existing._id;
    }

    const taxAmount = Math.round(args.amount * 0.18);
    return await ctx.db.insert("payments", {
      userId: user._id,
      razorpayOrderId: args.razorpayOrderId,
      amount: args.amount,
      status: "pending",
      createdAt: Date.now(),
      currency: "INR",
      gateway: "Razorpay",
      courseId: args.courseId,
      batchId: args.batchId,
      courseTitle: course.title,
      customerName: user.name,
      customerEmail: user.email,
      taxAmount,
      netAmount: args.amount - taxAmount,
      invoiceNumber: `INV-2026-${args.razorpayOrderId.slice(-4).toUpperCase()}`,
    });
  },
});

export const getCheckoutStatus = query({
  args: {
    courseId: v.id("courses"),
    batchId: v.id("batches"),
  },
  handler: async (ctx, args) => {
    await requireCourseBatch(ctx, args);

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return null;

    const enrollment = await findActiveEnrollment(ctx, user._id, args);
    if (enrollment) {
      return {
        hasActiveEnrollment: true,
        hasSuccessfulPayment: false,
        enrollmentId: enrollment._id,
        batchId: enrollment.batchId,
        courseId: args.courseId,
      };
    }

    const payment = await findSuccessfulPayment(ctx, user._id, args);
    return {
      hasActiveEnrollment: false,
      hasSuccessfulPayment: payment !== null,
      enrollmentId: null,
      batchId: payment?.batchId ?? args.batchId,
      courseId: args.courseId,
    };
  },
});

export const reconcileEnrollment = mutation({
  args: {
    courseId: v.id("courses"),
    batchId: v.id("batches"),
  },
  handler: async (ctx, args) => {
    const [user] = await Promise.all([
      requireCurrentUser(ctx),
      requireCourseBatch(ctx, args),
    ]);

    const payment = await findSuccessfulPayment(ctx, user._id, args);
    if (!payment) throw new Error("No verified successful payment exists for this batch");

    // Historical payments predate batch-scoped storage. Bind them once to the
    // validated checkout batch before creating the missing enrollment.
    if (payment.batchId === undefined) {
      await ctx.db.patch(payment._id, { batchId: args.batchId });
    }

    const enrollmentId = await activateEnrollment(ctx, user._id, {
      ...args,
      paymentId: payment._id,
    });
    return { enrollmentId, batchId: args.batchId };
  },
});

export const confirmPayment = mutation({
  args: {
    razorpayOrderId: v.string(),
    razorpayPaymentId: v.string(),
    courseId: v.id("courses"),
    batchId: v.id("batches"),
  },
  handler: async (ctx, args) => {
    const [user] = await Promise.all([
      requireCurrentUser(ctx),
      requireCourseBatch(ctx, args),
    ]);

    const payment = await ctx.db
      .query("payments")
      .filter((q) => q.eq(q.field("razorpayOrderId"), args.razorpayOrderId))
      .first();

    if (!payment) throw new Error("Payment order not found");
    if (payment.userId !== user._id) {
      throw new Error("Payment order does not belong to the authenticated user");
    }
    if (payment.courseId !== args.courseId || payment.batchId !== args.batchId) {
      throw new Error("Payment order does not match this course and batch");
    }

    const taxAmount = Math.round(payment.amount * 0.18);
    await ctx.db.patch(payment._id, {
      status: "successful",
      paymentMethod: "Razorpay Checkout",
      taxAmount,
      netAmount: payment.amount - taxAmount,
      payoutStatus: "Pending",
    });

    const enrollmentId = await activateEnrollment(ctx, user._id, {
      courseId: args.courseId,
      batchId: args.batchId,
      paymentId: payment._id,
    });
    return { success: true, enrollmentId, batchId: args.batchId };
  },
});

export const fulfillEnrollment = internalMutation({
  args: {
    clerkId: v.string(),
    courseId: v.id("courses"),
    batchId: v.id("batches"),
    amount: v.number(),
    razorpayOrderId: v.string(),
    razorpayPaymentId: v.optional(v.string()),
    paymentMethod: v.optional(v.string()),
    gateway: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { course } = await requireCourseBatch(ctx, args);
    if (args.amount !== course.price) {
      throw new Error("Checkout amount does not match the course price");
    }

    let user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    if (!user) {
      const userId = await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: "",
        name: "User",
        avatarUrl: "",
        role: "student",
        createdAt: Date.now(),
      });
      user = await ctx.db.get(userId);
    }
    if (!user) throw new Error("Unable to synchronize payment user");

    const existingPayment = await ctx.db
      .query("payments")
      .filter((q) => q.eq(q.field("razorpayOrderId"), args.razorpayOrderId))
      .first();
    if (existingPayment && (existingPayment.userId !== user._id || existingPayment.courseId !== args.courseId || existingPayment.batchId !== args.batchId)) {
      throw new Error("Payment order does not match this course and batch");
    }

    const taxAmount = Math.round(args.amount * 0.18);
    const paymentId = existingPayment?._id ?? await ctx.db.insert("payments", {
      userId: user._id,
      razorpayOrderId: args.razorpayOrderId,
      amount: args.amount,
      status: "successful",
      createdAt: Date.now(),
      currency: "INR",
      gateway: args.gateway ?? "Razorpay",
      paymentMethod: args.paymentMethod ?? "Razorpay Checkout",
      courseId: args.courseId,
      batchId: args.batchId,
      courseTitle: course.title,
      customerName: user.name,
      customerEmail: user.email,
      taxAmount,
      netAmount: args.amount - taxAmount,
      invoiceNumber: `INV-2026-${args.razorpayOrderId.slice(-4).toUpperCase()}`,
      payoutStatus: "Pending",
    });

    if (existingPayment) {
      await ctx.db.patch(existingPayment._id, {
        status: "successful",
        paymentMethod: args.paymentMethod ?? "Razorpay Checkout",
        payoutStatus: "Pending",
        taxAmount,
        netAmount: args.amount - taxAmount,
      });
    }

    const enrollmentId = await activateEnrollment(ctx, user._id, {
      courseId: args.courseId,
      batchId: args.batchId,
      paymentId,
    });
    return { success: true, enrollmentId, batchId: args.batchId };
  },
});

export const fulfillPurchasePayment = mutation({
  args: {
    purchaseId: v.id("purchases"),
    razorpayOrderId: v.string(),
    razorpayPaymentId: v.string(),
    amount: v.number(),
    paymentMethod: v.optional(v.string()),
    gateway: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const purchase = await ctx.db.get(args.purchaseId);
    if (!purchase) throw new Error("Purchase not found");

    const [course, batch] = await Promise.all([
      ctx.db.get(purchase.courseId),
      ctx.db.get(purchase.batchId),
    ]);

    // Idempotency: If already verified, return success without duplicating side effects
    if (purchase.paymentStatus === "verified") {
      return {
        success: true,
        alreadyVerified: true,
        purchaseId: purchase._id,
        courseSlug: course?.slug,
        courseId: purchase.courseId,
        batchId: purchase.batchId,
        oversubscribed: purchase.entitlementStatus === "pending_reconciliation",
      };
    }

    // Security: Validate amount matches server-calculated purchase price
    if (purchase.amount !== args.amount) {
      throw new Error(`Payment amount mismatch: expected ₹${purchase.amount}, received ₹${args.amount}`);
    }

    // Security: Validate order ID matches bound order ID if set
    if (purchase.razorpayOrderId && purchase.razorpayOrderId !== args.razorpayOrderId) {
      throw new Error(`Order ID mismatch: expected ${purchase.razorpayOrderId}, received ${args.razorpayOrderId}`);
    }

    if (!course || !batch) {
      throw new Error("Associated course or batch record not found");
    }

    // Concurrency protection: Check if batch was filled while payment was being processed
    const isOverCapacity = batch.enrolledCount >= batch.capacity;

    if (isOverCapacity) {
      // Concurrency protection: payment arrived after cohort was filled by concurrent checkouts.
      // 1. Never discard a verified payment.
      // 2. Do not increment enrolledCount past capacity.
      // 3. Mark entitlementStatus as "pending_reconciliation".
      // 4. Log detailed reason in reassignedReason for admin visibility.
      await ctx.db.patch(purchase._id, {
        paymentStatus: "verified",
        entitlementStatus: "pending_reconciliation",
        razorpayPaymentId: args.razorpayPaymentId,
        reassignedReason: `BATCH_CAPACITY_EXHAUSTED: Verified payment arrived after cohort ${batch.title} reached capacity (${batch.enrolledCount}/${batch.capacity}). Awaiting admin reconciliation or waitlist.`,
        updatedAt: Date.now(),
      });
    } else {
      // Normal seat allocation
      await ctx.db.patch(batch._id, {
        enrolledCount: batch.enrolledCount + 1,
      });

      await ctx.db.patch(purchase._id, {
        paymentStatus: "verified",
        entitlementStatus: "pending_claim",
        razorpayPaymentId: args.razorpayPaymentId,
        updatedAt: Date.now(),
      });
    }

    // Increment coupon usage count if applied
    if (purchase.couponCode) {
      const coupon = await ctx.db
        .query("coupons")
        .withIndex("by_code", (q) => q.eq("code", purchase.couponCode!))
        .first();
      if (coupon) {
        await ctx.db.patch(coupon._id, {
          usageCount: coupon.usageCount + 1,
        });
      }
    }

    // Activate draft email job for verified payment
    const draftEmailJob = await ctx.db
      .query("emailJobs")
      .withIndex("by_purchase_id", (q) => q.eq("purchaseId", purchase._id))
      .filter((q) => q.eq(q.field("status"), "draft"))
      .first();

    if (draftEmailJob) {
      await ctx.db.patch(draftEmailJob._id, {
        status: "pending",
      });
    }

    // Record verified transaction in payments table
    const taxAmount = Math.round(args.amount * 0.18);
    await ctx.db.insert("payments", {
      purchaseId: purchase._id,
      razorpayOrderId: args.razorpayOrderId,
      amount: args.amount,
      status: "successful",
      createdAt: Date.now(),
      currency: "INR",
      gateway: args.gateway ?? "Razorpay",
      paymentMethod: args.paymentMethod ?? "Razorpay Checkout",
      courseId: purchase.courseId,
      batchId: purchase.batchId,
      courseTitle: course.title,
      customerName: purchase.buyerName,
      customerEmail: purchase.buyerEmail,
      couponCode: purchase.couponCode,
      discountAmount: purchase.discountAmount,
      taxAmount,
      netAmount: args.amount - taxAmount,
      invoiceNumber: `INV-2026-${args.razorpayOrderId.slice(-4).toUpperCase()}`,
      payoutStatus: "Pending",
    });

    return {
      success: true,
      purchaseId: purchase._id,
      courseSlug: course.slug,
      courseId: course._id,
      batchId: batch._id,
      oversubscribed: isOverCapacity,
    };
  },
});

export const recordFailedPayment = mutation({
  args: {
    purchaseId: v.optional(v.id("purchases")),
    razorpayOrderId: v.string(),
    razorpayPaymentId: v.optional(v.string()),
    errorCode: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.purchaseId) {
      const purchase = await ctx.db.get(args.purchaseId);
      if (purchase && purchase.paymentStatus === "pending") {
        await ctx.db.patch(purchase._id, {
          paymentStatus: "failed",
          updatedAt: Date.now(),
        });
      }
    }

    const existingPayment = await ctx.db
      .query("payments")
      .filter((q) => q.eq(q.field("razorpayOrderId"), args.razorpayOrderId))
      .first();

    if (existingPayment) {
      await ctx.db.patch(existingPayment._id, {
        status: "failed",
        errorCode: args.errorCode,
        errorMessage: args.errorMessage,
      });
    }

    return { success: true };
  },
});

