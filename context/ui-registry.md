# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

The single source of truth for the design language is the VibeLogic Studio UI Design System.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following the design system tokens, then add it here

After building any component — update this file with the component name, purpose, file path, variants, states, usage rules, and tokens used.

---

## Design System

### Color System
- **Primary:** `#FF5A1F`
- **Secondary:** `#0D0D0D`
- **Accent:** `#FF5A1F`
- **Background:** `#FAF7F3`
- **Surface:** `#FFFFFF`
- **Border:** `#E6E2DC`
- **Text Primary:** `#0D0D0D`
- **Text Secondary:** `#525252`
- **Muted Text:** `#8A8A8A`
- **Success:** `#22C55E`
- **Warning:** `#F59E0B`
- **Error:** `#EF4444`
- **Info:** `#3B82F6`

### Typography (Inter)
- **Display:** 56px, 700, 110% (Hero / Big Headlines)
- **H1:** 40px, 700, 120% (Section Titles)
- **H2:** 32px, 700, 120% (Sub Section Titles)
- **H3:** 24px, 600, 130% (Card Titles)
- **H4:** 16px, 600, 140% (Small Titles)
- **Body Large:** 16px, 400, 160% (Paragraph / Content)
- **Body Medium:** 14px, 400, 160% (Supporting Text)
- **Body Small:** 13px, 400, 150% (Descriptions / Notes)
- **Caption:** 13px, 400, 140% (Captions / Meta)
- **Button:** 14px, 600, 140% (Buttons)
- **Label:** 11px, 600, 140% (Labels / Inputs)

### Grid & Spacing
- **Container Width:** 1280px
- **Columns:** 12
- **Margin:** 24px
- **Gutter:** 24px
- **Spacing Scale:** 4px base (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160)

### Border Radius
- **Scale:** 2px, 4px, 8px, 12px, 16px, 24px, 32px, 9999px (full)

### Shadows
- **Small:** `0px 1px 2px rgba(0,0,0,0.05)`
- **Medium:** `0px 4px 8px rgba(0,0,0,0.08)`
- **Large:** `0px 12px 24px rgba(0,0,0,0.12)`
- **Extra Large:** `0px 20px 40px rgba(0,0,0,0.16)`

---

## Components

### BrandLogo
**Purpose:** Displays the VibeLogic Studio brand mark and text.
**File Path:** `components/ui/brand-logo.tsx`
**Variants:** Default (Icon + Text), Icon Only.
**States:** Default.
**Usage Rules:** Used in Navbar and Footer.
**Tokens Used:** Primary Color, Text Primary, Inter 700.

---

### PrimaryButton
**Purpose:** Main call to action (e.g., "Get started").
**File Path:** `components/ui/button.tsx`
**Variants:** Small, Medium, Large.
**States:** Default, Hover, Active, Disabled, Loading.
**Usage Rules:** One per view/section.
**Tokens Used:** Primary (`#FF5A1F`), Border Radius 9999px (full).

---

### SecondaryButton
**Purpose:** Alternative actions.
**File Path:** `components/ui/button.tsx`
**Variants:** Small, Medium, Large.
**States:** Default, Hover, Active, Disabled.
**Usage Rules:** Next to PrimaryButton.
**Tokens Used:** Secondary (`#0D0D0D`), Border Radius 9999px.

---

### OutlineButton / GhostButton / IconButton
**Purpose:** Low priority actions and contextual triggers.
**File Path:** `components/ui/button.tsx`
**States:** Default, Hover, Active, Disabled.
**Tokens Used:** Border (`#E6E2DC`), Text Secondary (`#525252`).

---

### Input
**Purpose:** Standard text entry.
**File Path:** `components/ui/input.tsx`
**Variants:** Default, Password, With Icon.
**States:** Default, Focus, Success, Error, Disabled.
**Usage Rules:** Always pair with a Label.
**Tokens Used:** Border (`#E6E2DC`), Surface (`#FFFFFF`), Focus Ring (Primary).

---

### Chip / Tag / Badge
**Purpose:** Categorization, status indication, and filtering.
**File Path:** `components/ui/chip.tsx`
**Variants:** Category, Status, Filter, Badge, Pill, Tag.
**States:** Default, Selected.
**Usage Rules:** Use status chips (Active, In Progress, Completed, Cancelled) for course/batch status.
**Tokens Used:** Success, Warning, Error, Info, Border Radius 9999px.

---

### CourseCard
**Purpose:** Display course preview in the marketplace.
**File Path:** `components/courses/course-card.tsx`
**Variants:** Grid, List.
**States:** Default, Hover.
**Composition Rules:** Image on top (or left), Title, Instructor, Status Chip, Price, Enrollment Button.
**Tokens Used:** Surface (`#FFFFFF`), Border (`#E6E2DC`), Shadow Small (Hover: Medium), Border Radius 16px.

---

### Navbar
**Purpose:** Top-level global navigation.
**File Path:** `components/layout/navbar.tsx`
**Variants:** Marketing, Authenticated.
**Composition Rules:** BrandLogo (left), Links (center), PrimaryButton / Avatar (right).
**Tokens Used:** Surface (`#FFFFFF`), Border Bottom (`#E6E2DC`).

---

### Footer
**Purpose:** Bottom-level global navigation and branding.
**File Path:** `components/layout/footer.tsx`
**Composition Rules:** BrandLogo, tagline, copyright, social icons.
**Tokens Used:** Background (`#FAF7F3`), Text Secondary (`#525252`).

---

### Tabs
**Purpose:** Section navigation within a page (e.g., Course Details).
**File Path:** `components/ui/tabs.tsx`
**States:** Default, Selected, Hover.
**Usage Rules:** Used for switching between Overview, Features, Syllabus, Reviews.
**Tokens Used:** Text Primary, Muted Text, Primary underline (Selected).

---

