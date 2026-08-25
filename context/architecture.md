# Architecture

## Stack

| Layer                          | Tool                     | Purpose                                          |
| ------------------------------ | ------------------------ | ------------------------------------------------ |
| Framework                      | Next.js 16 (App Router)  | Full stack framework                             |
| Auth                           | Clerk                    | Authentication and user management               |
| Backend & DB                   | Convex                   | Serverless backend, Realtime database, and API   |
| Cache Layer                    | Upstash Redis            | Distributed Cache, Rate Limiting, Idempotency    |
| Payments                       | Razorpay                 | Payment processing and checkout                  |
| Storage                        | UploadThing              | Media and study material file uploads            |
| Email                          | Resend                   | Transactional emails                             |
| Analytics                      | PostHog                  | Event tracking and user behavior analytics       |
| Monitoring                     | Sentry                   | Error tracking and performance monitoring        |
| Styling                        | Tailwind CSS + shadcn/ui | UI components and styling                        |
| Language                       | TypeScript strict        | Throughout                                       |
| Forms & Validation             | React Hook Form + Zod    | Form state management and schema validation      |
| Calendar                       | FullCalendar             | Live class and event scheduling UI               |
| Charts & Tables                | Recharts + TanStack Table| Data visualization and data grids                |
| Icons & Images                 | Lucide + Next/Image      | SVG icons and optimized image delivery           |
| Animations                     | GSAP + Framer Motion     | Scroll animations and micro-interactions         |
| Video Meetings & Hosting       | Google Meet + YouTube    | Live classes and recorded sessions (Unlisted)    |

---

## Folder Structure

```
/
├── AGENTS.md
├── context/
│   ├── project-overview.md
│   ├── architecture.md
│   ├── ui-tokens.md
│   ├── ui-rules.md
│   ├── ui-registry.md
│   ├── code-standards.md
│   ├── library-docs.md
│   ├── build-plan.md
│   └── progress-tracker.md
├── app/
│   ├── layout.tsx                          → Root layout, PostHog & Clerk providers
│   ├── page.tsx                            → Landing Page
│   ├── (auth)/
│   │   ├── sign-in/
│   │   │   └── page.tsx                   → Clerk Sign-in
│   │   └── sign-up/
│   │       └── page.tsx                   → Clerk Sign-up
│   ├── courses/
│   │   ├── page.tsx                       → Course Marketplace
│   │   └── [id]/
│   │       └── page.tsx                   → Individual Course Details
│   ├── student/
│   │   ├── dashboard/
│   │   │   └── page.tsx                   → Student Dashboard
│   │   ├── courses/[id]/
│   │   │   └── page.tsx                   → LMS Course View & Study Materials
│   │   ├── calendar/
│   │   │   └── page.tsx                   → Student Calendar (FullCalendar)
│   │   └── profile/
│   │       └── page.tsx                   → Student Profile & Settings
│   ├── admin/
│   │   ├── dashboard/
│   │   │   └── page.tsx                   → Admin Dashboard & Analytics
│   │   ├── courses/
│   │   │   └── page.tsx                   → Course & Batch Management
│   │   ├── students/
│   │   │   └── page.tsx                   → Student Management
│   │   └── cms/
│   │       └── page.tsx                   → Landing Page CMS
│   └── api/
│       ├── webhooks/
│       │   ├── clerk/route.ts             → Clerk user sync webhook
│       │   └── razorpay/route.ts          → Razorpay payment verification webhook
│       └── uploadthing/
│           └── core.ts                    → UploadThing file routes
├── components/
│   ├── ui/                                → shadcn/ui components only
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   ├── landing/
│   │   ├── Hero.tsx
│   │   └── FeaturedCourses.tsx
│   ├── courses/
│   │   ├── CourseCard.tsx
│   │   └── BatchSelector.tsx
│   ├── dashboard/
│   │   ├── StatsBar.tsx
│   │   └── AnalyticsCharts.tsx
│   ├── calendar/
│   │   └── EventCalendar.tsx
│   └── forms/
│       ├── CourseForm.tsx
│       └── ReviewForm.tsx
├── convex/
│   ├── schema.ts                          → Convex database schema and indexes
│   ├── users.ts                           → User queries and mutations
│   ├── courses.ts                         → Course queries and mutations
│   ├── batches.ts                         → Batch queries and mutations
│   ├── enrollments.ts                     → Enrollment queries and mutations
│   ├── payments.ts                        → Payment actions and mutations
│   ├── liveClasses.ts                     → Live class scheduling and mutations
│   ├── studyMaterials.ts                  → Media and material queries
│   └── _generated/                        → Auto-generated Convex types
├── lib/
│   ├── posthog-client.ts                  → PostHog browser client
│   ├── razorpay.ts                        → Razorpay client and utility functions
│   └── utils.ts                           → Shared utility functions (Tailwind merge, etc.)
└── types/
    └── index.ts                           → Global TypeScript types
```

