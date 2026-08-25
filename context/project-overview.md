# Project Overview

## About the Project

VibeLogic Studio is a production-ready AI-first EdTech SaaS platform. It provides a complete learning ecosystem where students can discover courses, enroll, attend live classes, access study materials, watch recordings, and manage their learning experience, while administrators manage every aspect of the platform through a powerful CMS and admin dashboard.

The entire process is tracked on a dashboard with PostHog-powered analytics and a recent activity feed.

---

## The Problem It Solves

Managing online education often involves scattered learning platforms, manual student management, difficult batch management, and multiple disconnected tools. This results in a poor learning experience for students and a lack of centralized management for administrators.

VibeLogic Studio solves this by unifying the entire educational workflow. From landing page to course delivery, the platform centralizes enrollments, automatic batch assignments, live class scheduling, and media delivery. Students enjoy a seamless, high-quality learning experience, while administrators can operate the entire business from a single, powerful dashboard.

---

## Pages

```
/                  → Landing Page
/login             → Auth page (Clerk)
/register          → Registration page
/marketplace       → Course Marketplace
/course/[slug]     → Course Details page
/checkout          → Checkout page
/dashboard         → Student dashboard home
/calendar          → Student calendar for live classes
/live              → Live Classes overview
/recordings        → Class Recordings
/materials         → Study Materials
/profile           → Student Profile
/settings          → User Settings
/admin             → Admin dashboard home
/admin/courses     → Course Management
/admin/batches     → Batch Management
/admin/students    → Student Management
/admin/reviews     → Review Management
/admin/media       → Media Library
/admin/cms         → Landing Page CMS
/admin/settings    → Admin Settings
```

---

## Navigation

**Marketing site:**
```
Home    Courses    About    Reviews    FAQ    Dashboard / Login
```

**Student dashboard:**
```
Dashboard    Calendar    Live Classes    Recordings    Study Materials    Announcements    Profile    Settings
```

**Admin dashboard:**
```
Dashboard    Courses    Batches    Students    Payments    Reviews    Landing Page CMS    Media Library    Settings
```

---

## Core User Flow

### Landing Page
- Hero section, featured courses, testimonials, and FAQ.
- Logged in users → redirect to student or admin dashboard.
- Logged out users → can browse courses or sign in.

### Authentication
- User signs up via Clerk auth (Email, Google OAuth).
- On login → redirect to `/dashboard` (or `/admin` based on role).

### Marketplace
- User views all active courses.
- Filters and search bar available.
- Displays basic course info, price, and next batch date.

### Course Details
- Detailed course syllabus, reviews, and instructor info.
- Shows available upcoming batches with remaining seat counts.
- "Enroll Now" button available if seats remain.

### Checkout & Payment
- User selects a batch and clicks Enroll Now.
- Razorpay modal opens for payment.
- Successful payment triggers webhook for verification.

### Automatic Batch Assignment
- If the user buys a course without selecting a batch, the system automatically assigns them to the earliest upcoming batch with available seats.

### Dashboard Access
- Student is granted access to the internal LMS only after successful enrollment.
- Displays enrolled courses, progress, and recent announcements.

### Live Classes & Recordings
- Calendar displays scheduled Google Meet links for enrolled batches.
- Past sessions appear in the Recordings tab (YouTube Unlisted embeds).

### Study Materials & Announcements
- PDFs, assignments, and notes available per course.
- Announcements broadcasted by admins appear on the dashboard feed.

### Profile & Settings
- Manage personal details, avatar, and notification preferences.

### Admin Workflow
- Admin manages courses, batches, and student overrides.
- Handles review moderation and announcements.

### Landing Page CMS
- Admin can dynamically toggle visibility of hero sections, banners, and promotional content on the public landing page.

---

## Enrollment Flow

1. Landing Page
2. ↓
3. Course Marketplace
4. ↓
5. Course Details
6. ↓
7. Authentication (if required)
8. ↓
9. Checkout
10. ↓
11. Razorpay Payment
12. ↓
13. Automatic Batch Assignment
14. ↓
15. WhatsApp Group Invitation
16. ↓
17. Student Dashboard

If no upcoming batch exists, display "New batch starting soon" instead of dashboard content.

---

## Batch Logic

- **Batch Capacity**: Hard limit on maximum allowed students per batch.
- **Available Seats**: Calculated as Capacity minus Enrolled Count.
- **Seat Reservation**: Confirmed immediately upon successful payment webhook.
- **Automatic Assignment**: System finds the earliest upcoming batch if the user skips selection.
- **Upcoming Batch**: Future start date, seats available.
- **Running Batch**: Currently active.
- **Completed Batch**: Past end date.
- **Full Batch**: Capacity reached. No new enrollments allowed.

