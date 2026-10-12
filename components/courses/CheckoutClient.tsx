"use client";

import React, { useState, useEffect } from "react";
import { Loader2, CreditCard, ShieldCheck, Tag, Check, AlertCircle } from "lucide-react";

type CheckoutClientProps = {
  purchaseId?: string;
  courseSlug: string;
  batchId: string;
  originalPrice: number;
  initialAmount: number;
  initialCoupon?: string;
  initialDiscount?: number;
  studentName: string;
  studentEmail: string;
  onValidateForm: () => { valid: boolean; name: string; email: string };
  onPurchaseSessionCreated?: (purchaseId: string) => void;
};

export function CheckoutClient({
  purchaseId,
  courseSlug,
  batchId,
  originalPrice,
  initialAmount,
  initialCoupon,
  initialDiscount = 0,
  studentName,
  studentEmail,
  onValidateForm,
  onPurchaseSessionCreated,
}: CheckoutClientProps) {
  const [currentPurchaseId, setCurrentPurchaseId] = useState<string | undefined>(purchaseId);
  const [currentBoundName, setCurrentBoundName] = useState(studentName);
  const [currentBoundEmail, setCurrentBoundEmail] = useState(studentEmail);

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  // Coupon state
  const [couponInput, setCouponInput] = useState(initialCoupon || "");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(initialCoupon || null);
  const [discountAmount, setDiscountAmount] = useState(initialDiscount);
  const [finalPayable, setFinalPayable] = useState(initialAmount);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponMessage, setCouponMessage] = useState<string | null>(
    initialCoupon ? `Coupon "${initialCoupon}" applied (-₹${initialDiscount.toLocaleString("en-IN")})` : null
  );

  // Dynamically load Razorpay SDK
  useEffect(() => {
    const existingScript = document.getElementById("razorpay-sdk");
    if (existingScript) {
      setSdkLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.id = "razorpay-sdk";
    script.async = true;
    script.onload = () => setSdkLoaded(true);
    script.onerror = () =>
      setError("Failed to load Razorpay payment gateway. Please check your internet connection.");
    document.body.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById("razorpay-sdk");
      if (scriptToRemove) {
        document.body.removeChild(scriptToRemove);
      }
    };
  }, []);

  // Update internal tracking if external props change
  useEffect(() => {
    if (purchaseId && purchaseId !== currentPurchaseId) {
      setCurrentPurchaseId(purchaseId);
    }
  }, [purchaseId, currentPurchaseId]);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsApplyingCoupon(true);
    setError(null);
    setCouponMessage(null);

    try {
      let activePurchaseId = currentPurchaseId;

      if (!activePurchaseId) {
        const validation = onValidateForm();
        if (!validation.valid) {
          setError("Please enter your full name and email before applying a coupon.");
          setIsApplyingCoupon(false);
          return;
        }

        const sessionRes = await fetch("/api/checkout/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            buyerName: validation.name,
            buyerEmail: validation.email,
            courseSlug,
            batchId,
          }),
        });

        const sessionData = await sessionRes.json();
        if (!sessionRes.ok || !sessionData.purchaseId) {
          throw new Error(sessionData.error || "Failed to initialize checkout session");
        }

        activePurchaseId = String(sessionData.purchaseId);
        setCurrentPurchaseId(activePurchaseId);
        setCurrentBoundName(validation.name);
        setCurrentBoundEmail(validation.email);
        onPurchaseSessionCreated?.(activePurchaseId);
      }

      const res = await fetch("/api/checkout/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purchaseId: activePurchaseId,
          code: couponInput.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Invalid coupon code");
      }

      setAppliedCoupon(data.couponCode);
      setDiscountAmount(data.discountAmount);
      setFinalPayable(data.finalAmount);
      setCouponMessage(`Coupon "${data.couponCode}" applied successfully! (-₹${data.discountAmount.toLocaleString("en-IN")})`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to apply coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handlePayment = async () => {
    if (!sdkLoaded) {
      setError("Payment gateway is still initializing. Please wait a moment.");
      return;
    }

    const validation = onValidateForm();
    if (!validation.valid) {
      return;
    }

    setIsPending(true);
    setError(null);

    try {
      let activePurchaseId = currentPurchaseId;

      // 1. Initialize or update session if needed
      if (
        !activePurchaseId ||
        validation.name !== currentBoundName ||
        validation.email !== currentBoundEmail
      ) {
        const sessionRes = await fetch("/api/checkout/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            buyerName: validation.name,
            buyerEmail: validation.email,
            courseSlug,
            batchId,
          }),
        });

        const sessionData = await sessionRes.json();
        if (!sessionRes.ok || !sessionData.purchaseId) {
          throw new Error(sessionData.error || "Failed to initialize checkout session");
        }

        activePurchaseId = String(sessionData.purchaseId);
        setCurrentPurchaseId(activePurchaseId);
        setCurrentBoundName(validation.name);
        setCurrentBoundEmail(validation.email);
        onPurchaseSessionCreated?.(activePurchaseId);
      }

      if (!activePurchaseId) {
        throw new Error("Checkout session is missing or expired. Please try again.");
      }

      // 2. Create Razorpay order on the server
      const orderRes = await fetch("/api/checkout/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purchaseId: activePurchaseId,
          courseSlug,
          batchId,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || "Failed to initialize payment order");
      }

      // 3. Launch Razorpay modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "VibeLogic Studio",
        description: orderData.courseTitle,
        order_id: orderData.orderId,
        handler: async function (paymentResponse: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          try {
            // 4. Verify payment signature on the server
            const verifyRes = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                purchaseId: activePurchaseId,
                courseSlug,
                batchId,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData.error || "Payment verification failed");
            }

            // 5. Redirect to onboarding or course workspace
            window.location.href =
              verifyData.redirectUrl ||
              verifyData.onboardingUrl ||
              `/checkout/onboarding?purchaseId=${activePurchaseId}`;
          } catch (verifyErr: unknown) {
            console.error("[CheckoutClient] Verification error:", verifyErr);
            setError(
              verifyErr instanceof Error
                ? verifyErr.message
                : "Payment confirmed by bank but verification syncing failed. Contact support."
            );
            setIsPending(false);
          }
        },
        prefill: {
          name: validation.name,
          email: validation.email,
        },
        theme: {
          color: "#FF5A1F",
        },
        modal: {
          ondismiss: function () {
            setIsPending(false);
          },
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      console.error("[CheckoutClient] Payment error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred during checkout.");
      setIsPending(false);
    }
  };

  const taxAmount = Math.round(finalPayable * 0.18);
  const netAmount = finalPayable - taxAmount;

  return (
    <aside className="rounded-2xl md:rounded-3xl border border-border/60 bg-surface p-4 md:p-5 shadow-sm space-y-3.5 text-left">
      <div>
        <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-2.5">
          Fee Breakdown
        </h3>
        <div className="space-y-2 text-xs md:text-sm">
          <div className="flex justify-between items-center text-text-secondary">
            <span>Course Tuition</span>
            <span>₹{originalPrice.toLocaleString("en-IN")}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between items-center text-success font-semibold">
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                Coupon Discount ({appliedCoupon})
              </span>
              <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-text-secondary">
            <span>Base Registration Fee</span>
            <span>₹{netAmount.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex justify-between items-center text-text-secondary">
            <span>GST / VAT (18%)</span>
            <span>₹{taxAmount.toLocaleString("en-IN")}</span>
          </div>

          <div className="h-px bg-border/60 my-1.5" />

          <div className="flex justify-between items-baseline pt-0.5">
            <span className="text-sm font-bold text-text-primary">Total Payable</span>
            <span className="text-xl md:text-2xl font-extrabold text-[#FF5A1F]">
              ₹{finalPayable.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Coupon Application Box (Compact) */}
      <div className="p-3 rounded-xl bg-background/60 border border-border/50 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            Promotional Code
          </label>
          {couponMessage && (
            <span className="text-[10px] font-medium text-success flex items-center gap-1">
              <Check className="w-3 h-3 shrink-0" />
              Applied
            </span>
          )}
        </div>
        <form onSubmit={handleApplyCoupon} className="flex gap-2">
          <input
            type="text"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
            placeholder="e.g. LAUNCH25"
            disabled={isApplyingCoupon || isPending}
            className="flex-1 h-9 px-3 rounded-lg border border-border bg-surface text-xs font-mono uppercase text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
          <button
            type="submit"
            disabled={isApplyingCoupon || !couponInput.trim()}
            className="px-3.5 h-9 rounded-lg bg-text-primary hover:bg-primary text-white text-xs font-bold disabled:opacity-40 transition-colors flex items-center justify-center gap-1"
          >
            {isApplyingCoupon ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              "Apply"
            )}
          </button>
        </form>

        {couponMessage && (
          <p className="text-[10px] font-medium text-success leading-tight">
            {couponMessage}
          </p>
        )}
      </div>

      {error && (
        <div className="p-2.5 bg-error/10 border border-error/30 text-error text-xs font-medium rounded-xl leading-relaxed flex items-start gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Payment CTA */}
      <div className="space-y-2.5 pt-0.5">
        <button
          onClick={handlePayment}
          disabled={isPending || !sdkLoaded}
          className="w-full flex h-12 md:h-12.5 items-center justify-between rounded-full bg-[#FF5A1F] hover:bg-[#E64A19] text-white pl-5 pr-1.5 text-xs md:text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed select-none transition-all cursor-pointer"
        >
          <span className="tracking-tight">
            {isPending ? "Connecting Payment Gateway..." : "Proceed to Payment"}
          </span>
          <span className="flex size-9 items-center justify-center rounded-full bg-white/10 shrink-0">
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <CreditCard className="w-4 h-4 text-white" />
            )}
          </span>
        </button>

        <div className="flex items-center gap-1.5 text-[10px] leading-tight text-text-secondary">
          <ShieldCheck className="size-3.5 shrink-0 text-success" strokeWidth={2} />
          <span>
            100% secure checkout via Razorpay · Full refund guarantee
          </span>
        </div>
      </div>
    </aside>
  );
}
