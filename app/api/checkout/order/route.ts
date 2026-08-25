import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Razorpay from "razorpay";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api, internal } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { courseSlug, courseId, batchId: requestedBatchId } = body;
    const targetSlug = courseSlug || courseId || "build-software-with-ai";

    // 1. Fetch course details to verify price
    const course = await fetchQuery(api.courses.getBySlug, { slug: targetSlug });
    
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Find the batch in course batches, or select earliest upcoming with capacity
    let batch: any = null;
    if (requestedBatchId) {
      batch = course.batches?.find((b: any) => b._id === requestedBatchId || (b as any).id === requestedBatchId);
    }

    if (!batch && course.batches && course.batches.length > 0) {
      const upcomingWithCapacity = course.batches.find((b: any) => 
        (b.capacity ?? 50) > (b.enrolledCount ?? 0) && (b.status === "upcoming" || b.status === "live")
      );
      batch = upcomingWithCapacity || course.batches[0];
    }

    if (!batch) {
      return NextResponse.json({ error: "No active batches found for this program" }, { status: 404 });
    }

    const batchId = batch._id || batch.id;


    // Verify seats
    const enrolledCount = batch.enrolledCount ?? 0;
    const capacity = batch.capacity ?? 50;
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
        courseId: course.id, // use the internal DB ID from the course object
        batchId,
      },
    });

    const token = await (await auth()).getToken({ template: "convex" }) ?? undefined;

    // 3. Create pending payment record in Convex
    await fetchMutation(api.payments.createPendingPayment, {
      razorpayOrderId: order.id,
      amount: course.price,
      courseId: course.id as Id<"courses">,
    }, { token });

    return NextResponse.json({
      keyId: key_id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      courseTitle: course.title,
      price: course.price,
    });
  } catch (error: any) {
    console.error("Checkout order API error:", error);
    return NextResponse.json({ error: error.message || "Failed to create checkout order" }, { status: 500 });
  }
}
