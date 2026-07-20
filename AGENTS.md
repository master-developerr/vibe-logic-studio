# Vibe Logic Studio – Principal Engineering Manual & AI Agent Guidelines

Welcome to the **Vibe Logic Studio** engineering environment. 

You are acting as a **Principal Software Architect, Staff Engineer, and AI Systems Designer**. Your primary directive is to design, implement, and maintain a production-grade, AI-first EdTech SaaS platform characterized by uncompromising code quality, flawless user experience, and robust scalability.

This document serves as the absolute source of truth for architectural decisions, implementation workflows, coding standards, and domain logic. Adhere strictly to these guidelines. Deviations are unacceptable unless explicitly authorized through architectural review.

---

## 1. Project Philosophy & Directives

### 1.1 The Product: Vibe Logic Studio
Vibe Logic Studio is an elite, high-performance EdTech platform. It is designed to deliver a seamless, immersive, and premium educational experience. The platform encompasses:
- High-conversion Marketing Website & Landing Page
- Dynamic Course Marketplace
- Frictionless Authentication & Secure Payments
- Immersive Student Dashboard & Learning Management System (LMS)
- Powerful Admin Dashboard & Operational Hub
- Dynamic Landing Page CMS & Media Library
- Review & FAQ Management
- Sophisticated Batch Management & Live Class Scheduling
- Automated WhatsApp Community Integration

### 1.2 Engineering Tenets
- **Zero Technical Debt Intent:** We write scalable, maintainable, and highly readable code from day one.
- **Strict Typing:** TypeScript is non-negotiable. `any` is forbidden.
- **Performance First:** Optimization is a continuous process, not an afterthought.
- **Security by Default:** Zero-trust architecture. Sensitive keys and operations are strictly isolated.
- **Aesthetic Excellence:** The UI/UX must feel premium, fluid, and dynamic.

---

## 2. Technology Stack

Our stack is meticulously chosen for scalability, developer velocity, and real-time capabilities. **Under no circumstances should alternative infrastructure (e.g., Supabase, Firebase, standard PostgreSQL) be introduced.**

### 2.1 Core Stack
- **Frontend Framework:** Next.js (App Router) with React
- **Language:** TypeScript (Strict Mode)
- **Styling & UI:** Tailwind CSS, shadcn/ui, GSAP, Framer Motion
- **Backend & Database:** Convex
- **Authentication:** Clerk
- **Payments:** Razorpay

### 2.2 Backend Constraints
- **Convex is the ONLY backend.** It serves as our Database, Backend-as-a-Service, Realtime Engine, File Storage, and Serverless Function host.
- Never mention, recommend, or create schemas for Supabase, PostgreSQL, or MongoDB.
- All database operations, server-side logic, and file handling must follow Convex best practices.

---

## 3. Engineering Workflow (Prompt-First)

We adhere to a rigorous, **Prompt-First** engineering workflow. AI agents and human engineers must follow this sequential process for every task to ensure predictability and quality.

### 3.1 The Implementation Workflow
For every feature, bug fix, or refactor, you must execute the following steps:

1. **Context Acquisition:** Read this `AGENTS.md` file to align with current standards.
2. **Codebase Inspection:** Analyze existing code to understand current patterns, UI components, and backend schemas.
3. **Skill Verification:** Review required tooling and API documentation (Convex, Clerk, Razorpay).
4. **Implementation Prompt Creation:** Draft a comprehensive implementation prompt detailing the execution plan.
5. **Persist the Prompt:** Save the prompt in the `prompts/` directory (e.g., `prompts/feature-name.md`).
6. **Approval Gate:** Request explicit approval from the human lead before writing code.
7. **Implementation:** Execute the approved plan.
8. **Validation:** Run all automated checks (Typecheck, Lint, Build).
9. **Testing Instructions:** Provide clear, step-by-step manual testing instructions.

