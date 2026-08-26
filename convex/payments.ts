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
  courseId: Id<"courses">
) {
  const enrollments = await ctx.db
    .query("enrollments")
    .withIndex("by_user_id", (q) => q.eq("userId", userId))
    .filter((q) =>
      q.and(
        q.eq(q.field("courseId"), courseId),
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

    const enrollment = await findActiveEnrollment(ctx, user._id, args.courseId);
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
