# Goal

Simplify the public course purchase experience by removing redundant public pages (`/marketplace` and `/course/[slug]`) and making `/build-software-with-ai` the single entry point for purchasing the flagship course, ensuring a seamless checkout/auth flow.

# Target Files

- `app/marketplace/page.tsx` (Modified)
- `app/course/[slug]/page.tsx` (Modified)
- `components/courses/MarketplaceFilters.tsx` (Deleted)
- `components/courses/CourseCard.tsx` (Deleted)
- `components/courses/BatchSelector.tsx` (Deleted)
- `app/build-software-with-ai/page.tsx` (Modified)
- `app/checkout/page.tsx` (Modified)
- `app/sign-up/[[...sign-up]]/page.tsx` (Modified)
- `app/sign-in/[[...sign-in]]/page.tsx` (Modified)
- `components/dashboard/MyCoursesClient.tsx` (Modified)

# Requirements

- **Keep `/build-software-with-ai`** as the main sales page, preserving its approved visual identity and design.
- **Remove public `/marketplace`** and redirect requests to `/build-software-with-ai`.
- **Remove public `/course/[slug]` sales page** and redirect requests for the flagship course to `/build-software-with-ai`.
- **Delete redundant components** (`MarketplaceFilters.tsx`, `CourseCard.tsx`, `BatchSelector.tsx`) that are no longer used anywhere.
- **Ensure clean "Buy Now" flow for new users**: Click Buy Now → Clerk Sign Up (passing redirect url) → Successful account creation → `/checkout` → Razorpay payment modal → Dashboard.
- **Ensure clean "Buy Now" flow for existing users**: Click Buy Now → `/checkout` → Razorpay payment modal → Dashboard.
- **Security & Integrity**: Keep Razorpay keys, webhook signature verification, and Convex logic completely intact and secure.
- **Learning & Admin systems**: Ensure `/learn/*`, `/dashboard/*`, and `/admin/*` remain fully operational and untouched.

# Acceptance Criteria

- [ ] `/marketplace` redirects to `/build-software-with-ai`
- [ ] `/course/ai-build-sprint` and `/course/build-software-with-ai` redirect to `/build-software-with-ai`
- [ ] Unused components are deleted safely without breaking any page
- [ ] Navbar and button links point to the correct destinations
- [ ] Unauthenticated users attempting to checkout are sent to `/sign-up` with correct redirect context
- [ ] Authenticated users go straight to Razorpay checkout on `/checkout`
- [ ] Successful payment updates enrollment and redirects to dashboard course page
- [ ] Canceled payment does not create enrollment and permits retry
- [ ] No TypeScript errors, no build-time warnings, and build compiles successfully

# Validation & Checks

- [ ] TypeScript compilation passes (`npm run typecheck`)
- [ ] ESLint throws no warnings/errors (`npm run lint` if available)
- [ ] Build succeeds (`npm run build`)

# Manual Testing Steps

1. Visit `/marketplace` and verify redirect to `/build-software-with-ai`.
2. Visit `/course/ai-build-sprint` and verify redirect to `/build-software-with-ai`.
3. In incognito mode, visit `/build-software-with-ai` and click the "Join the cohort" or "Enroll Now" CTA. Verify it opens `/sign-up` with the redirect URL parameter pointing to `/checkout?courseSlug=build-software-with-ai`.
4. Sign in as a test user, visit `/build-software-with-ai`, click "Enroll Now", and verify `/checkout` loads directly showing the product details and payment summary.
5. In the checkout screen, click "Proceed to Payment" to initialize Razorpay, then close the modal and verify no enrollment is created.
6. Verify student dashboard and admin sidebar pages load without errors.
