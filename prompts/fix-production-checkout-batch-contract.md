# Goal

Repair the production checkout contract so every status check, Razorpay order, verified payment, enrollment, and redirect is bound to one validated course and batch. Ensure a paid learner reaches their enrolled batch workspace without another checkout attempt.

# Target Files

- `convex/schema.ts` (To be modified)
- `convex/payments.ts` (To be modified)
- `components/courses/CheckoutFlowClient.tsx` (To be modified)
- `app/api/checkout/order/route.ts` (To be modified)
- `app/api/checkout/verify/route.ts` (To be modified)

# Requirements

- Preserve `batchId` as a required argument to `payments:getCheckoutStatus`; do not weaken its validator.
- Validate server-side that the supplied batch exists and belongs to the supplied course before payment-status lookup, pending-payment creation, payment confirmation, or enrollment reconciliation.
- Store the selected `batchId` on every newly created payment record. Keep schema compatibility for existing payment records while requiring a batch ID on new checkout mutations.
- Scope payment status and active-enrollment checks to the authenticated Convex user, `courseId`, and `batchId`.
- Ensure `createPendingPayment` receives the validated batch ID from the order endpoint and rejects an invalid or full batch.
- Ensure `confirmPayment` verifies that the authenticated user owns the pending order and that its stored course and batch match the request before it marks the payment successful or creates an enrollment.
- Make enrollment fulfillment idempotent for the same user, course, and batch. If an already-successful, batch-scoped payment has no enrollment, reconcile one before redirecting to `/dashboard/courses/{batchId}/overview`.
- Preserve Clerk session checks and `users:ensureMyUser` synchronization. Never call payment-status functions until the Convex user is ready.
- Keep Razorpay in TEST mode and retain server-side signature verification. Do not expose secrets or grant access based only on a browser callback.
- Retain the existing checkout layout and diagnostics. Refine only copy for batch-configuration or payment-status failures so it follows the existing off-white, black, orange VibeLogic design language.
- Deploy Convex only to the production deployment `acoustic-pigeon-151`; verify the deployed function contract afterwards.
- Trigger and verify a Vercel production deployment from `main` so its frontend includes the existing two-ID `getCheckoutStatus` call and the new batch-safe payment flow.

# Acceptance Criteria

- `payments:getCheckoutStatus({ courseId, batchId })` rejects unrelated course and batch IDs and checks only the authenticated learner's matching enrollment/payment state.
- A direct checkout URL resolves a valid batch before the payment status query runs.
- An unpaid authenticated learner sees checkout and can create a Razorpay TEST order only for the resolved course and batch.
- A successful Razorpay TEST payment creates or reuses exactly one matching enrollment and redirects to the matching batch dashboard.
- A matching successful payment without enrollment is reconciled once and then redirects to the batch dashboard.
- A matching active enrollment or successful payment never opens Razorpay again.
- The Vercel production frontend and production Convex metadata both use the same batch-aware contract.

# Validation & Checks

- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] `npx convex deploy --yes` succeeds against production
- [ ] `npx convex function-spec --prod` confirms both required IDs for `payments:getCheckoutStatus`
- [ ] Vercel production deployment completes from `main`

# Manual Testing Steps

1. Sign in with an unpaid Clerk account and open `/checkout?courseSlug=ai-build-sprint`.
2. Verify a valid course and batch appear, then verify no payment-status diagnostic is shown.
3. Complete a Razorpay TEST payment and verify exactly one successful payment and enrollment for the selected batch.
4. Verify the browser redirects to `/dashboard/courses/{selectedBatchId}/overview`.
5. Refresh the batch dashboard and verify access remains available with no duplicate enrollment or payment.
6. Reopen the direct checkout URL while signed in as the paid learner and verify it redirects to the same batch workspace without opening Razorpay.
7. Test a course with no valid batch and verify a clear VibeLogic-styled configuration error prevents payment.
