# Goal
Trigger automated transactional welcome email dispatch immediately upon payment fulfillment in both the verification route and the Razorpay webhook, configure automatic queue drainage via Vercel Cron, and provide precise Vercel deployment configuration instructions.

# Target Files
- `app/api/checkout/verify/route.ts` (To be modified — trigger `dispatchPurchaseEmail` immediately upon verified payment)
- `app/api/webhooks/razorpay/route.ts` (To be modified — trigger `dispatchPurchaseEmail` upon webhook payment fulfillment)
- `lib/resend.ts` (To be modified — improve error details for unverified domains and sandbox limits)
- `vercel.json` (To be created — configure Vercel Cron schedule for `/api/checkout/email-dispatch`)

# Requirements
- **Immediate Fulfillment Dispatch:**
  - Upon successful payment verification in `app/api/checkout/verify/route.ts`, trigger `dispatchPurchaseEmail(purchase.purchaseId, baseUrl)`.
  - Upon successful payment capture in `app/api/webhooks/razorpay/route.ts`, trigger `dispatchPurchaseEmail(notes.purchaseId, baseUrl)`.
  - Non-blocking execution: email dispatch failure or network issues must NOT block or fail the HTTP response returning payment verification success to the client.
- **Idempotency & Safety:**
  - `dispatchPurchaseEmail` relies on Convex's atomic `claimPendingJobForPurchase`, ensuring no duplicate emails are sent if both the frontend verification and the webhook trigger fire concurrently.
- **Vercel Cron Automation:**
  - Provide `vercel.json` with a 10-minute cron schedule calling `/api/checkout/email-dispatch` to drain and retry any unfulfilled or pending email jobs.
- **Actionable Resend Error Handling:**
  - Improve error logging in `lib/resend.ts` to surface clear console diagnostics if Resend responds with domain verification failures (403) or sandbox recipient restrictions.
- **Strict Typing & Zero Technical Debt:**
  - Non-negotiable strict TypeScript adherence. No `any`.

# Acceptance Criteria
- Payment verification endpoint immediately invokes email dispatch in the background without blocking client checkout confirmation.
- Razorpay webhook endpoint invokes email dispatch for verified purchases.
- `vercel.json` defines a valid cron configuration for `/api/checkout/email-dispatch`.
- Convex job claiming guarantees atomic, exactly-once delivery across concurrent webhooks and client verify routes.
- Full typecheck (`npm run typecheck`) and build pass without errors.

# Validation & Checks
- [ ] TypeScript compilation passes (`npm run typecheck`)
- [ ] Build succeeds (`npm run build`)
- [ ] No regressions in payment verification or webhook handlers

# Manual Testing Steps
1. Initiate checkout and verify that upon payment signature verification, `dispatchPurchaseEmail` is executed.
2. Verify that if a user never progresses through Onboarding Step 3, the email is already sent at fulfillment.
3. Verify that `/api/checkout/email-dispatch` executes successfully when called with `Authorization: Bearer <CRON_SECRET>`.