### Modal
**Purpose:** Focused interactions and confirmations.
**File Path:** `components/ui/modal.tsx`
**Variants:** Dialog, Alert.
**Composition Rules:** Overlay, Content Box, Title, Message, Cancel Button, Confirm Button.
**Tokens Used:** Surface (`#FFFFFF`), Shadow Extra Large, Border Radius 16px.

---

### MarketplaceFilters

File: `components/courses/MarketplaceFilters.tsx`
Last updated: 2026-07-25

| Property | Class |
| --- | --- |
| Background | `bg-surface` |
| Border | `border border-border` |
| Border radius | `rounded-2xl` outer, `rounded-lg` controls |
| Text - primary | `text-text-primary` |
| Text - secondary | `text-text-secondary` |
| Spacing | `p-4`, `gap-3` |
| Hover state | `hover:opacity-90 active:scale-[0.97]` |
| Shadow | `shadow-sm` |
| Accent usage | `focus-within:ring-primary`, `bg-primary` submit action |

**Pattern notes:** Forms place labels above controls, use surface-filled border-token controls, and submit filters through URL search parameters.

### BatchSelector

File: `components/courses/BatchSelector.tsx`
Last updated: 2026-07-25

| Property | Class |
| --- | --- |
| Background | `bg-surface`; availability panel `bg-background` |
| Border | `border border-border` |
| Border radius | `rounded-2xl` outer, `rounded-xl` panel, `rounded-full` CTA |
| Text - primary | `text-text-primary` |
| Text - secondary | `text-text-secondary` |
| Spacing | `p-6`, `space-y-6` |
| Hover state | `hover:opacity-90 active:scale-[0.97]` |
| Shadow | `shadow-md` |
| Accent usage | `bg-primary` CTA, `bg-primary` seat-progress fill |

**Pattern notes:** Pricing and batch selection remain one persistent decision surface on desktop. Full batches always render a disabled CTA rather than allowing checkout.

### DashboardSidebar

File: `components/layout/DashboardSidebar.tsx`
Last updated: 2026-07-25

| Property | Class |
| --- | --- |
| Background | `bg-slate-950` |
| Border | `border-r border-slate-800` |
| Text - primary | `text-white` |
| Text - secondary | `text-slate-400` |
| Spacing | `p-4`, `space-y-6` |
| Hover state | `hover:bg-slate-800 hover:text-white` |
| Accent usage | `text-primary` for active icons |

**Pattern notes:** Fixed width sidebar with active route highlighting using pathnames.

### LMSPage

File: `app/learn/[courseId]/page.tsx`
Last updated: 2026-07-26

| Property | Class |
| --- | --- |
| Background | `bg-background` for layout, `bg-surface` for cards and modals |
| Border | `border border-border` |
| Text - primary | `text-text-primary` |
| Text - secondary | `text-text-secondary` |
| Accent usage | `text-primary`, `bg-primary/10`, `border-primary/40` on active/hover |
| WhatsApp banner | `bg-success/10 text-success border-success/30` |
| Calendar theme | Custom `.calendar-lms` overriding FullCalendar standard styles with `#ff5a1f` accents and `#e6e2dc` borders |

**Pattern notes:** Unified into native `/dashboard/*` routes (`/dashboard/materials`, `/dashboard/live`, `/dashboard/recordings`, `/dashboard/announcements`) so the student sidebar (`DashboardSidebar`) and user settings remain accessible at all times. Incorporates WhatsApp Group Join banners, FullCalendar weekly/monthly grids, and modal previewers.

### CourseSelector

File: `components/dashboard/CourseSelector.tsx`
Last updated: 2026-07-26

| Property | Class |
| --- | --- |
| Background | `bg-surface` for unselected pill, `bg-primary` for active selected pill |
| Border | `border border-border` |
| Text | `text-xs font-semibold uppercase tracking-wider` |
| Hover | `hover:border-primary/40` |

**Pattern notes:** Horizontal scrollable pill switcher that updates URL query parameters (`?courseId=`) so multi-course students can switch courses seamlessly across `/dashboard/materials`, `/dashboard/live`, and `/dashboard/recordings`.

### CourseDetailsPage

File: `app/course/[slug]/page.tsx`
Last updated: 2026-07-26

| Property | Class |
| --- | --- |
| Background | `bg-background overflow-x-hidden w-full max-w-full` with ambient radial blur glow layers |
| Top Navbar | `sticky top-0 z-50 bg-surface/75 backdrop-blur-2xl border-b border-border/50` with quick-access `"Join Now"` CTA |
| Hero Headline | `text-[clamp(2.75rem,5.2vw,5.5rem)] font-bold tracking-[-0.045em] max-w-6xl text-balance` with inline typography image pill (`inline-block w-20 h-9 rounded-full align-middle mx-2`) |
| Hero CTAs | Primary `"Join Now — Enroll Today"` (`bg-text-primary text-surface hover:bg-primary active:scale-[0.97]`) + Secondary `"Explore Curriculum"` (`border-border/70 bg-surface/80`) |
| Bento Grid | `grid grid-cols-1 md:grid-cols-3 gap-6 grid-flow-dense` with interlocking 2x2, 1x1, and 3x1 cards leaving 0 empty spaces |
| Sticky Batch Selector | `BatchSelectorPremium` sticky right column with `"Join Now — Enroll in Batch"` button |
| Bottom Conversion | Massive `py-24 md:py-36` bottom card with `30-Day Money-Back Guarantee` pill badge and `"Join Now — Secure Your Seat"` button |

**Pattern notes:** Built following Emil Kowalski (`/emil-design-eng`), GPT-Taste (`/gpt-taste`), and Apple Design (`/apple-design`). Banned cheap meta-labels and generic `transition: all`. Uses Apple cubic-bezier damped curves (`cubic-bezier(0.23, 1, 0.32, 1)`).

### AdminSidebar & QuickCreateModal

File: `components/admin/AdminSidebar.tsx` & `components/admin/QuickCreateModal.tsx`
Last updated: 2026-07-28

