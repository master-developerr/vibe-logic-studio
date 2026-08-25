# VibeLogic Studio — User Flow & Behavioral Specification

## Definitive Behavioral Source of Truth

> [!IMPORTANT]
> **Document Type:** Behavioral Specification & End-to-End User Journey Reference.
> **Audience:** Senior Product Designers, UX Architects, Software Architects, Product Managers, and AI Agents.
> **Authority:** When any uncertainty or ambiguity arises regarding application routing, permissions, empty states, error recovery, or user navigation, **this document is the final authority**.
> **Last Updated:** 2026-07-26

---

## 1. Document Goal & Engineering Philosophy

This document defines **HOW** users interact with VibeLogic Studio from their first touchpoint as an unauthenticated visitor to ongoing engagement as an enrolled student or platform administrator. 

- **Behavior Over Implementation:** It defines precisely what the system must do, where it redirects, how it validates input, and how it recovers from failure—without prescribing specific UI styling, CSS classes, or internal database schemas.
- **Exhaustive Decision Logic:** Every button click, route change, session check, empty state, and error condition is explicitly specified so an AI agent or engineer can implement complete, bulletproof routing and user flows without asking follow-up questions.
- **Deterministic Outcomes:** For every user action, there is exactly one success path and a defined set of failure/recovery paths.

---

## 2. User Types & Role Taxonomy

VibeLogic Studio defines four distinct behavioral roles, each with strict navigation boundaries:

```mermaid
graph TD
    USER["User Accessing Platform"] --> IS_AUTH{"Is Authenticated (Clerk JWT)?"}
    IS_AUTH -->|No| VISITOR["1. Visitor (Public Catalog & CMS)"]
    IS_AUTH -->|Yes| CHECK_ROLE{"Resolve Convex Identity Role"}
    
    CHECK_ROLE -->|role == 'student'| STUDENT["2. Student (LMS, Calendar, Profile)"]
    CHECK_ROLE -->|role == 'admin'| ADMIN["3. Admin (Command Center, Workspaces, CMS)"]
    CHECK_ROLE -->|role == 'superadmin'| SUPER["4. Super Admin (Reserved / Root Access)"]
```

### Role Summary Table
| User Type | Access Scope | Session Behavior | Primary Goal |
| :--- | :--- | :--- | :--- |
| **Visitor** | `/`, `/courses`, `/course/[slug]`, `/sign-in`, `/sign-up`, `/faq` | Anonymous browser session. Rate-limited by IP/device. | Discover courses, evaluate social proof, and initiate checkout. |
| **Student** | All public routes + `/dashboard/*`, `/student/*`, `/profile` | Authenticated Clerk JWT (7-day rolling expiry). | Consume study materials, join live classes, watch recordings, and manage profile. |
| **Admin** | All public + student routes + `/admin/*` | Authenticated Clerk JWT with `admin` claim verified in Convex. | Operate Admin Command Center, publish courses, manage dedicated Batch Workspaces, upload media, and configure CMS. |
| **Super Admin** | Reserved for multi-tenant / system configuration | MFA-enforced JWT with root-level mutations. | Platform audit logs, payment gateway credentials, and system-wide overrides. |

---

## 3. Visitor Flow (Public Exploration & Discovery)

A Visitor explores the platform without authentication. The system ensures fast discovery while gracefully nudging toward enrollment.

```mermaid
flowchart TD
    LAND["Visitor Lands on `/`"] --> BROWSE["Browse Hero, Featured Courses, Testimonials, FAQ"]
    BROWSE --> CLICK_COURSE["Click Course Card / Featured CTA"]
    CLICK_COURSE --> COURSE_DETAIL["Navigate to `/course/[slug]`"]
    
    COURSE_DETAIL --> VIEW_SYLLABUS["Expand Curriculum Topic (Animated Stagger Row)"]
    COURSE_DETAIL --> VIEW_BATCH["Select Cohort in Sticky/Inline Batch Picker"]
    COURSE_DETAIL --> CLICK_ENROLL["Click 'Enroll Now' Button"]
    
    CLICK_ENROLL --> CHECK_AUTH{"Is Visitor Authenticated?"}
    CHECK_AUTH -->|No| REDIRECT_SIGNUP["Redirect to `/sign-up?fallback_redirect_url=/dashboard`"]
    CHECK_AUTH -->|Yes| OPEN_CHECKOUT["Initiate Razorpay Checkout Modal"]
```

### Detailed Behavioral Requirements
1. **Landing Page (`/`):**
   - **Behavior:** Loads promotional banners, featured courses, and dynamic testimonials from Upstash Redis cache (`cache:cms:landing`).
   - **Loading State:** If cache is cold, renders a branded skeleton layout without layout shift.
   - **Error State:** If Convex CMS query fails, falls back to static default hero copy; never shows a broken error screen to a visitor.
2. **Catalog Browsing (`/courses`):**
   - **Behavior:** Allows filtering by category (`All`, `AI`, `Full-Stack`, `Design`) and keyword searching.
   - **URL Synchronization:** Changing a category filter or search query updates URL query parameters (`/courses?category=AI&search=sprint`) without a page reload.
   - **Back Navigation:** Clicking the browser Back button restores the exact scroll position and filter state.
