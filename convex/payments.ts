import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Creates a pending payment record in the database when a checkout is initiated.
 */
export const createPendingPayment = internalMutation({
  args: {
    clerkId: v.string(),
    razorpayOrderId: v.string(),
    amount: v.number(),
    courseId: v.id("courses"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const course = await ctx.db.get(args.courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    const taxAmount = Math.round(args.amount * 0.18);
    const netAmount = args.amount - taxAmount;

    const paymentId = await ctx.db.insert("payments", {
      userId: user._id,
      razorpayOrderId: args.razorpayOrderId,
      amount: args.amount,
      status: "pending",
      createdAt: Date.now(),
      currency: "INR",
      gateway: "Razorpay",
      courseId: args.courseId,
      courseTitle: course.title,
      customerName: user.name,
      customerEmail: user.email,
      taxAmount,
      netAmount,
      invoiceNumber: `INV-2026-${args.razorpayOrderId.slice(-4).toUpperCase()}`,
    });

    return paymentId;
  },
});

/**
 * Fulfills an enrollment after a successful Razorpay payment capture.
 * This is triggered securely via the Razorpay webhook.
 */
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
    // 1. Fetch user record
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // 2. Locate or create the payment record
    const existingPayment = await ctx.db
      .query("payments")
      .filter((q) => q.eq(q.field("razorpayOrderId"), args.razorpayOrderId))
      .first();

    const taxAmount = Math.round(args.amount * 0.18);
    const netAmount = args.amount - taxAmount;
    
    let paymentId = existingPayment?._id;

    if (existingPayment) {
      await ctx.db.patch(existingPayment._id, {
        status: "successful",
        razorpayOrderId: args.razorpayOrderId,
        paymentMethod: args.paymentMethod ?? "UPI",
        taxAmount,
        netAmount,
        payoutStatus: "Pending",
      });
    } else {
      const course = await ctx.db.get(args.courseId);
      paymentId = await ctx.db.insert("payments", {
        userId: user._id,
        razorpayOrderId: args.razorpayOrderId,
        amount: args.amount,
        status: "successful",
        createdAt: Date.now(),
        currency: "INR",
        gateway: args.gateway ?? "Razorpay",
        paymentMethod: args.paymentMethod ?? "UPI",
        courseId: args.courseId,
        courseTitle: course?.title ?? "VibeLogic Course",
        customerName: user.name,
        customerEmail: user.email,
        taxAmount,
        netAmount,
        invoiceNumber: `INV-2026-${args.razorpayOrderId.slice(-4).toUpperCase()}`,
        payoutStatus: "Pending",
      });
    }

    // 3. Verify if user is already enrolled
    const existingEnrollment = await ctx.db
      .query("enrollments")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("courseId"), args.courseId))
      .first();

    if (existingEnrollment) {
      // If enrollment exists but is inactive, activate it and update batch
      if (existingEnrollment.status !== "active") {
        await ctx.db.patch(existingEnrollment._id, {
          status: "active",
          batchId: args.batchId,
          paymentId,
        });

        const batch = await ctx.db.get(args.batchId);
        if (batch) {
          if (batch.enrolledCount >= batch.capacity) {
            await ctx.db.patch(existingEnrollment._id, {
              notes: "OVERFLOW: Batch reached capacity. Needs manual review.",
            });
          } else {
            await ctx.db.patch(args.batchId, {
              enrolledCount: batch.enrolledCount + 1,
            });
          }
        }
      }
      return { success: true, enrollmentId: existingEnrollment._id };
    }

    // 4. Create new enrollment
    const enrollmentId = await ctx.db.insert("enrollments", {
      userId: user._id,
      courseId: args.courseId,
      batchId: args.batchId,
      paymentId,
      status: "active",
      progress: 0,
      enrolledAt: Date.now(),
      completedLessons: [],
    });

    // 5. Update batch count
    const batch = await ctx.db.get(args.batchId);
    if (batch) {
      if (batch.enrolledCount >= batch.capacity) {
        // Flag for manual admin intervention instead of over-enrolling
        await ctx.db.patch(enrollmentId, {
          notes: "OVERFLOW: Batch reached capacity. Needs manual review.",
        });
      } else {
        await ctx.db.patch(args.batchId, {
          enrolledCount: batch.enrolledCount + 1,
        });
      }
    }

    // 6. Log enrollment activity
    const course = await ctx.db.get(args.courseId);
    await ctx.db.insert("activities", {
      userId: user._id,
      courseId: args.courseId,
      batchId: args.batchId,
      type: "Lesson Completed", // We can use "Lesson Completed" or add a new activity logger
      title: `Enrolled in course: ${course?.title || "Course"}`,
      timestamp: Date.now(),
      resourceId: enrollmentId,
    });

    return { success: true, enrollmentId };
  },
});