| Property | Class |
| --- | --- |
| Sidebar Container | `w-64 border-r border-border bg-surface flex flex-col h-full shrink-0 shadow-sm select-none` |
| Quick Create Button | `w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all` |
| Navigation Items | 10 Core Modules (`Dashboard`, `Courses`, `Batches`, `Students`, `Payments`, `Reviews`, `Media Library`, `Announcements`, `Analytics`, `Settings`) with `pathname.startsWith(link.href)` active state |
| Quick Create Modal | Modal backdrop `bg-black/60 backdrop-blur-sm` with tabbed switcher (`Course`, `Batch`, `Announcement`, `Media`) to instantly trigger platform mutations |

**Pattern notes:** Updated to 10 admin modules (excluding Landing Page CMS per user request). Features a globally accessible Quick Create trigger button in the sidebar that opens `QuickCreateModal` from anywhere in `/admin/*`.

### AdminCommandCenterPage

File: `app/admin/dashboard/page.tsx`
Last updated: 2026-07-28

| Property | Class |
| --- | --- |
| Header Badge | `px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider` |
| Action Bento Bar | 4 Quick-Action cards (`Cohorts & Batches`, `Course Catalog`, `Announcements`, `Media Library`) with hover border/shadow transitions |
| Revenue Trajectory Chart | `Recharts` AreaChart with primary color gradient fill and custom formatted tooltips |

### BatchActivityCenter

File: `app/admin/batches/[batchId]/activity/page.tsx` & `components/admin/activity/*`
Last updated: 2026-08-01

| Property | Class |
| --- | --- |
| Header Toolbar | `flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-border bg-surface px-6 rounded-2xl shadow-sm` with pulsing `LIVE MONITORING` badge |
| 5-Card Bento KPI Grid | `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5` with selected active state (`border-primary bg-primary/5 shadow-sm ring-1 ring-primary`) |
| Filter & Presets Bar | Global search input + 3 dropdown selects (`Event Type`, `Date Range`, `Status`) + saved `Presets` dropdown menu + quick filter status chips |
| 2-Column Layout | `grid grid-cols-1 lg:grid-cols-12 gap-6 items-start` — left 7/8 columns for chronological timeline feed, right 5/4 columns for Operations Dashboard Sidebar |
| Timeline Card | `bg-surface border border-border rounded-xl p-4 shadow-sm hover:shadow transition-all` with category icon badge, actor metadata, status chip, and expandable audit payload |
| Donut Chart Summary | Pure CSS ring using polygon clip paths (`border-[14px] border-primary/blue-500/green-500`) with center total events badge |
| Jump to Today CTA | `inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary text-white text-xs font-bold shadow-md hover:bg-secondary/90 transition-all active:scale-[0.98]` |

**Pattern notes:** Redesign of `/admin/batches/[batchId]/activity` into an Enterprise Activity Center. Features real-time telemetry monitoring, 5-Card Bento KPI switcher, multi-dimensional filter bar with saved presets, chronological date-grouped audit trail with expandable payload inspector, and a sticky Operations Dashboard Sidebar with Donut Chart, Top Contributors, Recent Alerts, and an interactive Jump to Date Calendar.

| Seat Occupancy Meter | Circular fill badge `w-14 h-14 rounded-full bg-primary/10 border-4 border-primary` and capacity progress bar |

**Pattern notes:** Serves as the operational Command Center for `/admin/dashboard` (and `/admin` redirect). Incorporates GSAP-animated `StatsBento`, live cohort health monitors, and recent enrollments `DataTable`.

### BatchWorkspaceLayout & 8 Tab Pages

File: `app/admin/batches/[batchId]/layout.tsx` & `/overview`, `/students`, `/calendar`, `/materials`, `/recordings`, `/announcements`, `/settings`, `/activity`
Last updated: 2026-07-28

| Property | Class |
| --- | --- |
| Persistent Header | `bg-surface border border-border rounded-2xl p-6 shadow-sm` displaying cohort title, status badge, seat capacity, revenue, and WhatsApp link |
| Persistent Navigation | Horizontal scrollable tab bar with 8 workspace tabs (`Overview`, `Students`, `Calendar`, `Study Materials`, `Recordings`, `Announcements`, `Settings`, `Activity`) |
| Student Manual Enroll | Inline email enrollment form with instant mutation (`api.admin.manualEnrollStudent`) |
| Live Session Scheduler | Date/time and Google Meet URL scheduler (`api.admin.createLiveClass`) |

**Pattern notes:** Fully URL-driven cohort management workspace. Every tab is an independent page preserving shareable URL state (`/admin/batches/[batchId]/<tab>`).

### AdminStudentDirectoryPage

File: `app/admin/students/page.tsx`
Last updated: 2026-07-28

| Property | Class / Implementation |
| --- | --- |
| Page Header | Uses shared `AdminPageHeader` with title, subtitle, `Add Student` primary action pill button, and togglable `Filter` & `Export` secondary controls |
| Summary Section | 6-column grid of `StatCard` widgets (`Total Students`, `Active Now`, `Avg. Progress`, `Paid Students`, `Pending Payments`, `Completions`) |
| Filter Bar | Animated `motion.div` collapsible bar with search input, Course select, Payment select, Status select, and Clear button |
| Bulk Action Bar | Floating primary-tinted selection bar (`bg-primary/5 border border-primary/20`) with bulk Assign Batch, Announce, Certificates, Export, and Remove |
| Student Table | Sortable columns with `SortHeader` arrows, checkbox row selection, custom `ProgressRing` SVG chart, `PaymentChip`, and `StatusBadge` |
| Student Profile Drawer | Slide-in drawer (`w-full max-w-[480px]`) with 5 tabs (`Profile`, `Enrollment`, `Progress`, `Payments`, `Notes`) and footer quick actions |
| Manual Enroll Modal | Framer Motion dialog (`max-w-md`) integrating `api.admin.manualEnrollStudent` mutation |