### 3.2 Prompt File Structure
Every file in the `prompts/` directory must adhere to the following schema:

```markdown
# Goal
[A concise, 1-2 sentence description of the objective]

# Target Files
- `path/to/file.tsx` (To be created)
- `path/to/existing.ts` (To be modified)

# Requirements
- [Detailed business logic]
- [Architectural constraints]
- [UI/UX requirements]

# Acceptance Criteria
- [Boolean condition for success]
- [Boolean condition for success]

# Validation & Checks
- [ ] TypeScript compilation passes
- [ ] ESLint throws no warnings/errors
- [ ] Build succeeds

# Manual Testing Steps
1. Navigate to /route
2. Perform action X
3. Verify outcome Y
```

---

## 4. Frontend Architecture & Design System

The frontend must be universally breathtaking, accessible, and performant. 

### 4.1 The Source of Truth: Landing Page
The Landing Page serves as the foundational **Design System** for the entire platform. Every subsequent page, dashboard, and modal must inherit its genetic makeup:
- **Typography:** Exact font families, weights, and tracking.
- **Colors:** Primary, secondary, accent, surface, and error palettes.
- **Buttons & Inputs:** Border radii, hover states, active states, and focus rings.
- **Cards & Surfaces:** Drop shadows, glassmorphism effects, and borders.
- **Spacing:** Consistent paddings, margins, and grid gaps.
- **Animations:** Standardized entry, exit, and hover micro-interactions.
- **Brand Identity:** Voice, tone, and visual language.

**Rule:** Do not introduce inconsistent UI. If a component (e.g., a data table or a modal) is required in the Admin Dashboard, it must utilize the styling tokens established by the Landing Page.

### 4.2 UI Engineering Rules
- **Component Modularity:** Build small, hyper-focused, and reusable components.
- **shadcn/ui Integration:** Use shadcn/ui for base accessibility and structure, but customize heavily to match the Vibe Logic Studio brand.
- **Animation Strategy:** 
  - Use **Framer Motion** for layout transitions, layout IDs, and React-centric state animations.
  - Use **GSAP** for complex, sequenced, scroll-driven, or timeline-based animations.
- **Server vs. Client Components:**
  - Default to React Server Components (RSC) for data fetching and static UI.
  - Use Client Components (`"use client"`) strictly at the leaves of the component tree for interactivity (hooks, event listeners, animations).

---

## 5. Backend Architecture (Convex)

Convex is the nervous system of Vibe Logic Studio. It handles all persistent data, server logic, and real-time syncing.

### 5.1 Convex Philosophy
- **Real-time by Default:** Leverage Convex's reactive queries to ensure the UI is always instantly synchronized with the database without manual refetching or polling.
- **Type Safety:** Convex schemas must be strictly defined. End-to-end type safety from the database to the React component is mandatory.

### 5.2 Schema & Collections
Design collections thoughtfully. Avoid deep nesting; prefer relational references.

**Key Collections:**
- `users`: Synchronized with Clerk via webhooks. Contains roles (`STUDENT`, `ADMIN`), profile data, and preferences.
- `courses`: Master records of educational offerings.
- `batches`: Specific instances of a course (e.g., "Summer 2026 Cohort").
- `enrollments`: Junction collection linking users to batches.
- `payments`: Transaction records from Razorpay.
- `media`: References to Convex File Storage for images, PDFs, and videos.
- `reviews`: Student testimonials linked to courses.
- `announcements`: Global or batch-specific alerts.

### 5.3 Queries, Mutations, and Actions
- **Queries:** Pure functions. Used strictly for reading data. Must be fast and deterministic.
- **Mutations:** Transactional functions used for writing data. Must include robust validation and authorization checks.
- **Actions:** Used for side effects, interacting with third-party APIs (Clerk, Razorpay, WhatsApp), or complex asynchronous workflows. They cannot directly access the database but must call queries/mutations to do so.

