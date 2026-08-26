import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { verifyRazorpayPaymentSignature } from "@/lib/razorpay";
import { Id } from "@/convex/_generated/dataModel";

type CheckoutVerificationRequest = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  courseSlug: string;
  batchId: string;
};

function isCheckoutVerificationRequest(value: unknown): value is CheckoutVerificationRequest {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return ["razorpay_order_id", "razorpay_payment_id", "razorpay_signature", "courseSlug", "batchId"].every(
    (key) => typeof record[key] === "string" && record[key].length > 0
  );
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Failed to verify checkout";
}

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId, getToken } = await auth();
    if (!clerkId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body: unknown = await req.json();
    if (!isCheckoutVerificationRequest(body)) {
      return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseSlug, batchId } = body;

    const course = await fetchQuery(api.courses.getBySlug, { slug: courseSlug });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    const courseId = course.id;

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
  } catch (error: unknown) {
    console.error("Checkout verify API error:", error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