**Pattern notes:** Central student administration page for VibeLogic Studio. Integrates cleanly with shared `AdminLayout`, `AdminSidebar`, and design system tokens.

### AdminCourseManagementPage & CourseDrawer

File: `app/admin/courses/page.tsx` & `components/admin/CourseDrawer.tsx`
Last updated: 2026-07-30

| Property | Class / Implementation |
| --- | --- |
| Page Header | Uses shared `AdminPageHeader` with title, subtitle, View Mode Toggle (`Table` vs `Cards`), `Filter` toggle with count badge, `Export CSV`, and `+ Create Course` primary CTA button |
| 8 KPI Summary Cards | Responsive 8-column grid (`grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3`) of `StatCard` widgets (`Total Courses`, `Published`, `Drafts`, `Archived`, `Total Revenue`, `Avg Rating`, `Active Students`, `Running Batches`) |
| Filter & Search Bar | Animated `motion.div` collapsible filter drawer with keyword search, `Category` dropdown, `Difficulty` dropdown, `Status` dropdown, `Instructor` filter, and reset button |
| Table View (`list`) | Custom sortable table with select-all checkbox, thumbnail image preview, copy-slug button, `DifficultyChip` (`Beginner`, `Intermediate`, `Advanced`), tuition price, learners count, running batches, revenue, star rating, `StatusBadge`, and row action dropdown menu |
| Card Grid View (`grid`) | Responsive 3-column card layout (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`) displaying course cover image with overlaid difficulty and status badges, price chip, instructor avatar/role, learners/revenue metrics, and quick action icons (`Edit`, `Duplicate`, `Delete`, `Batches link`) |
| Floating Bulk Actions Bar | Slide-up Framer Motion bottom bar appearing when 1+ courses are checked, supporting `Publish Selected`, `Move to Draft`, `Archive Selected`, `Delete Selected`, and `Clear` |
| CourseDrawer | Reusable right-side slide-in Framer Motion drawer (`w-full max-w-xl`) supporting both Create and Edit modes, integrated with `@uploadthing/react` `<UploadButton />` (`courseMediaUploader` endpoint) for cover thumbnail upload and live preview |

**Pattern notes:** Comprehensive curriculum management hub for VibeLogic Studio academies. Connects to `convex/admin.ts` (`getAllCourses`, `getCourseCatalogStats`, `createCourse`, `updateCourse`, `duplicateCourse`, `deleteCourse`, `toggleCourseStatus`, `bulkUpdateCourseStatus`, `bulkDeleteCourses`).

---

### BatchStudentsPage, BatchStudentProfileDrawer & InviteStudentModal

File: `app/admin/batches/[batchId]/students/page.tsx`, `components/admin/BatchStudentProfileDrawer.tsx` & `components/admin/InviteStudentModal.tsx`
Last updated: 2026-07-30

| Property | Class / Implementation |
| --- | --- |
| Page Header | Uses existing shared `Batch Header`, `Batch Information Section`, and `Batch Navigation Tabs` without generating another top bar. Provides primary `+ Invite Student`, `Import Students`, `Export CSV`, and `Bulk Actions` CTAs. |
| 10 KPI Summary Grid | Responsive bento grid of cards (`totalStudents`, `seatsFilled`, `seatsRemaining`, `averageAttendance`, `averageProgress`, `certificatesEligible`, `assignmentsCompleted`, `activeToday`, `pendingReviews`, `studentsAtRisk`) with capacity progress bars and red alert highlight for At-Risk learners. |
| 2-Column Classroom OS Layout | Desktop layout (`grid grid-cols-1 xl:grid-cols-12 gap-6`) separating the main Classroom Operating Table (`xl:col-span-9`) from the right-hand Classroom Dashboard Widgets (`xl:col-span-3`). |
| Right-Hand Classroom Widgets | Includes interactive `Classroom Schedule & Upcoming Sessions` (Live session countdown, attendance CTA), `Learning Milestones & Batch Timeline` (checkpoints with status badges), and `Cohort Health Overview & Risk Matrix` (Engagement score breakdown & intervention CTA). |
| Saved Filter Chips & Filter Bar | Interactive filter bar with saved quick-chips (`All Students`, `At Risk`, `Certificate Eligible`, `Top Performers`, `Pending Payment`), keyword search by Name/Email/Phone, and multi-select dropdown filters (`Attendance`, `Progress`, `Payment`, `Certificate`, `Sort By`). |
| 14-Column Classroom Table | Complete sortable table (`table-auto w-full`) with Selection Checkbox, Avatar, Student Name, Email, Phone Number, Enrollment Date, Attendance (color-coded bar), Learning Progress (progress bar), Assignment Completion, Payment Status, Certificate Status, Current Status, Last Active, and More Actions dropdown. |
| Floating Bulk Actions Bar | Slide-up Framer Motion bottom selection bar appearing when 1+ students are checked, supporting `Mark 100% Attendance`, `Issue Certificates`, `Export Selected CSV`, `Transfer Selected`, and `Remove Selected`. |
| BatchStudentProfileDrawer | 8-tab inspection drawer (`Overview`, `Attendance`, `Assignments`, `Materials`, `Payment`, `Notes`, `Timeline`, `Communication`) with Student ID banner, side-by-side Email/Phone cards, interactive `Next Milestones` checkable widget, and sticky Quick Actions footer (`Send Message`, `Review Progress`, `Issue Certificate`, `Mark Attendance`). |
| InviteStudentModal & Import Students Modal | Framer Motion dialogs (`max-w-md` and `max-w-xl`) for direct single learner enrollment by registered email and bulk student import via CSV or comma-separated email list. |

**Pattern notes:** Dedicated cohort Classroom Operating System for VibeLogic Studio. Built with strict Rules of Hooks safety (all hooks declared unconditionally at top of component), 2-column layout, and rich right-sidebar widgets. Powered by `getBatchStudentsExtended` query calculating 10 KPI summary stats and enriched student records.

---

### BatchCalendarWorkspace, BatchEventDrawer & CreateBatchEventModal

File: `app/admin/batches/[batchId]/calendar/page.tsx`, `components/admin/BatchCalendarWorkspace.tsx`, `components/admin/BatchEventDrawer.tsx` & `components/admin/CreateBatchEventModal.tsx`
Last updated: 2026-07-30

| Property | Class / Implementation |
| --- | --- |
| Page Header | Uses existing shared `Batch Header`, `Batch Information Section`, and `Batch Navigation Tabs` (`BatchWorkspaceLayout`). Provides primary `+ Create Class`, `Import Schedule`, and `Export Calendar` CTAs. |
| Multi-View Calendar Control Bar | Responsive header bar with Month navigation (`<`, `Today`, `>`), dynamic Month/Year label (`August 2026`), and segmented View Switcher (`Month | Week | Day | Agenda`). |
| 4 Responsive Calendar Views | **Month View**: 7-column calendar grid (Sun-Sat) with color-coded session pills and click-to-schedule empty cell support.<br>**Week View**: 7-day horizontal grid across Sunday to Saturday with scheduled blocks.<br>**Day View**: Single-day schedule cards with Meeting URL join buttons.<br>**Agenda View**: Chronological roster list of all cohort sessions grouped by date with join and action buttons. |
| 10 Session Types | Color-coded badges and border indicators for `Live Class`, `Workshop`, `Exam`, `Assignment Deadline`, `Office Hours`, `Holiday`, `Guest Session`, `Practice Session`, `Cancelled Session`, and `Completed Session`. |
| 2-Column Classroom OS Layout | Desktop layout (`grid grid-cols-1 xl:grid-cols-12 gap-6`) separating the main multi-view Calendar grid (`xl:col-span-9`) from the right-hand Sidebar Insights Widgets (`xl:col-span-3`). |
| 5 Sidebar Insights Widgets | Includes `Next Live Session` (countdown & quick join link), `Critical Milestones & Exams` (high-priority deadline cards), `Instructor Workload` (scheduled hours per instructor), `Cohort Schedule KPIs` (Total Sessions, Live Hours, Live Classes, Assignments), and `Recent Modifications` activity feed. |
| Quick Filters & Dropdowns | Quick-chip filter bar (`All Events`, `Upcoming`, `Only Live Classes`, `Only Assignments`, `Only Exams`, `Completed`, `Cancelled`) combined with dropdown selects for `Instructor`, `Event Type`, and `Published Status`. |
| BatchEventDrawer | 9-section slide-in inspection drawer (`max-w-2xl`) displaying Header with Published Badge, Live Join Action banner, Key Schedule Details, Curriculum Linkage, Editable Description, Study Resources & Assignments, Notification & Reminder toggles, Attendance Requirement toggle, and Footer Actions (`Save Changes`, `Duplicate Session`, `Delete Session`). |
| CreateBatchEventModal & Import/Export Modals | Framer Motion modals (`max-w-lg` and `max-w-md`) for scheduling new sessions with duration presets (`45m`, `60m`, `90m`, `120m`, `180m`), bulk schedule CSV import, and 1-click `.ics` iCal feed / CSV spreadsheet export. |

**Pattern notes:** Complete Classroom Schedule & Operations Platform for VibeLogic Studio cohorts. Built with strict Rules of Hooks safety (all top-level hooks declared unconditionally), 2-column layout, and 4 responsive multi-view calendar modes.

---

### BatchAnnouncementsPage, BatchAnnouncementComposer, BatchAnnouncementDrawer, BatchAnnouncementPreviewModal & AnnouncementAttachmentModal

File: `app/admin/batches/[batchId]/announcements/page.tsx`, `components/admin/BatchAnnouncementComposer.tsx`, `components/admin/BatchAnnouncementDrawer.tsx`, `components/admin/BatchAnnouncementPreviewModal.tsx` & `components/admin/AnnouncementAttachmentModal.tsx`
Last updated: 2026-07-31

| Property | Class / Implementation |
| --- | --- |
| Page Header | Uses existing shared `Batch Header`, `Batch Information Section`, and `Batch Navigation Tabs` (`BatchWorkspaceLayout`). Provides primary `View Drafts`, `Schedule Broadcast`, and `Create Announcement` CTAs. |
| 4 KPI Summary Cards | Bento grid of cards displaying `Total Announcements` (active vs drafts), `Active Broadcast Reach` (with 100% delivered status), `Avg. Open & Read Rate`, and `Engagement Score` (Q&A interactions). |
| 2-Column Classroom OS Layout | Desktop layout (`grid grid-cols-1 lg:grid-cols-12 gap-6`) separating the main announcements feed & composer (`lg:col-span-8`) from the right-hand Broadcast & Audience Insights sidebar (`lg:col-span-4`). |
| Right-Hand Insights Sidebar | Includes `Broadcast Channels` monitor (`WhatsApp Business API`, `Email Newsletter Engine`, `In-App Dashboard Feed`, `Mobile Push (Expo)`), `Audience Segment Reach` breakdown progress bars, and `AI Engagement Timing Insight` recommendations card. |
| BatchAnnouncementComposer | Expandable authoring composer with Title, rich content textarea, Audience Selector (`Entire Batch`, `Specific Students`, `Students with Pending Payments`, `Students with Low Attendance`), multi-channel broadcast toggles (`WhatsApp`, `In-App`, `Email`, `Push`), scheduler picker, pinning toggle, and comments switch. |
| BatchAnnouncementDrawer | 4-tab slide-in inspection drawer (`Overview`, `Engagement`, `Comments`, `Timeline`) displaying target audience reach, publishing date, attached study resources, multi-channel status pills, cohort read rate meter, student Q&A comments list, and lifecycle buttons (`Pin/Unpin`, `Duplicate`, `Archive`, `Publish Now`, `Delete`). |
| BatchAnnouncementPreviewModal | Framer Motion modal (`max-w-2xl`) allowing administrators to toggle between `Dashboard Feed` (learner desktop feed view) and `WhatsApp Business Mobile` (green chat bubble mobile broadcast view). |
| AnnouncementAttachmentModal | 4-tab resource attachment modal (`Link`, `Material`, `Recording`, `File`) allowing instructors to attach existing cohort study materials, live session video recordings, or external document links to any announcement. |

**Pattern notes:** Complete Multi-Channel Broadcast & Classroom OS Announcements Engine for VibeLogic Studio cohorts. Built with strict React Rules of Hooks safety, Framer Motion modals/drawers (`AnimatePresence`), and real-time Convex mutations/queries.

---

### BatchRecordingsPage, UploadBatchRecordingModal, ConnectYouTubeModal, ReplaceRecordingModal & BatchRecordingDrawer

File: `app/admin/batches/[batchId]/recordings/page.tsx`, `components/admin/UploadBatchRecordingModal.tsx`, `components/admin/ConnectYouTubeModal.tsx`, `components/admin/ReplaceRecordingModal.tsx` & `components/admin/BatchRecordingDrawer.tsx`
Last updated: 2026-07-31

| Property | Class / Implementation |
| --- | --- |
| Page Header | Uses existing shared `Batch Header`, `Batch Information Section`, and `Batch Navigation Tabs` (`BatchWorkspaceLayout`). Features compact **Executive Action Toolbar** with `Export CSV`, `Import Existing`, `Analytics` toggle, `Connect YouTube`, and `+ Publish Recording`. |
| 4 KPI Summary Cards | Bento grid of cards displaying `Total Recordings` (published vs drafts count), `Total Student Views` (+24% weekly growth badge & watch time hours), `Avg. Completion Retention` (with visual retention gradient bar), and `Archive Status` breakdown. |
| Analytics & Performance Summary Panel | Toggleable real-time telemetry panel (Section 2B, collapsed by default) showing `Cohort Engagement Score` (98.4%), `Most Viewed Recording` card, `Least Viewed Recording (Promotion Alert)` card, and `Recently Uploaded Session` card. |
| Multi-View Display Area | Dynamic toggle between **3-Column Bento Grid View** (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` with HD thumbnail preview, duration badge, source icon, student retention progress bar, and inspection/action footer) and **Dense 10-Column Roster List View Table** with full selection checkboxes. |
| Command & Filter Bar | Compact horizontal-wrapping toolbar (`h-9` pills) with search input filtering by title, instructor, description, or module; filter dropdowns for `Module`, `Instructor`, `Status`, and `Visibility`; Sort selector; and `Grid | List` view toggle. |
| Floating Bulk Actions Bar | Framer Motion animated floating toolbar when 1+ recordings are selected, providing `Publish Selected`, `Move to Draft`, `Archive`, `Move Module...` select, `Visibility...` select, `Delete Selected`, and 1-click `Export CSV` spreadsheet roster download. |
| BatchRecordingDrawer | 5-tab slide-in inspection drawer (`Overview`, `Audience Retention`, `Study Resources`, `Edit Metadata`, `Activity`) showing interactive retention graph, study resource attachment builder, instructor attribution, stream URL, and lifecycle controls (`Publish / Revert to Draft`, `Replace Video`, `Delete`). |
| UploadBatchRecordingModal | Framer Motion modal (`max-w-lg`) for uploading new video files or pasting direct AWS S3 / Cloud replay URLs with duration, module assignment, visibility, and unlisted watermark toggles. |
| ConnectYouTubeModal | Modal (`max-w-lg`) for synchronizing an external YouTube channel, video, or playlist URL with automatic watermarking and unlisted retention telemetry safeguards. |
| ReplaceRecordingModal | Modal (`max-w-lg`) allowing administrators to replace an existing video URL or file without losing accumulated view counts or student watch retention history. |

