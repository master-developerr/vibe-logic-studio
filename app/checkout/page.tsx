import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { CheckoutFlowClient } from "@/components/courses/CheckoutFlowClient";
import Link from "next/link";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { getPurchaseSessionFromCookies } from "@/lib/purchase-session";
import { EnrollModal } from "@/components/courses/EnrollModal";

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
    <main className="min-h-screen bg-background py-12 md:py-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-6">
          <Link
            href={
              course.slug === "build-software-with-ai" || course.slug === "ai-build-sprint"
                ? "/build-software-with-ai"
                : "/"
            }
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-text-secondary hover:text-text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Course Details
          </Link>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.14em] bg-primary/10 text-primary border border-primary/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Direct Secure Checkout
          </div>
        </div>

        {/* If purchase session exists, render the active checkout flow */}
        {purchase ? (
          <CheckoutFlowClient
            course={checkoutCourse}
            batch={checkoutBatch}
            purchaseId={purchase.purchaseId}
            buyerName={purchase.buyerName}
            buyerEmail={purchase.buyerEmail}
            appliedCoupon={purchase.couponCode}
            discountAmount={purchase.discountAmount}
            currentAmount={purchase.amount}
          />
        ) : (
          /* Direct visit without buyer session: Prompt buyer details */
          <div className="max-w-md mx-auto py-12">
            <EnrollModal
              isOpen={true}
              onClose={() => {}}
              courseSlug={course.slug}
              courseTitle={course.title}
              batchId={batchId}
              price={course.price}
            />
          </div>
        )}
      </div>
    </main>
  );
}
