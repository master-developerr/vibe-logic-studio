import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const validateCoupon = query({
  args: {
    code: v.string(),
    courseId: v.id("courses"),
    currentAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const normalizedCode = args.code.trim().toUpperCase();
    if (!normalizedCode) {
      return { valid: false, error: "Please enter a coupon code" };
    }

    const coupon = await ctx.db
      .query("coupons")
      .withIndex("by_code", (q) => q.eq("code", normalizedCode))
      .first();

    if (!coupon || !coupon.isActive) {
      return { valid: false, error: "Invalid or inactive coupon code" };
    }

    if (coupon.expiresAt && coupon.expiresAt < Date.now()) {
      return { valid: false, error: "This coupon has expired" };
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return { valid: false, error: "This coupon has reached its maximum redemption limit" };
    }

    if (coupon.courseId && coupon.courseId !== args.courseId) {
      return { valid: false, error: "This coupon is not applicable to the selected course" };
    }

    if (coupon.minPurchaseAmount && args.currentAmount < coupon.minPurchaseAmount) {
      return {
        valid: false,
        error: `Minimum purchase amount of ₹${coupon.minPurchaseAmount.toLocaleString("en-IN")} required`,
      };
    }

    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = Math.round((args.currentAmount * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    discountAmount = Math.min(discountAmount, args.currentAmount);
    const finalAmount = Math.max(0, args.currentAmount - discountAmount);

    return {
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      finalAmount,
    };
  },
});

export const applyCouponToPurchase = mutation({
  args: {
    purchaseId: v.id("purchases"),
    sessionToken: v.string(),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const purchase = await ctx.db.get(args.purchaseId);
    if (!purchase) throw new Error("Purchase not found");

    if (purchase.sessionToken !== args.sessionToken) {
      throw new Error("Unauthorized purchase session");
    }

    const normalizedCode = args.code.trim().toUpperCase();
    const coupon = await ctx.db
      .query("coupons")
      .withIndex("by_code", (q) => q.eq("code", normalizedCode))
      .first();

    if (!coupon || !coupon.isActive) {
      throw new Error("Invalid or inactive coupon code");
    }

    if (coupon.expiresAt && coupon.expiresAt < Date.now()) {
      throw new Error("This coupon has expired");
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw new Error("This coupon has reached its redemption limit");
    }

    if (coupon.courseId && coupon.courseId !== purchase.courseId) {
      throw new Error("This coupon is not applicable to the selected program");
    }

    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = Math.round((purchase.originalPrice * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    discountAmount = Math.min(discountAmount, purchase.originalPrice);
    const finalAmount = Math.max(0, purchase.originalPrice - discountAmount);

    await ctx.db.patch(purchase._id, {
      couponCode: coupon.code,
      discountAmount,
      amount: finalAmount,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      couponCode: coupon.code,
      discountAmount,
      finalAmount,
    };
  },
});
