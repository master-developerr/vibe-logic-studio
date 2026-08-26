import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { CheckoutFlowClient } from "@/components/courses/CheckoutFlowClient";
import Link from "next/link";
import { ChevronLeft, ShieldCheck } from "lucide-react";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ courseSlug?: string; batchId?: string; courseId?: string }>;
}) {
  const { userId } = await auth();
  const params = await searchParams;
  const targetCourseQuery = params.courseSlug || params.courseId || "build-software-with-ai";

  // 1. Fetch course details (includes batches)
  const course = await fetchQuery(api.courses.getBySlug, { slug: targetCourseQuery });
  if (!course) {
    redirect("/");
  }

  // 2. Locate or auto-select target batch
  let targetBatch = params.batchId
    ? course.batches.find((candidate) => candidate._id === params.batchId)
    : undefined;

  if (!targetBatch && course.batches.length > 0) {
    // Select earliest valid upcoming batch with capacity
    const upcomingWithCapacity = course.batches.find((candidate) =>
      candidate.capacity > candidate.enrolledCount && (candidate.status === "upcoming" || candidate.status === "live")
    );
    targetBatch = upcomingWithCapacity || course.batches[0];
  }

  if (!targetBatch) {
    redirect(course.slug === "build-software-with-ai" || course.slug === "ai-build-sprint" ? "/build-software-with-ai" : "/");
  }

  const batchId = targetBatch._id;
  const checkoutCourse = {
    id: course.id as Id<"courses">,
    slug: course.slug,
    category: course.category,
    title: course.title,
    price: course.price,
  };
  const checkoutBatch = {
    id: batchId as Id<"batches">,
    title: targetBatch.title,
    startDate: targetBatch.startDate,
  };

  if (!userId) {
    // If not authenticated, redirect to sign-up and redirect back to this checkout URL
    const redirectUrl = encodeURIComponent(`/checkout?courseSlug=${course.slug}&batchId=${batchId}`);
    redirect(`/sign-up?fallback_redirect_url=${redirectUrl}`);
  }

  return (
    <main className="min-h-screen bg-background py-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-6">
          <Link
            href={course.slug === "build-software-with-ai" || course.slug === "ai-build-sprint" ? "/build-software-with-ai" : "/"}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-text-secondary hover:text-text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Course Details
          </Link>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.14em] bg-primary/10 text-primary border border-primary/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Secured Checkout
          </div>
        </div>

        <CheckoutFlowClient 
          course={checkoutCourse}
          batch={checkoutBatch}
        />

      </div>
    </main>
  );
}
