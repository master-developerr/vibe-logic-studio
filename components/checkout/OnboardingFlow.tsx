"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Mail,
  ShieldCheck,
  Loader2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import {
  updateBuyerDetailsAction,
  updateOnboardingProgressAction,
  dispatchWelcomeEmailAction,
} from "@/app/checkout/onboarding/actions";

type OnboardingFlowProps = {
  purchaseId: string;
  initialName: string;
  initialEmail: string;
  courseTitle: string;
  whatsappLink?: string;
  batchTitle: string;
  detailsConfirmed?: boolean;
  whatsappJoined?: boolean;
  onboardingCompleted?: boolean;
};

export function OnboardingFlow({
  purchaseId,
  initialName,
  initialEmail,
  courseTitle,
  whatsappLink,
  batchTitle,
  detailsConfirmed = false,
  whatsappJoined = false,
  onboardingCompleted = false,
}: OnboardingFlowProps) {
  // Determine initial step
  const getInitialStep = () => {
    if (onboardingCompleted) return 3;
    if (detailsConfirmed) return 2;
    return 1;
  };

  const [step, setStep] = useState<number>(getInitialStep);
  const [buyerName, setBuyerName] = useState(initialName);
  const [buyerEmail, setBuyerEmail] = useState(initialEmail);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailDispatched, setEmailDispatched] = useState(false);

  // Automatically trigger email dispatch via Server Action when reaching Step 3
  useEffect(() => {
    if (step === 3 && !emailDispatched) {
      setEmailDispatched(true);
      dispatchWelcomeEmailAction(purchaseId).catch((err) =>
        console.error("[Onboarding] Email dispatch failed:", err)
      );
    }
  }, [step, emailDispatched, purchaseId]);

  const handleConfirmDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);

    try {
      // Execute server action which validates HttpOnly cookie server-side
      await updateBuyerDetailsAction(
        purchaseId,
        buyerName.trim(),
        buyerEmail.trim().toLowerCase()
      );

      setStep(2);
    } catch (err: unknown) {
      console.error("[Onboarding] Update details error:", err);
      setError(err instanceof Error ? err.message : "Failed to update details");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleContinueFromWhatsApp = async () => {
    setIsUpdating(true);
    try {
      // Execute server action which validates HttpOnly cookie server-side
      await updateOnboardingProgressAction(
        purchaseId,
        true,
        true
      );

      setStep(3);
    } catch (err) {
      console.error("[Onboarding] Update progress error:", err);
      setStep(3); // Proceed even if tracking progress fails
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Step Indicators */}
      <div className="flex items-center justify-between border-b border-border/60 pb-6">
        {[
          { num: 1, label: "Confirm Details" },
          { num: 2, label: "WhatsApp Cohort" },
          { num: 3, label: "Access Course" },
        ].map(({ num, label }) => (
          <div key={num} className="flex items-center gap-3">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === num
                  ? "bg-[#FF5A1F] text-white"
                  : step > num
                  ? "bg-success text-white"
                  : "bg-surface border border-border text-text-muted"
              }`}
            >
              {step > num ? <CheckCircle2 className="w-4 h-4" /> : num}
            </div>
            <span
              className={`text-xs font-semibold hidden sm:inline ${
                step === num ? "text-text-primary" : "text-text-muted"
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Confirm Details */}
      {step === 1 && (
        <section className="bg-surface border border-border/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              Step 01 of 03
            </span>
            <h2 className="text-2xl font-bold text-text-primary">
              Confirm Student Delivery Details
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              We will send your course credentials, invoice, and LMS link to this email address. Please make sure it is 100% correct.
            </p>
          </div>

          <form onSubmit={handleConfirmDetails} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-text-primary uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-border bg-background text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-text-primary uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-border bg-background text-sm text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#FFF8E6] border border-[#F59E0B]/30 text-[#92400E] text-[11px] leading-relaxed">
              <strong>Notice:</strong> If there is a typo in your email above, update it now before we dispatch your course access instructions.
            </div>

            {error && (
              <div className="p-3 bg-error/10 border border-error/30 text-error text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full h-12 flex items-center justify-center gap-2 rounded-full bg-[#0D0D0D] hover:bg-[#FF5A1F] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Confirm Details & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </section>
      )}

      {/* Step 2: WhatsApp Community */}
      {step === 2 && (
        <section className="bg-surface border border-border/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              Step 02 of 03
            </span>
            <h2 className="text-2xl font-bold text-text-primary">
              Join Your Official Cohort Community
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              Connect with fellow builders in <strong>{batchTitle}</strong>, receive live class reminders, and get direct mentor support.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#E8F5E9] border border-[#4CAF50]/30 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1B5E20]">
                  {batchTitle} WhatsApp Group
                </h3>
                <p className="text-[11px] text-[#2E7D32]">
                  Official community channel for {courseTitle}
                </p>
              </div>
            </div>

            <p className="text-xs text-[#2E7D32] leading-relaxed">
              Joining WhatsApp is optional and does not block your course access, but it is highly recommended so you never miss live sessions or homework reviews.
            </p>

            {whatsappLink ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all"
              >
                <span>Open WhatsApp Group</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <p className="text-xs text-[#2E7D32] italic">
                WhatsApp group link will be sent directly to your registered email.
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-bold text-text-muted hover:text-text-primary transition-colors"
            >
              ← Back to Details
            </button>
            <button
              type="button"
              onClick={handleContinueFromWhatsApp}
              disabled={isUpdating}
              className="px-8 h-12 rounded-full bg-[#0D0D0D] hover:bg-[#FF5A1F] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <span>Continue to Confirmation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* Step 3: Access Course & Instructions */}
      {step === 3 && (
        <section className="bg-surface border border-border/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-success/10 text-success border border-success/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-success">
                Payment Verified
              </span>
              <h2 className="text-2xl font-extrabold text-text-primary">
                You are all set, {buyerName}!
              </h2>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-background/60 border border-border/50 space-y-3 text-xs leading-relaxed text-text-secondary">
            <p className="flex items-center gap-2 font-semibold text-text-primary">
              <Mail className="w-4 h-4 text-primary" />
              Access instructions sent to {buyerEmail}
            </p>
            <p>
              We have dispatched your welcome email containing your personalized course claim link and cohort roadmap. If you do not see it within a couple of minutes, please check your spam or promotions folder.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFF8E6] border border-[#F59E0B]/30 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#92400E] uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#D97706]" />
              Set Up Your Student Dashboard
            </div>
            <p className="text-xs text-[#92400E] leading-relaxed">
              You can immediately link your verified purchase and unlock your classroom by clicking the button below:
            </p>
            <div className="pt-2">
              <Link
                href={`/claim?purchaseId=${purchaseId}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#0D0D0D] hover:bg-[#FF5A1F] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
              >
                <span>Enter Student Dashboard Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