3. **Course Detail Interaction (`/course/[slug]`):**
   - **Behavior:** Visitor can inspect course description, instructor credentials, itemized syllabus, student reviews, and live batch seat counts.
   - **Missing Slug Guard:** If `/course/[slug]` does not exist in Convex, system immediately renders a custom `404 Not Found` state with a "Browse All Courses" button.

---

## 4. Authentication Flow (Clerk Identity Resolution)

The authentication system governs entry into protected areas and ensures clean role-based routing.

```mermaid
stateDiagram-v2
    [*] --> Unauthenticated
    
    state Unauthenticated {
        [*] --> SignInOrSignUp
        SignInOrSignUp --> ClerkAuthModal: Email / OAuth / Password
    }
    
    ClerkAuthModal --> VerifyingSession: Token Minted
    
    state VerifyingSession {
        [*] --> CheckMiddleware: Edge Route Guard
        CheckMiddleware --> LookupConvexUser: getUserIdentity()
    }
    
    LookupConvexUser --> StudentAuthenticated: role == 'student'
    LookupConvexUser --> AdminAuthenticated: role == 'admin'
    
    StudentAuthenticated --> DashboardRedirect: Target /dashboard/materials
    AdminAuthenticated --> AdminRedirect: Target /admin/dashboard (Admin Command Center)
    
    StudentAuthenticated --> SessionExpired: JWT Expiry (7 days)
    AdminAuthenticated --> SessionExpired: JWT Expiry (7 days)
    
    SessionExpired --> Unauthenticated: Redirect to /sign-in
```

### Step-by-Step Authentication Rules
1. **Sign-Up & Login Entry (`/sign-in`, `/sign-up`):**
   - **Behavior:** Hosted within the Next.js App Router using Clerk components.
   - **Post-Login Routing:**
     - If the user was trying to access a protected URL before login, redirect to `fallback_redirect_url` or `redirect_url`.
     - If no target URL was specified, check `user.role`:
       - `role === 'admin'` → Redirect to `/admin/dashboard` (Admin Command Center & operational starting point).
       - `role === 'student'` → Redirect to `/dashboard/materials`.
2. **Session Expiry & Silent Refresh:**
   - **Behavior:** Clerk SDK automatically attempts a silent token refresh in the background.
   - **Expired Session:** If a user returns after 7 days of inactivity and the token cannot be refreshed, any attempt to navigate to `/dashboard/*` intercepts at the Edge Middleware and redirects to `/sign-in?redirect_url=/dashboard...`.
3. **Role & Privilege Guarding:**
   - **Student trying to access `/admin/*`:** Middleware or route layout detects non-admin claim and immediately redirects to `/dashboard/materials` with an info toast: *"Admin access required."*
   - **Admin accessing `/dashboard/*`:** Admin is allowed to browse student dashboard views for testing and previewing course materials.
4. **Logout Flow:**
   - **Behavior:** Clicking "Log Out" purges local session cookies, clears client-side Convex subscription caches, and redirects the user to `/`.

---

## 5. Marketplace Flow (Catalog Exploration & Search)

```mermaid
flowchart LR
    LAND["/courses Catalog"] --> SEARCH["Type Search Query"]
    LAND --> FILTER["Click Category Pill ('AI', 'Design')"]
    
    SEARCH & FILTER --> RENDER_GRID["Render Active Courses"]
    
    RENDER_GRID --> EMPTY_CHECK{"Any Courses Found?"}
    EMPTY_CHECK -->|No| EMPTY_STATE["Render 'No courses match your filter' + Reset Button"]
    EMPTY_CHECK -->|Yes| CARD_CLICK["Click Course Card"]
    
    CARD_CLICK --> DETAIL_VIEW["Navigate to `/course/[slug]`"]
```

### Marketplace Edge Cases & Rules
- **No Active Courses in Category:** Display clear empty state: *"No courses available in [Category] yet. Check back soon or browse All Courses."*
- **Inactive / Draft Course:** If an admin marks `isActive: false`, the course is omitted from `/courses`. If a user bookmarks a direct URL `/course/[slug]` for a now-inactive course, display: *"This course is currently not accepting new enrollments."*

---

## 6. Course Details Flow (`/course/[slug]`)

The Course Details page is the primary conversion funnel. It presents complete information and enforces cohort capacity rules.

```mermaid
flowchart TD
    ENTER["Visit `/course/[slug]`"] --> CHECK_SLUG{"Course Exists & Active?"}
    CHECK_SLUG -->|No| ERR_404["Render 404 Course Not Found"]
    CHECK_SLUG -->|Yes| LOAD_DATA["Load Course details, syllabus, batches, reviews"]
    
    LOAD_DATA --> BATCH_SELECT["User views Batch Selector"]
    BATCH_SELECT --> BATCH_STATUS{"What is Selected Batch Status?"}
    
    BATCH_STATUS -->|"status == 'upcoming' or 'live' AND seats > 0"| CTA_ACTIVE["CTA: 'Enroll now (₹4,999)' -> Active"]
    BATCH_STATUS -->|"seats == 0 (Sold Out)"| CTA_FULL["CTA: 'This batch is full' -> Disabled"]
    BATCH_STATUS -->|"status == 'completed'"| CTA_CLOSED["CTA: 'Cohort Completed' -> Disabled"]
    
    CTA_ACTIVE --> CLICK_ENROLL["User Clicks Enroll"]
    CLICK_ENROLL --> AUTH_GUARD["Check Clerk Authentication"]
```

