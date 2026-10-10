# Build Plan

## Core Principle

Full page UI built with mock data first — verified visually before any logic is written. Then functionality is built and wired to the UI step by step. Every feature must be visible and testable before moving to the next. No backend-only phases.

---

## Phase 1 — Foundation [COMPLETED]

### 01 Landing Page

Build the complete landing page UI.

**UI:**

- Navbar — Logo, Courses, Dashboard, Profile links, Sign In button
- Hero section — headline, subheadline, Get Started CTA, immersive background animation (GSAP)
- Featured Courses section — three course cards with mock data
- Testimonial section
- Bottom CTA section
- Footer

**Logic:**

- Get Started and Sign In → /sign-in if not authenticated, /student/dashboard if authenticated

---

### 02 Authentication

Clerk authentication — Email, Google OAuth.

**UI:**

- Standard Clerk `<SignIn />` and `<SignUp />` components hosted on `/sign-in` and `/sign-up` routes

**Logic:**

- Clerk configuration via environment variables
- `app/api/webhooks/clerk/route.ts` webhook handler to sync user data
- Convex Mutation to upsert user record into `users` collection upon successful sign-up
- Route protection middleware to secure `/student/*` and `/admin/*` routes
- After login → redirect to `/student/dashboard` (or `/admin/dashboard` based on role)

---

### 03 Analytics & Monitoring Initialization

Set up PostHog and Sentry before any complex logic runs.

**Logic:**

- Create `lib/posthog-client.ts` — PostHog browser client, initialized with environment variables
- Initialize PostHog provider in root app layout — wraps entire app
- Integrate Sentry for error tracking
- `posthog.identify()` called after successful Clerk login with the user's ID
- `posthog.reset()` called on logout

---

### 04 Database Schema

All Convex collections created before any data is written.

**Logic:**

- Define schema in `convex/schema.ts`
- Create `users` collection with Clerk sync logic
- Create `courses` collection (title, description, price, coverImageId, isActive)
- Create `batches` collection (courseId, startDate, capacity, enrolledCount, status)
- Create `enrollments` collection (userId, courseId, batchId, status, progress)
- Create `payments` collection (razorpayOrderId, amount, status)
- Create `studyMaterials`, `liveClasses`, `reviews`, `announcements`, `landingPage`, and `media` collections
- Add required indexes (e.g., `by_clerk_id`, `by_course_id`)

---

### 04.5 Upstash Redis Setup

Configure Upstash Redis for caching, idempotency, and rate limiting.

**Logic:**

- Configure Upstash Redis Client
- Set up Environment Variables
- Implement Redis Health Check
- Implement Redis Cache Invalidation utilities

---

## Phase 2 — Course Marketplace

### 05 Course Marketplace — Full UI

Build the complete Course Marketplace UI with mock data. No live queries yet.

**UI:**

- Search and Filter bar: Search by title, Category dropdown
- Grid of `CourseCard` components showing: cover image, title, instructor, price, and Next Batch date
- Empty state: "No courses found matching your criteria"
- Pagination or infinite scroll loader

**Logic:**
- Cache Marketplace with Upstash Redis

---

### 06 Course Details — Full UI

Build the complete Course Details page UI with mock data.

**UI:**

- Hero section — Course title, description, instructor profile snippet
- Pricing card — Price, "Enroll Now" CTA, Batch Selector dropdown
- Syllabus section — Mock list of topics/modules
- Reviews section — Mock student testimonials and star ratings
- Upcoming Batches section — List of batches with "Seats Remaining" progress bars

---

### 07 Marketplace & Details Logic

Wire the Marketplace and Details pages to Convex DB.

**Logic:**

- Use Convex `useQuery` to fetch active courses for the Marketplace
- Fetch specific course data, active reviews, and upcoming batches for the Course Details page
- **Batch Logic Implementation:** 
  - Only show batches where `status === 'upcoming'` or `'live'`
  - Calculate `Remaining Seats` = `capacity - enrolledCount`
  - Disable "Enroll Now" if `Remaining Seats === 0` (Full Batches)
- Cache Course Details with Upstash Redis

---

## Phase 3 — Payment-First Checkout, Secure Purchase Recovery & Post-Payment Onboarding

### 08 Lightweight Buyer Modal & Session Initiation

Visitor clicks "Enroll Now" without any pre-authentication or OTP requirements.

**UI:**
- `EnrollModal` dialog requesting Full Name and Email Address.
- Prominent accuracy advisory: *"Make sure your email address is correct. Your course access instructions will be sent to this email. An incorrect email may prevent you from receiving them."*

**Logic:**
- Server-side mutation creates a durable `purchases` record (`paymentStatus: 'pending'`, `claimStatus: 'unclaimed'`, high-entropy session token, secure recovery hash).
- Secure, HttpOnly cookie `vls_purchase_session` is minted.
- Visitor is redirected to `/checkout?purchaseId=...`.

---

### 09 Server-Authoritative Checkout & Coupon Engine

**UI:**
- Order breakdown showing canonical Course title, Cohort Batch schedule, Base price, Coupon field, Discount, and Net Payable amount.
- Clean Razorpay Checkout modal trigger.

**Logic:**
- Server strictly validates price and coupons (percentage or fixed discount, usage limits, expiration) via Convex query/mutation.
- Razorpay Order created via `/api/checkout/order` using server-calculated amount. Notes contain only `purchaseId`, `courseId`, and `batchId` (no raw secret tokens exposed).

