# Goal
Remove the Quick Enrollment modal from the course landing page and embed the student name, email, and verification warning directly into the checkout page layout. Provide a seamless, single-step checkout experience where clicking "Proceed to Payment" validates input, initializes the checkout session via `POST /api/checkout/session`, creates the Razorpay order via `POST /api/checkout/order`, and triggers the Razorpay Checkout modal without popups or double entry.

# Target Files
- `app/build-software-with-ai/_components/CourseEnrollCta.tsx` (Modify: replace popup modal state with direct navigation to `/checkout`)
- `components/courses/EnrollButton.tsx` (Modify: update universal enroll button to navigate to `/checkout`)
- `app/checkout/page.tsx` (Modify: remove fallback `EnrollModal` overlay; always render full checkout layout with course, batch, student form, and fee summary)
- `components/courses/CheckoutFlowClient.tsx` (Modify/Refactor: integrate interactive editable student form with inline validation into left column; wire up with `CheckoutClient`)
- `components/courses/CheckoutClient.tsx` (Modify: accept student form state, perform client validation, orchestrate session initialization + Razorpay order creation)
- `tests/purchase-ownership.test.ts` (Modify/Extend: add Suite 17 testing embedded checkout validation, session creation, single-step payment handoff, and direct navigation)

# Requirements
- Remove Quick Enrollment popup modal from the course landing page.
- Enrollment CTAs on `/build-software-with-ai` (and any general course CTAs) must navigate directly to `/checkout?courseSlug=ai-build-sprint` (or selected course/batch).
- Embed Full Name and Email Address inputs directly into the checkout layout with VibeLogic Studio's warm off-white editorial aesthetic (`bg-surface`, `#FF5A1F` accent, rounded inputs, clear typography).
- Include the Email Accuracy Advisory notice prominently within the student form card.
- Support prefilling from existing purchase sessions (via URL `purchaseId` or HttpOnly session cookie) or authenticated Clerk profile, while keeping fields editable.
- Desktop layout: course & batch details + student form on the left (col-span-7), fee breakdown + coupon + payment CTA on the right (col-span-5).
- Mobile layout: stacked vertically with course details, student form, fee breakdown, and payment CTA in natural reading order without horizontal overflow.
- Perform client-side validation (min 2 characters for Name, RFC-compliant email regex) and server-side validation on `/api/checkout/session`.
- Single-step payment action: Clicking "Proceed to Payment" validates student fields, creates/updates session if needed, acquires `purchaseId`, sets HttpOnly cookie, creates Razorpay order, and launches the Razorpay modal seamlessly.
- Preserve full backend security, signature verification, server-side pricing, and idempotency.

# Acceptance Criteria
- [ ] No modal popup or backdrop appears when clicking course enrollment CTAs on the landing page or visiting `/checkout`.
- [ ] Landing page CTAs navigate cleanly to `/checkout?courseSlug=ai-build-sprint`.
- [ ] Student form (Full Name, Email Address, Email accuracy advisory) is embedded directly in the checkout page layout.
- [ ] Inline validation displays helpful error states when Name is < 2 chars or Email is invalid.
- [ ] Submitting valid details seamlessly initializes the session, sets the HttpOnly cookie, and opens the Razorpay Checkout modal.
- [ ] Re-entering or correcting details does not produce duplicate orders or lose user input on errors.
- [ ] Both desktop and mobile viewports are fully responsive with zero horizontal overflow.
- [ ] All automated checks pass (`npm test`, `npm run typecheck`, `npm run lint`, `npm run build`).

# Validation & Checks
- [ ] TypeScript compilation passes (`npm run typecheck`)
- [ ] ESLint throws no warnings/errors (`npm run lint`)
- [ ] All unit and regression tests pass (`npm test`)
- [ ] Production build succeeds (`npm run build`)

# Manual Testing Steps
1. Navigate to `/build-software-with-ai` in browser.
2. Click any of the "Enroll now" or "Join the cohort" CTAs.
3. Verify it navigates directly to `/checkout?courseSlug=ai-build-sprint` without any popup modal.
4. On `/checkout`, verify Course & Cohort details and the Student Enrollment Profile inputs (Full Name, Email) are visible in the main layout.
5. Attempt clicking "Proceed to Payment" with empty or invalid fields, verifying inline validation errors appear.
6. Enter valid Name ("Jane Doe") and Email ("jane@example.com") and click "Proceed to Payment".
7. Verify session is initialized (`/api/checkout/session`), order created (`/api/checkout/order`), and the Razorpay modal opens with prefilled student details and correct amount (₹999).
