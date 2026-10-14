# Goal
Fix and harden the student onboarding email system so that every new student who registers or purchases the bootcamp reliably receives an individualized dashboard access email, with full idempotency, delivery status tracking, and admin resend capabilities.

# Target Files
- `convex/schema.ts` (Modified: add onboarding email status fields to `enrollments` and `emailJobs`)
- `lib/resend.ts` (Modified: enforce required email subject, clean branded template, fallback sender, and robust error handling)
- `convex/emails.ts` (Modified: add student-level job queries, idempotent status updates, and admin resend mutation)
- `lib/email-dispatch-service.ts` (Modified: server-side atomic dispatching with structured `[ONBOARDING]` logging)
- `convex/admin.ts` (Modified: trigger onboarding email job on `manualEnrollStudent`)
- `components/admin/students/drawer/OverviewTab.tsx` (Modified: display onboarding email status badge and "Resend Dashboard Access Email" action)
- `app/api/checkout/verify/route.ts` (Modified: ensure server-side email dispatch occurs immediately upon payment verification)
- `app/api/webhooks/razorpay/route.ts` (Modified: ensure webhook settlement triggers email dispatch for legacy and purchase flows)
- `tests/onboarding-email.test.ts` (To be created: unit and integration tests covering idempotency, email generation, failure handling, and admin resend)

# Requirements
1. **Server-Side Reliability & Decoupling from Browser:**
   - Onboarding emails must dispatch immediately server-side upon payment verification (`/api/checkout/verify`, `/api/webhooks/razorpay`, or `manualEnrollStudent`).
   - The user closing their browser must never prevent the email from dispatching.
2. **Individualized Email Content:**
   - Subject: `"Your Vibe Logic Studio Dashboard Access"`
   - Exact branded responsive template with student name, registration confirmation, course title, dashboard URL (`/claim` or `/dashboard`), feature checklist, and student email.
   - Zero plain-text passwords; authentication via Clerk password setup or claim link.
3. **Idempotency & Duplicate Prevention:**
   - Check if an onboarding email for this enrollment/purchase has already been marked `sent`.
   - Prevent duplicate welcome emails if endpoints are triggered multiple times concurrently or repeatedly.
4. **Email Status Tracking:**
   - Store `onboardingEmailStatus` (`pending` | `sent` | `failed`), `onboardingEmailSentAt`, `onboardingEmailLastError`, `onboardingEmailRetryCount`, and `resendMessageId`.
5. **Failure Handling & Admin Resend:**
   - Email delivery failure must never fail registration or payment.
   - Provide an admin mutation and UI button: `"Resend Dashboard Access Email"` in the admin student drawer to re-trigger delivery safely.
6. **Structured Logging:**
   - Log `[ONBOARDING] Student created`, `[ONBOARDING] Enrollment confirmed`, `[ONBOARDING] Sending dashboard email`, `[ONBOARDING] Email sent successfully`, `[ONBOARDING] Email failed`, and `[ONBOARDING] Duplicate email prevented`.

# Acceptance Criteria
- [ ] Every verified purchase and manual enrollment enqueues/dispatches an individualized onboarding email
- [ ] Email matches the required subject: "Your Vibe Logic Studio Dashboard Access" and structured body
- [ ] Duplicate registrations/webhooks for the same order do NOT send duplicate emails
- [ ] Delivery failures are captured with error messages in the database without failing the registration
- [ ] Admin can view email status and click "Resend Dashboard Access Email" to trigger a fresh delivery
- [ ] All tests pass and TypeScript compiles cleanly with 0 errors

# Validation & Checks
- [ ] `npm run typecheck` passes with 0 errors
- [ ] `npm run lint` passes
- [ ] `npm test` passes all tests including new onboarding email test suite
- [ ] Build compiles cleanly

# Manual Testing Steps
1. Run checkout with a test email. Complete payment or use 100% discount.
2. Verify in logs: `[ONBOARDING] Sending dashboard email` and `[ONBOARDING] Email sent successfully`.
3. Check database to verify `status: "sent"` and `sentAt` timestamp recorded.
4. Trigger verification endpoint a second time with the same order ID; verify `[ONBOARDING] Duplicate email prevented`.
5. Open `/admin/students`, click on the student, and click "Resend Dashboard Access Email".
6. Verify a fresh email is dispatched and status updates accordingly.