### Behavioral Specifications
- **Seat Scarcity Visualization:**
  - Shows real-time remaining seat count (`{remaining} of {capacity} seats open`).
  - As seats fill, visual progress bar fills dynamically.
- **Sold Out Cohorts:**
  - When `enrolledCount == capacity`, the cohort pill displays a red `"Full"` badge.
  - The enroll CTA button becomes disabled (`cursor-not-allowed`) with text `"This batch is full"`.
  - If another upcoming batch is available, the system automatically selects the next open batch by default.

---

## 7. Enrollment & Payment Processing Flow (The Core Conversion Engine)

This is the most critical behavioral sequence in the application. It ensures zero duplicate payments and atomic cohort assignment.

```mermaid
sequenceDiagram
    autonumber
    actor U as Student
    participant C as Client (`/course/[slug]`)
    participant A as Server Action
    participant R as Razorpay Checkout Modal
    participant W as Webhook (`/api/webhooks/razorpay`)
    participant DB as Convex Database

    U->>C: Clicks "Enroll now" on Batch A
    C->>A: Validate user auth & seat availability
    A-->>C: Return Razorpay Order ID & Config
    C->>R: Open Razorpay UPI/Card Modal
    
    alt Payment Cancelled by User
        U->>R: Closes Modal without paying
        R-->>C: Modal Dismissed -> Stay on Course Page (No-op)
    else Payment Successful
        U->>R: Completes INR Payment
        R-->>C: Payment Success Callback (`razorpay_payment_id`)
        C->>C: Show "Verifying your payment..." loading state
        
        par Async Webhook Verification
            R->>W: POST Webhook (`order.paid`)
            W->>DB: Verify signature & execute atomic Enrollment mutation
            DB->>DB: Decrement seat capacity (`enrolledCount++`)
            DB->>DB: Insert record in `enrollments` table
        end
        
        C->>C: Redirect to `/dashboard/materials?courseId={id}&newEnrollment=true`
    end
```

### Step-by-Step Behavioral Requirements
1. **Enrollment Initiation:**
   - User clicks `"Enroll now"`.
   - System checks if user is logged in. If anonymous, redirect to `/sign-up?fallback_redirect_url=/course/[slug]`.
   - If user already holds an active enrollment for this course, display a modal: *"You are already enrolled in this course!"* with a button `"Go to Classroom"`.
2. **Checkout Modal Execution:**
   - Server mints an INR Razorpay order and opens the overlay modal.
   - If the user closes the modal without paying, the UI returns to normal interactive state. No draft enrollment is created.
3. **Payment Verification & Confirmation:**
   - Upon successful payment, the UI displays a full-screen or toast overlay: *"Payment confirmed! Preparing your classroom..."*
   - Once Convex confirms the `enrollments` record via WebSocket or polling, the user is redirected to `/dashboard/materials?courseId={id}`.
4. **WhatsApp Community Welcome Popup:**
   - If `newEnrollment=true` is present in the URL on first arrival at the dashboard, present an immediate modal popup:
     - **Title:** *"Welcome to the Cohort!"*
     - **Body:** *"Join your official batch WhatsApp group to get daily updates, class links, and connect with peers."*
     - **Buttons:** `"Join WhatsApp Group"` (opens link in new tab) and `"I'll join later"` (closes modal).
   - Once dismissed, store a flag in localStorage so the popup does not repeatedly appear on page refreshes.

---

## 8. Batch Assignment Flow

```mermaid
flowchart TD
    START["Enrollment Confirmed"] --> CHECK_BATCH{"Was Batch explicitly selected?"}
    CHECK_BATCH -->|Yes| CHECK_SEAT{"enrolledCount < capacity?"}
    CHECK_BATCH -->|No (Auto-Assign)| FIND_NEXT["Query Active Batches ordered by startDate"]
    
    FIND_NEXT --> CHECK_SEAT
    
    CHECK_SEAT -->|Yes| ASSIGN_BATCH["Insert Enrollment & Increment enrolledCount"]
    CHECK_SEAT -->|No (Batch Sold Out)| OVERFLOW["Assign to Next Upcoming Batch OR create Overflow Cohort"]
    
    OVERFLOW --> NOTIFY_USER["Send Email: 'Cohort Assigned - Schedule Updated'"]
    ASSIGN_BATCH --> GRANT_LMS["Grant immediate access to /dashboard/materials"]
```

---

## 9. Student Dashboard Flow (`/dashboard/*`)

The Student Dashboard is the operational center for learners. It unifies materials, live classes, recordings, and announcements under a single persistent sidebar.

