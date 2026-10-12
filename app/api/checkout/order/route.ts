import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Razorpay from "razorpay";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getPurchaseSessionFromCookies } from "@/lib/purchase-session";
import type { Id } from "@/convex/_generated/dataModel";
import { invalidatePurchaseRelatedCaches } from "@/lib/course-cache";
import { dispatchPurchaseEmail } from "@/lib/email-dispatch-service";

function extractRazorpayError(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    const rzp = error as {
      statusCode?: number;
      error?: { code?: string; description?: string };
      description?: string;
      message?: string;
    };
    if (
      rzp.statusCode === 401 ||
      (rzp.error?.code === "BAD_REQUEST_ERROR" &&
        rzp.error?.description?.toLowerCase().includes("authentication"))
    ) {
      return "Razorpay API authentication failed (HTTP 401). Verify that RAZORPAY_KEY_SECRET and NEXT_PUBLIC_RAZORPAY_KEY_ID in server environment variables match an active key pair from your Razorpay Dashboard.";
    }
    if (rzp.error?.description) {
      return rzp.error.description;
    }
    if (rzp.description) {
      return rzp.description;
    }
    if (rzp.message) {
      return rzp.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Failed to create checkout order";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { purchaseId, courseSlug, courseId, batchId: requestedBatchId } = body;

    // 1. Resolve server-side Razorpay credentials
    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim();
    const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim();

    if (!key_id || !key_secret) {
      console.error("[CheckoutOrder] Missing Razorpay server credentials");
      return NextResponse.json(
        {
          error:
            "Razorpay credentials not configured on server. Please ensure NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set in environment variables.",
        },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    // Path A: Payment-first checkout session (if purchaseId is provided)
    if (purchaseId) {
      const sessionToken = await getPurchaseSessionFromCookies();
      if (!sessionToken) {
        return NextResponse.json(
          { error: "Purchase session not found or expired. Please restart checkout from the course page." },
          { status: 401 }
        );
      }

      const purchase = await fetchQuery(api.purchases.getPurchaseForCheckout, {
        purchaseId: purchaseId as Id<"purchases">,
        sessionToken,
      });

      if (!purchase) {
        return NextResponse.json(
          { error: "Invalid purchase session. Please re-enter your details." },
          { status: 403 }
        );
      }

      if (purchase.batch.enrolledCount >= purchase.batch.capacity) {
        return NextResponse.json(
          { error: "The selected batch is full. Please choose another cohort." },
          { status: 400 }
        );
      }

      // Path A1: 100% OFF (free coupon) direct fulfillment without payment gateway
      if (purchase.amount === 0) {
        const freeId = `free_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const result = await fetchMutation(api.payments.fulfillPurchasePayment, {
          purchaseId: purchase.purchaseId,
          razorpayOrderId: freeId,
          razorpayPaymentId: freeId,
          amount: 0,
          paymentMethod: "100% OFF Coupon",
          gateway: "Coupon",
        });

        await invalidatePurchaseRelatedCaches({
          courseSlug: result.courseSlug || purchase.course.slug,
          courseId: result.courseId || purchase.course.id,
          batchId: result.batchId || purchase.batch.id,
        });

        const host = req.headers.get("host") || "localhost:3000";
        const protocol = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

        dispatchPurchaseEmail(purchase.purchaseId, baseUrl).catch((err) => {
          console.error("[CheckoutOrder] Free purchase email dispatch failed:", err);
        });

        return NextResponse.json({
          free: true,
          purchaseId: purchase.purchaseId,
          onboardingUrl: `/checkout/onboarding?purchaseId=${purchase.purchaseId}`,
        });
      }

      const amountInPaise = Math.round(purchase.amount * 100);

      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        notes: {
          purchaseId: purchase.purchaseId.toString(),
          courseId: purchase.course.id.toString(),
          batchId: purchase.batch.id.toString(),
        },
      });

      await fetchMutation(api.purchases.bindRazorpayOrder, {
        purchaseId: purchase.purchaseId,
        sessionToken,
        razorpayOrderId: order.id,
        amount: purchase.amount,
        couponCode: purchase.couponCode,
        discountAmount: purchase.discountAmount,
      });

      return NextResponse.json({
        keyId: key_id,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        courseTitle: purchase.course.title,
        price: purchase.amount,
        buyerName: purchase.buyerName,
        buyerEmail: purchase.buyerEmail,
      });
    }

    // Path B: Authenticated student checkout (if courseSlug or courseId is provided)
    const targetSlug = courseSlug || courseId || "ai-build-sprint";
    const { userId: clerkId, getToken } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        { error: "Authentication required to checkout without a purchase session." },
        { status: 401 }
      );
    }

    let course = await fetchQuery(api.courses.getBySlug, { slug: targetSlug });
    if (!course && (targetSlug === "ai-build-sprint" || targetSlug === "build-software-with-ai")) {
      const altSlug = targetSlug === "ai-build-sprint" ? "build-software-with-ai" : "ai-build-sprint";
      course = await fetchQuery(api.courses.getBySlug, { slug: altSlug });
    }

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    let batch = requestedBatchId
      ? course.batches.find((candidate) => candidate._id === requestedBatchId)
      : undefined;

    if (!batch && course.batches.length > 0) {
      const upcomingWithCapacity = course.batches.find(
        (candidate) =>
          candidate.capacity > candidate.enrolledCount &&
          (candidate.status === "upcoming" || candidate.status === "live")
      );
      batch = upcomingWithCapacity || course.batches[0];
    }

    if (!batch) {
      return NextResponse.json({ error: "No active batches found for this program" }, { status: 404 });
    }

    const batchId = batch._id;
    if (batch.enrolledCount >= batch.capacity) {
      return NextResponse.json({ error: "The selected batch is full" }, { status: 400 });
    }

    const amountInPaise = Math.round(course.price * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      notes: {
        clerkId,
        courseId: course.id.toString(),
        batchId: batchId.toString(),
      },
    });

    const token = (await getToken({ template: "convex" })) ?? undefined;

    await fetchMutation(
      api.payments.createPendingPayment,
      {
        razorpayOrderId: order.id,
        amount: course.price,
        courseId: course.id as Id<"courses">,
        batchId: batchId as Id<"batches">,
      },
      { token }
    );

    return NextResponse.json({
      keyId: key_id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      courseTitle: course.title,
      price: course.price,
    });
  } catch (error: unknown) {
    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim() || "";
    const keyMode = key_id.startsWith("rzp_live_")
      ? "live"
      : key_id.startsWith("rzp_test_")
      ? "test"
      : "unknown";

    console.error("[CheckoutOrder] Order creation error:", {
      keyMode,
      keyPrefix: key_id ? key_id.slice(0, 8) : "missing",
      hasSecret: !!process.env.RAZORPAY_KEY_SECRET,
      errorDetails:
        typeof error === "object" && error !== null
          ? {
              statusCode: (error as { statusCode?: number }).statusCode,
              error: (error as { error?: unknown }).error,
              message: (error as Error).message,
            }
          : String(error),
    });
    const msg = extractRazorpayError(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
