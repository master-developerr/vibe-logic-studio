import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { verifyRazorpayPaymentSignature } from "@/lib/razorpay";
import { getPurchaseSessionFromCookies } from "@/lib/purchase-session";
import type { Id } from "@/convex/_generated/dataModel";
import { invalidatePurchaseRelatedCaches } from "@/lib/course-cache";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      purchaseId,
      courseSlug,
      batchId,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing required Razorpay payment parameters" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET?.trim();
    if (!secret) {
      console.error("[CheckoutVerify] RAZORPAY_KEY_SECRET is not configured on server");
      return NextResponse.json({ error: "Server payment configuration error" }, { status: 500 });
    }

    const isValid = verifyRazorpayPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      secret
    );

    if (!isValid) {
      console.warn("[CheckoutVerify] Invalid Razorpay signature for order:", razorpay_order_id);
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Path A: Purchase session fulfillment (Payment-First flow)
    if (purchaseId) {
      const sessionToken = await getPurchaseSessionFromCookies();
      if (!sessionToken) {
        return NextResponse.json(
          { error: "Purchase session expired. Please contact support if charged." },
          { status: 401 }
        );
      }

      const purchase = await fetchQuery(api.purchases.getPurchaseForCheckout, {
        purchaseId: purchaseId as Id<"purchases">,
        sessionToken,
      });

      if (!purchase) {
        return NextResponse.json({ error: "Invalid purchase session" }, { status: 403 });
      }

      const result = await fetchMutation(api.payments.fulfillPurchasePayment, {
        purchaseId: purchase.purchaseId,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        amount: purchase.amount,
        paymentMethod: "Razorpay Checkout",
        gateway: "Razorpay",
      });

      await invalidatePurchaseRelatedCaches({
        courseSlug: result.courseSlug || purchase.course.slug,
        courseId: result.courseId || purchase.course.id,
        batchId: result.batchId || purchase.batch.id,
      });

      return NextResponse.json({
        success: true,
        purchaseId: purchase.purchaseId,
        oversubscribed: result.oversubscribed ?? false,
        onboardingUrl: `/checkout/onboarding?purchaseId=${purchase.purchaseId}`,
      });
    }

    // Path B: Authenticated Clerk student fulfillment
    const { userId: clerkId, getToken } = await auth();
    if (!clerkId) {
      return NextResponse.json(
        { error: "Authentication required to verify payment without a purchase session" },
        { status: 401 }
      );
    }

    if (!courseSlug || !batchId) {
      return NextResponse.json(
        { error: "Missing courseSlug or batchId for authenticated verification" },
        { status: 400 }
      );
    }

    const course = await fetchQuery(api.courses.getBySlug, { slug: courseSlug });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const token = (await getToken({ template: "convex" })) ?? undefined;

    const result = await fetchMutation(
      api.payments.confirmPayment,
      {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        courseId: course.id as Id<"courses">,
        batchId: batchId as Id<"batches">,
      },
      { token }
    );

    await invalidatePurchaseRelatedCaches({
      courseSlug: course.slug,
      courseId: course.id as Id<"courses">,
      batchId: batchId as Id<"batches">,
    });

    return NextResponse.json({
      success: true,
      result,
      redirectUrl: `/dashboard/courses/${batchId}/overview?success=true`,
    });
  } catch (error: unknown) {
    console.error("[CheckoutVerify] Verification error:", error);
    const msg = error instanceof Error ? error.message : "Payment verification failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