```mermaid
flowchart TD
    DASH_ENTRY["Student enters `/dashboard` or `/dashboard/materials`"] --> LOAD_ENR["Convex Query: Get Active Enrollments"]
    
    LOAD_ENR --> HAS_ENR{"Enrollments Count > 0?"}
    HAS_ENR -->|No| EMPTY_DASH["Render Empty Dashboard State + 'Explore Courses' CTA"]
    HAS_ENR -->|Yes| SELECT_COURSE["Set active Course (default: most recently enrolled)"]
    
    SELECT_COURSE --> ROUTE_BRANCH{"Active Sub-Route"}
    
    ROUTE_BRANCH -->|`/dashboard/materials`| MAT_VIEW["Render Study Materials & Video PDFs"]
    ROUTE_BRANCH -->|`/dashboard/live`| LIVE_VIEW["Render Upcoming Live Class Sessions"]
    ROUTE_BRANCH -->|`/dashboard/recordings`| REC_VIEW["Render Past Class Recordings (YouTube)"]
    ROUTE_BRANCH -->|`/dashboard/announcements`| ANN_VIEW["Render Cohort & Platform Announcements"]
    
    MAT_VIEW & LIVE_VIEW & REC_VIEW & ANN_VIEW --> SWITCH_COURSE["Student selects different course in top CourseSelector"]
    SWITCH_COURSE --> SELECT_COURSE
```

### Dashboard Navigation & Multi-Course Rules
- **Course Selector:** When a student is enrolled in multiple courses, a persistent dropdown (`CourseSelector`) in the top navigation bar allows switching between courses.
- **URL Parameter Preservation:** Selecting a new course updates the URL to `?courseId={id}`. All sidebar tabs (`Materials`, `Live`, `Recordings`, `Announcements`) respect the currently active `courseId`.
- **Empty Enrollment State:** If an authenticated user without enrollments visits `/dashboard/*`, display an engaging empty state with an illustration, copy *"You haven't enrolled in a course yet"*, and a primary button *"Explore Marketplace"*.

---

## 10. Live Class Flow (`/dashboard/live` & `/dashboard/calendar`)

```mermaid
sequenceDiagram
    autonumber
    actor S as Student
    participant D as Dashboard (`/dashboard/live`)
    participant C as Convex Realtime DB
    participant M as Google Meet

    S->>D: Opens `/dashboard/live`
    D->>C: Query active `liveClasses` for enrolled batch
    C-->>D: Return schedule array (sorted by startTime)
    
    alt Class starts in > 15 minutes
        D->>D: Render "Starts in 2 hours" badge (Join button disabled)
    else Class starts in <= 15 minutes OR is currently running
        D->>D: Render pulsing "Live Now" badge
        D->>D: Enable "Join Google Meet" primary button
        S->>D: Clicks "Join Google Meet"
        D->>M: Open Google Meet URL in new browser tab
    end
```

---

## 11. Study Material Flow (`/dashboard/materials`)

```mermaid
flowchart LR
    MAT_LOAD["Load `/dashboard/materials`"] --> FETCH_MATS["Convex Query: Get studyMaterials ordered by 'order'"]
    
    FETCH_MATS --> CHECK_EMPTY{"Materials Count > 0?"}
    CHECK_EMPTY -->|No| MAT_EMPTY["Display: 'Materials will be published before session 1'"]
    CHECK_EMPTY -->|Yes| RENDER_MATS["Render Itemized Material Cards"]
    
    RENDER_MATS --> TYPE_CHECK{"Material Type"}
    TYPE_CHECK -->|"type == 'pdf'"| VIEW_PDF["Open PDF in Browser Preview / Download"]
    TYPE_CHECK -->|"type == 'video'"| VIEW_VID["Open Embedded Video Modal / Watch"]
    TYPE_CHECK -->|"type == 'link'"| VIEW_LINK["Open External Resource in new tab"]
```

---

## 12. Recording Flow (`/dashboard/recordings`)

1. **Behavior:** Lists all completed class sessions where the instructor has added a `recordingUrl` (YouTube Unlisted).
2. **Interactive Player:** Clicking a recording card opens an inline or modal video player.
3. **Empty State:** If no recordings are published yet, display: *"No class recordings published yet. Recordings appear within 24 hours of class completion."*

---

## 13. Calendar Flow (`/dashboard/calendar`)

```mermaid
flowchart TD
    CAL_LOAD["Open `/dashboard/calendar`"] --> FETCH_EVENTS["Convex Query: `api.calendar.getStudentEvents(month)`"]
    FETCH_EVENTS --> RENDER_CAL["Render FullCalendar Grid (Month/Week View)"]
    
    RENDER_CAL --> CLICK_PILL["Student Clicks Event Pill in Calendar Day"]
    CLICK_PILL --> SHOW_POPOVER["Open Class Details Popover (Title, Time, Meeting Link)"]
    
    SHOW_POPOVER --> CLICK_JOIN["Click 'Join Google Meet'"]
    CLICK_JOIN --> OPEN_MEET["Launch Google Meet in New Tab"]
```

---

## 14. Announcement Flow (`/dashboard/announcements`)

- **Admin Publishing:** Admin creates an announcement scoped to a specific `batchId` (via `/admin/batches/[batchId]/announcements` or global Quick Create) or platform-wide (`batchId: null` via `/admin/announcements`). Supports Draft, Scheduled, and Published states with attachments, email toggles, WhatsApp toggles, and push notifications.
- **Realtime Delivery:** The announcement appears immediately on all connected student dashboards via Convex WebSocket push.
- **Email Broadcast:** Concurrently, Resend emails the announcement text to all enrolled students in the cohort.

---

## 15. Review & Testimonial Submission Flow

