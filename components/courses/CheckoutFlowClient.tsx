"use client";

import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CheckoutClient } from "./CheckoutClient";
import { Loader2, AlertCircle } from "lucide-react";
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

type CheckoutState = "INITIALIZING" | "AUTHENTICATING" | "SYNCING_USER" | "CHECKING_PAYMENT" | "READY" | "ERROR";

export function CheckoutFlowClient({ course, batch }: CheckoutFlowClientProps) {
  const { isLoaded: clerkLoaded, userId } = useAuth();
  const { user: clerkUser } = useUser();
  const router = useRouter();
  
  const [state, setState] = useState<CheckoutState>("INITIALIZING");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [hasAttemptedSync, setHasAttemptedSync] = useState(false);

  const ensureUser = useMutation(api.users.ensureMyUser);

  const convexUser = useQuery(
    api.users.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );

  const checkoutStatus = useQuery(
    api.payments.getCheckoutStatus,
    userId && convexUser ? { courseId: course.id, batchId: batch.id } : "skip"
  );

  useEffect(() => {
    if (!clerkLoaded) {
      setState("INITIALIZING");
      return;
    }
    if (!userId) {
      setState("AUTHENTICATING");
      return;
    }

    if (convexUser === undefined) {
      setState("SYNCING_USER");
      return;
    }

    if (convexUser === null) {
      if (hasAttemptedSync) return; // Prevent infinite loop if ensureUser failed or is still processing
      
      setState("SYNCING_USER");
      setHasAttemptedSync(true);
      
      // Proactively ensure user if missing
      ensureUser().catch((err) => {
        console.error("Failed to ensure Convex user:", err);
        setErrorMessage(
          err.message.includes("Unauthenticated") 
            ? "Authentication configuration error. Please verify your Clerk Domain in Convex (auth.config.ts) matches the production environment."
            : err.message
        );
        setState("ERROR");
      });
      return;
    }

    if (checkoutStatus === undefined) {
      setState("CHECKING_PAYMENT");
      return;
    }

    // Process checkoutStatus
    if (checkoutStatus?.hasSuccessfulPayment || checkoutStatus?.hasActiveEnrollment) {
      router.push(`/dashboard/courses/${checkoutStatus.batchId || batch.id}/overview`);
      return;
    }

    setState("READY");

  }, [clerkLoaded, userId, convexUser, checkoutStatus, ensureUser, router, batch.id, hasAttemptedSync]);

  if (state === "ERROR") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <AlertCircle className="w-12 h-12 text-error" />
        <p className="text-error font-medium text-center max-w-md">
          {errorMessage || "An unexpected error occurred while setting up your account."}
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium hover:bg-surface/80"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (state === "INITIALIZING" || state === "AUTHENTICATING") {
    return <LoadingState text="Signing you in..." />;
  }

  if (state === "SYNCING_USER") {
    return <LoadingState text="Setting up your account in the database..." />;
  }

  if (state === "CHECKING_PAYMENT") {
    return <LoadingState text="Checking your enrollment status..." />;
  }

  // READY state below
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
                {convexUser?.name || `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim() || "Student"}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase">Email Address</label>
              <div className="mt-1 text-sm font-medium text-text-primary p-3 bg-background/50 border border-border/40 rounded-xl truncate">
                {convexUser?.email || clerkUser?.emailAddresses[0]?.emailAddress || ""}
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
          studentName={convexUser?.name || `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim() || "Student"}
          studentEmail={convexUser?.email || clerkUser?.emailAddresses[0]?.emailAddress || ""}
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
