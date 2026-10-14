import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { dispatchPurchaseEmail, dispatchJobById } from "@/lib/email-dispatch-service";
import { sendWelcomeAccessEmail } from "@/lib/resend";

const MAX_BATCH_DISPATCH_LIMIT = 10;

/**
 * Constant-time comparison to prevent timing attacks against the secret
 */
function verifyCronAuthorization(req: NextRequest): boolean {
  const configuredSecret = process.env.CRON_SECRET;
  if (!configuredSecret) {
    return false;
  }

  const authHeader = req.headers.get("authorization");
  const cronHeader = req.headers.get("x-cron-secret");

  let candidateSecret: string | null = null;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    candidateSecret = authHeader.slice(7).trim();
  } else if (cronHeader) {
    candidateSecret = cronHeader.trim();
  }

  if (!candidateSecret) {
    return false;
  }

  const expectedBuffer = Buffer.from(configuredSecret.trim());
  const actualBuffer = Buffer.from(candidateSecret);

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

/**
 * Secured transactional email dispatch endpoint.
 *
 * Production Schedulers (e.g. Vercel Cron, GitHub Actions, or Internal Workers) must authenticate via:
 *   Headers: { "Authorization": "Bearer <CRON_SECRET>" }
 *   or:      { "x-cron-secret": "<CRON_SECRET>" }
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate scheduler or internal worker
    if (!verifyCronAuthorization(req)) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing authorization credentials" },
        { status: 401 }
      );
    }

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    // 2. Parse request payload if present
    let body: { purchaseId?: string; jobId?: string } = {};
    try {
      body = await req.json();
    } catch {
      // Empty body is valid for scheduled queue drain
    }

    // Single-job targeted dispatch
    if (body.jobId) {
      const result = await dispatchJobById(body.jobId, baseUrl);
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || "Failed to dispatch email" },
          { status: 500 }
        );
      }
      return NextResponse.json({ success: true, message: result.message });
    }

    // Single-purchase targeted dispatch
    if (body.purchaseId) {
      const result = await dispatchPurchaseEmail(body.purchaseId, baseUrl);
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || "Failed to dispatch email" },
          { status: 500 }
        );
      }
      return NextResponse.json({ success: true, message: result.message });
    }

    // Bounded batch queue processing (up to MAX_BATCH_DISPATCH_LIMIT jobs per invocation)
    let processedCount = 0;
    let failedCount = 0;

    for (let i = 0; i < MAX_BATCH_DISPATCH_LIMIT; i++) {
      const job = await fetchMutation(api.emails.claimNextPendingJob, {});
      if (!job) {
        break; // Queue is empty
      }

      const claimUrl = job.purchaseId
        ? `${baseUrl}/claim?purchaseId=${job.purchaseId}${
            job.rawRecoveryToken ? `&recovery=${job.rawRecoveryToken}` : ""
          }`
        : `${baseUrl}/dashboard`;

      const emailResult = await sendWelcomeAccessEmail({
        to: job.recipientEmail,
        name: job.recipientName,
        courseTitle: job.courseTitle || "VibeLogic Bootcamp",
        claimUrl,
      });

      if (emailResult.success) {
        await fetchMutation(api.emails.markEmailJobSent, {
          jobId: job._id,
          resendMessageId: emailResult.messageId,
        });
        processedCount++;
      } else {
        await fetchMutation(api.emails.markEmailJobFailed, {
          jobId: job._id,
          errorMessage: emailResult.error || "Email delivery failed",
        });
        failedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      processed: processedCount,
      failed: failedCount,
    });
  } catch (error: unknown) {
    console.error("[EmailDispatchAPI] Error:", error);
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