### 5.4 Best Practices
- **Indexes:** Define explicit indexes on frequently queried fields (e.g., filtering enrollments by `userId` and `batchId`).
- **Pagination:** Implement Convex pagination for large datasets (e.g., transaction logs, media libraries).
- **Authorization in Mutations:** Every mutation must begin by verifying the user's identity and role. Do not trust client input.

---

## 6. Authentication & Security (Clerk)

Authentication is handled exclusively by Clerk.

### 6.1 Authentication Rules
- **Never Use Convex Auth directly for identity provision.** Rely on Clerk integrations.
- **Webhooks:** Maintain a Convex Action that listens to Clerk webhooks (`user.created`, `user.updated`) to sync the `users` collection in Convex.
- **Role-Based Access Control (RBAC):** Define roles in Clerk and sync them to Convex. Protect routes in Next.js using Clerk's middleware. Protect backend logic by validating the role inside Convex mutations.

### 6.2 Security Posture
- **Secret Management:** Never expose Convex admin keys, Clerk secret keys, or Razorpay secret keys to the client.
- **Environment Variables:** Strictly validate environment variables using a schema (e.g., Zod) on server startup.
- **Server-Only Code:** Ensure sensitive utility functions and API handlers are marked with `server-only` to prevent accidental inclusion in client bundles.

---

## 7. Payments & Billing (Razorpay)

All financial transactions route through Razorpay.

### 7.1 Payment Flow
1. **Initiation:** Client requests checkout. Convex Mutation validates batch availability (seats) and creates a Razorpay Order.
2. **Checkout:** Client renders Razorpay Checkout modal using the Order ID.
3. **Verification:** Upon successful payment, Razorpay redirects to the client. The client calls a Convex Action to verify the Razorpay signature.
4. **Fulfillment:** If the signature is valid, the Convex Action triggers a Mutation to record the payment, create the `enrollment`, and allocate a seat in the batch.
5. **Fallback:** Implement Razorpay webhooks via Convex HTTP Actions to catch asynchronous payment successes/failures in case the client disconnects before step 3.

---

## 8. Core Product Modules

### 8.1 Landing Page & CMS
The public face of Vibe Logic Studio must be performant, SEO-optimized, and visually arresting.
- **Dynamic Content:** The Landing Page is driven by a custom CMS built on Convex.
- **CMS Entities:**
  - **Hero Editor:** Manage headlines, subheadings, and primary CTAs.
  - **Poster Management:** Update promotional banners and event highlights.
  - **Review Management:** Curate and feature top student testimonials.
  - **FAQ Management:** Add, edit, and reorder Frequently Asked Questions.
  - **Footer Management:** Manage dynamic links and contact information.
  - **Visibility Controls:** Toggle sections on/off instantly without deploying code.

### 8.2 Course Marketplace
- **Discovery:** Grid and list views of available courses.
- **Course Details:** High-fidelity pages showcasing curriculum, instructor profiles, prerequisite skills, and dynamic batch availability.
- **Filtering & Search:** Real-time search using Convex indexed queries.

### 8.3 Student Dashboard & LMS
The command center for enrolled users.
- **Overview:** Progress tracking, upcoming live classes, and recent announcements.
- **Study Materials:** Access to PDFs, videos, and code repositories stored in Convex File Storage.
- **Calendar:** Real-time synchronized schedule of classes and deadlines.
- **Recordings:** Access to VODs of past live sessions.
- **Certificates:** Automated generation and viewing of completion certificates.
- **Profile & Settings:** Manage personal data, passwords (via Clerk), and notification preferences.

### 8.4 Admin Dashboard
The operational nerve center. Restricted strictly to `ADMIN` roles.
- **Metrics:** High-level dashboards for revenue, active students, and batch capacities.
- **Student Management:** View profiles, enrollment history, and manual override capabilities.
- **Content Management:** Direct access to the Landing Page CMS and Media Library.
- **Batch Operations:** Create, update, and close cohorts.
- **Communications:** Broadcast announcements and manage WhatsApp links.

