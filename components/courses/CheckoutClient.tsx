"use client";

import React, { useState, useEffect } from "react";
import { Loader2, CreditCard, ShieldCheck, Tag, Check, AlertCircle, Lock } from "lucide-react";

function RazorpayLogo({ className = "h-4 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1896 401"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Razorpay"
    >
      <path
        d="M451.9209,151.4937 C448.9309,162.6497 443.1359,170.8377 434.5349,176.0657 C425.9239,181.2927 413.8469,183.9117 398.2689,183.9117 L348.7769,183.9117 L366.1509,119.0807 L415.6429,119.0807 C431.2089,119.0807 441.8959,121.6947 447.7019,126.9217 C453.4969,132.1547 454.9109,140.3437 451.9209,151.4937 M503.1739,150.0967 C509.4679,126.6377 506.8589,108.6267 495.3509,96.0797 C483.8409,83.5327 463.6739,77.2627 434.8709,77.2627 L324.3909,77.2627 L257.8969,325.4027 L311.5719,325.4027 L338.3809,225.3777 L373.5809,225.3777 C381.4739,225.3777 387.6869,226.6577 392.2309,229.2137 C396.7849,231.7747 399.4509,236.3067 400.2739,242.8037 L409.8479,325.4027 L467.3589,325.4027 L458.0289,248.3847 C456.1279,231.1897 448.2589,221.0827 434.4309,218.0637 C452.0599,212.9577 466.8259,204.4677 478.7179,192.6167 C490.5989,180.7717 498.7579,166.6017 503.1739,150.0967"
        fill="#072654"
      />
      <path
        d="M633.625,236.533 C629.14,253.258 622.231,266.042 612.901,274.868 C603.56,283.7 592.386,288.111 579.382,288.111 C566.122,288.111 557.128,283.758 552.387,275.042 C547.623,266.332 547.461,253.733 551.889,237.228 C556.305,220.735 563.352,207.841 573.053,198.539 C582.742,189.255 594.09,184.602 607.105,184.602 C620.11,184.602 628.919,189.082 633.485,198.024 C638.053,206.966 638.11,219.802 633.625,236.533 L633.625,236.533 Z M657.153,148.706 L650.431,173.8 C647.521,164.736 641.9,157.538 633.578,152.195 C625.245,146.852 614.918,144.174 602.608,144.174 C587.506,144.174 572.983,148.069 559.052,155.852 C545.12,163.64 532.938,174.617 522.519,188.786 C512.099,202.961 504.461,219.107 499.604,237.228 C494.748,255.356 493.774,271.328 496.695,285.149 C499.616,298.977 505.944,309.605 515.691,317.04 C525.428,324.481 537.969,328.19 553.303,328.19 C565.612,328.19 577.342,325.635 588.469,320.523 C599.595,315.418 609.041,308.325 616.818,299.266 L609.807,325.403 L661.731,325.403 L709.079,148.706 L657.153,148.706 Z"
        fill="#072654"
      />
      <polygon
        points="895.79 148.7061 744.882 148.7061 734.334 188.0911 822.155 188.0911 706.042 288.4581 696.132 325.4031 851.92 325.4031 862.478 286.0241 768.388 286.0241 886.263 184.2541"
        fill="#072654"
      />
      <path
        d="M1028.6514,236.1853 C1023.9804,253.6053 1017.0604,266.6273 1007.9044,275.2223 C998.7484,283.8163 987.6674,288.1103 974.6634,288.1103 C947.4714,288.1103 938.5234,270.8113 947.7964,236.1853 C952.4094,218.9903 959.3634,206.0383 968.6594,197.3283 C977.9654,188.6123 989.2324,184.2543 1002.4804,184.2543 C1015.4844,184.2543 1024.2584,188.6123 1028.7794,197.3283 C1033.2984,206.0383 1033.2644,218.9903 1028.6514,236.1853 M1059.0304,155.3243 C1047.0804,147.8943 1031.8154,144.1743 1013.2244,144.1743 C994.4014,144.1743 976.9694,147.8943 960.9174,155.3243 C944.8644,162.7653 931.1984,173.4523 919.9214,187.3893 C908.6314,201.3323 900.4954,217.5943 895.5114,236.1853 C890.5274,254.7763 889.9484,271.0323 893.7734,284.9753 C897.5864,298.9183 905.5144,309.6053 917.5914,317.0403 C929.6574,324.4813 945.0954,328.1903 963.9194,328.1903 C982.5094,328.1903 999.7674,324.4813 1015.7054,317.0403 C1031.6184,309.6053 1045.2374,298.9183 1056.5264,284.9753 C1067.8034,271.0323 1075.9404,254.7763 1080.9244,236.1853 C1085.9084,217.5943 1086.4884,201.3323 1082.6744,187.3893 C1078.8494,173.4523 1070.9674,162.7653 1059.0304,155.3243"
        fill="#072654"
      />
      <path
        d="M1602.1367,236.533 C1597.6517,253.258 1590.7427,266.042 1581.4127,274.868 C1572.0817,283.7 1560.8857,288.111 1547.8817,288.111 C1534.6457,288.111 1525.6397,283.758 1520.8987,275.042 C1516.1347,266.332 1515.9727,253.733 1520.4007,237.228 C1524.8167,220.735 1531.8637,207.841 1541.5647,198.539 C1551.2537,189.255 1562.6017,184.602 1575.6167,184.602 C1588.6217,184.602 1597.4307,189.082 1601.9967,198.024 C1606.5647,206.966 1606.6217,219.802 1602.1367,236.533 L1602.1367,236.533 Z M1625.6647,148.706 L1618.9427,173.8 C1616.0327,164.736 1610.4117,157.538 1602.0897,152.195 C1593.7567,146.852 1583.4297,144.174 1571.1197,144.174 C1556.0177,144.174 1541.4947,148.069 1527.5637,155.852 C1513.6317,163.64 1501.4497,174.617 1491.0307,188.786 C1480.6107,202.961 1472.9717,219.107 1468.1157,237.228 C1463.2597,255.356 1462.2967,271.328 1465.2067,285.149 C1468.1267,298.977 1474.4447,309.605 1484.2027,317.04 C1493.9397,324.481 1506.4807,328.19 1521.8147,328.19 C1534.1227,328.19 1545.8537,325.635 1556.9797,320.523 C1568.1067,315.418 1577.5527,308.325 1585.3297,299.266 L1578.3187,325.403 L1630.2427,325.403 L1677.5907,148.706 L1625.6647,148.706 Z"
        fill="#072654"
      />
      <path
        d="M1244.165,196.1055 L1257.401,148.0105 C1252.904,145.6865 1246.946,144.5225 1239.517,144.5225 C1227.66,144.5225 1216.243,147.4835 1205.244,153.4115 C1195.798,158.4975 1187.754,165.6365 1180.962,174.5815 L1187.847,148.6815 L1172.813,148.7065 L1135.938,148.7065 L1088.227,325.4025 L1140.87,325.4025 L1165.616,233.0505 C1169.221,219.5765 1175.688,209.0635 1185.042,201.5125 C1194.372,193.9615 1206.02,190.1825 1219.964,190.1825 C1228.563,190.1825 1236.619,192.1585 1244.165,196.1055"
        fill="#072654"
      />
      <path
        d="M1390.6973,237.2256 C1386.2693,253.7306 1379.4083,266.3296 1370.1123,275.0396 C1360.7943,283.7556 1349.6433,288.1076 1336.6393,288.1076 C1323.6233,288.1076 1314.7573,283.6976 1310.0393,274.8656 C1305.3103,266.0396 1305.1943,253.2606 1309.6793,236.5296 C1314.1653,219.7996 1321.1423,206.9626 1330.6243,198.0206 C1340.1043,189.0786 1351.3593,184.5986 1364.3753,184.5986 C1377.1473,184.5986 1385.8293,189.2526 1390.4303,198.5426 C1395.0203,207.8376 1395.1133,220.7376 1390.6973,237.2256 M1427.4853,155.8486 C1417.7153,148.0656 1405.2783,144.1776 1390.1873,144.1776 C1376.9393,144.1776 1364.3293,147.1966 1352.3903,153.2356 C1340.4183,159.2856 1330.7173,167.5206 1323.2753,177.9806 L1323.4433,176.8216 L1332.2873,148.6786 L1322.1103,148.6786 L1322.1103,148.7036 L1280.9003,148.7036 L1267.8153,197.5656 C1267.6643,198.1336 1267.5373,198.6636 1267.3853,199.2376 L1213.4093,400.6806 L1266.0423,400.6806 L1293.2213,299.2696 C1295.8863,308.3216 1301.4273,315.4146 1309.8193,320.5206 C1318.2103,325.6316 1328.5603,328.1876 1340.8813,328.1876 C1356.2163,328.1876 1370.7963,324.4786 1384.6463,317.0376 C1398.4863,309.6076 1410.5163,298.9736 1420.7173,285.1466 C1430.9273,271.3306 1438.4623,255.3526 1443.3183,237.2256 C1448.1753,219.1036 1449.1823,202.9586 1446.3663,188.7836 C1443.5503,174.6136 1437.2443,163.6376 1427.4853,155.8486"
        fill="#072654"
      />
      <path
        d="M1895.5381,148.7554 L1895.5721,148.7064 L1863.6921,148.7064 C1862.6731,148.7064 1861.7741,148.7354 1860.8421,148.7554 L1844.2961,148.7554 L1835.8351,160.5434 C1835.1571,161.4314 1834.4791,162.3254 1833.7491,163.3624 L1832.8271,164.7274 L1765.5851,258.3754 L1751.6421,148.7064 L1696.5641,148.7064 L1724.4561,315.3544 L1662.8591,400.6834 L1664.6151,400.6834 L1696.0651,400.6834 L1717.7341,400.6834 L1732.6621,379.5374 C1733.1021,378.9074 1733.4791,378.3914 1733.9491,377.7254 L1751.3691,353.0284 L1751.8681,352.3214 L1829.8131,241.8274 L1895.4851,148.8284 L1895.5721,148.7554 L1895.5381,148.7554 Z"
        fill="#072654"
      />
      <polygon
        points="122.6338 105.6902 106.8778 163.6732 197.0338 105.3642 138.0748 325.3482 197.9478 325.4032 285.0458 0.4822"
        fill="#3395FF"
      />
      <path
        d="M25.5947,232.9246 L0.8077,325.4026 L123.5337,325.4026 C123.5337,325.4026 173.7317,137.3196 173.7457,137.2656 C173.6987,137.2956 25.5947,232.9246 25.5947,232.9246"
        fill="#072654"
      />
    </svg>
  );
}

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

      // Check if order was directly fulfilled for 100% OFF free coupon
      if (orderData.free && orderData.onboardingUrl) {
        window.location.href = orderData.onboardingUrl;
        return;
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
          disabled={isPending || (finalPayable > 0 && !sdkLoaded)}
          className="w-full flex h-12 md:h-12.5 items-center justify-between rounded-full bg-[#FF5A1F] hover:bg-[#E64A19] text-white pl-5 pr-1.5 text-xs md:text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed select-none transition-all cursor-pointer"
        >
          <span className="tracking-tight">
            {isPending
              ? (finalPayable === 0 ? "Claiming Free Access..." : "Connecting Payment Gateway...")
              : (finalPayable === 0 ? "Complete Free Enrollment (100% OFF) →" : "Proceed to Payment")}
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

        {/* Professional Secured by Razorpay Trust Badge */}
        <div className="w-full flex items-center justify-center gap-2 py-2.5 md:py-3 px-4 rounded-xl bg-[#F0F4F8] border border-slate-200/50 select-none shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <Lock className="w-3.5 h-3.5 text-[#072654] fill-[#072654] shrink-0" />
          <span className="text-[13px] font-medium tracking-tight text-[#334155]">Secured by</span>
          <RazorpayLogo className="h-4.5 w-auto inline-block -mt-0.5" />
        </div>
      </div>
    </aside>
  );
}