---

## System Boundaries

| Folder        | Owns                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| `app/`        | Pages and API routes (webhooks) only. No direct database logic.                                        |
| `convex/`     | All database schema, Queries, Mutations, and Actions. Nothing here touches React directly.             |
| `components/` | UI only. Data fetching happens via Convex React hooks (`useQuery`, `useMutation`).                     |
| `lib/`        | Third-party client initialization (Razorpay, PostHog) and shared utilities only.                       |
| `types/`      | TypeScript types shared across the project.                                                            |

---

## Data Flow

### Authentication

```
User signs up via Clerk
        ↓
Clerk handles authentication
        ↓
Clerk Webhook fires (app/api/webhooks/clerk)
        ↓
Convex Mutation inserts/updates user in `users` collection
        ↓
User is fully synced and can access protected routes
```

### Enrollment & Payment

```
User selects Course and Batch in Marketplace
        ↓
Check Redis Cache
        ↓
Cache Miss
        ↓
System checks Seat Availability via Convex Query
        ↓
Store Response in Redis
        ↓
User initiates Checkout
        ↓
Razorpay Order created via Server Action
        ↓
User completes payment on Razorpay checkout
        ↓
Razorpay Webhook fires (app/api/webhooks/razorpay)
        ↓
Check Redis for Webhook Idempotency (Deduplication)
        ↓
Convex Mutation verifies signature, deducts seat, creates Enrollment
        ↓
Invalidate Redis Cache for Course/Batch
        ↓
Resend sends Welcome Email with WhatsApp Group Link
```

### Automatic Batch Assignment

```
User initiates Checkout without selecting a specific Batch
        ↓
Convex Action fetches most recent active Batch with available seats
        ↓
Assigns Batch ID to checkout session
        ↓
Continues standard Enrollment & Payment flow
```

### Dashboard Access & Study Materials

```
Student navigates to Dashboard
        ↓
Convex Query fetches `enrollments` matching user ID
        ↓
Dashboard displays enrolled Courses
        ↓
Student clicks Course
        ↓
Check Redis Cache
        ↓
Cache Miss
        ↓
Convex Query fetches `studyMaterials` and `liveClasses` for that Course/Batch
        ↓
Store Response in Redis
        ↓
Content is rendered
```

### Live Classes

```
Admin schedules Live Class in Admin Dashboard
        ↓
Convex Mutation creates `liveClasses` record with Google Meet link
        ↓
Student views Calendar (FullCalendar component)
        ↓
Convex Query feeds active `liveClasses` into Calendar
        ↓
Student clicks "Join" to launch Google Meet
```

### Announcements

```
Admin creates Announcement for a specific Batch
        ↓
Convex Mutation saves Announcement
        ↓
Convex Realtime sync pushes Announcement to connected Student Dashboards
        ↓
Resend sends Email Notification to all enrolled Students
```

### Landing Page CMS
        ↓
Admin toggles promotional banner in CMS Dashboard
        ↓
Convex Mutation updates `landingPage` collection
        ↓
Invalidate Landing Page Redis Cache
        ↓
Landing Page re-renders with new content dynamically
```

### Review Management

```
Student submits Course Review
        ↓
Convex Mutation saves `reviews` record (isApproved: false)
        ↓
Admin reviews in Dashboard and toggles `isApproved`
        ↓
Convex Query on Course Details page immediately shows approved Review
```

### Media Upload

```
Admin uploads PDF/Video via UploadThing component
        ↓
UploadThing handles direct-to-S3 upload
        ↓
UploadThing `onClientUploadComplete` triggers Convex Mutation
        ↓
Convex saves file URL and metadata to `media` or `studyMaterials` collection
```

### Batch Management & Student Management

```
Admin updates Batch Capacity or manually Enrolls Student
        ↓
Convex Mutation updates `batches` or `enrollments` collection
        ↓