**Pattern notes:** Complete Classroom Video Library & HD Recording Archive Engine for VibeLogic Studio cohorts. Built with strict React Rules of Hooks safety, Convex real-time backend (`getBatchRecordingsExtended`, `bulkUpdateBatchRecordingsExtended` with extended archive/move_module/change_visibility actions), and responsive multi-view Grid/List layouts. Fully redesigned to the Light Editorial Theme (`bg-surface`, `border-border`, `text-text-primary`, `bg-background`, with vibrant `bg-primary`, `bg-red-600`, and `bg-amber-600` action accents) and rearranged with a sleek horizontal toolbar layout to ensure 100% visual consistency and zero TypeScript compilation errors.

---

### BatchMaterialsPage, BatchMaterialsAnalytics, BatchMaterialsDropzone, BatchMaterialsCollectionBar, BatchMaterialsFilterBar, BatchMaterialsTable, BatchMaterialsGrid, BatchMaterialsBulkActions, BatchMaterialDrawer & UploadBatchMaterialModal

File: `app/admin/batches/[batchId]/materials/page.tsx`, `components/admin/materials/BatchMaterialsAnalytics.tsx`, `components/admin/materials/BatchMaterialsDropzone.tsx`, `components/admin/materials/BatchMaterialsCollectionBar.tsx`, `components/admin/materials/BatchMaterialsFilterBar.tsx`, `components/admin/materials/BatchMaterialsTable.tsx`, `components/admin/materials/BatchMaterialsGrid.tsx`, `components/admin/materials/BatchMaterialsBulkActions.tsx`, `components/admin/materials/BatchMaterialDrawer.tsx` & `components/admin/materials/UploadBatchMaterialModal.tsx`
Last updated: 2026-08-01

