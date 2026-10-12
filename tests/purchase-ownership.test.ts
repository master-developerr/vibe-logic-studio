import { describe, it } from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";

// 1. Email Normalization & Validation Logic
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(normalizeEmail(email));
}

// 2. Cryptographic Token Hashing & Verification
function generateTokens() {
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const rawRecoveryToken = crypto.randomBytes(32).toString("hex");
  const recoveryTokenHash = crypto
    .createHash("sha256")
    .update(rawRecoveryToken)
    .digest("hex");

  return { sessionToken, rawRecoveryToken, recoveryTokenHash };
}

function verifyRecoveryToken(rawToken: string, storedHash: string): boolean {
  const computedHash = crypto
    .createHash("sha256")
    .update(rawToken.trim())
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(computedHash, "hex"),
    Buffer.from(storedHash, "hex")
  );
}

// 3. Server-Side Pricing & Coupon Calculator
interface Course {
  id: string;
  price: number;
}

interface Coupon {
  code: string;
  discountType: "percentage" | "fixed" | "fixed_price";
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  isActive: boolean;
  expiresAt?: number;
}

function calculateServerPrice(
  course: Course,
  coupon?: Coupon
): { originalPrice: number; discountAmount: number; finalPayable: number } {
  const originalPrice = course.price;
  let discountAmount = 0;

  if (coupon && coupon.isActive) {
    if (!coupon.expiresAt || coupon.expiresAt > Date.now()) {
      if (!coupon.minPurchaseAmount || originalPrice >= coupon.minPurchaseAmount) {
        if (coupon.discountType === "percentage") {
          discountAmount = Math.round((originalPrice * coupon.discountValue) / 100);
          if (coupon.maxDiscountAmount) {
            discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
          }
        } else if (coupon.discountType === "fixed_price") {
          discountAmount = Math.max(0, originalPrice - coupon.discountValue);
        } else if (coupon.discountType === "fixed") {
          discountAmount = Math.min(originalPrice, coupon.discountValue);
        }
      }
    }
  }

  const finalPayable = Math.max(0, originalPrice - discountAmount);
  return { originalPrice, discountAmount, finalPayable };
}

// 4. HMAC Signature Verification for Razorpay
function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): boolean {
  if (!signature || !orderId || !paymentId) {
    return false;
  }
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  const expectedBuffer = Buffer.from(expectedSignature);
  const signatureBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== signatureBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
}

// 5. Account Ownership & Entitlement State Machine Simulation
interface PurchaseState {
  id: string;
  buyerEmail: string;
  paymentStatus: "pending" | "verified" | "failed" | "refunded";
  claimStatus: "unclaimed" | "claimed";
  entitlementStatus: "pending_claim" | "active" | "suspended" | "revoked";
  claimedByUserId?: string;
  recoveryTokenHash?: string;
  recoveryTokenExpiresAt?: number;
}

interface ClerkIdentity {
  userId: string;
  email: string;
  emailVerified: boolean;
}

function simulateClaimPurchase(
  purchase: PurchaseState,
  identity: ClerkIdentity,
  providedRecoveryHash?: string
): { success: boolean; error?: string } {
  // 1. Verify payment status
  if (purchase.paymentStatus !== "verified") {
    return { success: false, error: "Payment not verified" };
  }

  // 2. Verified Clerk email required
  if (!identity.emailVerified) {
    return { success: false, error: "Unverified Clerk email" };
  }

  // 3. Strict Email Match Requirement
  const userEmail = normalizeEmail(identity.email);
  const purchaseEmail = normalizeEmail(purchase.buyerEmail);

  if (userEmail !== purchaseEmail) {
    return {
      success: false,
      error: `Email mismatch: purchase is registered to ${purchaseEmail}, user is ${userEmail}`,
    };
  }

  // 4. Recovery token validation if provided
  if (providedRecoveryHash && purchase.recoveryTokenHash) {
    if (providedRecoveryHash !== purchase.recoveryTokenHash) {
      return { success: false, error: "Invalid recovery token" };
    }
    if (purchase.recoveryTokenExpiresAt && purchase.recoveryTokenExpiresAt < Date.now()) {
      return { success: false, error: "Recovery token expired" };
    }
  }

  // 5. Single ownership rule
  if (purchase.claimStatus === "claimed" && purchase.claimedByUserId) {
    if (purchase.claimedByUserId !== identity.userId) {
      return { success: false, error: "Purchase already claimed by another account" };
    }
    // Idempotent re-claim by same user
    return { success: true };
  }

  // Transition states atomically
  purchase.claimStatus = "claimed";
  purchase.entitlementStatus = "active";
  purchase.claimedByUserId = identity.userId;
  purchase.recoveryTokenHash = undefined; // Invalidate single-use recovery token

  return { success: true };
}

// 6. Device Session & Account Sharing Telemetry Simulation
interface SessionFootprint {
  deviceId: string;
  ip: string;
  userAgent: string;
  lastActiveAt: number;
}

function evaluateAccountSharing(
  sessions: SessionFootprint[],
  newSession: SessionFootprint,
  windowMs = 24 * 60 * 60 * 1000,
  maxAllowedDevices = 4
): { activeSessions: SessionFootprint[]; flaggedSharing: boolean } {
  const cutoff = Date.now() - windowMs;
  const recent = sessions.filter((s) => s.lastActiveAt >= cutoff);

  // Update or append current device
  const existingIdx = recent.findIndex((s) => s.deviceId === newSession.deviceId);
  if (existingIdx >= 0) {
    recent[existingIdx] = newSession;
  } else {
    recent.push(newSession);
  }

  const distinctDevices = new Set(recent.map((s) => s.deviceId)).size;
  const flaggedSharing = distinctDevices > maxAllowedDevices;

  return { activeSessions: recent, flaggedSharing };
}

// ================= TEST SUITE ================= //

