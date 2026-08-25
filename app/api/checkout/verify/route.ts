import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { verifyRazorpayPaymentSignature } from "@/lib/razorpay";
import { Id } from "@/convex/_generated/dataModel";

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId, getToken } = await auth();
    if (!clerkId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseSlug, batchId } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courseSlug || !batchId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const course = await fetchQuery(api.courses.getBySlug, { slug: courseSlug });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    const courseId = (course as any)._id || (course as any).id;

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error("RAZORPAY_KEY_SECRET environment variable is missing on server");
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    const isValid = verifyRazorpayPaymentSignature(
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      secret
    );

    if (!isValid) {
      console.warn("Invalid signature during checkout verification");
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const token = (await getToken({ template: "convex" })) ?? undefined;

    // Securely invoke Convex to mark payment as successful and create enrollment
    const result = await fetchMutation(api.payments.confirmPayment, {
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      courseId: courseId as Id<"courses">,
      batchId: batchId as Id<"batches">,
    }, { token });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Checkout verify API error:", error);
    return NextResponse.json({ error: error.message || "Failed to verify checkout" }, { status: 500 });
  }
}