Students can only access course content after successful enrollment to a batch.

---

## Student Dashboard

- **Calendar**: FullCalendar integration displaying live classes.
- **Upcoming Classes**: List of imminent sessions.
- **Google Meet Links**: Click-to-join buttons for scheduled classes.
- **Recordings**: Embedded YouTube Unlisted videos of past classes.
- **Study Materials**: Downloadable PDFs and resources.
- **Announcements**: Broadcast messages from instructors.
- **Profile**: Personal information management.
- **Settings**: Email and notification preferences.
- **Certificates**: Future-ready module for course completion certificates.

---

## Admin Dashboard

- **Dashboard**: High-level stats (revenue, active students, active courses).
- **Course Management**: Create and edit courses.
- **Batch Management**: Create batches, set capacities, manage dates.
- **Student Management**: View progress, handle manual enrollments/drops.
- **Landing Page CMS**: Toggle promotional content and banners.
- **Review Management**: Approve/reject student testimonials.
- **Media Library**: Upload and manage files via UploadThing.
- **Announcements**: Send broadcasts to specific batches.
- **Payments**: View transaction history.
- **Analytics**: Key performance indicators.
- **Settings**: Platform configurations.

---

## Data Architecture

- **Users**: Managed via Clerk, synced to Convex `users` collection.
- **Courses**: Core offering data.
- **Batches**: Instances of courses with dates and capacities.
- **Enrollments**: The bridge between a User, a Course, and a Batch.
- **Payments**: Transaction records linked to Razorpay.
- **Reviews**: User-generated feedback requiring admin approval.
- **Announcements**: Messages linked to specific batches or global.
- **Study Materials**: Resources linked to courses.
- **Recordings**: Video URLs linked to batches.
- **Landing Page Content**: CMS configurations.
- **Media**: Uploaded assets (images, PDFs) references.
- **Settings**: Global app configs.

This structure represents high-level data ownership. All backend data resides in Convex.

---

## Features In Scope

- Landing Page
- Authentication
- Course Marketplace
- Checkout
- Student Dashboard
- Admin Dashboard
- Course Management
- Batch Management
- Landing Page CMS
- Media Library
- Study Materials
- Recordings
- Calendar
- Announcements
- Review Management
- Automatic Batch Assignment
- WhatsApp Group Assignment
- Analytics
- Responsive UI

---

## Features Out of Scope

- Native mobile apps
- Multi-tenant organizations
- Offline learning
- AI tutor
- Discussion forums
- Assignments
- Online exams
- Certificate verification portal
- Marketplace for instructors
- Affiliate system
- Advanced CRM
- Live chat
- Video hosting infrastructure (using YouTube)
- Building custom payment gateway (using Razorpay)
- Building custom authentication (using Clerk)
- Anything already handled by third-party integrations

---

## Analytics

Events tracked via PostHog:

```
landing_cta_clicked
course_viewed
course_enrolled
payment_started
payment_success
payment_failed
batch_assigned
dashboard_opened
live_class_joined
recording_viewed
study_material_downloaded
announcement_opened
review_published
```

---

## Target User

- Students
- Working professionals
- College students
- Career switchers
- Developers
- Anyone purchasing structured online courses
- Administrators managing courses and batches

---

## Success Criteria

- Students can discover and purchase courses easily.
- Enrollment takes only a few minutes.
- Batch assignment is automatic.
- Students immediately receive dashboard access after successful enrollment.
- Live classes are easily accessible.
- Study materials are organized.
- Admins can manage the platform without developer intervention.
- Landing page content can be updated through CMS.
- Overall experience is fast, responsive, and intuitive.

---

## Technology References

- **Backend** → Convex
- **Cache** → Upstash Redis
- **Authentication** → Clerk
- **Payments** → Razorpay
- **Uploads** → UploadThing
- **Emails** → Resend
- **Analytics** → PostHog
- **Monitoring** → Sentry
- **Calendar** → FullCalendar
- **Meetings** → Google Meet
- **Recordings** → YouTube (Unlisted)
- **Animations** → GSAP + Framer Motion
- **UI** → Tailwind CSS + shadcn/ui

---

## Engineering Philosophy

This document describes WHAT the product is and HOW users interact with it.

It serves as the definitive guide to the product's scope and behavior. Implementation details, code structure, and technical execution are covered in `architecture.md`, `build-plan.md`, and `code-standards.md`.
