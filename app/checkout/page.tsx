import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { CheckoutFlowClient } from "@/components/courses/CheckoutFlowClient";
import Link from "next/link";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { getPurchaseSessionFromCookies } from "@/lib/purchase-session";
import { currentUser } from "@clerk/nextjs/server";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{
    courseSlug?: string;
    batchId?: string;
    courseId?: string;
    purchaseId?: string;
  }>;
}) {
  const params = await searchParams;
  const sessionToken = await getPurchaseSessionFromCookies();

  // If purchaseId is present in query, fetch the server-persisted purchase session
  let purchase = null;
  if (params.purchaseId && sessionToken) {
    purchase = await fetchQuery(api.purchases.getPurchaseForCheckout, {
      purchaseId: params.purchaseId as Id<"purchases">,
      sessionToken,
    });
  }

  // Fallback to course by slug if direct navigation
  const targetCourseQuery =
    purchase?.course.slug || params.courseSlug || params.courseId || "ai-build-sprint";

  let course = await fetchQuery(api.courses.getBySlug, { slug: targetCourseQuery });
  if (!course && (targetCourseQuery === "ai-build-sprint" || targetCourseQuery === "build-software-with-ai")) {
    const altSlug = targetCourseQuery === "ai-build-sprint" ? "build-software-with-ai" : "ai-build-sprint";
    course = await fetchQuery(api.courses.getBySlug, { slug: altSlug });
  }
  if (!course) {
    return (
      <main className="min-h-screen bg-background py-16 px-4 text-center">
        <p className="text-sm font-semibold text-text-secondary">Course not found.</p>
        <Link href="/" className="mt-4 inline-block text-xs font-bold text-primary underline">
          Return to Home
        </Link>
      </main>
    );
  }

  // Resolve target batch
  let targetBatch = purchase
    ? course.batches.find((b) => b._id === purchase.batch.id)
    : params.batchId
    ? course.batches.find((candidate) => candidate._id === params.batchId)
    : undefined;

  if (!targetBatch && course.batches.length > 0) {
    const upcomingWithCapacity = course.batches.find(
      (candidate) =>
        candidate.capacity > candidate.enrolledCount &&
        (candidate.status === "upcoming" || candidate.status === "live")
    );
    targetBatch = upcomingWithCapacity || course.batches[0];
  }

  if (!targetBatch) {
    return (
      <main className="min-h-screen bg-background py-16 px-4 text-center">
        <p className="text-sm font-semibold text-text-secondary">No active cohorts available.</p>
        <Link href="/" className="mt-4 inline-block text-xs font-bold text-primary underline">
          Return to Home
        </Link>
      </main>
    );
  }

  const user = await currentUser().catch(() => null);
  const clerkName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ").trim()
    : "";
  const clerkEmail = user?.emailAddresses?.[0]?.emailAddress || "";

  const initialBuyerName = purchase?.buyerName || clerkName || "";
  const initialBuyerEmail = purchase?.buyerEmail || clerkEmail || "";

  const batchId = targetBatch._id;
  const checkoutCourse = {
    id: course.id as Id<"courses">,
    slug: course.slug,
    category: course.category,
    title: course.title,
    price: purchase?.originalPrice || course.price,
  };

  const checkoutBatch = {
    id: batchId as Id<"batches">,
    title: targetBatch.title,
    startDate: targetBatch.startDate,
  };

  return (
    <main className="min-h-screen bg-background py-4 md:py-5 lg:py-6 px-4 md:px-6 lg:px-8 flex flex-col lg:justify-center">
      <div className="w-full max-w-5xl mx-auto space-y-3 md:space-y-4">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-2.5 md:pb-3">
          <Link
            href={
              course.slug === "build-software-with-ai" || course.slug === "ai-build-sprint"
                ? "/build-software-with-ai"
                : "/"
            }
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-text-secondary hover:text-text-primary transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to Course Details
          </Link>
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.14em] bg-primary/10 text-primary border border-primary/20">
            <ShieldCheck className="w-3 h-3" />
            Direct Secure Checkout
          </div>
        </div>

        {/* Embedded Unified Checkout Layout */}
        <CheckoutFlowClient
          course={checkoutCourse}
          batch={checkoutBatch}
          initialPurchaseId={purchase?.purchaseId}
          initialBuyerName={initialBuyerName}
          initialBuyerEmail={initialBuyerEmail}
          appliedCoupon={purchase?.couponCode}
          discountAmount={purchase?.discountAmount || 0}
          currentAmount={purchase?.amount || course.price}
        />
      </div>
    </main>
  );
}