```mermaid
flowchart LR
    STUD["Student on `/dashboard`"] --> CLICK_REV["Click 'Write a Review' Modal"]
    CLICK_REV --> SUBMIT["Submit 1-5 Stars + Feedback Text"]
    SUBMIT --> MUT_SUB["Convex Mutation: `reviews.submitReview` (isApproved: false)"]
    
    MUT_SUB --> UI_CONFIRM["Show Toast: 'Thank you! Your review has been submitted for moderation.'"]
    
    MUT_SUB --> ADMIN_Q["Admin Review Queue (`/admin/reviews`)"]
    ADMIN_Q --> ADMIN_APP["Admin Clicks 'Approve'"]
    ADMIN_APP --> UPDATE_DB["UPDATE reviews SET isApproved = true"]
    UPDATE_DB --> LIVE_MKT["Review appears live on `/course/[slug]` and `/`"]
```

---

## 16. WhatsApp Community Integration Flow

- **Payment Success Popup:** Triggered immediately after checkout when `?newEnrollment=true` is present.
- **Persistent Access:** A student can always find their official WhatsApp cohort link under `/dashboard/announcements` or in the top banner of `/dashboard/materials`.
- **Batch-Specific Links:** Each cohort (`batchId`) stores its own dedicated WhatsApp group invite link, ensuring students only join their peer group.

---

## 17. Student Profile & Settings Flow (`/dashboard/settings`)

```mermaid
flowchart TD
    PROF_ENTRY["Navigate to `/dashboard/settings`"] --> LOAD_FORM["Load Profile Form (React Hook Form + Zod)"]
    
    LOAD_FORM --> CHANGE_NAME["Edit Display Name"]
    LOAD_FORM --> CHANGE_AVATAR["Upload New Profile Photo via UploadThing"]
    
    CHANGE_AVATAR --> S3_UP["Direct-to-S3 Multipart Upload"]
    S3_UP --> URL_RET["Return CDN Image URL"]
    
    CHANGE_NAME & URL_RET --> CLICK_SAVE["Click 'Save Changes'"]
    CLICK_SAVE --> CONVEX_PATCH["Convex Mutation: `users.updateProfile({ name, avatarUrl })`"]
    CONVEX_PATCH --> TOAST["Show Success Toast & Update Header Avatar Instantly"]
```

---

## 18. Admin Platform Management Flow (`/admin/*`)

The Admin suite provides complete CRUD control over the platform catalog, cohorts, students, and CMS. The Admin Dashboard (`/admin/dashboard`) is the operational home for administrators—acting as an Admin Command Center and the starting point for all admin workflows rather than only an analytics page.

```mermaid
flowchart TD
    ADMIN_LOGIN["Admin Login"] --> DASH["Admin Command Center (`/admin/dashboard`)"]
    DASH --> NAV_ADMIN{"Admin Sidebar Navigation"}
    
    NAV_ADMIN -->|`/admin/dashboard`| MNG_DASH["Platform KPIs, Revenue, Student/Course Stats, Upcoming Live Sessions"]
    NAV_ADMIN -->|`/admin/courses`| MNG_COURSES["Create, Edit, Publish, or Archive Courses"]
    NAV_ADMIN -->|`/admin/batches`| MNG_BATCHES["Batch Management -> Dedicated Batch Workspaces (`/admin/batches/[batchId]/overview`)"]
    NAV_ADMIN -->|`/admin/students`| MNG_STUDENTS["View Enrollments, Manually Enroll/Drop/Transfer Students"]
    NAV_ADMIN -->|`/admin/payments`| MNG_PAYMENTS["Audit Transactions, Refunds, and Razorpay Orders"]
    NAV_ADMIN -->|`/admin/reviews`| MNG_REVIEWS["Approve, Reject, or Feature Student Reviews"]
    NAV_ADMIN -->|`/admin/cms`| MNG_CMS["Modify Landing Page Banners, Hero copy, and FAQ"]
    NAV_ADMIN -->|`/admin/media`| MNG_MEDIA["Media Library -> Central Asset Manager (UploadThing)"]
    NAV_ADMIN -->|`/admin/announcements`| MNG_ANNOUNCE["Platform & Cohort Announcements Feed"]
    NAV_ADMIN -->|`/admin/analytics`| MNG_ANALYTICS["Deep Dive Platform & Cohort Analytics"]
    NAV_ADMIN -->|`/admin/settings`| MNG_SETTINGS["Platform-Wide Administrative Settings"]

    DASH --> QUICK_CREATE["Globally Accessible Quick Create (Course, Batch, Announcement, Media)"]
```

### Admin Dashboard & Operational Hub (`/admin/dashboard`)
1. **Command Center Behavior:**
   - **Operational Hub Loop:** `Admin Login ↓ Dashboard ↓ Choose Module ↓ Perform Action ↓ Return Dashboard`.
   - After login, administrators land on `/admin/dashboard`, which serves as the starting point for all admin workflows.
2. **Dashboard Contents:**
   - **Platform KPIs & Financials:** Total Revenue, Active Students, Course Statistics, Student Statistics, Completion Rate, and Revenue/Enrollments trends.
   - **Operational Insights:** Recent Activity feed, Course Popularity progress meters, and Upcoming Live Sessions schedule.
   - **Quick Actions:** Dedicated action triggers for `Create Course`, `Create Batch`, `Announcements`, and `Media Upload`.
