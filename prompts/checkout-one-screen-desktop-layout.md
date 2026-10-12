# Goal
Refactor the checkout page layout so that the entire checkout experience (header, course details, embedded student form, fee summary, promo code, and payment CTA) fits on a single desktop viewport (1440 × 900 px and 1366 × 768 px) without vertical or horizontal scrolling, while preserving all functionality, security, validation, and responsive mobile behavior.

# Target Files
- `app/checkout/page.tsx` (Modify: compact outer padding, margins, and header bar)
- `components/courses/CheckoutFlowClient.tsx` (Modify: compact page heading, course card, and embedded student form fields/advisory)
- `components/courses/CheckoutClient.tsx` (Modify: compact fee breakdown card, promo input, payment button, and security notice)
- `tests/purchase-ownership.test.ts` (Modify: verify tests continue to pass and add viewport/compact layout assertions)

# Requirements
- Entire desktop checkout visible without scrolling on 1440 × 900 and 1366 × 768 px viewports.
- Compact header with Back to Course Details and Direct Secure Checkout badge.
- Compact editorial page heading and course/cohort summary card (arranged in single compact row for cohort & start date).
- Compact student information card with Full Name and Email Address inputs (~40-44 px height) and concise email accuracy notice.
- Compact fee summary card on the right with tuition, discounts, GST/VAT, total payable, inline promo code input + apply button, primary Proceed to Payment button, and security reassurance.
- Preserve all responsive behaviors: mobile viewports stack naturally and allow standard vertical scrolling without horizontal overflow.
- Retain all validation, session management, Razorpay payment flow, and server pricing security.

# Acceptance Criteria
- [ ] At 1440 × 900 px and 1366 × 768 px, all checkout elements fit in the viewport without vertical scrolling.
- [ ] No clipping of input fields, validation errors, or the payment CTA button.
- [ ] Mobile viewports (<1024 px) stack vertically and allow natural scrolling without horizontal overflow.
- [ ] All 83 tests pass (`npm test`).
- [ ] TypeScript compilation succeeds (`npm run typecheck`).
- [ ] ESLint succeeds (`npm run lint`).
- [ ] Production build succeeds (`npm run build`).

# Validation & Checks
- [ ] TypeScript compilation passes (`npm run typecheck`)
- [ ] ESLint throws no warnings/errors (`npm run lint`)
- [ ] Unit and integration tests pass (`npm test`)
- [ ] Production build passes (`npm run build`)

# Manual Testing Steps
1. Open browser at 1440 × 900 and 1366 × 768 px at `/checkout?courseSlug=ai-build-sprint`.
2. Verify all elements (header, course card, student form, fee summary, and Proceed to Payment CTA) are visible without scrolling.
3. Verify entering valid and invalid student details triggers inline errors without breaking the layout.
4. Verify mobile viewport (390 × 844) scrolls naturally and stacks properly.