| Property | Class / Implementation |
| --- | --- |
| Executive Page Toolbar | Renders title, subtitle with total files count, and action buttons: `Show/Hide Analytics`, `Show/Hide Upload Dock`, and primary `+ Upload Material` CTA. |
| BatchMaterialsAnalytics | 4-Card Bento Dashboard displaying `Storage Quota & Health Gauge` (`2.4 GB / 10 GB`), `Asset Formats` volume distribution with color-coded badges, `Cohort Engagement` total downloads counter with Most Downloaded item spotlight, and `Recent Uploads` real-time activity feed. |
| BatchMaterialsDropzone | Interactive Quick Drop Asset Dock supporting drag-and-drop or file browsing for instant file uploads, format badge previews (`PDF`, `DOCX`, `PPTX`, `ZIP`, `MP4`, `CODE`, `LINK`), collapsible dock header, and real-time simulated upload queue. |
| BatchMaterialsCollectionBar | Horizontal category switching bar (`All Resources`, `Module 1: Foundations`, `Day 1: Intro to AI`, `Assignments`), custom collection inline creation input, and `Favorites Only` toggle. |
| BatchMaterialsFilterBar | Search input filtering across title, collection, format, and description; Format pill filters; Access visibility filters (`Public`, `Students Only`, `Draft`, `Archived`); Sort selector (`Order`, `Title`, `Downloads`, `Recently Updated`); and display mode switcher (`Table` vs. `Grid`). |
| BatchMaterialsTable & BatchMaterialsGrid | Enterprise Roster Table (`BatchMaterialsTable`) with Select All checkbox, order indicator, favorite star toggle, format badge, visibility badge, download counter with simulated test increment button, and action buttons (`Preview Asset`, `Copy URL`, `Edit`, `Delete`). Alternative visual cards grid view (`BatchMaterialsGrid`). |
| BatchMaterialsBulkActions | Floating command bar appearing when `selectedIds.length > 0`, supporting `Move to Collection...`, `Set Visibility...`, `Download ZIP`, and `Delete Selected`. |
| BatchMaterialDrawer | CMS-grade slide-over side panel with 2 tabs: `Asset Preview & Reader` (interactive document zoom/page viewer simulation, download CTA, audit trail cards, CDN endpoint link) and `CMS Metadata & Settings` (editor for title, collection, sort order, access level, companion notes, file URL, and favorite toggle). |
| UploadBatchMaterialModal | Dedicated modal for uploading study materials with format selector, auto-sizing calculation, access level dropdown, companion description textarea, and custom collection assignment. |

