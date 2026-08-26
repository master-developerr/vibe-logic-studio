import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Razorpay from "razorpay";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

type CheckoutOrderRequest = {
  courseSlug?: string;
  courseId?: string;
  batchId?: string;
};

function isCheckoutOrderRequest(value: unknown): value is CheckoutOrderRequest {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return ["courseSlug", "courseId", "batchId"].every((key) =>
    record[key] === undefined || typeof record[key] === "string"
  );
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Failed to create checkout order";
}

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId, getToken } = await auth();
    if (!clerkId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body: unknown = await req.json();
    if (!isCheckoutOrderRequest(body)) {
      return NextResponse.json({ error: "Invalid checkout request" }, { status: 400 });
    }

    const { courseSlug, courseId, batchId: requestedBatchId } = body;
    const targetSlug = courseSlug || courseId || "build-software-with-ai";

    // 1. Fetch course details to verify price
    const course = await fetchQuery(api.courses.getBySlug, { slug: targetSlug });
    
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Find the batch in course batches, or select earliest upcoming with capacity
    let batch = requestedBatchId
      ? course.batches.find((candidate) => candidate._id === requestedBatchId)
      : undefined;

    if (!batch && course.batches.length > 0) {
      const upcomingWithCapacity = course.batches.find((candidate) =>
        candidate.capacity > candidate.enrolledCount && (candidate.status === "upcoming" || candidate.status === "live")
      );
      batch = upcomingWithCapacity || course.batches[0];
    }

    if (!batch) {
      return NextResponse.json({ error: "No active batches found for this program" }, { status: 404 });
    }

    const batchId = batch._id;


    // Verify seats
    const enrolledCount = batch.enrolledCount;
    const capacity = batch.capacity;
    if (enrolledCount >= capacity) {
      return NextResponse.json({ error: "Batch is full" }, { status: 400 });
    }


    // 2. Initialize Razorpay and create order
    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json({ error: "Razorpay credentials not configured on server" }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

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

    // 3. Create pending payment record in Convex
    await fetchMutation(api.payments.createPendingPayment, {
      razorpayOrderId: order.id,
      amount: course.price,
      courseId: course.id as Id<"courses">,
      batchId,
    }, { token });

    return NextResponse.json({
      keyId: key_id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      courseTitle: course.title,
      price: course.price,
    });
  } catch (error: unknown) {
    console.error("Checkout order API error:", error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
