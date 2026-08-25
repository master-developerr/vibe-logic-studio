import { NextRequest } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { fetchMutation } from "convex/nextjs";
import { internal } from "@/convex/_generated/api";
import { redis } from "@/lib/redis";
import { Id } from "@/convex/_generated/dataModel";

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

  // We are primarily listening for payment.captured
  if (event.event === "payment.captured") {
    const paymentEntity = event.payload.payment.entity;
    const { order_id: razorpayOrderId, id: razorpayPaymentId, amount, method, notes } = paymentEntity;

    if (!notes || !notes.clerkId || !notes.courseId || !notes.batchId) {
      console.warn("Missing metadata notes in Razorpay payment captured event:", paymentEntity.id);
      return new Response("Missing notes metadata", { status: 400 });
    }

    const { clerkId, courseId, batchId } = notes;
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
      // 3. Fulfill enrollment and mark payment successful in Convex
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

      // 4. Invalidate student caches in Redis
      if (redis) {
        try {
          const pipeline = redis.pipeline();
          pipeline.del(`student:dashboard:${clerkId}`);
          pipeline.del(`student:lms:${clerkId}:${courseId}`);
          pipeline.del(`student:batchLms:${clerkId}:${batchId}`);
          pipeline.del(`student:dashboardContext:${clerkId}:${batchId}`);
          await pipeline.exec();
        } catch (redisErr) {
          console.error("Failed to invalidate Redis cache keys:", redisErr);
        }
      }

      console.log(`Successfully enrolled user ${clerkId} in batch ${batchId} after payment verification.`);
    } catch (dbErr) {
      console.error("Database enrollment settlement failed:", dbErr);
      return new Response("Failed database sync", { status: 500 });
    }
  }

  return new Response("OK", { status: 200 });
}