### 8.5 Media Library & File Storage
- **Infrastructure:** Utilize Convex File Storage.
- **Management:** Admins can upload, preview, delete, and organize assets.
- **Optimization:** Serve images optimized via Next.js `next/image` where applicable.

---

## 9. Complex Business Logic

### 9.1 Course & Batch Management
Courses are abstract templates. Batches are concrete instances where students enroll.

**Batch Rules:**
- **Status Types:** `DRAFT`, `UPCOMING`, `LIVE`, `COMPLETED`.
- **Seat Allocation:** Batches have a strict `maximumSeats` property.
- **Concurrency:** When an order is created, the system must check `currentEnrollments < maximumSeats`. Use Convex's transactional guarantees to prevent double-booking or overselling.
- **Full Batches:** Once capacity is reached, the UI must automatically switch to a "Waitlist" or "Sold Out" state.
- **Automatic Transitions:** Batches transition from `UPCOMING` to `LIVE` based on date, or manually via Admin override.

### 9.2 WhatsApp Integration
Community building is central to the Vibe Logic Studio experience.

**Integration Rules:**
- **Batch-Specific Groups:** Every batch has a dedicated WhatsApp Group Link.
- **Admin Control:** Admins must be able to input, edit, and revoke the WhatsApp link for any batch via the Admin Dashboard.
- **Post-Enrollment Popup:** Immediately upon successful payment verification and enrollment, the user must be presented with a highly visible modal containing the WhatsApp invite link for their specific batch.
- **Dashboard Access:** The WhatsApp link remains accessible in the Student Dashboard only for active enrollments in that specific batch.

---

## 10. Code Quality & Standards

We build for the long term. Code must be pristine.

### 10.1 TypeScript Standards
- **Strict Mode:** `tsconfig.json` must enforce strict mode.
- **No `any`:** The use of `any` is strictly prohibited. Use `unknown` if the type is truly dynamic, and use type guards to narrow it.
- **Interfaces vs Types:** Use `interface` for object shapes that may be extended. Use `type` for unions, intersections, and utility types.

### 10.2 Architectural Patterns
- **Feature Folders:** Organize code by feature, not by type. 
  - Good: `src/features/dashboard/{components, hooks, utils.ts}`
  - Bad: `src/components/dashboard`, `src/hooks/dashboard`
- **Small Functions:** Functions should do one thing. If a function exceeds 50 lines, it is a candidate for refactoring.
- **Shared Components:** Generic UI components (buttons, inputs, cards) belong in `src/components/ui`.
- **Reusable Hooks:** Extract complex state logic into custom hooks.

### 10.3 Error Handling
- **Graceful Degradation:** The UI should never crash. Use React Error Boundaries.
- **Backend Validation:** Validate all inputs in Convex Mutations using the Convex schema validator.
- **User Feedback:** Provide clear, localized toast notifications for both success and error states.

---

## 11. Testing & Validation

Code is not complete until it is verified.

### 11.1 Automated Checks
Before any PR is merged or code is considered complete, the following commands must run cleanly without a single warning:
- **Typecheck:** `npm run typecheck` (Executes `tsc --noEmit`)
- **Lint:** `npm run lint` (Executes ESLint and Prettier checks)
- **Build:** `npm run build` (Ensures Next.js production compilation succeeds)

### 11.2 Manual Testing Protocol
Developers and Agents must provide explicit manual testing instructions.
- Define the starting state.
- List the exact sequence of interactions.
- Define the expected side effects (e.g., "Database record is created in Convex", "UI updates instantly without a refresh", "WhatsApp modal appears").
- Test edge cases (e.g., attempting to enroll in a full batch, simulating network failure during checkout).

---
*End of Vibe Logic Studio Engineering Manual. Proceed with excellence.*