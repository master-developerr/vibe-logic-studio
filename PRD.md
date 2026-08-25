# VibeLogic Studio - Product Requirements Document (PRD)

## 1. Product Overview

**VibeLogic Studio** is a production-ready, AI-first EdTech SaaS platform. It is designed to handle the entire lifecycle of an online educational institution—from marketing and course discovery to enrollment, live class scheduling, content delivery, and student management.

**Core Philosophy:** The project strictly follows the **YAGNI (You Aren't Gonna Need It)** principle. We do not build infrastructure that already exists. We integrate mature, production-ready third-party solutions (e.g., Clerk for auth, Convex for backend, UploadThing for storage) instead of rebuilding them from scratch. Engineering effort is strictly reserved for building software that provides a direct competitive advantage.

---

## 2. Technology Stack

VibeLogic Studio relies on a modern, highly scalable, serverless-first tech stack.

**Frontend:**
- **Framework:** Next.js (React)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Component Library:** shadcn/ui
- **Animations:** GSAP, Framer Motion
- **Icons:** Lucide
- **Data Visualization:** Recharts, TanStack Table
- **Forms & Validation:** React Hook Form, Zod
- **Calendar:** FullCalendar

**Backend & Infrastructure:**
- **Database & API:** Convex (Serverless Backend, Realtime)
- **Authentication:** Clerk
- **Payments:** Razorpay
- **Storage:** UploadThing
- **Emails:** Resend
- **Analytics:** PostHog
- **Monitoring:** Sentry

---

## 3. Core Modules

The platform is divided into several primary modules, each handling a distinct domain of the application.

1. **Landing Page:** Public-facing marketing page built with high-performance animations and dynamically driven by a CMS.
2. **Course Marketplace:** Public directory of available courses, upcoming batches, and student reviews.
3. **Course Details:** Deep dive into specific courses, showcasing syllabus, instructors, and pricing.
4. **Authentication:** Secure login/signup flows powered by Clerk.
5. **Checkout:** Integrated payment flow via Razorpay for course enrollment.
6. **Student Dashboard:** Central hub for enrolled students to access their learning materials.
7. **Admin Dashboard:** Central hub for platform administrators to manage the entire application.
8. **Landing Page CMS:** Admin interface to dynamically update featured courses, banners, and marketing copy.
9. **Media Library:** Centralized asset management for course thumbnails, study materials, and recordings via UploadThing.
10. **Review Management:** System to curate, approve, and display student testimonials.
11. **Batch Management:** Cohort-based grouping of students for specific live sessions.
12. **Course Management:** Creation and structuring of course curriculums.
13. **Student Management:** Admin tools to view student progress, roles, and assignments.
14. **Calendar:** Unified view of live classes and deadlines for both students and admins.
15. **Live Classes:** Meeting link distribution and scheduling.
16. **Recordings:** Archival and distribution of past live sessions.
17. **Study Materials:** Delivery of PDFs, videos, and resources.
18. **Announcements:** Broadcast system for course or batch-wide updates.
19. **Settings:** User and platform configuration.
20. **Notifications:** Realtime alerts for users.
21. **Profile:** User identity and public persona management.
22. **Certificates:** Automated generation and validation of course completion certificates.

---

## 4. Product Logic & Workflows

### Enrollment Flow & Checkout
1. Student selects a course and an available batch from the Course Details page.
2. System verifies seat availability (Batch Capacity) in realtime via Convex.
3. Student is redirected to Razorpay checkout.
4. Upon successful payment, a webhook triggers a Convex Action.
5. The system creates an `enrollment` record, deducts a seat from the batch, and grants Dashboard Access.
6. A welcome email is triggered via Resend, including a link to the automated WhatsApp Group Assignment.

### Batch Management
- **Automatic Batch Allocation:** If a student does not select a specific batch, they are automatically placed in the most recent active batch with available seats.
- **Seat Management:** Batches have strict capacity limits. Once full, they are marked as "Completed" for enrollment purposes.
- **Lifecycles:** Batches transition from `Upcoming` -> `Live` -> `Completed`.

### Role-Based Access
- **Students:** Can only access materials, recordings, and calendar events linked to their active enrollments.
- **Admins:** Can bypass paywalls, edit content, manage users, and view platform analytics.

---

## 5. Admin Features

The Admin Dashboard provides full control over the platform's data.

- **Course & Batch Creation:** Admins can define new courses, set pricing, upload cover images to the Media Library, and spawn multiple batches per course.
- **Landing Page Editing:** Toggle visibility of specific promotional banners, featured courses, and curated testimonials.
- **Review Editing:** Approve, reject, or feature reviews submitted by students.
- **Media Management:** Upload, rename, and delete assets globally via UploadThing.
- **Student Assignment:** Manually enroll students into courses/batches (bypassing Razorpay) for offline payments or scholarships.
- **Payment Tracking:** Reconcile Razorpay webhook data, view revenue charts (Recharts), and manage refunds.
- **Analytics & Visibility:** View PostHog traffic data and toggle the public visibility of upcoming batches.
- **Announcements:** Send broadcast messages that appear in student dashboards and trigger email notifications.

---

## 6. Student Features

The Student Dashboard is focused on a distraction-free learning experience.

- **Course Access:** View all enrolled courses. 
- **Study Materials:** Access curriculum, PDFs, and related files.
- **Live Classes & Calendar:** View a FullCalendar interface detailing upcoming live classes, complete with one-click "Join" buttons.
- **Recordings:** Access archived video recordings of past live classes.
- **Announcements:** Read important updates from instructors.
- **Profile & Settings:** Update avatar, display name, and notification preferences.
- **Certificates:** Download verifiable PDF certificates upon 100% course completion.

---

## 7. Database Architecture (Convex)

VibeLogic Studio uses Convex as the single source of truth. All data is structured as documents and accessed via strict queries, mutations, and actions. **There are no SQL queries.**

### Core Collections

1. **`users`**
   - Synced from Clerk via webhooks.
   - Stores: `clerkId`, `email`, `role` (admin/student), `name`, `avatarUrl`.
2. **`courses`**
   - Stores: `title`, `description`, `price`, `coverImageId`, `isActive`, `createdAt`.
3. **`batches`**
   - Relationships: `courseId` (Ref to `courses`).
   - Stores: `title`, `startDate`, `endDate`, `capacity`, `enrolledCount`, `status` (upcoming/live/completed), `whatsappLink`.
4. **`enrollments`**
   - Relationships: `userId`, `courseId`, `batchId`.
   - Stores: `paymentId`, `status`, `progress`, `enrolledAt`.
5. **`liveClasses`**
   - Relationships: `batchId`.
   - Stores: `title`, `startTime`, `endTime`, `meetingLink`, `recordingUrl`.
6. **`studyMaterials`**
   - Relationships: `courseId`.
   - Stores: `title`, `fileUrl` (UploadThing), `type` (pdf/video/link), `order`.
7. **`reviews`**
   - Relationships: `userId`, `courseId`.
   - Stores: `rating`, `content`, `isApproved`, `isFeatured`.
8. **`announcements`**
   - Relationships: `batchId` (optional, if null applies to all).
   - Stores: `title`, `content`, `createdAt`.
9. **`certificates`**
   - Relationships: `userId`, `courseId`.
   - Stores: `issuedAt`, `certificateUrl`, `uniqueHash`.

### Indexes & Realtime
- **Indexes:** Created in `convex/schema.ts` to optimize lookups (e.g., `by_clerk_id` on users, `by_course_and_user` on enrollments to prevent duplicates).
- **Realtime:** The UI must use Convex's `useQuery` hooks to ensure that seat counts, calendar updates, and announcements update instantly across all connected clients without manual polling.

### Actions & Mutations
- **Mutations:** Used for pure database writes (e.g., `createCourse`, `approveReview`, `updateProgress`).
- **Actions:** Used when interacting with third-party APIs (e.g., `verifyRazorpayPayment`, `sendResendEmail`, `uploadToUploadThing`).

---

## 8. UI/UX Requirements

- **Design System:** Must adhere to the established VibeLogic Studio brand guidelines, utilizing strict color tokens, typography scales (Inter), and spacing units configured via Tailwind CSS.
- **Component Library:** Built entirely with `shadcn/ui` to ensure accessibility (a11y) and keyboard navigation out of the box. Do not build complex interactive components (like Selects or Dialogs) from scratch.
- **Animations:** Use GSAP for high-performance scroll triggers on the Landing Page. Use Framer Motion for micro-interactions (e.g., expanding cards, page transitions) inside the Dashboards.
- **Responsive Design:** 100% mobile-first approach. Tables (TanStack) must elegantly collapse or scroll horizontally on small screens.
- **Layouts:**
  - **Landing Page:** Immersive, high-contrast, animation-heavy marketing layout.
  - **Admin Layout:** Dense, data-rich sidebar navigation focusing on utility, tables, and charts.
  - **Student Layout:** Clean, distraction-free top-nav or minimal sidebar layout focusing entirely on content consumption and calendar visibility.

---

## 9. Implementation Philosophy

1. **Protect Secrets:** Webhook secrets, Razorpay keys, and Resend keys live *only* on the server (Convex Actions or Next.js Route Handlers).
2. **Serverless Edge:** Minimize heavy processing on the client. Push complex data aggregation to Convex queries.
3. **No Placeholders:** All UI must be driven by data. If building a new page, wire it up to a Convex query immediately.
4. **Resiliency:** Assume webhooks can fail or duplicate. Database mutations for enrollment must be idempotent.

---
*End of Document. This PRD serves as the master specification for VibeLogic Studio.*