Seat availability is instantly updated across the platform via Convex Realtime
```

---

## Convex Database Schema

### `users`

| Field      | Type   | Notes                                      |
| ---------- | ------ | ------------------------------------------ |
| _id        | Id     | Convex generated ID                        |
| clerkId    | string | Unique identifier from Clerk (Indexed)     |
| email      | string |                                            |
| name       | string |                                            |
| role       | string | "admin" / "student"                        |
| avatarUrl  | string |                                            |
| createdAt  | number | Timestamp                                  |

### `courses`

| Field        | Type    | Notes                                      |
| ------------ | ------- | ------------------------------------------ |
| _id          | Id      | Convex generated ID                        |
| title        | string  |                                            |
| description  | string  |                                            |
| price        | number  | Default price                              |
| coverImageId | string  | Reference to media                         |
| isActive     | boolean | True if published to Marketplace           |
| createdAt    | number  | Timestamp                                  |

### `batches`

| Field         | Type   | Notes                                      |
| ------------- | ------ | ------------------------------------------ |
| _id           | Id     | Convex generated ID                        |
| courseId      | Id     | References `courses`                       |
| title         | string | e.g. "Summer Cohort 2024"                  |
| startDate     | number | Timestamp                                  |
| endDate       | number | Timestamp                                  |
| capacity      | number | Maximum allowed seats                      |
| enrolledCount | number | Current number of enrollments              |
| status        | string | "upcoming" / "live" / "completed"          |
| whatsappLink  | string | Optional automated group link              |

### `enrollments`

| Field     | Type   | Notes                                                  |
| --------- | ------ | ------------------------------------------------------ |
| _id       | Id     | Convex generated ID                                    |
| userId    | Id     | References `users`                                     |
| courseId  | Id     | References `courses`                                   |
| batchId   | Id     | References `batches`                                   |
| paymentId | Id     | References `payments` (Optional for manual enrollment) |
| status    | string | "active" / "dropped" / "completed"                     |
| progress  | number | 0-100 percentage                                       |
| enrolledAt| number | Timestamp                                              |

### `payments`

| Field           | Type   | Notes                                      |
| --------------- | ------ | ------------------------------------------ |
| _id             | Id     | Convex generated ID                        |
| userId          | Id     | References `users`                         |
| razorpayOrderId | string | Unique order ID from Razorpay              |
| amount          | number | Amount paid                                |
| status          | string | "pending" / "successful" / "failed"        |
| createdAt       | number | Timestamp                                  |

### `reviews`

| Field      | Type    | Notes                                      |
| ---------- | ------- | ------------------------------------------ |
| _id        | Id      | Convex generated ID                        |
| userId     | Id      | References `users`                         |
| courseId   | Id      | References `courses`                       |
| rating     | number  | 1-5                                        |
| content    | string  | Text review                                |
| isApproved | boolean | Must be true to show on Marketplace        |
| isFeatured | boolean | Prioritized display                        |

### `studyMaterials`

| Field    | Type   | Notes                                      |
| -------- | ------ | ------------------------------------------ |
| _id      | Id     | Convex generated ID                        |
| courseId | Id     | References `courses`                       |
| title    | string |                                            |
| type     | string | "pdf" / "video" / "link"                   |
| fileUrl  | string | UploadThing URL                            |
| order    | number | Sorting order in UI                        |

### `liveClasses` (and `recordings`)

| Field        | Type   | Notes                                      |
| ------------ | ------ | ------------------------------------------ |
| _id          | Id     | Convex generated ID                        |
| batchId      | Id     | References `batches`                       |
| title        | string |                                            |
| startTime    | number | Timestamp (Stored in UTC)                  |
| endTime      | number | Timestamp (Stored in UTC)                  |
| meetingLink  | string | Google Meet URL                            |
| recordingUrl | string | YouTube Unlisted URL (populated later)     |

### `announcements`

| Field     | Type   | Notes                                      |
| --------- | ------ | ------------------------------------------ |
| _id       | Id     | Convex generated ID                        |
| batchId   | Id     | References `batches` (null = platform wide)|
| title     | string |                                            |
| content   | string |                                            |
| createdAt | number | Timestamp                                  |

### `landingPage`

| Field    | Type    | Notes                                      |
| -------- | ------- | ------------------------------------------ |
| _id      | Id      | Convex generated ID                        |
| section  | string  | "hero" / "banner" / "features"             |
| content  | string  | JSON stringified or raw text               |
| isVisible| boolean | CMS toggle                                 |

### `media`

| Field    | Type   | Notes                                      |
| -------- | ------ | ------------------------------------------ |
| _id      | Id     | Convex generated ID                        |
| fileName | string |                                            |
| fileUrl  | string | UploadThing URL                            |
| uploadedBy| Id    | References `users` (Admin)                 |

---

## Business Logic

### Course Marketplace
The Marketplace must only display Courses where `isActive === true`. Associated Batches must only be displayed if their `status` is `upcoming` or `live`.

### Seat Availability & Batch Capacity
A Batch has a hard `capacity` limit. Before an enrollment is confirmed, the system must check `enrolledCount < capacity`. Once `enrolledCount === capacity`, the Batch is automatically marked as "Completed" for new enrollments.

### Automatic Batch Assignment
If a student buys a Course without selecting a specific Batch, the system defaults to the earliest `startDate` Batch where `status === 'upcoming'` and `enrolledCount < capacity`.

### Upcoming & Completed Batches
- **Upcoming:** Future `startDate`, seats available.
- **Live:** Currently ongoing (between `startDate` and `endDate`).
- **Completed:** Past `endDate` OR `capacity` reached. Students can still access materials, but no new enrollments are allowed.

### WhatsApp Group Assignment
Upon successful enrollment, if the selected Batch has a `whatsappLink`, it is included in the Welcome Email and prominently displayed in the Student Dashboard on their first login.

### Enrollment Flow
Enrollment is an append-only transaction. Duplicate check: A user cannot have two active enrollments for the same `courseId` and `batchId`.

### Course Access
Students can only fetch `studyMaterials` and `liveClasses` if they possess a valid `enrollment` record with `status === 'active'` or `'completed'`.

### Student Permissions
Students cannot write to any collection except `users` (updating their own profile) and `reviews`. All other actions are strictly read-only scoped by their enrollments.

### Admin Permissions
Admins possess global read/write access. Convex mutations must strictly verify the user's role via Clerk before proceeding with destructive or sensitive actions (e.g., overriding enrollments, deleting courses).

---

## YAGNI Principle (Engineering Philosophy)

VibeLogic Studio adheres strictly to the **YAGNI (You Aren't Gonna Need It)** philosophy. The application should never rebuild infrastructure that already exists. We only build software that creates a direct competitive advantage for the business. Everything else is delegated to mature, production-ready integrations.

- **Authentication → Clerk:** We do not build password hashing, session management, or OAuth handshakes. Clerk handles all auth.
- **Payments → Razorpay:** We do not handle credit card data or complex retry logic. Razorpay handles checkout and webhooks.
- **Backend & Realtime → Convex:** We do not build REST APIs, WebSocket servers, or manage database migrations. Convex handles data, relationships, and realtime sync automatically.
- **Calendar → FullCalendar:** We do not build custom grid math for scheduling. FullCalendar renders all date views.
- **Video Meetings → Google Meet:** We do not build WebRTC streaming. We generate Google Meet links for live classes.
- **Video Hosting → YouTube (Unlisted):** We do not build video transcoding pipelines. Class recordings are hosted as Unlisted YouTube videos.
- **Emails → Resend:** We do not manage SMTP servers or email deliverability.
- **Analytics → PostHog:** We do not build custom event tracking pipelines.
- **Monitoring → Sentry:** We do not build custom error logging infrastructure.
- **Uploads → UploadThing:** We do not manage raw S3 buckets or multipart upload logic.
- **Charts → Recharts:** Data visualization uses established React SVG charting.
- **Tables → TanStack Table:** Complex data grids, sorting, and pagination use headless table logic.
- **Forms → React Hook Form:** Form state is not managed manually.
- **Validation → Zod:** Type-safe schema validation is shared across frontend and backend.
- **Icons → Lucide:** Consistent SVG iconography.
- **Image Optimization → Next/Image:** We do not build custom image resizing proxies.
- **Caching & Rate Limiting → Upstash Redis:** We do not build custom session stores or distributed locks.

---

## Invariants

Rules the system must never violate:

- API routes (`app/api`) are strictly for Webhooks. They contain no UI logic.
- Components contain no direct DB logic. All data flows through Convex hooks or actions.
- No hardcoded hex values or raw Tailwind color classes in components — use CSS variables from `ui-tokens.md`.
- Always scope Convex queries to the current authenticated user when dealing with student data — never query enrollments without a user filter.
- Webhook endpoints must mathematically verify signatures (Clerk / Razorpay) before processing.
- Time precision is critical: `startDate`, `endDate`, `startTime`, and `endTime` must always be stored in UTC format as numbers in Convex. Timezone conversion only happens on the client via UI components.
- Never delete `enrollments`. Use `status === 'dropped'` to revoke access while preserving historical data.
- The `admin` role is the ultimate authority. Mutations must rigorously check the user's role against the database before executing admin actions.
