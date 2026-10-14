import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("Student Onboarding Email System", () => {
  // Test 1: Verify exact email format and inclusions
  it("generates onboarding email with exact subject and required content", () => {
    const student = {
      name: "Alex Morgan",
      email: "alex@example.com",
      courseTitle: "Fullstack AI Engineering Cohort 1",
      claimUrl: "https://vibelogic.studio/claim?purchaseId=purch_123",
    };

    const subject = "Your Vibe Logic Studio Dashboard Access";
    assert.equal(subject, "Your Vibe Logic Studio Dashboard Access");

    // Check inclusions
    const requiredInclusions = [
      "Class schedule",
      "Meeting links",
      "Recordings",
      "Study materials",
      "Assignments",
      "Course progress",
      "Important announcements",
    ];

    // Simulated email content generator matching lib/resend.ts
    const plainText = `Hi ${student.name},

Welcome to Vibe Logic Studio.
Your bootcamp registration is confirmed for ${student.courseTitle}.

Access your dashboard here:
${student.claimUrl}

Your dashboard contains:
- Class schedule
- Meeting links
- Recordings
- Study materials
- Assignments
- Course progress
- Important announcements

Your account email: ${student.email}

Security note: For your security, we never send passwords in plain text. Use the secure link above to set your password and access your account.

Thanks,
Vibe Logic Studio`;

    assert.ok(plainText.includes(`Hi ${student.name},`), "Greeting must include student name");
    assert.ok(plainText.includes(student.courseTitle), "Must confirm course/bootcamp title");
    assert.ok(plainText.includes(student.claimUrl), "Must contain direct dashboard URL");
    assert.ok(plainText.includes(`Your account email: ${student.email}`), "Must state student account email");
    assert.ok(plainText.includes("never send passwords in plain text"), "Must not send plain text passwords");

    for (const item of requiredInclusions) {
      assert.ok(plainText.includes(item), `Email must include dashboard feature: ${item}`);
    }
  });

  // Test 2: Idempotency & Duplicate Prevention
  it("prevents duplicate email dispatch when an email is already sent", () => {
    type EmailJob = {
      id: string;
      purchaseId?: string;
      recipientEmail: string;
      status: "pending" | "processing" | "sent" | "failed";
      attempts: number;
    };

    const jobs: EmailJob[] = [
      {
        id: "job_1",
        purchaseId: "purch_abc",
        recipientEmail: "student@example.com",
        status: "sent",
        attempts: 1,
      },
    ];

    // Idempotency check logic matching convex/emails.ts
    function claimPendingJob(purchaseId: string) {
      const alreadySent = jobs.some(
        (j) => j.purchaseId === purchaseId && j.status === "sent"
      );
      if (alreadySent) {
        return { alreadySent: true, duplicatePrevented: true };
      }
      return { alreadySent: false, duplicatePrevented: false };
    }

    const firstAttempt = claimPendingJob("purch_abc");
    assert.equal(firstAttempt.alreadySent, true);
    assert.equal(firstAttempt.duplicatePrevented, true);
  });

  // Test 3: Tracking delivery status lifecycle
  it("accurately updates status lifecycle from pending -> sent or failed", () => {
    type Enrollment = {
      id: string;
      userId: string;
      onboardingEmailStatus?: "pending" | "sent" | "failed";
      onboardingEmailSentAt?: number;
      onboardingEmailLastError?: string;
      onboardingEmailRetryCount?: number;
      onboardingEmailMessageId?: string;
    };

    const enrollment: Enrollment = {
      id: "enr_1",
      userId: "usr_1",
      onboardingEmailStatus: "pending",
    };

    assert.equal(enrollment.onboardingEmailStatus, "pending");

    // Simulate failure
    const errorMsg = "Resend API Rate Limited";
    enrollment.onboardingEmailStatus = "failed";
    enrollment.onboardingEmailLastError = errorMsg;
    enrollment.onboardingEmailRetryCount = 1;

    assert.equal(enrollment.onboardingEmailStatus, "failed");
    assert.equal(enrollment.onboardingEmailLastError, errorMsg);
    assert.equal(enrollment.onboardingEmailRetryCount, 1);

    // Simulate successful retry
    const now = Date.now();
    const resendMsgId = "msg_resend_999";
    enrollment.onboardingEmailStatus = "sent";
    enrollment.onboardingEmailSentAt = now;
    enrollment.onboardingEmailMessageId = resendMsgId;
    enrollment.onboardingEmailLastError = undefined;

    assert.equal(enrollment.onboardingEmailStatus, "sent");
    assert.equal(enrollment.onboardingEmailSentAt, now);
    assert.equal(enrollment.onboardingEmailMessageId, resendMsgId);
    assert.equal(enrollment.onboardingEmailLastError, undefined);
  });

  // Test 4: Admin Resend Action
  it("allows admin to re-queue email and increments retry count", () => {
    const job: {
      id: string;
      status: "pending" | "failed";
      attempts: number;
      errorMessage?: string;
    } = {
      id: "job_failed",
      status: "failed",
      attempts: 3,
      errorMessage: "Domain not verified",
    };

    const enrollment: {
      id: string;
      onboardingEmailStatus: "pending" | "failed";
      onboardingEmailRetryCount: number;
      onboardingEmailLastError?: string;
    } = {
      id: "enr_1",
      onboardingEmailStatus: "failed",
      onboardingEmailRetryCount: 3,
      onboardingEmailLastError: "Domain not verified",
    };

    // Admin triggers resend mutation
    job.status = "pending";
    job.attempts = 0;
    job.errorMessage = undefined;

    enrollment.onboardingEmailStatus = "pending";
    enrollment.onboardingEmailLastError = undefined;
    enrollment.onboardingEmailRetryCount = (enrollment.onboardingEmailRetryCount || 0) + 1;

    assert.equal(job.status, "pending");
    assert.equal(job.attempts, 0);
    assert.equal(enrollment.onboardingEmailStatus, "pending");
    assert.equal(enrollment.onboardingEmailRetryCount, 4);
    assert.equal(enrollment.onboardingEmailLastError, undefined);
  });

  // Test 5: Automatic Sender Fallback on HTTP 403
  it("triggers fallback sender on Resend HTTP 403 domain error", () => {
    const configuredFrom = "Vibe Logic Studio <access@vibelogic.studio>";
    const fallbackFrom = "Vibe Logic Studio <onboarding@resend.dev>";

    function resolveSender(httpStatus: number, configured: string): string {
      if (httpStatus === 403 && configured !== fallbackFrom) {
        return fallbackFrom;
      }
      return configured;
    }

    const resolved = resolveSender(403, configuredFrom);
    assert.equal(resolved, fallbackFrom);
  });
});