---

### 10 Cryptographic Payment Verification & Guaranteed Seat Allocation

**Logic:**
- Dual-channel verification: synchronous client verify endpoint (`/api/checkout/verify`) and webhook (`/api/webhooks/razorpay`).
- Verifies Razorpay signatures securely on the server.
- Atomic Convex mutation transitions purchase `paymentStatus` to `'verified'`.
- Seat allocation is guaranteed for verified payments without silent drops or race condition loss.
- Durable email outbox job (`emailJobs`) is scheduled for transactional delivery.

---

### 11 Protected 3-Step Post-Payment Onboarding (`/checkout/onboarding`)

**UI & Logic:**
- Route access strictly guarded: requires verified `vls_purchase_session` matching `paymentStatus: 'verified'`.
- **Step 1:** Confirm/correct buyer name and email address before welcome email release.
- **Step 2:** Join official WhatsApp cohort community (optional, non-blocking).
- **Step 3:** Payment verified confirmation with email instructions and recovery guide.

---

### 12 Resend Durable Email Delivery & Clerk Account Linking

**Logic:**
- Durable worker dispatches Resend welcome email with high-entropy recovery link.
- Student authenticates via Clerk (sign-in or sign-up).
- Backend strictly verifies Clerk authenticated user's verified email matches the purchase's `buyerEmail`.
- Links purchase (`claimStatus: 'claimed'`), creates active `enrollments` record, and unlocks LMS Dashboard.
  - If `enrolledCount === capacity`, update batch status to `completed`
  - Create `enrollments` record (`status: 'active'`)
- Invalidate Redis Cache for Course/Batch details
- Trigger Resend email welcome sequence containing the automated WhatsApp Group link

---

## Phase 4 — Student Dashboard & LMS

### 11 Student Dashboard — Full UI

Build the central hub for enrolled students with mock data.

**UI:**

- Welcome banner — "Welcome back, [Name]"
- Active Courses grid — Course cards with progress bars
- Upcoming Classes (Calendar preview) — List of next 3 live sessions
- Announcements feed — Latest updates from instructors
- Empty state if no enrollments exist

---

### 12 LMS View & Calendar — Full UI [COMPLETED]

Build the internal course consumption interface.

**UI:**

- Sidebar navigation — Study Materials, Live Classes, Recordings
- Content area — PDF viewer or Video player component
- FullCalendar component — Monthly/Weekly view of live classes with "Join Google Meet" buttons
- WhatsApp Group Join banner

---

### 13 Dashboard Data Wiring [COMPLETED]

Connect the Student Dashboard and LMS to real Convex data.

**Logic:**

- Query `enrollments` scoped to the current user's ID
- Fetch `courses` associated with those enrollments
- Feed `liveClasses` into FullCalendar based on enrolled batches
- Query `studyMaterials` and `recordings` based on selected course
- **Access Control:** Ensure users can only view materials for courses they hold an active enrollment for
- Cache Dashboard and CMS data in Upstash Redis

---

### 14 Student Profile & Settings [COMPLETED]

Build the user configuration page.

**UI:**

- Profile form (React Hook Form) — Name, Avatar upload (UploadThing)
- Settings — Notification preferences (email toggles)

**Logic:**

- Upload profile picture directly to UploadThing
- Convex Mutation to update `users` collection

---

## Phase 5 — Admin Dashboard & CMS

### 15 Admin Dashboard & Management UI

Build the admin control center with mock data.

**UI:**

- Stats Bar — Total Revenue, Active Students, Active Courses (mock data)
- Revenue Chart (Recharts) and Recent Enrollments table (TanStack Table)
- Course Management — Forms to create/edit courses and spawn new batches
- Student Management — Table to view student progress and manual enrollment overrides

---

### 16 Admin Data Wiring & Media Library

Wire admin features to Convex and UploadThing.

**Logic:**

- Query all data without user-scoping (protected by Admin role check)
- Wire Course/Batch creation forms to Convex Mutations
- Integrate UploadThing for Cover Image and Study Material uploads (Media Library)
- Wire manual enrollment overrides (bypassing Razorpay)

---

### 17 Landing Page CMS

Allow admins to edit the marketing site dynamically.

**Logic:**

- Admin UI toggles visibility of Hero sections and Promotional Banners
- Convex Mutation updates `landingPage` collection
- Invalidate Landing Page Redis Cache
- Landing page queries this collection to conditionally render sections
- Implement Rate Limiting via Redis for public-facing CMS endpoints

---

### 18 Review Management & Announcements

Wire the administrative communication tools.

**Logic:**

- Table displaying pending student reviews
- Admin toggles `isApproved` via Convex Mutation (immediately visible on Course Details page)
- Form to broadcast Announcements to specific batches
- Realtime sync pushes Announcements to Student Dashboards instantly
- Trigger Resend email to all students in the batch

---

## Feature Count

| Phase                               | Features |
| ----------------------------------- | -------- |
| Phase 1 — Foundation                | 4        |
| Phase 2 — Course Marketplace        | 3        |
| Phase 3 — Checkout & Enrollment     | 3        |
| Phase 4 — Student Dashboard & LMS   | 4        |
| Phase 5 — Admin Dashboard & CMS     | 4        |
| **Total**                           | **18**   |
