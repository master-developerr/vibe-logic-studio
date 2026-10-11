# Goal
Fix the production "Server Error [Request ID: I482719a06c37a47]" during Quick Enrollment by deploying missing Convex backend modules/schema to production, adding slug alias resolution for the flagship course, hardening session creation error diagnostics, and adding comprehensive regression tests.

# Target Files
- `prompts/fix-quick-enrollment-server-error.md` (To be created)
- `convex/courses.ts` (To be modified - add bidirectional slug alias fallback for `build-software-with-ai` and `ai-build-sprint`)
- `app/api/checkout/session/route.ts` (To be modified - add slug alias fallback and clean error diagnostics)
- `app/api/checkout/order/route.ts` (To be modified - add slug alias fallback)
- `app/checkout/page.tsx` (To be modified - add slug alias fallback)
- `tests/purchase-ownership.test.ts` (To be modified - add Suite 16: Quick Enrollment Session Creation & Slug Resilience)
- Production deployment: Execute `npx convex deploy -y` to push schema (`purchases`, `emailJobs`, `coupons`) and functions (`convex/purchases.ts`, `convex/payments.ts`) to Convex production (`acoustic-pigeon-151.eu-west-1.convex.cloud`)

# Requirements
- **Convex Production Schema & Function Sync**:
  - Deploy `convex/` codebase to Convex production (`acoustic-pigeon-151.eu-west-1.convex.cloud`) via `npx convex deploy -y`.
  - Ensure tables `purchases`, `emailJobs`, `coupons` and indexes (`by_session_token`, `by_buyer_email`, `by_purchase_id`, `by_razorpay_order_id`) exist in production.
  - Ensure `api.purchases` mutations and queries (`createPurchaseSession`, `getPurchaseForCheckout`, etc.) exist in production.
- **Slug Alias Resolution**:
  - Resolve both `build-software-with-ai` and `ai-build-sprint` interchangeably to ensure enrollment and checkout never 404 or fail due to slug mismatches.
- **Session & Cookie Security**:
  - Maintain `HttpOnly`, `SameSite=Lax`, `Secure` in production for `vls_purchase_session`.
  - Maintain strict separation of unauthenticated buyer tokens and gateway notes.
- **Diagnostics & Error Handling**:
  - Do not expose raw server stack traces or secrets in client responses.
  - Return clear, actionable user messages when batches are full or session creation encounters issues.
- **Zero Regressions**:
  - Maintain Razorpay signature verification, idempotent payment fulfillment, oversubscription handling, and outbox email workflows.

# Acceptance Criteria
- [ ] `npx convex deploy -y` successfully deploys code and schema to Convex production (`acoustic-pigeon-151`).
- [ ] `functionSpec` on Convex production contains `purchases:createPurchaseSession` and all required modules.
- [ ] Bidirectional slug fallback resolves both `build-software-with-ai` and `ai-build-sprint`.
- [ ] `/api/checkout/session` successfully creates a purchase session and sets the HttpOnly cookie.
- [ ] All 63 existing tests plus new regression tests in Suite 16 pass (`npm test`).
- [ ] `npm run typecheck`, `npm run lint`, and `npm run build` pass cleanly with 0 errors.

# Validation & Checks
- [ ] TypeScript compilation passes (`npm run typecheck`)
- [ ] ESLint throws no warnings/errors (`npm run lint`)
- [ ] Unit and integration tests pass (`npm test`)
- [ ] Next.js production build succeeds (`npm run build`)
- [ ] Verification on deployed production site

# Manual Testing Steps
1. Navigate to `https://vibe-logic-studio.vercel.app/build-software-with-ai`.
2. Click "Enroll now" or "Join the cohort".
3. Enter student name and email in the Quick Enrollment modal.
4. Click "Continue to Payment".
5. Verify it navigates to `/checkout?purchaseId=...` without showing `[Request ID: ...] Server Error`.
6. Verify the Razorpay payment modal or checkout client initializes cleanly with the authoritative amount (₹999 / 99900 paise).
