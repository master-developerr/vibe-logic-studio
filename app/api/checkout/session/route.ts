import { NextRequest, NextResponse } from "next/server";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { generateSecureTokens, setPurchaseSessionOnResponse } from "@/lib/purchase-session";
import type { Id } from "@/convex/_generated/dataModel";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { buyerName, buyerEmail, courseSlug, courseId, batchId: requestedBatchId } = body;

    if (!buyerName || typeof buyerName !== "string" || buyerName.trim().length < 2) {
      return NextResponse.json({ error: "Please enter your full name (minimum 2 characters)" }, { status: 400 });
    }

    if (!buyerEmail || typeof buyerEmail !== "string") {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(buyerEmail.trim())) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    const targetSlug = courseSlug || courseId || "build-software-with-ai";
    const course = await fetchQuery(api.courses.getBySlug, { slug: targetSlug });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Resolve target batch
    let batch = requestedBatchId
      ? course.batches.find((b) => b._id === requestedBatchId)
      : undefined;

    if (!batch && course.batches.length > 0) {
      const upcomingWithCapacity = course.batches.find(
        (b) => b.capacity > b.enrolledCount && (b.status === "upcoming" || b.status === "live")
      );
      batch = upcomingWithCapacity || course.batches[0];
    }

    if (!batch) {
      return NextResponse.json({ error: "No active batches available for this program" }, { status: 404 });
    }

    if (batch.enrolledCount >= batch.capacity) {
      return NextResponse.json({ error: "The selected batch is full" }, { status: 400 });
    }

    const tokens = generateSecureTokens();

    const result = await fetchMutation(api.purchases.createPurchaseSession, {
      buyerName: buyerName.trim(),
      buyerEmail: buyerEmail.trim().toLowerCase(),
      courseId: course.id as Id<"courses">,
      batchId: batch._id as Id<"batches">,
      sessionToken: tokens.sessionToken,
      recoveryTokenHash: tokens.recoveryTokenHash,
      rawRecoveryToken: tokens.rawRecoveryToken,
    });

    const response = NextResponse.json({
      success: true,
      purchaseId: result.purchaseId,
      courseSlug: course.slug,
      batchId: batch._id,
    });

    // Set HttpOnly session cookie
    setPurchaseSessionOnResponse(response, tokens.sessionToken);

    return response;
  } catch (error: unknown) {
    console.error("[CheckoutSessionAPI] Error:", error);
    const msg = error instanceof Error ? error.message : "Failed to initialize purchase session";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