3. **Globally Accessible Quick Create:**
   - A persistent `Quick Create` trigger is globally accessible across every page in the `/admin/*` suite.
   - Allows instant initiation of: `Create Course`, `Create Batch`, `Announcement`, and `Upload Media` without losing context.

### Batch Management & Dedicated Batch Workspace (`/admin/batches`)
The Batch Management page (`/admin/batches`) remains a collection of batch cards. However, clicking a batch card now navigates directly to a dedicated **Batch Workspace** at `/admin/batches/[batchId]/overview` (NOT a modal and NOT an expandable card). The Batch Workspace is the primary operational workspace for administrators managing a specific cohort.

```mermaid
flowchart LR
    ADMIN["Admin"] --> BATCH_MNG["Batch Management (`/admin/batches`)"]
    BATCH_MNG --> CLICK_CARD["Click Batch Card"]
    CLICK_CARD --> WORKSPACE["Batch Workspace (`/admin/batches/[batchId]/*`)"]
    
    WORKSPACE --> TAB_OVERVIEW["Overview"]
    WORKSPACE --> TAB_STUDENTS["Students"]
    WORKSPACE --> TAB_CALENDAR["Calendar"]
    WORKSPACE --> TAB_MATERIALS["Study Materials"]
    WORKSPACE --> TAB_RECORDINGS["Recordings"]
    WORKSPACE --> TAB_ANNOUNCEMENTS["Announcements"]
    WORKSPACE --> TAB_SETTINGS["Settings"]
    WORKSPACE --> TAB_ACTIVITY["Activity"]
```

### Persistent Batch Header & Navigation Tabs
Every page within a Batch Workspace shares a **persistent header** and **shared tabbed navigation**. Only the content below the tabs changes; the header remains constant across all tab views.
- **Persistent Batch Header Contents:** Displays `Batch Name`, `Status` (`upcoming` | `live` | `completed`), `Seats` filled/remaining, `Revenue` generated, parent `Course` badge, batch `Date` range, `WhatsApp Group` link, `Google Meet` link, `Publish Changes` button, and `Edit Batch` trigger.
- **Persistent Workspace Tabs & Behaviors:**
  1. **Overview (`/admin/batches/[batchId]/overview`):** The operational command center where administrators begin batch management. Contains cohort KPIs, Next Live Session card, Student Progress bars, Attendance Overview, Recent Activity, Quick Actions, Batch Overview details, and Quick Resources (GitHub Repo, Notion Page, Discord, Drive Folder).
  2. **Students (`/admin/batches/[batchId]/students`):** Dedicated page for cohort learner management. Supports Search Students, Filter Students, View Student Profile (Student Detail Drawer), Remove Student, Transfer Student, Export CSV, Invite Student, and Bulk Actions.
  3. **Calendar (`/admin/batches/[batchId]/calendar`):** Dedicated scheduling page. Supports Create Class, Edit Class, Delete Class, Recurring Classes, Google Meet Links, Drag and Drop rescheduling, and Month / Week / Day / Agenda views. Clicking any class event opens an interactive edit panel.
  4. **Study Materials (`/admin/batches/[batchId]/materials`):** Supports Upload Notes, Organize Modules, Folders, Preview Files, Replace Files, Delete Files, Visibility Toggle, Search, and Filter.
  5. **Recordings (`/admin/batches/[batchId]/recordings`):** Supports Upload Recording, YouTube Link insertion, Preview, Replace, Delete, Publish toggle, and per-video Analytics.
  6. **Announcements (`/admin/batches/[batchId]/announcements`):** Supports Create Announcement with Draft, Scheduled, and Published states, Attachments, Email Toggle, WhatsApp Toggle, and Push Notifications.
  7. **Settings (`/admin/batches/[batchId]/settings`):** Configures Batch Details, Capacity limits, Enrollment toggles, Communication links, Permissions, and a Danger Zone for cohort archival/deletion.
  8. **Activity (`/admin/batches/[batchId]/activity`):** Audit Timeline tracking Batch Changes, Student Joined, Student Removed, Announcement Published, Recording Uploaded, Attendance updates, and Settings Updated.

### Admin Operational Behavior
1. **Course Publishing:**
   - Setting a course to `isActive: true` immediately broadcasts it to the `/courses` marketplace.
   - Archiving a course (`isActive: false`) hides it from the catalog but preserves LMS access for currently enrolled students.
2. **Manual Student Enrollment:**
   - Admins can manually grant course access to any user email via `/admin/students` or from the Batch Workspace Students tab (`/admin/batches/[batchId]/students`), bypassing Razorpay checkout.
3. **Class Scheduling & Recording Entry:**
   - Admins create `liveClasses` records with start/end UTC timestamps and Google Meet URLs directly in `/admin/batches/[batchId]/calendar`.
   - After class, admins paste the YouTube Unlisted URL into the session record in `/admin/batches/[batchId]/recordings`, immediately publishing it to `/dashboard/recordings`.

---

## 19. Landing Page CMS Flow (`/admin/cms`)

1. **Admin Action:** Admin edits hero headline, subheadline, or announcement banner in `/admin/cms` and clicks "Save".
2. **Database Mutation:** `api.admin.cms.updateSection` updates the `landingPage` JSON document in Convex.
3. **Cache Invalidation:** Triggers Redis deletion (`redis.del('cache:cms:landing')`).
4. **Instant Site Update:** The very next visitor to `/` sees the updated content without requiring a frontend Vercel redeployment.

---

## 20. Media Library Flow (`/admin/media`)

- **Upload:** Central library supporting drag-and-drop UploadThing uploads for images (`.webp`, `.jpg`), videos, and course PDFs.
- **Reuse:** Downloaded URLs can be attached to any course syllabus, batch material, or CMS banner.

---

## 21. Payment Verification & Edge Case Behavioral Reference

```mermaid
stateDiagram-v2
    [*] --> CheckoutInitiated
    CheckoutInitiated --> RazorpayModalOpened
    
    RazorpayModalOpened --> CheckoutCancelled: User Closes Modal
    CheckoutCancelled --> [*]: Stay on Course Page (No-op)
    
    RazorpayModalOpened --> PaymentProcessing: User Completes Payment
    
    state PaymentProcessing {
        [*] --> SignatureVerification
        SignatureVerification --> ValidSignature: HMAC-SHA256 Match
        SignatureVerification --> InvalidSignature: Signature Mismatch
        InvalidSignature --> SecurityAlert: Return HTTP 400 & Alert Sentry
        
        ValidSignature --> IdempotencyCheck: Check Redis Key
        IdempotencyCheck --> DuplicateWebhook: Key Exists
        DuplicateWebhook --> IgnoreSuccess: Return HTTP 200 (No-op)
        
        IdempotencyCheck --> AtomicEnrollment: Key Created
        AtomicEnrollment --> CapacityCheck
        CapacityCheck --> SeatAvailable: seats > 0
        CapacityCheck --> BatchSoldOut: seats == 0
        
        SeatAvailable --> CreateEnrollmentRecord
        BatchSoldOut --> AssignOverflowBatch
    }
    
    CreateEnrollmentRecord --> RedirectToClassroom: Send Welcome Email
    AssignOverflowBatch --> RedirectToClassroom: Send Overflow Notification Email
```

---

## 22. Upstash Redis Caching in the User Journey

Upstash Redis participates silently as a high-speed cache layer to accelerate page loads and enforce rate limits.

```mermaid
flowchart LR
    REQ["User Request (`/` or `/courses`)"] --> REDIS_CHK{"Key in Upstash Redis?"}
    REDIS_CHK -->|Hit| RETURN_CACHE["Return sub-50ms Cached Payload"]
    REDIS_CHK -->|Miss| QUERY_CONVEX["Fetch from Convex -> Store in Redis -> Return"]
    
    MUT["Admin or Payment Mutation Commits"] --> REDIS_DEL["Delete associated Redis Cache Keys"]
```

> [!CAUTION]
> **Architectural Rule:** Upstash Redis never replaces Convex. If Redis fails or times out (`>800ms`), the system automatically fails-open and reads directly from Convex, ensuring **zero user-facing downtime**.

---

## 23. Comprehensive Permissions & Authorization Matrix

| Route / Action | Visitor | Student (Unenrolled) | Student (Enrolled) | Admin | Super Admin |
| :--- | :---: | :---: | :---: | :---: | :---: |
| View `/`, `/courses`, `/faq` | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| View Course Details `/course/[slug]` | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Initiate Razorpay Checkout | ✅ Yes* | ✅ Yes | ❌ No** | ✅ Yes | ✅ Yes |
| Access `/dashboard` (Empty State) | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Access `/dashboard/materials` (Course X) | ❌ No | ❌ No | ✅ Yes (Course X) | ✅ Yes (All) | ✅ Yes (All) |
| Join Google Meet (`/dashboard/live`) | ❌ No | ❌ No | ✅ Yes (Course X) | ✅ Yes (All) | ✅ Yes (All) |
| Submit Course Review | ❌ No | ❌ No | ✅ Yes (Course X) | ✅ Yes | ✅ Yes |
| Access `/admin/*` Suite | ❌ No | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| Mutate `courses`, `batches`, `cms` | ❌ No | ❌ No | ❌ No | ✅ Yes | ✅ Yes |

*\*Visitors initiating checkout are first redirected to Sign-Up.*
*\*\*Students already enrolled in Course X receive a modal directing them to their Classroom.*

---

## 24. Exhaustive Empty States Inventory

Every view in VibeLogic Studio must present an intentional, beautifully designed empty state rather than a blank screen or technical zero-count message.

| Location | Trigger Condition | UI Title & Copy | Action CTA |
| :--- | :--- | :--- | :--- |
| `/courses` | Search query or filter matches 0 courses | *"No courses found matching your criteria."* | `"Clear Filters"` (Resets URL params) |
| `/dashboard` | Authenticated student has 0 active enrollments | *"Your classroom is empty."* / *"You haven't enrolled in any cohorts yet."* | `"Explore Course Catalog"` → `/courses` |
| `/dashboard/materials` | Admin hasn't published study materials for cohort yet | *"Study materials are on the way."* / *"Documents and PDFs will be published here prior to Session 1."* | `"View Live Schedule"` → `/dashboard/live` |
| `/dashboard/recordings` | 0 recordings published for enrolled cohort | *"No class recordings available yet."* / *"Video recordings appear within 24 hours of each live class."* | `"Check Next Live Class"` → `/dashboard/live` |
| `/dashboard/calendar` | 0 live classes scheduled for selected month | *"No classes scheduled for this month."* | `"Switch to Current Month"` |
| `/dashboard/announcements` | 0 batch or platform announcements | *"All caught up!"* / *"No announcements have been posted for your batch."* | None (Informational badge) |
| `/course/[slug]` (Reviews) | 0 approved reviews for course | *"Be the first to review!"* (Shown only to enrolled students; hidden from visitors) | `"Write a Review"` |

---

## 25. System Error States & User Recovery Paths

| Error State | System Cause | User-Facing Message | User Recovery Action |
| :--- | :--- | :--- | :--- |
| **404 Course Not Found** | `/course/[slug]` slug does not exist in Convex | *"We couldn't find the course you're looking for."* | `"Browse All Courses"` → `/courses` |
| **401 Unauthorized** | Session JWT expired or missing on protected route | *"Please log in to continue."* | Redirects to `/sign-in?redirect_url={path}` |
| **403 Forbidden** | Student attempts to navigate to `/admin/*` | *"You do not have administrative access."* | `"Go to Student Dashboard"` → `/dashboard/materials` |
| **Payment Failed** | Razorpay UPI/Card transaction declined by bank | *"Payment declined by your financial institution."* | `"Try Another Payment Method"` (Reopens Razorpay modal) |
| **Cohort Sold Out** | `enrolledCount == capacity` during checkout race | *"This cohort just filled up!"* | `"Enroll in Next Upcoming Cohort"` |
| **Upload Failed** | S3 / UploadThing network drop during file upload | *"File upload interrupted."* | `"Retry Upload"` (Auto-resumes chunked upload) |

---

## 26. Loading States & Visual Feedback

To maintain a responsive, Apple-calm aesthetic, VibeLogic Studio forbids generic spinners in favor of layout-matched skeleton loaders and instant optimistic transitions:

- **Landing Page & Marketplace (`/`, `/courses`):** Animated skeleton cards matching exact aspect ratios (`aspect-[4/3]`) while Redis/Convex queries resolve.
- **Course Details (`/course/[slug]`):** Editorial skeleton placeholders for hero copy and sticky enrollment panel.
- **Student Dashboard (`/dashboard/*`):** Sidebar renders instantly; content area displays subtle shimmer blocks for study material cards and calendar grids.
- **Interactive Buttons:** Pressing `"Enroll Now"`, `"Save Profile"`, or `"Submit Review"` immediately triggers a micro-animation (`scale-[0.98]`) and renders an inline progress indicator without freezing the browser UI.

---

## 27. Notification & Feedback Taxonomy

| Type | Visual Presentation | Trigger Events |
| :--- | :--- | :--- |
| **Success (Green)** | Top-right floating glassmorphic toast with checkmark | Profile updated, review submitted, payment confirmed, admin course published. |
| **Warning (Amber)** | Inline callout banner with alert icon | Cohort filling fast (`< 5 seats left`), session starts in 15 minutes. |
| **Error (Red)** | Top-right floating toast or modal with retry option | Payment declined, file upload failed, network disconnection. |
| **Information (Blue)** | Subtle pill badge or inline notification | New batch announcement published, new study material added. |

---

## 28. Future Flow Placeholders (Architectural Roadmap)

```mermaid
flowchart LR
    CURR["VibeLogic Studio v1.0 Core Flows"] --> F1["1. Automated Certificate Flow"]
    CURR --> F2["2. Homework & Assignment Submission Flow"]
    CURR --> F3["3. Interactive Quiz & Assessment Flow"]
    CURR --> F4["4. AI Tutor Bot (RAG Vector Search) Flow"]
    CURR --> F5["5. Affiliate Referral Commission Flow"]
    CURR --> F6["6. Mobile App API Authentication Flow"]
```

1. **Automated Certificate Flow:**
   - *Future Behavior:* When student progress reaches 100%, system renders custom PDF certificate via background worker and unlocks `"Download Certificate"` button in `/dashboard`.
2. **Assignment Submission Flow:**
   - *Future Behavior:* Students upload homework `.zip` or `.pdf` on lesson pages; instructors review and grade in `/admin/submissions`.
3. **Interactive Quiz Flow:**
   - *Future Behavior:* Multiple-choice assessment checkpoints required before progressing to subsequent course modules.
4. **AI Tutor Assistant Flow:**
   - *Future Behavior:* Floating AI classroom assistant answering technical course questions using vectorized syllabus embeddings.
5. **Affiliate Referral Flow:**
   - *Future Behavior:* Students generate custom referral links (`?ref=user_id`); successful peer enrollments credit wallet balance.

---

## 29. Summary for AI Agents & Developers

When implementing any page, component, or server action in VibeLogic Studio:
1. **Check Role Permissions First:** Ensure the route or action enforces the boundaries defined in **Section 23**.
2. **Handle Every Empty State:** Never render a blank screen; implement the exact empty state copy and CTAs defined in **Section 24**.
3. **Respect Scarcity & Concurrency:** All course enrollments must verify cohort seat capacity atomically as specified in **Section 7**.
4. **Fail-Open on Cache:** Never block a user if Upstash Redis is down; always fall back to Convex as specified in **Section 22**.
