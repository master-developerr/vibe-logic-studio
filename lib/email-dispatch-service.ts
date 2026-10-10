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
  // Claim pending job atomically in Convex (enforces paymentStatus === "verified")
  const pendingJob = await fetchMutation(api.emails.claimPendingJobForPurchase, {
    purchaseId: purchaseId as Id<"purchases">,
  });

  if (!pendingJob) {
    return { success: true, message: "No pending email jobs found for this purchase" };
  }

  // Retrieve course title from Convex
  const courseTitle = pendingJob.courseTitle || "VibeLogic Bootcamp";
  const claimUrl = `${baseUrl}/claim?purchaseId=${purchaseId}${
    pendingJob.rawRecoveryToken ? `&recovery=${pendingJob.rawRecoveryToken}` : ""
  }`;

  const emailResult = await sendWelcomeAccessEmail({
    to: pendingJob.recipientEmail,
    name: pendingJob.recipientName,
    courseTitle,
    claimUrl,
  });

  if (emailResult.success) {
    await fetchMutation(api.emails.markEmailJobSent, {
      jobId: pendingJob._id,
      resendMessageId: emailResult.messageId,
    });
    return { success: true };
  } else {
    await fetchMutation(api.emails.markEmailJobFailed, {
      jobId: pendingJob._id,
      errorMessage: emailResult.error || "Email delivery failed",
    });
    return { success: false, error: emailResult.error };
  }
}
