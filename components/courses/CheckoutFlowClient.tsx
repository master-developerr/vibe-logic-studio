"use client";

import React, { Component, useEffect, useState, type ReactNode, type ErrorInfo } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CheckoutClient } from "./CheckoutClient";
import { Loader2, AlertTriangle, RefreshCw, Terminal } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

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

type CheckoutState =
  | "INITIALIZING"
  | "AUTHENTICATING"
  | "SYNCING_USER"
  | "CHECKING_PAYMENT"
  | "READY"
  | "ERROR";

type DiagnosticInfo = {
  stage: string;
  operation: string;
  error: string;
  hints: string[];
};

// ─── Error Boundary ───────────────────────────────────────────────────────────
// Catches unhandled thrown errors from Convex useMutation/useQuery that bypass
// Promise .catch() handlers, preventing the generic error.tsx from rendering.

type ErrorBoundaryProps = { children: ReactNode; onError: (info: DiagnosticInfo) => void };
type ErrorBoundaryState = { hasError: boolean };

class CheckoutErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[CheckoutErrorBoundary]", error, errorInfo);

    const msg = error.message || String(error);
    let stage = "Checkout initialization";
    let operation = "unknown";
    const hints: string[] = [];

    if (msg.includes("ensureMyUser")) {
      stage = "Convex user synchronization";
      operation = "users:ensureMyUser";
    } else if (msg.includes("getCheckoutStatus")) {
      stage = "Payment status check";
      operation = "payments:getCheckoutStatus";
    } else if (msg.includes("createPendingPayment")) {
      stage = "Payment order creation";
      operation = "payments:createPendingPayment";
    }

    if (msg.includes("Could not find public function")) {
      hints.push("The Convex production deployment may not have this function deployed.");
      hints.push("Run: npx convex deploy --yes");
    }
    if (msg.includes("Unauthenticated")) {
      hints.push("Convex cannot validate the Clerk JWT token.");
      hints.push("Check CLERK_JWT_ISSUER_DOMAIN in the Convex production environment.");
      hints.push("Verify the Clerk JWT template named 'convex' has audience='convex'.");
    }
    if (msg.includes("ArgumentValidationError")) {
      hints.push("The function arguments don't match the deployed schema.");
      hints.push("The deployed Convex version may be older than the frontend.");
    }

    if (hints.length === 0) {
      hints.push("Check Vercel function logs and Convex dashboard logs for details.");
    }

    this.props.onError({ stage, operation, error: msg, hints });
  }

  render() {
    if (this.state.hasError) {
      return null; // Parent renders the diagnostic panel via state
    }
    return this.props.children;
  }
}

// ─── Diagnostic Error Panel ───────────────────────────────────────────────────

