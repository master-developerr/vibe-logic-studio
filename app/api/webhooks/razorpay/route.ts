import { NextRequest } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { fetchMutation } from "convex/nextjs";
import { api, internal } from "@/convex/_generated/api";
import { redis } from "@/lib/redis";
import { Id } from "@/convex/_generated/dataModel";
import { invalidatePurchaseRelatedCaches } from "@/lib/course-cache";

export async function POST(req: NextRequest) {
  let rawBody = "";
  try {
    rawBody = await req.text();
  } catch (err) {
    console.error("Failed to read webhook body:", err);
    return new Response("Invalid body", { status: 400 });
  }

  const signature = req.headers.get("x-razorpay-signature");
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("RAZORPAY_WEBHOOK_SECRET environment variable is missing on server");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  // 1. Verify webhook signature
  const isValid = verifyRazorpaySignature(rawBody, signature, webhookSecret);
  if (!isValid) {
    console.warn("Signature verification failed for Razorpay webhook");
    return new Response("Invalid signature", { status: 400 });
  }

  // 2. Parse event payload
  let event;
  try {
    event = JSON.parse(rawBody);
  } catch (err) {
    return new Response("Invalid JSON", { status: 400 });
  }

  // 3. Handle payment.failed lifecycle event
  if (event.event === "payment.failed") {
    const paymentEntity = event.payload?.payment?.entity;
    if (paymentEntity) {
      const { order_id: razorpayOrderId, id: razorpayPaymentId, error_code, error_description, notes } = paymentEntity;
      try {
        await fetchMutation(api.payments.recordFailedPayment, {
          purchaseId: notes?.purchaseId ? (notes.purchaseId as Id<"purchases">) : undefined,
          razorpayOrderId: razorpayOrderId || "",
          razorpayPaymentId,
          errorCode: error_code,
          errorMessage: error_description,
        });
        console.log(`Recorded payment failure for order ${razorpayOrderId}: ${error_code} - ${error_description}`);
      } catch (err) {
        console.error("Failed to record payment failure in database:", err);
      }
    }
    return new Response("OK", { status: 200 });
  }

  // 4. Handle successful payment captured / order paid events
  if (event.event === "payment.captured" || event.event === "order.paid") {
    const paymentEntity = event.payload?.payment?.entity;
    if (!paymentEntity) {
      console.warn("Payment entity missing in payment event payload");
      return new Response("Missing payment entity", { status: 400 });
    }

    const { order_id: razorpayOrderId, id: razorpayPaymentId, amount, method, notes } = paymentEntity;

    if (!notes || (!notes.purchaseId && (!notes.clerkId || !notes.courseId || !notes.batchId))) {
      console.warn("Missing metadata notes in Razorpay payment captured event:", paymentEntity.id);
      return new Response("Missing notes metadata", { status: 400 });
    }

    const rupeeAmount = amount / 100; // Razorpay amounts are in paise

    let friendlyMethod = method;
    if (method === "card") {
      friendlyMethod = `Card (•••• ${paymentEntity.card?.last4 || "Card"})`;
    } else if (method === "upi") {
      friendlyMethod = "UPI";
    } else if (method === "netbanking") {
      friendlyMethod = "NetBanking";
    } else if (method === "wallet") {
      friendlyMethod = `Wallet (${paymentEntity.wallet || "Wallet"})`;
    }

    try {
      if (notes?.purchaseId) {
        // Modern payment-first purchase flow
        const result = await fetchMutation(api.payments.fulfillPurchasePayment, {
          purchaseId: notes.purchaseId as Id<"purchases">,
          razorpayOrderId,
          razorpayPaymentId,
          amount: rupeeAmount,
          paymentMethod: friendlyMethod,
          gateway: "Razorpay",
        });

        // Invalidate course, batch, and student caches idempotently
        await invalidatePurchaseRelatedCaches({
          courseSlug: result.courseSlug,
          courseId: result.courseId,
          batchId: result.batchId,
          clerkId: notes?.clerkId,
        });
      } else if (notes?.clerkId && notes?.courseId && notes?.batchId) {
        // Legacy authenticated checkout flow
        const { clerkId, courseId, batchId } = notes;
        await fetchMutation(internal.payments.fulfillEnrollment as any, {
          clerkId,
          courseId: courseId as Id<"courses">,
          batchId: batchId as Id<"batches">,
          amount: rupeeAmount,
          razorpayOrderId,
          razorpayPaymentId,
          paymentMethod: friendlyMethod,
          gateway: "Razorpay",
        });

        // Invalidate student and batch caches in Redis
        await invalidatePurchaseRelatedCaches({
          courseId,
          batchId,
          clerkId,
        });
      } else {
        console.warn("Unrecognized notes payload in webhook:", paymentEntity.id);
        return new Response("Missing required notes metadata", { status: 400 });
      }

      console.log(`Successfully verified payment ${razorpayPaymentId} for order ${razorpayOrderId}`);
    } catch (dbErr) {
      console.error("Database enrollment settlement failed:", dbErr);
      return new Response("Failed database sync", { status: 500 });
    }
  }

  return new Response("OK", { status: 200 });
}
