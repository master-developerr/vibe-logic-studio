# Goal
Add a professional, compact "Secured by Razorpay" trust badge beneath the payment CTA and refund guarantee caption in the checkout fee summary card, strictly matching the visual design of the reference screenshot.

# Target Files
- `components/courses/CheckoutClient.tsx` (To be modified — integrate RazorpayLogo SVG component and render the styled trust badge)
- `public/razorpay-logo.svg` (Created — official vector asset for Razorpay logo/wordmark)

# Requirements
- **Visual Design:**
  - Full-width badge container with subtle rounded corners (`rounded-xl` or `rounded-2xl`).
  - Light blue-gray surface background (`bg-[#F0F4F9]` or `bg-slate-100`).
  - Dark navy lock icon on the left (`#072654`).
  - "Secured by" label in medium slate typography (`#334155`).
  - Official vector Razorpay brand mark and wordmark with authentic colors (`#3395FF` blade, `#072654` typography).
  - Horizontally and vertically centered layout.
- **Layout & Responsiveness:**
  - Compact padding (`py-2.5 px-4`) to fit effortlessly within the single-viewport checkout card on 1440x900 and 1366x768 screens.
  - Fully responsive on mobile viewports with no horizontal overflow.
- **Non-Interfering & Accessible:**
  - Purely decorative and informational; does not intercept clicks, form submissions, or Razorpay modal initialization.
  - Contains descriptive `aria-label="Secured by Razorpay"`.
- **Zero Technical Debt:**
  - TypeScript strict compliance. No external third-party CDN or runtime dependencies.

# Acceptance Criteria
- Fee summary card renders the "Secured by Razorpay" trust badge directly below the refund caption.
- No duplicate badges rendered.
- All checkout flows (coupon application, validation, zero-dollar flow, Razorpay modal) remain intact.
- TypeScript compilation and test suites pass with 0 errors.

# Validation & Checks
- [ ] TypeScript compilation passes (`npm run typecheck`)
- [ ] Automated test suite passes (`npm test`)
- [ ] Desktop viewport fits without unwanted scrollbar regression

# Manual Testing Steps
1. Navigate to `/checkout?courseSlug=ai-build-sprint`.
2. Inspect the right-hand Fee Breakdown card below the payment button.
3. Confirm the "Secured by Razorpay" trust badge is centered, matches the screenshot, and renders cleanly across desktop and mobile screen sizes.
