# Goal
Remediate the four confirmed security audit findings for VibeLogic Studio:
1. Secure server-side onboarding session handling eliminating client HttpOnly cookie access.
2. Invalidate Redis course and batch caches during modern payment-first webhook and checkout verification.
3. Authenticate the email dispatch endpoint with a server-only CRON_SECRET and constant-time validation.
4. Concurrency-safe batch capacity and oversubscription handling with explicit admin reconciliation.

# Target Files
- `app/checkout/onboarding/actions.ts` (To be created)
- `components/checkout/OnboardingFlow.tsx` (To be modified)
- `app/checkout/onboarding/page.tsx` (To be modified)
- `lib/course-cache.ts` (To be modified)
- `app/api/webhooks/razorpay/route.ts` (To be modified)
- `app/api/checkout/verify/route.ts` (To be modified)
- `app/api/checkout/email-dispatch/route.ts` (To be modified)
- `convex/payments.ts` (To be modified)
- `convex/purchases.ts` (To be modified)
- `tests/purchase-ownership.test.ts` (To be modified)

# Requirements
1. **Finding 1 — HttpOnly Onboarding Session**:
   - Provide Server Actions in `app/checkout/onboarding/actions.ts` that read `vls_purchase_session` via `getPurchaseSessionFromCookies()`.
   - Eliminate `document.cookie` calls in `OnboardingFlow.tsx`.
   - Never expose raw session tokens to client props, HTML, storage, or URLs.
   - Safe error handling for missing or invalid sessions.

2. **Finding 2 — Redis Cache Invalidation**:
   - Invalidate `courses:detail:${slug}`, `course:v1:${slug}`, `courses:market:*`, and `marketplace:v1:*` on payment capture.
   - Support payment-first purchases where `notes.clerkId` is absent.
   - Cache invalidation failures must not fail monetary payment fulfillment.

3. **Finding 3 — Secure Email Dispatch**:
   - Support `Authorization: Bearer <CRON_SECRET>` or `x-cron-secret` with constant-time comparison.
   - Reject unauthenticated and unauthorized requests with 401/403.
   - Dispatch welcome emails server-side via server actions during onboarding.
   - Atomic Convex claiming and verified payment checks remain enforced.

4. **Finding 4 — Batch Oversubscription & Concurrency**:
   - In `fulfillPurchasePayment`, if batch capacity is reached concurrently, do NOT over-increment `enrolledCount` past `capacity`.
   - Never discard verified payments. Flag purchase with `entitlementStatus: "pending_reconciliation"` and clear diagnostic reason.
   - Block `claimPurchase` for purchases pending reconciliation until admin reassigns to an open cohort.
   - Provide `reassignPurchaseBatch` admin mutation for resolving oversubscribed purchases.

# Acceptance Criteria
- [ ] No `document.cookie` in `components/checkout/OnboardingFlow.tsx`.
- [ ] Onboarding details updates and step progression execute securely via Server Actions.
- [ ] Both Razorpay webhook and checkout verification invalidate Redis course caches upon payment success.
- [ ] `/api/checkout/email-dispatch` rejects missing or invalid `CRON_SECRET` tokens.
- [ ] Payments received for full cohorts are safely stored and flagged for admin reconciliation without over-allocating seats.
- [ ] All automated checks pass (`npm test`, `npm run typecheck`, `npm run lint`, `npx convex codegen`, `npm run build`).

# Validation & Checks
- [ ] `npm test` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npx convex codegen` passes
- [ ] `npm run build` succeeds

# Manual Testing Steps
1. Initiate checkout session and simulate payment verification.
2. Visit `/checkout/onboarding?purchaseId=...` and verify details update functions without reading cookies in client JS.
3. Simulate payment webhook and verify course cache keys are evicted from Redis.
4. Send unauthorized request to `/api/checkout/email-dispatch` and verify 401 response; send with valid `CRON_SECRET` and verify successful claim.
5. Simulate concurrent checkout on a full batch; verify payment is marked verified, seat count is capped at capacity, and purchase is flagged with `pending_reconciliation`.
