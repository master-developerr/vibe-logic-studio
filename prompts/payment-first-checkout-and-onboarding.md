# Goal
Implement a production-grade, payment-first checkout, secure purchase recovery, and post-payment onboarding architecture for VibeLogic Studio without requiring Clerk authentication prior to payment.

# Target Files
- `convex/schema.ts` (Modified: add `purchases`, `coupons`, `emailJobs` tables and indexes)
- `convex/purchases.ts` (Created: purchase session, order binding, buyer info update, and account claim mutations/queries)
- `convex/coupons.ts` (Created: coupon validation, creation, and redemption logic)
- `convex/emails.ts` (Created: email outbox job dispatcher and Resend integration worker)
- `convex/payments.ts` (Modified: unauthenticated purchase fulfillment, idempotent webhook/verify integration)
- `lib/purchase-session.ts` (Created: secure encrypted/signed cookie and claim-token utilities)
- `lib/resend.ts` (Created: Resend transactional email client and templates)
- `components/courses/EnrollModal.tsx` (Created: lightweight buyer details modal with email accuracy warning)
- `components/courses/EnrollButton.tsx` (Created/Modified: universal trigger for the EnrollModal across all landing/course CTAs)
- `app/checkout/page.tsx` (Modified: payment-first checkout page with server-calculated price, coupon support, and session guard)
- `components/courses/CheckoutClient.tsx` (Modified: coupon application, server pricing display, Razorpay launch)
- `app/api/checkout/session/route.ts` (Created: initial purchase session creation and cookie minting)
- `app/api/checkout/coupon/route.ts` (Created: server-authoritative coupon validation endpoint)
- `app/api/checkout/order/route.ts` (Modified: create Razorpay order bound to purchase session without pre-auth)
- `app/api/checkout/verify/route.ts` (Modified: verify payment signature and transition purchase to verified)
- `app/api/webhooks/razorpay/route.ts` (Modified: durable idempotent webhook processing bound to purchase records)
- `app/checkout/onboarding/page.tsx` (Created: protected 3-step post-payment onboarding)
- `components/checkout/OnboardingFlow.tsx` (Created: 3-step UI for buyer confirmation, WhatsApp invite, completion)
- `app/claim/page.tsx` (Created: secure post-payment Clerk account linking and dashboard redirection)
- `context/architecture.md` (Modified: updated purchase, payment, and auth flow architecture)
- `context/build-plan.md` (Modified: updated checkout and enrollment phases)
- `context/user-flow.md` (Modified: updated customer purchase and post-payment onboarding journey)
- `context/system-flow.md` (Modified: updated system execution, webhook, and email outbox flow)
- `context/progress-tracker.md` (Modified: updated progress and verified milestone)

# Requirements
- **No Pre-Auth**: Visitors enter full name and email in `EnrollModal` and proceed straight to checkout without signing in or email OTP.
- **Server Authoritative Pricing**: Base price, batch validation, coupons, and final amounts are validated and calculated strictly on the backend.
- **Protected Onboarding**: Post-payment onboarding (`/checkout/onboarding`) is accessible ONLY via verified purchase session cookie/claim token.
- **3-Step Onboarding**:
  1. Confirm/edit buyer name and email before welcome email dispatch.
  2. Join batch WhatsApp community (optional, non-blocking).
  3. Completion screen with email access instructions.
- **Durable Email Delivery**: Resend transactional email sent via durable Convex email outbox job containing a secure account claim link.
- **Account Linking & Entitlements**: Post-payment Clerk signup/signin links purchase to Convex user and creates active batch enrollment.
- **Strict Concurrency & Idempotency**: Safe under duplicate webhook deliveries, delayed callbacks, and concurrent coupon/batch seat claims.

# Acceptance Criteria
- [ ] Visitor can initiate purchase without logging in or signing up.
- [ ] Server enforces coupon validity, course price, and batch seat limits.
- [ ] Payment verification is cryptographically verified on server and idempotent.
- [ ] Thank-you/onboarding page blocks unverified or spoofed sessions.
- [ ] Buyer can correct name/email during onboarding step 1.
- [ ] WhatsApp join step is optional and does not block email or course access.
- [ ] Welcome email with claim link is durably queued and sent via Resend.
- [ ] Clerk account links the purchase to Convex user identity and grants course dashboard access.
- [ ] Existing admin and student dashboard features remain fully functional without regression.

# Validation & Checks
- [ ] TypeScript compilation passes (`npm run typecheck` / `npx tsc --noEmit`)
- [ ] ESLint throws no warnings/errors (`npm run lint`)
- [ ] Next.js build succeeds (`npm run build`)

# Manual Testing Steps
1. Navigate to `/build-software-with-ai` or `/` as an unauthenticated visitor in incognito mode.
2. Click "Enroll Now", enter full name and email in the modal, and proceed to checkout.
3. Test coupon entry and verify discount and final amount update dynamically.
4. Complete test payment via Razorpay.
5. Verify automatic transition to protected `/checkout/onboarding`.
6. Confirm/update email in Step 1, view WhatsApp invite in Step 2, and view completion in Step 3.
7. Verify welcome email job in Convex and test the secure claim link.
8. Sign up or log in via Clerk to link account and verify immediate dashboard access to the cohort.