function DiagnosticErrorPanel({ info, onRetry }: { info: DiagnosticInfo; onRetry: () => void }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-8">
      <div className="border border-red-200 bg-red-50/50 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-red-200 bg-red-100/40">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <h2 className="text-sm font-bold text-red-900 uppercase tracking-wider">
                Checkout Initialization Failed
              </h2>
              <p className="text-xs text-red-700 mt-0.5">
                We could not complete your account or payment verification.
              </p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="px-6 py-5 space-y-4 text-sm">
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
            <span className="font-semibold text-red-800">Stage:</span>
            <span className="text-red-700">{info.stage}</span>

            <span className="font-semibold text-red-800">Operation:</span>
            <span className="font-mono text-xs bg-red-100 px-2 py-0.5 rounded text-red-800 inline-block">
              {info.operation}
            </span>
          </div>

          {/* What to check */}
          {info.hints.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-bold text-red-800 uppercase tracking-wider mb-2">
                Likely causes:
              </p>
              <ul className="space-y-1">
                {info.hints.map((hint, i) => (
                  <li key={i} className="text-xs text-red-700 flex items-start gap-2">
                    <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>
                    {hint}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technical details toggle */}
          <button
            onClick={() => setShowDetails((v) => !v)}
            className="flex items-center gap-2 text-xs font-semibold text-red-600 hover:text-red-800 transition-colors mt-2"
          >
            <Terminal className="w-3.5 h-3.5" />
            {showDetails ? "Hide" : "Show"} technical details
          </button>

          {showDetails && (
            <pre className="bg-red-950 text-red-200 text-[11px] font-mono p-4 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {info.error}
            </pre>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-red-200 bg-red-50/60 flex items-center gap-3">
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-xs font-bold rounded-full hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-red-200 text-red-700 text-xs font-bold rounded-full hover:bg-red-100 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CheckoutFlowClient({ course, batch }: CheckoutFlowClientProps) {
  const [boundaryError, setBoundaryError] = useState<DiagnosticInfo | null>(null);

  const handleBoundaryError = (info: DiagnosticInfo) => {
    setBoundaryError(info);
  };

  if (boundaryError) {
    return (
      <DiagnosticErrorPanel
        info={boundaryError}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <CheckoutErrorBoundary onError={handleBoundaryError}>
      <CheckoutFlowInner course={course} batch={batch} />
    </CheckoutErrorBoundary>
  );
}

function CheckoutFlowInner({ course, batch }: CheckoutFlowClientProps) {
  const { isLoaded: clerkLoaded, userId } = useAuth();
  const { user: clerkUser } = useUser();
  const router = useRouter();

  const [state, setState] = useState<CheckoutState>("INITIALIZING");
  const [diagnosticError, setDiagnosticError] = useState<DiagnosticInfo | null>(null);
  const [hasAttemptedSync, setHasAttemptedSync] = useState(false);
  const [hasAttemptedReconciliation, setHasAttemptedReconciliation] = useState(false);

  const ensureUser = useMutation(api.users.ensureMyUser);
  const reconcileEnrollment = useMutation(api.payments.reconcileEnrollment);

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

    // convexUser === undefined means the query is still loading
    if (convexUser === undefined) {
      setState("SYNCING_USER");
      return;
    }

    // convexUser === null means no record exists — attempt to create
    if (convexUser === null) {
      if (hasAttemptedSync) {
        // Already attempted — don't retry automatically to avoid loops
        return;
      }

      setState("SYNCING_USER");
      setHasAttemptedSync(true);

      ensureUser()
        .then(() => {
          // Success — the reactive useQuery will automatically re-fire
          // and convexUser will switch from null to the new record.
          console.log("[Checkout] ensureMyUser succeeded");
        })
        .catch((err: Error) => {
          console.error("[Checkout] ensureMyUser failed:", err);

          const msg = err.message || String(err);
          const hints: string[] = [];

          if (msg.includes("Could not find public function")) {
            hints.push("Backend function 'users:ensureMyUser' is unavailable in the production Convex deployment.");
            hints.push("Run: npx convex deploy --yes");
          } else if (msg.includes("Unauthenticated")) {
            hints.push("Your Clerk session could not be authenticated by Convex.");
            hints.push("The CLERK_JWT_ISSUER_DOMAIN in the Convex deployment may not match the Clerk instance.");
            hints.push("Verify the Clerk JWT template 'convex' exists with audience='convex'.");
          } else {
            hints.push("An unexpected error occurred during user synchronization.");
            hints.push("Check Convex dashboard logs for details.");
          }

          setDiagnosticError({
            stage: "Convex user synchronization",
            operation: "users:ensureMyUser",
            error: msg,
            hints,
          });
          setState("ERROR");
        });
      return;
    }

    // User exists — check payment status
    if (checkoutStatus === undefined) {
      setState("CHECKING_PAYMENT");
      return;
    }

    // An active enrollment is authoritative and determines the destination batch.
    if (checkoutStatus?.hasActiveEnrollment) {
      router.replace(`/dashboard/courses/${checkoutStatus.batchId || batch.id}/overview`);
      return;
    }

    // A verified payment without an enrollment is repaired before access is granted.
    if (checkoutStatus?.hasSuccessfulPayment) {
      if (hasAttemptedReconciliation) return;

      const resolvedBatchId = checkoutStatus.batchId || batch.id;
      setState("CHECKING_PAYMENT");
      setHasAttemptedReconciliation(true);
      reconcileEnrollment({ courseId: course.id, batchId: resolvedBatchId })
        .then(({ batchId }) => {
          router.replace(`/dashboard/courses/${batchId}/overview`);
        })
        .catch((err: unknown) => {
          const message = err instanceof Error ? err.message : "Unable to restore your enrollment";
          setDiagnosticError({
            stage: "Enrollment reconciliation",
            operation: "payments:reconcileEnrollment",
            error: message,
            hints: [
              "A verified payment was found, but the matching enrollment could not be restored.",
              "No new payment was started. Please try again or contact support.",
            ],
          });
          setState("ERROR");
        });
      return;
    }

    setState("READY");
  }, [
    clerkLoaded,
    userId,
    convexUser,
    checkoutStatus,
    ensureUser,
    reconcileEnrollment,
    router,
    course.id,
    batch.id,
    hasAttemptedSync,
    hasAttemptedReconciliation,
  ]);

  // ── Render states ──

  if (state === "ERROR" && diagnosticError) {
    return (
      <DiagnosticErrorPanel
        info={diagnosticError}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (state === "ERROR") {
    return (
      <DiagnosticErrorPanel
        info={{
          stage: "Checkout initialization",
          operation: "unknown",
          error: "An unexpected error occurred.",
          hints: ["Please try again or contact support."],
        }}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (state === "INITIALIZING" || state === "AUTHENTICATING") {
    return <LoadingState text="Signing you in..." />;
  }

  if (state === "SYNCING_USER") {
    return <LoadingState text="Setting up your account..." />;
  }

  if (state === "CHECKING_PAYMENT") {
    return <LoadingState text="Checking your enrollment status..." />;
  }

  // ── READY state ──

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
