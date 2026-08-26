"use client";

import React, { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CheckoutClient } from "./CheckoutClient";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type CheckoutFlowClientProps = {
  course: {
    id: Id<"courses">;
    slug: string;
    category: string;
    title: string;
    price: number;
  };
  batch: {
    id: Id<"batches">;
    title: string;
    startDate: number;
  };
};

export function CheckoutFlowClient({ course, batch }: CheckoutFlowClientProps) {
  const { isLoaded: clerkLoaded, userId } = useAuth();
  const { user: clerkUser } = useUser();
  const router = useRouter();
  
  const [syncTimeout, setSyncTimeout] = useState(false);

  // Poll Convex for the user record (reactive)
  const convexUser = useQuery(
    api.users.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );

  // Poll Convex for the checkout status (reactive, only when user exists)
  const checkoutStatus = useQuery(
    api.payments.getCheckoutStatus,
    userId && convexUser ? { courseId: course.id, batchId: batch.id } : "skip"
  );

  useEffect(() => {
    // If Clerk is loaded and we have a userId, start a 15s timeout
    // If the convexUser is still null after 15s, show an error.
    if (clerkLoaded && userId && convexUser === null) {
      const timer = setTimeout(() => setSyncTimeout(true), 15000);
      return () => clearTimeout(timer);
    }
  }, [clerkLoaded, userId, convexUser]);
  
  // Handle redirect if paid
  useEffect(() => {
    if (checkoutStatus?.hasSuccessfulPayment || checkoutStatus?.hasActiveEnrollment) {
      router.push(`/dashboard/courses/${checkoutStatus.batchId || batch.id}/overview`);
    }
  }, [checkoutStatus, router, batch.id]);

  if (!clerkLoaded) {
    return <LoadingState text="Signing you in..." />;
  }

  if (!userId) {
    // This shouldn't happen because page.tsx redirects unauth users, but just in case
    return <LoadingState text="Redirecting to sign in..." />;
  }

  if (convexUser === undefined) {
    return <LoadingState text="Checking account..." />;
  }

  if (convexUser === null) {
    if (syncTimeout) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <p className="text-error font-medium">Your account is still being set up. Please try again.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-surface border border-border rounded-lg text-sm"
          >
            Refresh
          </button>
        </div>
      );
    }
    return <LoadingState text="Setting up your account..." />;
  }

  if (checkoutStatus === undefined) {
    return <LoadingState text="Checking your enrollment..." />;
  }

  const hasPaid = checkoutStatus?.hasSuccessfulPayment || checkoutStatus?.hasActiveEnrollment;

  if (hasPaid) {
    return <LoadingState text="Redirecting to your course..." />;
  }

  // Ready for checkout
  const subtotal = course.price;
  const tax = Math.round(subtotal * 0.18);
  const netAmount = subtotal - tax;

  return (
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
              <p className="text-sm font-semibold text-text-primary mt-1">{batch.title}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Start Date</p>
              <p className="text-sm font-semibold text-text-primary mt-1">
                {new Date(batch.startDate).toLocaleDateString("en-IN", {
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
                {convexUser.name || `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim() || "Student"}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase">Email Address</label>
              <div className="mt-1 text-sm font-medium text-text-primary p-3 bg-background/50 border border-border/40 rounded-xl truncate">
                {convexUser.email || clerkUser?.emailAddresses[0]?.emailAddress || ""}
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
          courseSlug={course.slug}
          batchId={batch.id}
          coursePrice={subtotal}
          taxAmount={tax}
          netAmount={netAmount}
          studentName={convexUser.name || `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim() || "Student"}
          studentEmail={convexUser.email || clerkUser?.emailAddresses[0]?.emailAddress || ""}
        />
      </div>
    </div>
  );
}

function LoadingState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-sm font-medium animate-pulse text-text-secondary">{text}</p>
    </div>
  );
}