**Pattern notes:** Enterprise Curriculum Asset Studio for VibeLogic Studio course batches. Built with strict React Rules of Hooks safety, Convex real-time backend (`getBatchStudyMaterialsExtended`, `createBatchStudyMaterialExtended`, `updateBatchStudyMaterialExtended`, `deleteBatchStudyMaterialExtended`, `bulkUpdateStudyMaterialsExtended`, `incrementMaterialDownload`), clean custom SVG format icons (`MaterialIcons.tsx`), zero raw hex colors, and 100% Light Editorial Theme consistency.

---

### BatchSettingsPage & Modular Enterprise Configuration Workspace Components

File: `app/admin/batches/[batchId]/settings/page.tsx`, `components/admin/settings/BatchSettingsToolbar.tsx`, `components/admin/settings/BatchSettingsHealthBanner.tsx`, `components/admin/settings/BatchSettingsGeneral.tsx`, `components/admin/settings/BatchSettingsEnrollment.tsx`, `components/admin/settings/BatchSettingsCommunication.tsx`, `components/admin/settings/BatchSettingsResourcesHub.tsx`, `components/admin/settings/BatchSettingsFeatures.tsx`, `components/admin/settings/BatchSettingsDangerZone.tsx`, `components/admin/settings/BatchSettingsSaveBar.tsx`, `components/admin/settings/BatchSettingsModals.tsx` & `components/admin/settings/types.ts`
Last updated: 2026-08-01

| Property | Class / Implementation |
| --- | --- |
| Page Header | Uses existing shared `Batch Header`, `Batch Information Section`, and `Batch Navigation Tabs` (`BatchWorkspaceLayout`). Renders executive configuration toolbar below tabs with cohort title, identifier badge, completeness indicator, and jump-link navigation pills. |
| BatchSettingsToolbar | Executive header featuring cohort subtitle, active status badge, `Completeness Score` ring badge (`88% Configured`), and jump navigation pills (`General`, `Enrollment`, `Communication`, `Resources`, `Features`, `Danger Zone`). |
| BatchSettingsHealthBanner | 3-Column Bento health dashboard displaying `Configuration Health Score` (with status ring and alert pill), `Seat Utilization & Admission Threshold` (enrolled vs capacity progress bar and waitlist badge), and `Recent Configuration Audit Trail` (last modified user, timestamp, and action history). |
| BatchSettingsGeneral | General Cohort Information form card managing `Cohort Batch Name` (`input`), `Lead Instructor & Mentor` (`select`), `Cohort Companion Description` (`textarea`), `Start Date` & `End Date` (`date` inputs), `Cohort Timezone` (`select`), and 3-state `Operational Lifecycle State` selector (`upcoming`, `live`, `completed`). |
| BatchSettingsEnrollment | Enrollment & Seat Capacity Rules card managing `Maximum Seat Capacity` (`number` input + quick inc buttons +10, +25, +50), real-time seat gauge progress bar, `Public Checkout & Admission Window` selector (`Running`, `Upcoming`, `Completed`, `Closed`), and `Allow Waitlist Queue` toggle. |
| BatchSettingsCommunication | Centralized Communication & Community Hubs card managing `WhatsApp Community URL`, `Primary Google Meet Room URL`, `Discord Community Server URL`, `Notion Cohort Hub URL`, inline "+ Add Custom Channel" creator, and interactive `Test Link` preview buttons for every channel. |
| BatchSettingsResourcesHub | Connected Cohort Content & Resource Hubs card rendering 4 Bento cards linking directly to `Study Materials & Curriculum` (`/admin/batches/[batchId]/materials`), `Class Video Recordings` (`/admin/batches/[batchId]/recordings`), `Student Announcements` (`/admin/batches/[batchId]/announcements`), and `Course Media Asset Library` (`/admin/media`). |
| BatchSettingsFeatures | Cohort Capability & Feature Entitlements card with SaaS-style feature toggles for `Live Class Attendance Tracking`, `Student Assignments & Submissions`, `Blockchain Completion Certificates`, `24/7 AI Learning Assistant Module`, and `Embedded Web IDE & Code Sandbox`. |
| BatchSettingsDangerZone | Isolated red-accented destructive operations card with 3 actions: `Archive Cohort Program` (opens confirmation modal), `Duplicate Cohort Configuration & Syllabus` (opens clone modal with new title input), and `Permanently Delete Cohort Program` (opens confirmation modal requiring typing batch title). |
| BatchSettingsSaveBar | Sticky bottom floating feedback bar (`fixed bottom-6`) appearing when `isDirty` is true, providing `Reset Changes` and `Save All Settings` buttons with loading spinner, and displaying a 4-second green success feedback toast upon save completion. |
| BatchSettingsModals | Three modals for irreversible actions: `ArchiveBatchModal` (archive/restore confirmation), `DuplicateBatchModal` (input new batch name and clone), and `DeleteBatchModal` (type batch title confirmation). |