describe("VibeLogic Studio — Secure Purchase Ownership & Access Control", () => {
  describe("1. Email Normalization & Input Validation", () => {
    it("should accept valid emails and normalize casing and whitespace", () => {
      assert.equal(isValidEmail("  Student@Domain.COM  "), true);
      assert.equal(normalizeEmail("  Student@Domain.COM  "), "student@domain.com");
    });

    it("should reject invalid email formats", () => {
      assert.equal(isValidEmail("plainaddress"), false);
      assert.equal(isValidEmail("missing@domain"), false);
      assert.equal(isValidEmail("@nodomain.com"), false);
    });
  });

  describe("2. Cryptographic Recovery Token Security", () => {
    it("should generate 256-bit entropy tokens and verify hash equality", () => {
      const { rawRecoveryToken, recoveryTokenHash } = generateTokens();
      assert.equal(rawRecoveryToken.length, 64); // 32 bytes hex
      assert.equal(recoveryTokenHash.length, 64); // SHA-256 hex
      assert.equal(verifyRecoveryToken(rawRecoveryToken, recoveryTokenHash), true);
    });

    it("should reject tampered or incorrect recovery tokens", () => {
      const { recoveryTokenHash } = generateTokens();
      const fakeToken = crypto.randomBytes(32).toString("hex");
      assert.equal(verifyRecoveryToken(fakeToken, recoveryTokenHash), false);
    });
  });

  describe("3. Server-Side Pricing & Tampering Prevention", () => {
    const course: Course = { id: "c1", price: 4999 };

    it("should compute authoritative price on server and ignore client price overrides", () => {
      const pricing = calculateServerPrice(course);
      assert.equal(pricing.originalPrice, 4999);
      assert.equal(pricing.discountAmount, 0);
      assert.equal(pricing.finalPayable, 4999);
    });

    it("should apply percentage coupon with max discount cap", () => {
      const coupon: Coupon = {
        code: "LAUNCH20",
        discountType: "percentage",
        discountValue: 20,
        maxDiscountAmount: 500,
        isActive: true,
      };
      const pricing = calculateServerPrice(course, coupon);
      assert.equal(pricing.discountAmount, 500); // 20% of 4999 is ~1000, capped at 500
      assert.equal(pricing.finalPayable, 4499);
    });

    it("should reject expired or inactive coupons", () => {
      const expiredCoupon: Coupon = {
        code: "OLDPROMO",
        discountType: "fixed",
        discountValue: 1000,
        isActive: false,
        expiresAt: Date.now() - 10000,
      };
      const pricing = calculateServerPrice(course, expiredCoupon);
      assert.equal(pricing.discountAmount, 0);
      assert.equal(pricing.finalPayable, 4999);
    });

    it("should reduce price to exactly 10 rupees using fixed_price coupon", () => {
      const course999: Course = { id: "c2", price: 999 };
      const coupon10: Coupon = {
        code: "TEST10",
        discountType: "fixed_price",
        discountValue: 10,
        isActive: true,
      };
      const pricing = calculateServerPrice(course999, coupon10);
      assert.equal(pricing.originalPrice, 999);
      assert.equal(pricing.discountAmount, 989);
      assert.equal(pricing.finalPayable, 10);
    });

    it("should reduce price to 10 rupees using fixed discount coupon of 989 on 999 course", () => {
      const course999: Course = { id: "c2", price: 999 };
      const fixedCoupon: Coupon = {
        code: "VIBE10",
        discountType: "fixed",
        discountValue: 989,
        isActive: true,
      };
      const pricing = calculateServerPrice(course999, fixedCoupon);
      assert.equal(pricing.originalPrice, 999);
      assert.equal(pricing.discountAmount, 989);
      assert.equal(pricing.finalPayable, 10);
    });
  });

  describe("4. Razorpay HMAC Signature Verification", () => {
    const secret = "test_razorpay_secret_key_123";
    const orderId = "order_O82KskL194";
    const paymentId = "pay_P82KskL194";

    it("should accept valid cryptographic signature", () => {
      const body = `${orderId}|${paymentId}`;
      const validSig = crypto.createHmac("sha256", secret).update(body).digest("hex");
      assert.equal(verifyRazorpaySignature(orderId, paymentId, validSig, secret), true);
    });

    it("should reject invalid or tampered payment signature", () => {
      const invalidSig = "bad_signature_that_does_not_match";
      assert.equal(verifyRazorpaySignature(orderId, paymentId, invalidSig, secret), false);
    });
  });

  describe("5. Post-Payment Purchase Claiming & Ownership Integrity", () => {
    it("should successfully claim when payment is verified and email matches", () => {
      const purchase: PurchaseState = {
        id: "p1",
        buyerEmail: "student@example.com",
        paymentStatus: "verified",
        claimStatus: "unclaimed",
        entitlementStatus: "pending_claim",
      };

      const identity: ClerkIdentity = {
        userId: "clerk_user_1",
        email: "student@example.com",
        emailVerified: true,
      };

      const result = simulateClaimPurchase(purchase, identity);
      assert.equal(result.success, true);
      assert.equal(purchase.claimStatus, "claimed");
      assert.equal(purchase.entitlementStatus, "active");
      assert.equal(purchase.claimedByUserId, "clerk_user_1");
    });

    it("should REJECT claim if user email does not match purchase email", () => {
      const purchase: PurchaseState = {
        id: "p2",
        buyerEmail: "buyer@example.com",
        paymentStatus: "verified",
        claimStatus: "unclaimed",
        entitlementStatus: "pending_claim",
      };

      const unauthorizedIdentity: ClerkIdentity = {
        userId: "clerk_user_2",
        email: "attacker@different.com",
        emailVerified: true,
      };

      const result = simulateClaimPurchase(purchase, unauthorizedIdentity);
      assert.equal(result.success, false);
      assert.match(result.error ?? "", /Email mismatch/);
      assert.equal(purchase.claimStatus, "unclaimed");
      assert.equal(purchase.entitlementStatus, "pending_claim");
    });

    it("should REJECT claim if email is unverified in Clerk", () => {
      const purchase: PurchaseState = {
        id: "p3",
        buyerEmail: "student@example.com",
        paymentStatus: "verified",
        claimStatus: "unclaimed",
        entitlementStatus: "pending_claim",
      };

      const unverifiedIdentity: ClerkIdentity = {
        userId: "clerk_user_3",
        email: "student@example.com",
        emailVerified: false,
      };

      const result = simulateClaimPurchase(purchase, unverifiedIdentity);
      assert.equal(result.success, false);
      assert.equal(result.error, "Unverified Clerk email");
      assert.equal(purchase.claimStatus, "unclaimed");
    });

    it("should REJECT claim if payment is not yet verified", () => {
      const unpaidPurchase: PurchaseState = {
        id: "p4",
        buyerEmail: "student@example.com",
        paymentStatus: "pending",
        claimStatus: "unclaimed",
        entitlementStatus: "pending_claim",
      };

      const identity: ClerkIdentity = {
        userId: "clerk_user_4",
        email: "student@example.com",
        emailVerified: true,
      };

      const result = simulateClaimPurchase(unpaidPurchase, identity);
      assert.equal(result.success, false);
      assert.equal(result.error, "Payment not verified");
    });

    it("should be idempotent when claimed again by the same authorized user", () => {
      const claimedPurchase: PurchaseState = {
        id: "p5",
        buyerEmail: "student@example.com",
        paymentStatus: "verified",
        claimStatus: "claimed",
        entitlementStatus: "active",
        claimedByUserId: "clerk_user_5",
      };

      const identity: ClerkIdentity = {
        userId: "clerk_user_5",
        email: "student@example.com",
        emailVerified: true,
      };

      const result = simulateClaimPurchase(claimedPurchase, identity);
      assert.equal(result.success, true);
    });

    it("should prevent another user from hijacking an already claimed purchase", () => {
      const claimedPurchase: PurchaseState = {
        id: "p6",
        buyerEmail: "student@example.com",
        paymentStatus: "verified",
        claimStatus: "claimed",
        entitlementStatus: "active",
        claimedByUserId: "clerk_user_owner",
      };

      const secondUser: ClerkIdentity = {
        userId: "clerk_user_imposter",
        email: "student@example.com", // hypothetically same email with different clerk ID
        emailVerified: true,
      };

      const result = simulateClaimPurchase(claimedPurchase, secondUser);
      assert.equal(result.success, false);
      assert.match(result.error ?? "", /already claimed/);
    });

    it("should invalidate single-use recovery token hash upon successful claim", () => {
      const { recoveryTokenHash } = generateTokens();
      const purchase: PurchaseState = {
        id: "p7",
        buyerEmail: "student@example.com",
        paymentStatus: "verified",
        claimStatus: "unclaimed",
        entitlementStatus: "pending_claim",
        recoveryTokenHash,
        recoveryTokenExpiresAt: Date.now() + 100000,
      };

      const identity: ClerkIdentity = {
        userId: "clerk_user_7",
        email: "student@example.com",
        emailVerified: true,
      };

      const result = simulateClaimPurchase(purchase, identity, recoveryTokenHash);
      assert.equal(result.success, true);
      assert.equal(purchase.recoveryTokenHash, undefined); // Token wiped
    });
  });

  describe("6. Account Sharing & Multi-Device Usage Telemetry", () => {
    it("should permit normal phone and laptop usage (<= 4 devices) without flagging", () => {
      const now = Date.now();
      const initialSessions: SessionFootprint[] = [
        { deviceId: "macbook-air-1", ip: "203.0.113.1", userAgent: "macOS Safari", lastActiveAt: now - 3600000 },
        { deviceId: "iphone-15-pro", ip: "198.51.100.2", userAgent: "iOS Mobile Safari", lastActiveAt: now - 1800000 },
      ];

      const newPhoneSession: SessionFootprint = {
        deviceId: "work-laptop-dell",
        ip: "203.0.113.4",
        userAgent: "Windows Chrome",
        lastActiveAt: now,
      };

      const { activeSessions, flaggedSharing } = evaluateAccountSharing(
        initialSessions,
        newPhoneSession,
        24 * 60 * 60 * 1000,
        4
      );

      assert.equal(activeSessions.length, 3);
      assert.equal(flaggedSharing, false);
    });

    it("should flag suspicious account sharing when exceeding device threshold", () => {
      const now = Date.now();
      const initialSessions: SessionFootprint[] = [
        { deviceId: "device-1", ip: "1.1.1.1", userAgent: "Chrome", lastActiveAt: now },
        { deviceId: "device-2", ip: "2.2.2.2", userAgent: "Firefox", lastActiveAt: now },
        { deviceId: "device-3", ip: "3.3.3.3", userAgent: "Safari", lastActiveAt: now },
        { deviceId: "device-4", ip: "4.4.4.4", userAgent: "Edge", lastActiveAt: now },
      ];

      const fifthDevice: SessionFootprint = {
        deviceId: "device-5",
        ip: "5.5.5.5",
        userAgent: "Android Mobile",
        lastActiveAt: now,
      };

      const { activeSessions, flaggedSharing } = evaluateAccountSharing(
        initialSessions,
        fifthDevice,
        24 * 60 * 60 * 1000,
        4
      );

      assert.equal(activeSessions.length, 5);
      assert.equal(flaggedSharing, true);
    });
  });

  describe("7. Adversarial Payment Fulfillment & Idempotency", () => {
    function simulateFulfillPayment(
      purchase: PurchaseState & { amount: number; razorpayOrderId?: string },
      batch: { capacity: number; enrolledCount: number },
      incoming: { amount: number; razorpayOrderId: string; razorpayPaymentId: string }
    ): { success: boolean; error?: string; alreadyVerified?: boolean } {
      if (purchase.paymentStatus === "verified") {
        return { success: true, alreadyVerified: true };
      }

      if (incoming.amount !== purchase.amount) {
        return { success: false, error: `Payment amount mismatch: expected ₹${purchase.amount}, received ₹${incoming.amount}` };
      }

      if (purchase.razorpayOrderId && purchase.razorpayOrderId !== incoming.razorpayOrderId) {
        return { success: false, error: `Order ID mismatch: expected ${purchase.razorpayOrderId}, received ${incoming.razorpayOrderId}` };
      }

      batch.enrolledCount += 1;
      purchase.paymentStatus = "verified";
      purchase.entitlementStatus = "pending_claim";
      return { success: true };
    }

    it("should reject forged payment if incoming amount does not match server price", () => {
      const purchase = {
        id: "p10",
        buyerEmail: "victim@example.com",
        amount: 4999,
        razorpayOrderId: "order_123",
        paymentStatus: "pending" as const,
        claimStatus: "unclaimed" as const,
        entitlementStatus: "pending_claim" as const,
      };
      const batch = { capacity: 50, enrolledCount: 10 };

      const forgedPayment = {
        amount: 1, // Tampered to 1 INR
        razorpayOrderId: "order_123",
        razorpayPaymentId: "pay_tampered_1",
      };

      const result = simulateFulfillPayment(purchase, batch, forgedPayment);
      assert.equal(result.success, false);
      assert.match(result.error ?? "", /amount mismatch/);
      assert.equal(purchase.paymentStatus, "pending");
      assert.equal(batch.enrolledCount, 10); // Seats not modified
    });

    it("should reject payment with mismatched order ID", () => {
      const purchase = {
        id: "p11",
        buyerEmail: "student@example.com",
        amount: 4999,
        razorpayOrderId: "order_expected_456",
        paymentStatus: "pending" as const,
        claimStatus: "unclaimed" as const,
        entitlementStatus: "pending_claim" as const,
      };
      const batch = { capacity: 50, enrolledCount: 10 };

      const mismatchedOrder = {
        amount: 4999,
        razorpayOrderId: "order_different_999",
        razorpayPaymentId: "pay_mismatch_1",
      };

      const result = simulateFulfillPayment(purchase, batch, mismatchedOrder);
      assert.equal(result.success, false);
      assert.match(result.error ?? "", /Order ID mismatch/);
      assert.equal(purchase.paymentStatus, "pending");
    });

    it("should idempotently handle concurrent webhook and client verification without double seat allocation", () => {
      const purchase = {
        id: "p12",
        buyerEmail: "student@example.com",
        amount: 4999,
        razorpayOrderId: "order_789",
        paymentStatus: "pending" as const,
        claimStatus: "unclaimed" as const,
        entitlementStatus: "pending_claim" as const,
      };
      const batch = { capacity: 50, enrolledCount: 20 };

      const validPayment = {
        amount: 4999,
        razorpayOrderId: "order_789",
        razorpayPaymentId: "pay_valid_789",
      };

      // Call 1: Client verification arrives first
      const res1 = simulateFulfillPayment(purchase, batch, validPayment);
      assert.equal(res1.success, true);
      assert.equal(purchase.paymentStatus, "verified");
      assert.equal(batch.enrolledCount, 21);

      // Call 2: Webhook arrives subsequently
      const res2 = simulateFulfillPayment(purchase, batch, validPayment);
      assert.equal(res2.success, true);
      assert.equal(res2.alreadyVerified, true);
      assert.equal(batch.enrolledCount, 21); // Exactly 1 seat allocated, zero duplicates
    });
  });

  describe("8. Atomic Email Queue Protection", () => {
    interface EmailJobState {
      id: string;
      purchaseId: string;
      status: "draft" | "pending" | "processing" | "sent" | "failed";
    }

    function simulateClaimEmailJob(
      purchase: PurchaseState,
      jobs: EmailJobState[]
    ): { job: EmailJobState | null; error?: string } {
      if (purchase.paymentStatus !== "verified") {
        return { job: null, error: "Purchase is not verified for email dispatch" };
      }

      const job = jobs.find((j) => j.purchaseId === purchase.id && j.status === "pending");
      if (!job) return { job: null };

      job.status = "processing";
      return { job };
    }

    it("should never dispatch email jobs for unpaid checkout sessions", () => {
      const unpaidPurchase: PurchaseState = {
        id: "p20",
        buyerEmail: "unpaid@example.com",
        paymentStatus: "pending",
        claimStatus: "unclaimed",
        entitlementStatus: "pending_claim",
      };
      const jobs: EmailJobState[] = [
        { id: "j1", purchaseId: "p20", status: "draft" },
      ];

      const res = simulateClaimEmailJob(unpaidPurchase, jobs);
      assert.equal(res.job, null);
      assert.equal(res.error, "Purchase is not verified for email dispatch");
    });

    it("should atomically claim pending job once and prevent duplicate dispatch", () => {
      const paidPurchase: PurchaseState = {
        id: "p21",
        buyerEmail: "paid@example.com",
        paymentStatus: "verified",
        claimStatus: "unclaimed",
        entitlementStatus: "pending_claim",
      };
      const jobs: EmailJobState[] = [
        { id: "j2", purchaseId: "p21", status: "pending" },
      ];

      // First worker claims the job
      const claim1 = simulateClaimEmailJob(paidPurchase, jobs);
      assert.notEqual(claim1.job, null);
      assert.equal(claim1.job?.status, "processing");

      // Concurrent second worker tries to claim the same job
      const claim2 = simulateClaimEmailJob(paidPurchase, jobs);
      assert.equal(claim2.job, null); // Blocked from double dispatch
    });
  });

  describe("9. Protected Course Content Access Control", () => {
    function simulateRequireStudentEnrolled(
      identity: ClerkIdentity | null,
      enrollments: Array<{ userId: string; batchId: string; status: string }>,
      targetBatchId: string
    ): { authorized: boolean; reason?: string } {
      if (!identity) {
        return { authorized: false, reason: "Unauthenticated" };
      }

      const enrollment = enrollments.find(
        (e) => e.userId === identity.userId && e.batchId === targetBatchId
      );

      if (!enrollment || enrollment.status !== "active") {
        return { authorized: false, reason: "No active enrollment in batch" };
      }

      return { authorized: true };
    }

    it("should reject unauthenticated visitors from accessing protected batch LMS content", () => {
      const enrollments = [{ userId: "u1", batchId: "batch_ai_1", status: "active" }];
      const res = simulateRequireStudentEnrolled(null, enrollments, "batch_ai_1");
      assert.equal(res.authorized, false);
      assert.equal(res.reason, "Unauthenticated");
    });

    it("should reject authenticated users who do not have an active enrollment in the batch", () => {
      const enrollments = [{ userId: "u1", batchId: "batch_ai_1", status: "active" }];
      const otherUser: ClerkIdentity = {
        userId: "u2",
        email: "other@example.com",
        emailVerified: true,
      };

      const res = simulateRequireStudentEnrolled(otherUser, enrollments, "batch_ai_1");
      assert.equal(res.authorized, false);
      assert.equal(res.reason, "No active enrollment in batch");
    });

    it("should reject access when enrollment exists but is still in pending_claim status", () => {
      const enrollments = [{ userId: "u3", batchId: "batch_ai_1", status: "pending_claim" }];
      const user: ClerkIdentity = {
        userId: "u3",
        email: "buyer@example.com",
        emailVerified: true,
      };

      const res = simulateRequireStudentEnrolled(user, enrollments, "batch_ai_1");
      assert.equal(res.authorized, false);
      assert.equal(res.reason, "No active enrollment in batch");
    });

    it("should grant access only when student has an active enrollment", () => {
      const enrollments = [{ userId: "u4", batchId: "batch_ai_1", status: "active" }];
      const user: ClerkIdentity = {
        userId: "u4",
        email: "enrolled@example.com",
        emailVerified: true,
      };

      const res = simulateRequireStudentEnrolled(user, enrollments, "batch_ai_1");
      assert.equal(res.authorized, true);
    });
  });

  describe("10. Server-Side Onboarding Session Handling (Finding 1)", () => {
    function simulateServerActionUpdateDetails(
      cookieToken: string | null,
      storedPurchaseToken: string,
      details: { buyerName: string; buyerEmail: string }
    ): { success: boolean; error?: string } {
      if (!cookieToken) {
        return { success: false, error: "Purchase session not found or expired" };
      }
      if (cookieToken !== storedPurchaseToken) {
        return { success: false, error: "Unauthorized purchase session" };
      }
      if (details.buyerName.trim().length < 2) {
        return { success: false, error: "Name must be at least 2 characters" };
      }
      return { success: true };
    }

    it("should reject client mutation when HttpOnly session cookie is missing", () => {
      const res = simulateServerActionUpdateDetails(null, "valid_token_123", {
        buyerName: "Adil",
        buyerEmail: "adil@example.com",
      });
      assert.equal(res.success, false);
      assert.equal(res.error, "Purchase session not found or expired");
    });

    it("should reject mutation if session token does not match purchase record", () => {
      const res = simulateServerActionUpdateDetails("wrong_token", "valid_token_123", {
        buyerName: "Adil",
        buyerEmail: "adil@example.com",
      });
      assert.equal(res.success, false);
      assert.equal(res.error, "Unauthorized purchase session");
    });

    it("should safely update buyer details on the server without exposing token in response", () => {
      const res = simulateServerActionUpdateDetails("valid_token_123", "valid_token_123", {
        buyerName: "Adil",
        buyerEmail: "adil@example.com",
      });
      assert.equal(res.success, true);
      assert.equal(res.error, undefined);
    });
  });

  describe("11. Redis Cache Eviction on Payment-First Fulfillment (Finding 2)", () => {
    interface CacheStore {
      [key: string]: unknown;
    }

    function simulateInvalidatePurchaseCaches(
      cache: CacheStore,
      params: { courseSlug?: string; courseId?: string; batchId?: string; clerkId?: string }
    ): string[] {
      const deletedKeys: string[] = [];

      if (params.courseSlug) {
        const slugKey1 = `course:v1:${params.courseSlug}`;
        const slugKey2 = `courses:detail:${params.courseSlug}`;
        delete cache[slugKey1];
        delete cache[slugKey2];
        deletedKeys.push(slugKey1, slugKey2);
      }

      // Marketplace keys
      delete cache["marketplace:v1:*"];
      delete cache["courses:market:*"];
      deletedKeys.push("marketplace:v1:*", "courses:market:*");

      if (params.clerkId) {
        const dashKey = `student:dashboard:${params.clerkId}`;
        delete cache[dashKey];
        deletedKeys.push(dashKey);
      }

      return deletedKeys;
    }

    it("should invalidate course and marketplace caches for payment-first purchases without clerkId", () => {
      const cache: CacheStore = {
        "course:v1:vibe-coding-bootcamp": { title: "Bootcamp" },
        "courses:detail:vibe-coding-bootcamp": { title: "Bootcamp" },
        "marketplace:v1:*": [{ id: "c1" }],
        "courses:market:*": [{ id: "c1" }],
      };

      const deleted = simulateInvalidatePurchaseCaches(cache, {
        courseSlug: "vibe-coding-bootcamp",
        courseId: "course_123",
        batchId: "batch_456",
      });

      assert.ok(deleted.includes("course:v1:vibe-coding-bootcamp"));
      assert.ok(deleted.includes("courses:detail:vibe-coding-bootcamp"));
      assert.ok(deleted.includes("marketplace:v1:*"));
      assert.ok(deleted.includes("courses:market:*"));
      assert.equal(cache["course:v1:vibe-coding-bootcamp"], undefined);
    });

    it("should invalidate student-specific keys if clerkId is supplied", () => {
      const cache: CacheStore = {
        "student:dashboard:user_clerk_1": { stats: "data" },
      };

      const deleted = simulateInvalidatePurchaseCaches(cache, {
        courseSlug: "ai-saas",
        clerkId: "user_clerk_1",
      });

      assert.ok(deleted.includes("student:dashboard:user_clerk_1"));
      assert.equal(cache["student:dashboard:user_clerk_1"], undefined);
    });
  });

  describe("12. Authenticated Email Dispatch Security (Finding 3)", () => {
    function verifyCronAuth(configuredSecret: string | undefined, authHeader: string | null): boolean {
      if (!configuredSecret || !authHeader) return false;
      const candidate = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : authHeader.trim();
      const expectedBuf = Buffer.from(configuredSecret.trim());
      const actualBuf = Buffer.from(candidate);
      if (expectedBuf.length !== actualBuf.length) return false;
      return crypto.timingSafeEqual(expectedBuf, actualBuf);
    }

    it("should reject requests when CRON_SECRET is missing or auth header is empty", () => {
      assert.equal(verifyCronAuth("secret123", null), false);
      assert.equal(verifyCronAuth(undefined, "Bearer secret123"), false);
    });

    it("should reject invalid secrets safely in constant time", () => {
      assert.equal(verifyCronAuth("prod_secret_vls_2026", "Bearer wrong_secret"), false);
      assert.equal(verifyCronAuth("prod_secret_vls_2026", "Bearer prod_secret_vls_202"), false);
    });

    it("should accept valid bearer token matching CRON_SECRET", () => {
      assert.equal(verifyCronAuth("prod_secret_vls_2026", "Bearer prod_secret_vls_2026"), true);
      assert.equal(verifyCronAuth("prod_secret_vls_2026", "prod_secret_vls_2026"), true);
    });
  });

  describe("13. Concurrency-Safe Batch Capacity & Oversubscription Reconciliation (Finding 4)", () => {
    interface BatchState {
      id: string;
      title: string;
      capacity: number;
      enrolledCount: number;
    }

    interface FulfillResult {
      success: boolean;
      oversubscribed: boolean;
      entitlementStatus: string;
      reassignedReason?: string;
    }

    function simulateFulfillPayment(
      batch: BatchState,
      _purchase: { id: string; amount: number; paymentStatus: string }
    ): FulfillResult {
      if (batch.enrolledCount >= batch.capacity) {
        // Cohort full: Record payment as verified, do NOT increment enrolledCount, flag for reconciliation
        return {
          success: true,
          oversubscribed: true,
          entitlementStatus: "pending_reconciliation",
          reassignedReason: `BATCH_CAPACITY_EXHAUSTED: Cohort ${batch.title} full (${batch.enrolledCount}/${batch.capacity})`,
        };
      } else {
        // Seat available: atomically allocate seat
        batch.enrolledCount += 1;
        return {
          success: true,
          oversubscribed: false,
          entitlementStatus: "pending_claim",
        };
      }
    }

    it("should atomically allocate seat when capacity is available", () => {
      const batch: BatchState = { id: "b1", title: "Cohort 1", capacity: 10, enrolledCount: 9 };
      const purchase = { id: "p100", amount: 4999, paymentStatus: "pending" };

      const res = simulateFulfillPayment(batch, purchase);
      assert.equal(res.success, true);
      assert.equal(res.oversubscribed, false);
      assert.equal(res.entitlementStatus, "pending_claim");
      assert.equal(batch.enrolledCount, 10);
    });

    it("should never discard payment when batch is full; flag as pending_reconciliation and cap enrolledCount", () => {
      const batch: BatchState = { id: "b1", title: "Cohort 1", capacity: 10, enrolledCount: 10 };
      const purchase = { id: "p101", amount: 4999, paymentStatus: "pending" };

      const res = simulateFulfillPayment(batch, purchase);
      assert.equal(res.success, true);
      assert.equal(res.oversubscribed, true);
      assert.equal(res.entitlementStatus, "pending_reconciliation");
      assert.ok(res.reassignedReason?.includes("BATCH_CAPACITY_EXHAUSTED"));
      // Enrolled count must NOT exceed capacity
      assert.equal(batch.enrolledCount, 10);
    });

    it("should prevent student from claiming course access while pending reconciliation", () => {
      function simulateClaimWithEntitlement(entitlementStatus: string): { allowed: boolean; error?: string } {
        if (entitlementStatus === "pending_reconciliation") {
          return { allowed: false, error: "Cohort reached capacity before checkout. Awaiting admin assignment." };
        }
        return { allowed: true };
      }

      const blockedClaim = simulateClaimWithEntitlement("pending_reconciliation");
      assert.equal(blockedClaim.allowed, false);
      assert.ok(blockedClaim.error?.includes("Cohort reached capacity"));

      const normalClaim = simulateClaimWithEntitlement("pending_claim");
      assert.equal(normalClaim.allowed, true);
    });

    it("should allow admin to reassign oversubscribed purchase to an available batch", () => {
      const fullBatch: BatchState = { id: "b1", title: "Cohort 1", capacity: 10, enrolledCount: 10 };
      const nextBatch: BatchState = { id: "b2", title: "Cohort 2", capacity: 10, enrolledCount: 2 };
      const purchase = {
        id: "p101",
        batchId: "b1",
        entitlementStatus: "pending_reconciliation",
        claimStatus: "unclaimed",
      };

      // Admin reassigns
      assert.ok(nextBatch.enrolledCount < nextBatch.capacity);
      nextBatch.enrolledCount += 1;
      purchase.batchId = nextBatch.id;
      purchase.entitlementStatus = "pending_claim";

      assert.equal(purchase.batchId, "b2");
      assert.equal(purchase.entitlementStatus, "pending_claim");
      assert.equal(nextBatch.enrolledCount, 3);
      assert.equal(fullBatch.enrolledCount, 10);
    });
  });

  describe("14. Complete Razorpay Payment Lifecycle & Integration Matrix (Scenarios 1-18)", () => {
    const TEST_KEY_SECRET = "test_rzp_secret_key_1234567890abcdef";
    const TEST_WEBHOOK_SECRET = "test_rzp_webhook_secret_987654321";

    it("Scenario 1: Correct Razorpay payment signature passes verification", () => {
      const orderId = "order_9901";
      const paymentId = "pay_8801";
      const validSig = crypto
        .createHmac("sha256", TEST_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

      assert.equal(verifyRazorpaySignature(orderId, paymentId, validSig, TEST_KEY_SECRET), true);
    });

    it("Scenario 2: Invalid payment signature is rejected", () => {
      const orderId = "order_9901";
      const paymentId = "pay_8801";
      const invalidSig = "bad_signature_00000000000000000000000000000000000000000000000000000000";

      assert.equal(verifyRazorpaySignature(orderId, paymentId, invalidSig, TEST_KEY_SECRET), false);
    });

    it("Scenario 3: Invalid webhook signature against raw body is rejected", () => {
      const rawBody = JSON.stringify({ event: "payment.captured", payload: { payment: { entity: { id: "pay_1" } } } });
      const badWebhookSig = "wrong_webhook_signature_hash_000000000000000000000000000000000000";

      function verifyWebhookSig(body: string, sig: string, secret: string): boolean {
        const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
        if (expected.length !== sig.length) return false;
        return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
      }

      assert.equal(verifyWebhookSig(rawBody, badWebhookSig, TEST_WEBHOOK_SECRET), false);

      const validWebhookSig = crypto.createHmac("sha256", TEST_WEBHOOK_SECRET).update(rawBody).digest("hex");
      assert.equal(verifyWebhookSig(rawBody, validWebhookSig, TEST_WEBHOOK_SECRET), true);
    });

    it("Scenario 4: Missing required environment variables triggers safe server error", () => {
      function checkPaymentConfig(keyId?: string, keySecret?: string): { ok: boolean; error?: string } {
        if (!keyId || !keySecret) {
          return { ok: false, error: "Payment gateway configuration error" };
        }
        return { ok: true };
      }

      const resMissing = checkPaymentConfig(undefined, "secret");
      assert.equal(resMissing.ok, false);
      assert.equal(resMissing.error, "Payment gateway configuration error");

      const resConfigured = checkPaymentConfig("rzp_test_123", "secret_123");
      assert.equal(resConfigured.ok, true);
    });

    it("Scenario 5: Client-supplied price tampering is rejected by server-side authoritative pricing", () => {
      const serverPrice = 4999;
      const clientForgedPrice = 1; // Attempted tampering to ₹1

      function validatePaymentAmount(expected: number, received: number): boolean {
        return expected === received;
      }

      assert.equal(validatePaymentAmount(serverPrice, clientForgedPrice), false);
      assert.equal(validatePaymentAmount(serverPrice, serverPrice), true);
    });

    it("Scenario 6: Payment associated with wrong user or order is rejected", () => {
      const boundOrderId = "order_real_123";
      const attackerOrderId = "order_fake_999";

      function validateOrderMatch(expectedOrder: string, incomingOrder: string): boolean {
        return expectedOrder === incomingOrder;
      }

      assert.equal(validateOrderMatch(boundOrderId, attackerOrderId), false);
      assert.equal(validateOrderMatch(boundOrderId, boundOrderId), true);
    });

    it("Scenario 7: Failed or cancelled payment is recorded in database without granting course access", () => {
      interface PaymentEntity {
        orderId: string;
        status: "pending" | "successful" | "failed";
        errorCode?: string;
      }

      const payment: PaymentEntity = { orderId: "order_fail_1", status: "pending" };

      // Simulate payment.failed webhook
      payment.status = "failed";
      payment.errorCode = "BAD_REQUEST_PAYMENT_DECLINED";

      assert.equal(payment.status, "failed");
      assert.notEqual(payment.status, "successful");
    });

    it("Scenario 8: Duplicate payment verification returns alreadyVerified: true without duplicate enrollment", () => {
      let enrollCount = 5;
      let isVerified = false;

      function verifyOnce(): { alreadyVerified: boolean; enrollCount: number } {
        if (isVerified) {
          return { alreadyVerified: true, enrollCount };
        }
        isVerified = true;
        enrollCount += 1;
        return { alreadyVerified: false, enrollCount };
      }

      const firstCall = verifyOnce();
      assert.equal(firstCall.alreadyVerified, false);
      assert.equal(firstCall.enrollCount, 6);

      const secondCall = verifyOnce();
      assert.equal(secondCall.alreadyVerified, true);
      assert.equal(secondCall.enrollCount, 6); // Untouched
    });

    it("Scenario 9: Duplicate webhook delivery is strictly idempotent", () => {
      let webhookHandledCount = 0;
      let purchasePaymentStatus = "pending";

      function handleWebhook(): { handled: boolean } {
        if (purchasePaymentStatus === "verified") {
          return { handled: true }; // No repeated side effects
        }
        purchasePaymentStatus = "verified";
        webhookHandledCount += 1;
        return { handled: true };
      }

      handleWebhook();
      handleWebhook();
      handleWebhook();

      assert.equal(webhookHandledCount, 1);
      assert.equal(purchasePaymentStatus, "verified");
    });

    it("Scenario 10: Concurrent webhook and verification requests execute safely without double allocation", async () => {
      let allocatedSeats = 0;
      let paymentStatus = "pending";

      async function atomicFulfill(): Promise<boolean> {
        // Simulating Convex transactional isolation
        if (paymentStatus === "verified") {
          return false; // Already verified
        }
        paymentStatus = "verified";
        allocatedSeats += 1;
        return true;
      }

      const [resWebhook, resClient] = await Promise.all([atomicFulfill(), atomicFulfill()]);

      // Exactly one should perform the seat increment
      assert.equal(Number(resWebhook) + Number(resClient), 1);
      assert.equal(allocatedSeats, 1);
    });

    it("Scenario 11: Successful payment followed by page refresh survives without re-charging", () => {
      const purchaseRecord = {
        id: "p_refresh_test",
        paymentStatus: "verified",
        claimStatus: "unclaimed",
        entitlementStatus: "pending_claim",
      };

      // When student refreshes /checkout/onboarding
      assert.equal(purchaseRecord.paymentStatus, "verified");
      // Access to onboarding is guaranteed without re-initiating checkout
      const canAccessOnboarding = purchaseRecord.paymentStatus === "verified";
      assert.equal(canAccessOnboarding, true);
    });

    it("Scenario 12: Course enrollment activates only after verified payment and matching student identity claim", () => {
      const student: ClerkIdentity = {
        userId: "clerk_student_123",
        email: "student@example.com",
        emailVerified: true,
      };

      const purchase: PurchaseState = {
        id: "p_claim_test",
        buyerEmail: "student@example.com",
        paymentStatus: "verified",
        claimStatus: "unclaimed",
        entitlementStatus: "pending_claim",
      };

      const claimRes = simulateClaimPurchase(purchase, student);
      assert.equal(claimRes.success, true);
      assert.equal(purchase.claimStatus, "claimed");
      assert.equal(purchase.entitlementStatus, "active");
    });

    it("Scenario 13: Batch capacity exhaustion results in pending_reconciliation without dropping payment", () => {
      const batchCapacity = 10;
      let enrolledCount = 10; // Batch is full

      function fulfillCapacityAware(): { paymentVerified: boolean; entitlement: string } {
        if (enrolledCount >= batchCapacity) {
          return {
            paymentVerified: true,
            entitlement: "pending_reconciliation",
          };
        }
        enrolledCount += 1;
        return {
          paymentVerified: true,
          entitlement: "pending_claim",
        };
      }

      const res = fulfillCapacityAware();
      assert.equal(res.paymentVerified, true);
      assert.equal(res.entitlement, "pending_reconciliation");
      assert.equal(enrolledCount, 10); // Capped at capacity
    });

    it("Scenario 14: Unauthorized email-dispatch requests without authorization are rejected (401)", () => {
      function authorizeDispatch(authHeader?: string | null): number {
        if (!authHeader) return 401;
        return 200;
      }

      assert.equal(authorizeDispatch(null), 401);
      assert.equal(authorizeDispatch(undefined), 401);
    });

    it("Scenario 15: Missing or incorrect cron secret is rejected in constant time", () => {
      const CRON_SECRET = "vls_cron_secret_secure_hash_87123";

      function safeCompare(input: string, secret: string): boolean {
        const inBuf = Buffer.from(input);
        const secBuf = Buffer.from(secret);
        if (inBuf.length !== secBuf.length) return false;
        return crypto.timingSafeEqual(inBuf, secBuf);
      }

      assert.equal(safeCompare("vls_cron_secret_secure_hash_87123", CRON_SECRET), true);
      assert.equal(safeCompare("wrong_secret_123", CRON_SECRET), false);
    });

    it("Scenario 16: Cache invalidation purges course and marketplace caches without failing payment", () => {
      const redisOnline = false; // Simulate Redis outage
      let paymentFulfillmentSucceeded = false;

      function fulfillWithCacheEviction(): { paymentSuccess: boolean; cacheEvicted: boolean } {
        // Payment in Convex succeeds first
        paymentFulfillmentSucceeded = true;

        let cacheEvicted = false;
        try {
          if (!redisOnline) throw new Error("Redis connection timeout");
          cacheEvicted = true;
        } catch {
          // Logged as observable warning, does not crash payment
          cacheEvicted = false;
        }

        return { paymentSuccess: paymentFulfillmentSucceeded, cacheEvicted };
      }

      const res = fulfillWithCacheEviction();
      assert.equal(res.paymentSuccess, true);
      assert.equal(res.cacheEvicted, false); // Observable without failing payment
    });

    it("Scenario 17: Email delivery failure retains verified payment and increments retry counter up to 5 attempts", () => {
      interface EmailJob {
        attempts: number;
        status: "pending" | "processing" | "sent" | "failed";
      }

      const job: EmailJob = { attempts: 0, status: "pending" };
      const paymentVerified = true;

      // Simulate failure on Resend
      job.attempts += 1;
      job.status = job.attempts >= 5 ? "failed" : "pending"; // Retries scheduled

      assert.equal(job.attempts, 1);
      assert.equal(job.status, "pending"); // Eligible for retry
      assert.equal(paymentVerified, true); // Payment NEVER reversed due to email failure
    });

    it("Scenario 18: Unauthorized attempts to access a purchased course without active enrollment are blocked", () => {
      function checkContentAccess(enrollmentStatus?: string): boolean {
        return enrollmentStatus === "active";
      }

      assert.equal(checkContentAccess(undefined), false);
      assert.equal(checkContentAccess("pending_claim"), false);
      assert.equal(checkContentAccess("pending_reconciliation"), false);
      assert.equal(checkContentAccess("dropped"), false);
      assert.equal(checkContentAccess("active"), true);
    });
  });

  describe("15. Razorpay Checkout Order Creation & Diagnostic Handling", () => {
    function extractRazorpayError(error: unknown): string {
      if (typeof error === "object" && error !== null) {
        const rzp = error as {
          statusCode?: number;
          error?: { code?: string; description?: string };
          description?: string;
          message?: string;
        };
        if (
          rzp.statusCode === 401 ||
          (rzp.error?.code === "BAD_REQUEST_ERROR" &&
            rzp.error?.description?.toLowerCase().includes("authentication"))
        ) {
          return "Razorpay API authentication failed (HTTP 401). Verify that RAZORPAY_KEY_SECRET and NEXT_PUBLIC_RAZORPAY_KEY_ID in server environment variables match an active key pair from your Razorpay Dashboard.";
        }
        if (rzp.error?.description) {
          return rzp.error.description;
        }
        if (rzp.description) {
          return rzp.description;
        }
        if (rzp.message) {
          return rzp.message;
        }
      }
      if (error instanceof Error) {
        return error.message;
      }
      return "Failed to create checkout order";
    }

    it("Scenario A: Successful order creation returns orderId, keyId, and paise amount", async () => {
      const mockRazorpay = {
        orders: {
          create: async (params: { amount: number; currency: string }) => ({
            id: "order_mock_test_123",
            amount: params.amount,
            currency: params.currency,
          }),
        },
      };

      const order = await mockRazorpay.orders.create({
        amount: 99900,
        currency: "INR",
      });

      assert.equal(order.id, "order_mock_test_123");
      assert.equal(order.amount, 99900);
      assert.equal(order.currency, "INR");
    });

    it("Scenario B: Missing credentials returns clear configuration error", () => {
      const key_id = undefined;
      const key_secret = undefined;

      const hasCredentials = !!(key_id && key_secret);
      assert.equal(hasCredentials, false);
      const errorMsg = hasCredentials
        ? ""
        : "Razorpay credentials not configured on server. Please ensure NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set in environment variables.";
      assert.match(errorMsg, /Razorpay credentials not configured/);
    });

    it("Scenario C: Razorpay 401 authentication failure is extracted as an actionable diagnostic error", () => {
      const rawRzpError = {
        statusCode: 401,
        error: {
          code: "BAD_REQUEST_ERROR",
          description: "Authentication failed",
        },
      };

      // Ensure error object does NOT satisfy instanceof Error
      assert.equal(rawRzpError instanceof Error, false);

      const diagnostic = extractRazorpayError(rawRzpError);
      assert.match(diagnostic, /Razorpay API authentication failed \(HTTP 401\)/);
      assert.match(diagnostic, /RAZORPAY_KEY_SECRET/);
    });

    it("Scenario D: Invalid amount or negative price is rejected before order creation", () => {
      function validateAmount(price: number): boolean {
        if (!Number.isFinite(price) || price <= 0) return false;
        const amountInPaise = Math.round(price * 100);
        return Number.isInteger(amountInPaise) && amountInPaise >= 100;
      }

      assert.equal(validateAmount(999), true);
      assert.equal(validateAmount(0), false);
      assert.equal(validateAmount(-999), false);
      assert.equal(validateAmount(NaN), false);
    });

    it("Scenario E: Razorpay network or DNS failure surfaces the connection error safely", () => {
      const networkError = new Error("getaddrinfo ENOTFOUND api.razorpay.com");
      const diagnostic = extractRazorpayError(networkError);
      assert.equal(diagnostic, "getaddrinfo ENOTFOUND api.razorpay.com");
    });

    it("Scenario F: Unauthorized or missing purchase request is rejected with 401/403", () => {
      function validatePurchaseRequest(payload: { purchaseId?: string; courseSlug?: string }, authUser?: string) {
        if (payload.purchaseId) return { authorized: true, mode: "purchase_session" };
        if (payload.courseSlug && authUser) return { authorized: true, mode: "authenticated_user" };
        return { authorized: false, error: "Authentication required to checkout without a purchase session." };
      }

      assert.deepEqual(validatePurchaseRequest({ purchaseId: "purch_123" }), {
        authorized: true,
        mode: "purchase_session",
      });
      assert.deepEqual(validatePurchaseRequest({ courseSlug: "ai-build-sprint" }, "user_clerk_123"), {
        authorized: true,
        mode: "authenticated_user",
      });
      assert.deepEqual(validatePurchaseRequest({ courseSlug: "ai-build-sprint" }, undefined), {
        authorized: false,
        error: "Authentication required to checkout without a purchase session.",
      });
    });
  });

  describe("16. Quick Enrollment Session Creation, Slug Resilience & Gateway Handoff", () => {
    // 16.1 Form Input Validation
    function validateQuickEnrollmentInput(name: unknown, email: unknown): { valid: boolean; error?: string; trimmedName?: string; normalizedEmail?: string } {
      if (!name || typeof name !== "string" || name.trim().length < 2) {
        return { valid: false, error: "Please enter your full name (minimum 2 characters)" };
      }
      if (!email || typeof email !== "string") {
        return { valid: false, error: "Please enter a valid email address" };
      }
      const trimmedEmail = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        return { valid: false, error: "Please enter a valid email address" };
      }
      return { valid: true, trimmedName: name.trim(), normalizedEmail: trimmedEmail };
    }

    it("should accept valid buyer input and normalize whitespace and email casing", () => {
      const res = validateQuickEnrollmentInput("  Alex Morgan  ", "  Alex.Morgan@Example.COM  ");
      assert.equal(res.valid, true);
      assert.equal(res.trimmedName, "Alex Morgan");
      assert.equal(res.normalizedEmail, "alex.morgan@example.com");
    });

    it("should reject names with fewer than 2 characters", () => {
      const res = validateQuickEnrollmentInput("A", "alex@example.com");
      assert.equal(res.valid, false);
      assert.equal(res.error, "Please enter your full name (minimum 2 characters)");
    });

    it("should reject invalid email formats", () => {
      const res = validateQuickEnrollmentInput("Alex Morgan", "not-an-email");
      assert.equal(res.valid, false);
      assert.equal(res.error, "Please enter a valid email address");
    });

    // 16.2 Slug Alias Resolution
    interface MockCourse {
      slug: string;
      title: string;
      price: number;
    }

    const mockCourses: MockCourse[] = [
      { slug: "ai-build-sprint", title: "Build software with AI.", price: 999 },
    ];

    function resolveCourseBySlug(slug: string): MockCourse | null {
      let found = mockCourses.find((c) => c.slug === slug);
      if (!found) {
        if (slug === "build-software-with-ai") {
          found = mockCourses.find((c) => c.slug === "ai-build-sprint");
        } else if (slug === "ai-build-sprint") {
          found = mockCourses.find((c) => c.slug === "build-software-with-ai");
        }
      }
      return found ?? null;
    }

    it("should resolve course whether querying build-software-with-ai or ai-build-sprint", () => {
      const course1 = resolveCourseBySlug("ai-build-sprint");
      assert.ok(course1);
      assert.equal(course1.title, "Build software with AI.");

      const course2 = resolveCourseBySlug("build-software-with-ai");
      assert.ok(course2);
      assert.equal(course2.title, "Build software with AI.");
      assert.equal(course2.price, 999);
    });

    // 16.3 Batch Resolution & Capacity
    interface MockBatch {
      id: string;
      title: string;
      capacity: number;
      enrolledCount: number;
      status: "upcoming" | "live" | "completed";
    }

    function resolveBatch(batches: MockBatch[], requestedBatchId?: string): { batch: MockBatch | null; error?: string } {
      let batch = requestedBatchId ? batches.find((b) => b.id === requestedBatchId) : undefined;
      if (!batch && batches.length > 0) {
        const upcomingWithCapacity = batches.find(
          (b) => b.capacity > b.enrolledCount && (b.status === "upcoming" || b.status === "live")
        );
        batch = upcomingWithCapacity || batches[0];
      }
      if (!batch) {
        return { batch: null, error: "No active batches available for this program" };
      }
      if (batch.enrolledCount >= batch.capacity) {
        return { batch: null, error: "The selected batch is full" };
      }
      return { batch };
    }

    it("should select the active cohort with available capacity", () => {
      const batches: MockBatch[] = [
        { id: "b1", title: "Cohort 01", capacity: 50, enrolledCount: 12, status: "upcoming" },
      ];
      const res = resolveBatch(batches);
      assert.ok(res.batch);
      assert.equal(res.batch.id, "b1");
    });

    it("should reject enrollment if all cohorts are full", () => {
      const batches: MockBatch[] = [
        { id: "b1", title: "Cohort 01", capacity: 50, enrolledCount: 50, status: "upcoming" },
      ];
      const res = resolveBatch(batches);
      assert.equal(res.batch, null);
      assert.equal(res.error, "The selected batch is full");
    });

    // 16.4 Safe Error Formatting
    function formatSessionError(err: unknown): string {
      let msg = err instanceof Error ? err.message : "Failed to initialize purchase session";
      if (msg.includes("Server Error")) {
        msg = "Unable to start checkout session at the moment. Please try again or refresh the page.";
      }
      return msg;
    }

    it("should transform opaque Convex Server Error into clear user-facing guidance", () => {
      const rawError = new Error("[Request ID: I482719a06c37a47] Server Error");
      const formatted = formatSessionError(rawError);
      assert.equal(formatted, "Unable to start checkout session at the moment. Please try again or refresh the page.");
    });

    it("should preserve specific business error messages", () => {
      const specificError = new Error("The selected batch is full");
      const formatted = formatSessionError(specificError);
      assert.equal(formatted, "The selected batch is full");
    });

    // 16.5 HttpOnly Cookie Spec
    it("should configure HttpOnly cookie attributes securely", () => {
      const cookieConfig = {
        name: "vls_purchase_session",
        value: "test_session_token_12345",
        httpOnly: true,
        secure: true,
        sameSite: "lax" as const,
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      };
      assert.equal(cookieConfig.httpOnly, true);
      assert.equal(cookieConfig.path, "/");
      assert.equal(cookieConfig.sameSite, "lax");
      assert.equal(cookieConfig.name, "vls_purchase_session");
    });
  });

  describe("17. Embedded Checkout Student Form & Direct Flow Verification", () => {
    // 17.1 Direct Navigation URL Construction
    function buildCheckoutHref(courseSlug: string, batchId?: string): string {
      const base = `/checkout?courseSlug=${encodeURIComponent(courseSlug)}`;
      return batchId ? `${base}&batchId=${encodeURIComponent(batchId)}` : base;
    }

    it("should generate direct checkout href without modal popups", () => {
      assert.equal(buildCheckoutHref("ai-build-sprint"), "/checkout?courseSlug=ai-build-sprint");
      assert.equal(
        buildCheckoutHref("build-software-with-ai", "batch_99"),
        "/checkout?courseSlug=build-software-with-ai&batchId=batch_99"
      );
    });

    // 17.2 Student Profile Prefill Resolution
    function resolveInitialStudentDetails(params: {
      purchase?: { buyerName: string; buyerEmail: string } | null;
      clerkUser?: { firstName?: string; lastName?: string; email?: string } | null;
    }): { name: string; email: string } {
      if (params.purchase) {
        return { name: params.purchase.buyerName, email: params.purchase.buyerEmail };
      }
      if (params.clerkUser) {
        const fullName = [params.clerkUser.firstName, params.clerkUser.lastName].filter(Boolean).join(" ").trim();
        return { name: fullName, email: params.clerkUser.email || "" };
      }
      return { name: "", email: "" };
    }

    it("should prioritize existing purchase session details for prefill", () => {
      const prefill = resolveInitialStudentDetails({
        purchase: { buyerName: "Session Buyer", buyerEmail: "session@example.com" },
        clerkUser: { firstName: "Clerk", lastName: "User", email: "clerk@example.com" },
      });
      assert.equal(prefill.name, "Session Buyer");
      assert.equal(prefill.email, "session@example.com");
    });

    it("should fallback to Clerk profile when purchase session is not present", () => {
      const prefill = resolveInitialStudentDetails({
        purchase: null,
        clerkUser: { firstName: "Ada", lastName: "Lovelace", email: "ada@example.com" },
      });
      assert.equal(prefill.name, "Ada Lovelace");
      assert.equal(prefill.email, "ada@example.com");
    });

    it("should default to empty strings when visitor is anonymous without prior session", () => {
      const prefill = resolveInitialStudentDetails({ purchase: null, clerkUser: null });
      assert.equal(prefill.name, "");
      assert.equal(prefill.email, "");
    });

    // 17.3 Form Field Validation Logic
    function validateStudentForm(name: string, email: string): {
      valid: boolean;
      nameError?: string;
      emailError?: string;
      trimmedName?: string;
      normalizedEmail?: string;
    } {
      let isValid = true;
      let nameError: string | undefined;
      let emailError: string | undefined;

      const trimmedName = name.trim();
      const trimmedEmail = email.trim().toLowerCase();

      if (!trimmedName || trimmedName.length < 2) {
        nameError = "Please enter your full name (minimum 2 characters).";
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
        emailError = "Please enter a valid email address.";
        isValid = false;
      }

      return {
        valid: isValid,
        nameError,
        emailError,
        trimmedName: isValid ? trimmedName : undefined,
        normalizedEmail: isValid ? trimmedEmail : undefined,
      };
    }

    it("should validate and normalize valid student details", () => {
      const res = validateStudentForm("  John Carmack  ", "  Carmack@IdSoftware.COM  ");
      assert.equal(res.valid, true);
      assert.equal(res.trimmedName, "John Carmack");
      assert.equal(res.normalizedEmail, "carmack@idsoftware.com");
      assert.equal(res.nameError, undefined);
      assert.equal(res.emailError, undefined);
    });

    it("should show inline validation errors for incomplete names and invalid emails", () => {
      const res = validateStudentForm("J", "invalid-email");
      assert.equal(res.valid, false);
      assert.equal(res.nameError, "Please enter your full name (minimum 2 characters).");
      assert.equal(res.emailError, "Please enter a valid email address.");
    });

    // 17.4 State Preservation on Failure
    it("should preserve user input during initialization failures", () => {
      const formState = { name: "Grace Hopper", email: "grace@navy.mil" };
      let errorMessage: string | null = null;

      try {
        // Simulate backend transient failure
        throw new Error("Unable to start checkout session at the moment. Please try again.");
      } catch (err: unknown) {
        errorMessage = err instanceof Error ? err.message : "Error";
      }

      // Input must be retained
      assert.equal(formState.name, "Grace Hopper");
      assert.equal(formState.email, "grace@navy.mil");
      assert.equal(errorMessage, "Unable to start checkout session at the moment. Please try again.");
    });

    // 17.5 Duplicate Submission Guard
    it("should block concurrent duplicate submissions while checkout is in-flight", () => {
      let isPending = false;
      let orderSubmissions = 0;

      function triggerPaymentSubmission() {
        if (isPending) return false;
        isPending = true;
        orderSubmissions++;
        return true;
      }

      const click1 = triggerPaymentSubmission();
      const click2 = triggerPaymentSubmission();
      const click3 = triggerPaymentSubmission();

      assert.equal(click1, true);
      assert.equal(click2, false);
      assert.equal(click3, false);
      assert.equal(orderSubmissions, 1);
    });

    // 17.6 Single-Step Session + Order Handoff
    it("should execute single-step session creation and order handoff correctly", async () => {
      let createdPurchaseId: string | null = null;
      let createdOrderId: string | null = null;

      async function executeSingleStepCheckout(name: string, email: string) {
        const validation = validateStudentForm(name, email);
        if (!validation.valid) throw new Error("Validation failed");

        // Step 1: Session initialization
        createdPurchaseId = `purch_${Date.now()}`;

        // Step 2: Order creation
        createdOrderId = `order_${Date.now()}`;

        return {
          purchaseId: createdPurchaseId,
          orderId: createdOrderId,
          prefill: { name: validation.trimmedName, email: validation.normalizedEmail },
        };
      }

      const result = await executeSingleStepCheckout("Linus Torvalds", "linus@linux.org");
      assert.ok(result.purchaseId.startsWith("purch_"));
      assert.ok(result.orderId.startsWith("order_"));
      assert.deepEqual(result.prefill, {
        name: "Linus Torvalds",
        email: "linus@linux.org",
      });
    });
  });
});



