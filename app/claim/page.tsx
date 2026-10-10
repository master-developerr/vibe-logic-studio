"use client";

import React, { useEffect, useState, use } from "react";
import { useAuth, useUser, SignInButton, SignUpButton, SignOutButton } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowRight,
  LogOut,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function ClaimPurchasePage({
  searchParams,
}: {
  searchParams: Promise<{ purchaseId?: string; recovery?: string }>;
}) {
  const resolvedParams = use(searchParams);
  const router = useRouter();
  const { isLoaded: clerkLoaded, isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();

  const [isClaiming, setIsClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState(false);

  const claimPurchase = useMutation(api.purchases.claimPurchase);
  const unclaimedPurchases = useQuery(
    api.purchases.getUnclaimedPurchasesForAuthenticatedUser,
    isSignedIn ? {} : "skip"
  );

  const purchaseId = resolvedParams.purchaseId;
  const rawRecoveryToken = resolvedParams.recovery;

  // Auto-claim when purchaseId is present in URL and user is signed in
  useEffect(() => {
    if (!clerkLoaded || !isSignedIn || !purchaseId || isClaiming || claimSuccess) {
      return;
    }

    const executeClaim = async () => {
      setIsClaiming(true);
      setClaimError(null);

      try {
        let recoveryTokenHash: string | undefined = undefined;
        if (rawRecoveryToken) {
          const encoder = new TextEncoder();
          const data = encoder.encode(rawRecoveryToken.trim());
          const hashBuffer = await crypto.subtle.digest("SHA-256", data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          recoveryTokenHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
        }

        const result = await claimPurchase({
          purchaseId: purchaseId as Id<"purchases">,
          recoveryTokenHash,
        });

        if (result.success) {
          setClaimSuccess(true);
          router.replace(`/dashboard/courses/${result.batchId}/overview`);
        }
      } catch (err: unknown) {
        console.error("[ClaimPurchase] Error claiming course:", err);
        setClaimError(
          err instanceof Error ? err.message : "Failed to link your purchase to this account"
        );
        setIsClaiming(false);
      }
    };

    executeClaim();
  }, [clerkLoaded, isSignedIn, purchaseId, rawRecoveryToken, claimPurchase, router, isClaiming, claimSuccess]);

  const handleManualClaim = async (targetPurchaseId: string) => {
    setIsClaiming(true);
    setClaimError(null);
    try {
      const result = await claimPurchase({
        purchaseId: targetPurchaseId as Id<"purchases">,
      });
      if (result.success) {
        setClaimSuccess(true);
        router.replace(`/dashboard/courses/${result.batchId}/overview`);
      }
    } catch (err: unknown) {
      setClaimError(err instanceof Error ? err.message : "Failed to claim course entitlement");
      setIsClaiming(false);
    }
  };

  // State when visiting /claim WITHOUT a purchaseId
  if (!purchaseId) {
    return (
      <main className="min-h-screen bg-background py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-surface border border-border p-8 rounded-3xl text-center space-y-6 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Purchase Recovery
            </span>
            <h1 className="text-xl font-bold text-text-primary">Find & Claim Your Courses</h1>
            <p className="text-xs text-text-secondary leading-relaxed">
              Sign in with the email address you used during checkout. The platform will automatically locate and link your verified purchases.
            </p>
          </div>

          {!isSignedIn ? (
            <div className="space-y-3 pt-2">
              <SignInButton mode="modal">
                <button className="w-full h-12 flex items-center justify-center gap-2 rounded-full bg-[#0D0D0D] hover:bg-primary text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md">
                  <span>Sign In with Purchase Email</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="w-full h-12 flex items-center justify-center gap-2 rounded-full border border-border hover:bg-background text-text-primary text-xs font-bold uppercase tracking-wider transition-all">
                  <span>Create Account</span>
                </button>
              </SignUpButton>
            </div>
          ) : unclaimedPurchases === undefined ? (
            <div className="py-8 flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-xs text-text-muted">Searching for verified purchases...</p>
            </div>
          ) : unclaimedPurchases.length > 0 ? (
            <div className="space-y-3 text-left">
              <p className="text-xs font-bold text-text-primary">
                Found {unclaimedPurchases.length} unclaimed purchase{unclaimedPurchases.length > 1 ? "s" : ""}:
              </p>
              {unclaimedPurchases.map((p) => (
                <div
                  key={p._id}
                  className="p-4 rounded-2xl bg-background border border-border space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-text-primary">{p.courseTitle}</h3>
                      <p className="text-[11px] text-text-muted">{p.batchTitle}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-primary">
                      ₹{p.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <button
                    onClick={() => handleManualClaim(p._id)}
                    disabled={isClaiming}
                    className="w-full h-9 rounded-full bg-primary hover:bg-primary/90 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    {isClaiming ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Claim Course Access</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-background border border-border text-xs text-text-secondary text-left space-y-1.5">
                <p className="font-semibold text-text-primary">No unclaimed purchases found</p>
                <p className="text-[11px]">
                  No unclaimed purchases were found for <strong>{clerkUser?.primaryEmailAddress?.emailAddress}</strong>.
                </p>
                <p className="text-[11px] text-text-muted">
                  If you used a different email address, switch accounts below or use the claim link from your welcome email.
                </p>
              </div>

              <div className="flex gap-2">
                <SignOutButton>
                  <button className="flex-1 h-10 rounded-full border border-border hover:bg-background text-text-primary text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Switch Account</span>
                  </button>
                </SignOutButton>
                <Link
                  href="/dashboard"
                  className="flex-1 h-10 rounded-full bg-[#0D0D0D] hover:bg-primary text-white text-xs font-bold flex items-center justify-center transition-all"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  // URL has purchaseId
  return (
    <main className="min-h-screen bg-background py-16 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-surface border border-border/80 p-8 rounded-3xl shadow-xl text-center space-y-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto">
          <Sparkles className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            Student Access Setup
          </span>
          <h1 className="text-2xl font-extrabold text-text-primary">
            Claim Your Course Entitlement
          </h1>
          <p className="text-xs text-text-secondary leading-relaxed">
            Link your verified payment to your student account to unlock live classes and dashboard materials.
          </p>
        </div>

        {!isSignedIn ? (
          /* Unauthenticated state: Guide user to sign in or create account */
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-background/70 border border-border/60 text-xs text-text-secondary text-left space-y-2">
              <p className="font-semibold text-text-primary flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Security & Ownership Notice
              </p>
              <p>
                To claim access, please sign in or register using the <strong>same email address</strong> you entered during checkout.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <SignUpButton mode="modal">
                <button className="w-full h-12 flex items-center justify-center gap-2 rounded-full bg-[#0D0D0D] hover:bg-primary text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all">
                  <span>Create Account & Claim</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </SignUpButton>

              <SignInButton mode="modal">
                <button className="w-full h-12 flex items-center justify-center gap-2 rounded-full border border-border hover:bg-background text-text-primary text-xs font-bold uppercase tracking-wider transition-all">
                  <span>Sign In to Existing Account</span>
                </button>
              </SignInButton>
            </div>
          </div>
        ) : isClaiming || claimSuccess ? (
          /* Processing claim */
          <div className="py-8 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-text-primary">
                Linking your purchase & setting up your classroom...
              </p>
              <p className="text-xs text-text-muted">
                Signed in as {clerkUser?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        ) : claimError ? (
          /* Claim error (e.g. Email mismatch) */
          <div className="space-y-5 pt-2">
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs leading-relaxed text-left flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Ownership verification required</p>
                <p className="mt-1">{claimError}</p>
              </div>
            </div>

            <div className="p-3 bg-background/60 rounded-xl text-[11px] text-text-secondary text-left space-y-1 border border-border">
              <p>
                Currently signed in as: <strong>{clerkUser?.primaryEmailAddress?.emailAddress}</strong>
              </p>
              <p>
                If your purchase was made under a different email, please sign out and sign in using the purchase email.
              </p>
            </div>

            <div className="flex gap-2">
              <SignOutButton>
                <button className="flex-1 h-11 rounded-full border border-border hover:bg-background text-text-primary text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Switch Account</span>
                </button>
              </SignOutButton>

              <button
                onClick={() => window.location.reload()}
                className="flex-1 h-11 rounded-full bg-[#0D0D0D] hover:bg-primary text-white text-xs font-bold transition-all"
              >
                Retry Claim
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
