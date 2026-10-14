import "server-only";

import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { sendWelcomeAccessEmail } from "@/lib/resend";
import type { Id } from "@/convex/_generated/dataModel";

export interface DispatchResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Shared server-side transactional email dispatcher.
 * Atomically claims pending jobs in Convex, sends the email via Resend,
 * and updates job status to 'sent' or 'failed'.
 */
export async function dispatchPurchaseEmail(
  purchaseId: string,
  baseUrl: string
): Promise<DispatchResult> {
  console.log(`[ONBOARDING] Initiating email dispatch for purchase ${purchaseId}`);

  // Claim pending job atomically in Convex (enforces paymentStatus === "verified")
  const pendingJob = await fetchMutation(api.emails.claimPendingJobForPurchase, {
    purchaseId: purchaseId as Id<"purchases">,
  });

  if (!pendingJob) {
    return { success: true, message: "No pending email jobs found for this purchase" };
  }

  // Idempotency check: Job already sent
  if (pendingJob.alreadySent) {
    console.log(`[ONBOARDING] Duplicate email prevented for purchase ${purchaseId} (${pendingJob.recipientEmail})`);
    return { success: true, message: "Email already sent for this purchase" };
  }

  // Retrieve course title from Convex
  const courseTitle = pendingJob.courseTitle || "VibeLogic Bootcamp";
  const claimUrl = `${baseUrl}/claim?purchaseId=${purchaseId}${
    pendingJob.rawRecoveryToken ? `&recovery=${pendingJob.rawRecoveryToken}` : ""
  }`;

  console.log(`[ONBOARDING] Sending dashboard email to ${pendingJob.recipientEmail} (${courseTitle})`);

  const emailResult = await sendWelcomeAccessEmail({
    to: pendingJob.recipientEmail,
    name: pendingJob.recipientName,
    courseTitle,
    claimUrl,
  });

  if (emailResult.success) {
    console.log(`[ONBOARDING] Email sent successfully to ${pendingJob.recipientEmail}`);
    await fetchMutation(api.emails.markEmailJobSent, {
      jobId: pendingJob._id,
      resendMessageId: emailResult.messageId,
    });
    return { success: true };
  } else {
    console.error(`[ONBOARDING] Email failed for ${pendingJob.recipientEmail}: ${emailResult.error}`);
    await fetchMutation(api.emails.markEmailJobFailed, {
      jobId: pendingJob._id,
      errorMessage: emailResult.error || "Email delivery failed",
    });
    return { success: false, error: emailResult.error };
  }
}

/**
 * Dispatches an email job directly by Job ID.
 * Used for admin manual enrollments and admin resends.
 */
export async function dispatchJobById(
  jobId: string,
  baseUrl: string
): Promise<DispatchResult> {
  console.log(`[ONBOARDING] Initiating email dispatch for job ${jobId}`);

  const claimedJob = await fetchMutation(api.emails.claimJobById, {
    jobId: jobId as Id<"emailJobs">,
  });

  if (!claimedJob) {
    return { success: false, error: "Email job not found" };
  }

  if (claimedJob.alreadySent) {
    console.log(`[ONBOARDING] Duplicate email prevented for job ${jobId} (${claimedJob.recipientEmail})`);
    return { success: true, message: "Email already sent" };
  }

  const claimUrl = claimedJob.purchaseId
    ? `${baseUrl}/claim?purchaseId=${claimedJob.purchaseId}${
        claimedJob.rawRecoveryToken ? `&recovery=${claimedJob.rawRecoveryToken}` : ""
      }`
    : `${baseUrl}/dashboard`;

  console.log(`[ONBOARDING] Sending dashboard email to ${claimedJob.recipientEmail} (${claimedJob.courseTitle})`);

  const emailResult = await sendWelcomeAccessEmail({
    to: claimedJob.recipientEmail,
    name: claimedJob.recipientName,
    courseTitle: claimedJob.courseTitle,
    claimUrl,
  });

  if (emailResult.success) {
    console.log(`[ONBOARDING] Email sent successfully to ${claimedJob.recipientEmail}`);
    await fetchMutation(api.emails.markEmailJobSent, {
      jobId: claimedJob._id,
      resendMessageId: emailResult.messageId,
    });
    return { success: true };
  } else {
    console.error(`[ONBOARDING] Email failed for ${claimedJob.recipientEmail}: ${emailResult.error}`);
    await fetchMutation(api.emails.markEmailJobFailed, {
      jobId: claimedJob._id,
      errorMessage: emailResult.error || "Email delivery failed",
    });
    return { success: false, error: emailResult.error };
  }
}
