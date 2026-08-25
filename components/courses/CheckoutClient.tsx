"use client";

import React, { useState, useEffect } from "react";
import { Loader2, CreditCard, ShieldCheck } from "lucide-react";

type CheckoutClientProps = {
  courseSlug: string;
  batchId: string;
  coursePrice: number;
  taxAmount: number;
  netAmount: number;
  studentName: string;
  studentEmail: string;
};

export function CheckoutClient({
  courseSlug,
  batchId,
  coursePrice,
  taxAmount,
  netAmount,
  studentName,
  studentEmail,
}: CheckoutClientProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  // Load Razorpay script dynamically
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
    script.onerror = () => setError("Failed to load Razorpay Payment Gateway. Check your internet connection.");
    document.body.appendChild(script);

    return () => {
      // Clean up script on unmount
      const scriptToRemove = document.getElementById("razorpay-sdk");
      if (scriptToRemove) {
        document.body.removeChild(scriptToRemove);
      }
    };
  }, []);

  const handlePayment = async () => {
    if (!sdkLoaded) {
      setError("Payment Gateway is still initializing. Please wait a moment.");
      return;
    }

    setIsPending(true);
    setError(null);

    try {
      // 1. Hit order creation API
      const response = await fetch("/api/checkout/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseSlug,
          batchId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initialize order");
      }

      // 2. Open Razorpay Checkout modal
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "VibeLogic Studio",
        description: data.courseTitle,
        order_id: data.orderId,
        handler: async function (paymentResponse: any) {
          try {
            // Verify payment on the server synchronously before redirecting
            const verifyRes = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                courseSlug,
                batchId,
              }),
            });

            if (!verifyRes.ok) {
              const errData = await verifyRes.json();
              throw new Error(errData.error || "Payment verification failed");
            }

            // Backend verified the payment, updated Convex, and created the enrollment.
            // It's safe to immediately redirect to the course overview.
            window.location.href = `/dashboard/courses/${batchId}/overview?success=true`;
          } catch (verifyErr: any) {
            console.error("Payment verification error:", verifyErr);
            setError(verifyErr.message || "Payment verified locally but failed to sync. Contact support.");
            setIsPending(false);
          }
        },
        prefill: {
          name: studentName,
          email: studentEmail,
        },
        theme: {
          color: "#FF5722", // matches VibeLogic primary theme color
        },
        modal: {
          ondismiss: function () {
            setIsPending(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Razorpay checkout error:", err);
      setError(err?.message || "An unexpected error occurred during checkout initialization.");
      setIsPending(false);
    }
  };

  return (
    <aside className="rounded-[2rem] border border-border/60 bg-surface p-7 shadow-lg space-y-7 text-left">
      <div>
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">Fee Summary</h3>
        <div className="space-y-3.5">
          <div className="flex justify-between items-center text-sm font-medium text-text-secondary">
            <span>Program Registration Fee</span>
            <span>₹{netAmount.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-medium text-text-secondary">
            <span>GST / VAT (18%)</span>
            <span>₹{taxAmount.toLocaleString("en-IN")}</span>
          </div>
          <div className="h-px bg-border/60" />
          <div className="flex justify-between items-baseline pt-1">
            <span className="text-base font-bold text-text-primary">Total Amount Due</span>
            <span className="text-2xl font-extrabold text-text-primary">₹{coursePrice.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-error/8 border border-error/20 text-error text-xs font-semibold rounded-xl leading-relaxed">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={handlePayment}
          disabled={isPending || !sdkLoaded}
          className="w-full flex h-14 items-center justify-between rounded-full bg-[#FF5722] hover:bg-[#E64A19] text-white pl-6 pr-2 text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed select-none transition-all"
        >
          <span className="tracking-tight">
            {isPending ? "Connecting Securely..." : "Proceed to Payment"}
          </span>
          <span className="flex size-10 items-center justify-center rounded-full bg-white/10 shrink-0">
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <CreditCard className="w-4 h-4 text-white" />
            )}
          </span>
        </button>

        <div className="flex items-start gap-2.5 text-[11px] leading-relaxed text-text-secondary">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" strokeWidth={2} />
          <span>
            Payment processed securely by Razorpay. Includes instant activation and a 30-day money-back guarantee.
          </span>
        </div>
      </div>
    </aside>
  );
}
