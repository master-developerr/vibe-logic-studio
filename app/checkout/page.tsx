"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CheckoutClient } from "@/components/courses/CheckoutClient";
import Link from "next/link";
import { ChevronLeft, ShieldCheck, Loader2 } from "lucide-react";
import { useEffect, useState, Suspense } from "react";

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded: isAuthLoaded, isSignedIn, userId } = useAuth();
  const { user: clerkUser } = useUser();
  
  const targetCourseQuery = searchParams.get("courseSlug") || searchParams.get("courseId") || "ai-build-sprint";
  const requestedBatchId = searchParams.get("batchId");

  const [syncState, setSyncState] = useState<"idle" | "syncing" | "synced" | "error">("idle");

  const syncUserMutation = useMutation(api.users.syncUser);
  const convexUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : "skip");
  const existingEnrollment = useQuery(api.student.getCourseDashboardContext, requestedBatchId ? { batchId: requestedBatchId as Id<"batches"> } : "skip");

  // Auth Guard Effect
  useEffect(() => {
    if (isAuthLoaded && !isSignedIn) {
      // Redirect to sign-in while preserving return URL
      const currentUrl = `/checkout?courseSlug=${targetCourseQuery}${requestedBatchId ? `&batchId=${requestedBatchId}` : ""}`;
      router.push(`/sign-up?redirect_url=${encodeURIComponent(currentUrl)}`);
    }
  }, [isAuthLoaded, isSignedIn, router, targetCourseQuery, requestedBatchId]);

  // Sync user effect
  useEffect(() => {
    if (isAuthLoaded && isSignedIn && clerkUser && syncState === "idle" && convexUser === null) {
      setSyncState("syncing");
      syncUserMutation({
        clerkId: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
        name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || "Student",
        avatarUrl: clerkUser.imageUrl ?? "",
      })
        .then(() => setSyncState("synced"))
        .catch((e) => {
          console.error("Failed to sync user:", e);
          setSyncState("error");
        });
    } else if (convexUser) {
      setSyncState("synced");
    }
  }, [isAuthLoaded, isSignedIn, clerkUser, convexUser, syncState, syncUserMutation]);


  // 1. Fetch course details
  const course = useQuery(api.courses.getBySlug, { slug: targetCourseQuery });

  // 2. Locate batch
  let targetBatch: any = null;
  if (course && course.batches) {
    if (requestedBatchId) {
      targetBatch = course.batches.find((b: any) => b._id === requestedBatchId || (b as any).id === requestedBatchId);
    }
    if (!targetBatch && course.batches.length > 0) {
      const upcomingWithCapacity = course.batches.find((b: any) => 
        (b.capacity ?? 50) > (b.enrolledCount ?? 0) && (b.status === "upcoming" || b.status === "live")
      );
      targetBatch = upcomingWithCapacity || course.batches[0];
    }
  }

  // 3. Existing Enrollment Guard Effect
  useEffect(() => {
    if (existingEnrollment && targetBatch) {
      const bid = targetBatch._id || targetBatch.id;
      router.push(`/dashboard/courses/${bid}/overview`);
    }
  }, [existingEnrollment, targetBatch, router]);

  // STATE: AUTHENTICATING
  if (!isAuthLoaded || !isSignedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full p-8 bg-surface border border-border rounded-3xl space-y-4 text-center shadow-lg">
          <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
          <h2 className="text-xl font-bold text-text-primary">Checking authentication...</h2>
          <p className="text-sm text-text-secondary">Please wait while we verify your account.</p>
        </div>
      </main>
    );
  }

  // STATE: SYNCING USER
  if (syncState === "syncing" || (syncState === "idle" && convexUser === undefined)) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full p-8 bg-surface border border-border rounded-3xl space-y-4 text-center shadow-lg">
          <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
          <h2 className="text-xl font-bold text-text-primary">Setting up your profile...</h2>
          <p className="text-sm text-text-secondary">Initializing your student account for checkout.</p>
        </div>
      </main>
    );
  }

  if (syncState === "error") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full p-8 bg-surface border border-border rounded-3xl space-y-4 text-center shadow-lg">
          <ShieldCheck className="w-12 h-12 text-error mx-auto opacity-50" />
          <h2 className="text-xl font-bold text-text-primary">Account Setup Failed</h2>
          <p className="text-sm text-text-secondary">We could not initialize your profile for checkout. Please try logging out and back in.</p>
          <Link href="/sign-up" className="inline-block mt-4 text-sm font-semibold text-primary hover:underline">
            Return to Sign Up
          </Link>
        </div>
      </main>
    );
  }

  // STATE: LOADING COURSE & BATCH
  if (course === undefined) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full p-8 bg-surface border border-border rounded-3xl space-y-4 text-center shadow-lg">
          <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
          <h2 className="text-xl font-bold text-text-primary">Loading course details...</h2>
        </div>
      </main>
    );
  }

  // STATE: COURSE NOT FOUND
  if (course === null) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full p-8 bg-surface border border-border rounded-3xl space-y-4 text-center shadow-lg">
          <ShieldCheck className="w-12 h-12 text-error mx-auto opacity-50" />
          <h2 className="text-xl font-bold text-text-primary">Course Not Found</h2>
          <p className="text-sm text-text-secondary">The requested course could not be found or is currently inactive.</p>
          <Link href="/" className="inline-block mt-4 text-sm font-semibold text-primary hover:underline">
            Return to Homepage
          </Link>
        </div>
      </main>
    );
  }

  // STATE: BATCH NOT FOUND
  if (!targetBatch) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full p-8 bg-surface border border-border rounded-3xl space-y-4 text-center shadow-lg">
          <ShieldCheck className="w-12 h-12 text-error mx-auto opacity-50" />
          <h2 className="text-xl font-bold text-text-primary">No Upcoming Cohorts</h2>
          <p className="text-sm text-text-secondary">This program currently has no active or upcoming cohorts available for enrollment.</p>
          <Link href={`/${course.slug === "ai-build-sprint" ? "build-software-with-ai" : course.slug}`} className="inline-block mt-4 text-sm font-semibold text-primary hover:underline">
            Return to Course Details
          </Link>
        </div>
      </main>
    );
  }

  // STATE: READY
  const batchId = targetBatch._id || targetBatch.id;
  const subtotal = course.price;
  const tax = Math.round(subtotal * 0.18);
  const netAmount = subtotal - tax;
  const courseSlug = course.slug;

  const resolvedUser = convexUser || {
    name: `${clerkUser?.firstName ?? ""} ${clerkUser?.lastName ?? ""}`.trim() || "Student",
    email: clerkUser?.primaryEmailAddress?.emailAddress ?? ""
  };

  return (
    <main className="min-h-screen bg-background py-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-6">
          <Link
            href={courseSlug === "build-software-with-ai" || courseSlug === "ai-build-sprint" ? "/build-software-with-ai" : "/"}
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Summary & Student info */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3 text-left">
              <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Review Program Details</h1>
              <p className="text-sm text-text-secondary">
                Verify your cohort schedule and profile information before proceeding to payment.
              </p>
            </div>

            {/* Course & Batch Card */}
            <div className="p-6 bg-surface border border-border rounded-3xl space-y-4 shadow-sm text-left">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{course.category}</span>
                <h2 className="text-xl font-bold text-text-primary">{course.title}</h2>
              </div>
              
              <div className="h-px bg-border/60" />
              
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Cohort Batch</p>
                  <p className="text-sm font-semibold text-text-primary mt-1">{targetBatch.title}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Start Date</p>
                  <p className="text-sm font-semibold text-text-primary mt-1">
                    {new Date(targetBatch.startDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Student Prefill Info */}
            <div className="p-6 bg-surface border border-border rounded-3xl space-y-4 shadow-sm text-left">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Student Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase">Full Name</label>
                  <div className="mt-1 text-sm font-medium text-text-primary p-3 bg-background/50 border border-border/40 rounded-xl">
                    {resolvedUser.name}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase">Email Address</label>
                  <div className="mt-1 text-sm font-medium text-text-primary p-3 bg-background/50 border border-border/40 rounded-xl truncate">
                    {resolvedUser.email}
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-text-muted">
                * Note: Your course access and updates will be sent to the verified email above.
              </p>
            </div>
          </div>

          {/* Right Column: Pricing & Checkout trigger client */}
          <div className="lg:col-span-5">
            <CheckoutClient
              courseSlug={courseSlug}
              batchId={batchId}
              coursePrice={subtotal}
              taxAmount={tax}
              netAmount={netAmount}
              studentName={resolvedUser.name}
              studentEmail={resolvedUser.email}
            />
          </div>
        </div>

      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full p-8 bg-surface border border-border rounded-3xl space-y-4 text-center shadow-lg">
          <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
          <h2 className="text-xl font-bold text-text-primary">Loading...</h2>
        </div>
      </main>
    }>
      <CheckoutPageContent />
    </Suspense>
  );
}