**Pattern notes:** Enterprise SaaS Configuration Workspace for VibeLogic Studio course batches. Built with strict React Rules of Hooks safety (all Convex `useQuery` and `useMutation` hooks called unconditionally at top-level), modular form architecture (`components/admin/settings/`), dirty-state tracking with sticky bottom bar, zero hardcoded hex values, and 100% Light Editorial Theme consistency.

---

### AdminPaymentsPage & Modular Enterprise SaaS Financial Console Components

File: `app/admin/payments/page.tsx`, `components/admin/payments/PaymentsClient.tsx`, `components/admin/payments/FinanceKPIGrid.tsx`, `components/admin/payments/RevenueAnalyticsSection.tsx`, `components/admin/payments/TransactionsTable.tsx`, `components/admin/payments/TransactionDetailModal.tsx`, `components/admin/payments/SubscriptionsTable.tsx`, `components/admin/payments/RefundsTable.tsx`, `components/admin/payments/InvoicesTable.tsx`, `components/admin/payments/FinancialActivityLog.tsx` & `components/admin/payments/types.ts`
Last updated: 2026-08-04

| Property | Class / Implementation |
| --- | --- |
| Page Shell | Renders `<PaymentsClient />` inside `app/admin/payments/page.tsx`, preserving existing `<AdminSidebar />` and `<AdminTopNav />` (`app/admin/layout.tsx`). |
| PaymentsClient | Executive container with title header, subtitle, "+ Create Manual Charge" & "Export All CSV" actions, 8-Card KPI Bento Grid (`FinanceKPIGrid`), SVG Charting (`RevenueAnalyticsSection`), and 5 interactive tabs (`Transactions`, `Subscriptions`, `Refunds & Disputes`, `Invoices`, `Audit Log`). |
| FinanceKPIGrid | 8-Card Bento Grid displaying `Total Revenue`, `Monthly Revenue (MRR)`, `Successful Transactions`, `Average Order Value`, `Active Subscriptions`, `Pending Settlements`, `Refunds & Disputes`, and `Failed Transactions` with MoM change badges and subtle status accents. |
| RevenueAnalyticsSection | Pure CSS/SVG Line & Area chart showing 6-month historical revenue trend alongside an interactive Gateway Breakdown Donut/Bar chart (`Razorpay`, `Stripe`, `Manual Bank Transfer`, `PayPal`). |
| TransactionsTable & Detail Modal | Multi-filter transactions roster with search, gateway/status/currency filters, sorting, bulk CSV export, pagination, and a slide-over `TransactionDetailModal` for deep inspection of payment gateway IDs, invoice numbers, and customer metadata. |
| SubscriptionsTable | Active SaaS recurring subscriptions list with renewal date tracking, plan tier badges, MRR contribution, and administrative status controls (`Active`, `Past Due`, `Canceled`). |
| RefundsTable | Dispute & refund request queue with 1-click administrative `Approve Refund` and `Reject Request` actions. |
| InvoicesTable | Tax-compliant invoice registry displaying invoice number, customer, net/tax amounts, and download PDF action. |
| FinancialActivityLog | Immutable chronological audit trail of all financial events (`PAYMENT_RECEIVED`, `REFUND_PROCESSED`, `SUBSCRIPTION_RENEWED`, `INVOICE_GENERATED`). |

**Pattern notes:** Enterprise SaaS Financial Hub for VibeLogic Studio. Built with strict Convex WebSocket auth-hydration safety (`[] as never[]` default overview state in `convex/payments_admin.ts`), zero hardcoded hex values, zero lint errors, and 100% Light Editorial Theme consistency (`bg-surface`, `border-border`, `text-primary`, `bg-background`).

---

### CheckoutPage & CheckoutClient

File: `app/checkout/page.tsx`, `components/courses/CheckoutClient.tsx`
Last updated: 2026-08-24

| Property | Class / Implementation |
| --- | --- |
| CheckoutPage | Protected server page verifying Clerk authentication, parsing search parameters, fetching course/batch from Convex, confirming enrollment availability, and rendering profile/fee summary layouts. |
| CheckoutClient | Dynamic client side script loader that loads the Razorpay SDK (`https://checkout.razorpay.com/v1/checkout.js`), renders pricing breakdowns (Subtotal + GST), processes checkout, opens the checkout modal, and handles redirect. |
| Order Creation API | API endpoint (`/api/checkout/order`) generating Razorpay orders, validating batch seat capacity limits, and logging a pending payment record in Convex. |
| Verification Webhook | API endpoint (`/api/webhooks/razorpay`) verifying SHA256 signature verification, executing enrollment/payment settlement mutations, and evicting cached student dashboards from Upstash Redis. |

**Pattern notes:** Secure payment gateway checkout system for VibeLogic Studio. Integrates dynamic Razorpay modals, strict webhook signature validation, real-time database state synchronization, and comprehensive Redis cache evictions to keep dashboard interfaces completely fresh.




