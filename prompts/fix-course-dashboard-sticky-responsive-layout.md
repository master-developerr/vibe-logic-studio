# Goal
Correct the course dashboard header and section navigation behavior while preserving the existing VibeLogic Studio visual language and all application flows.

# Target Files
- `components/layout/StudentBatchWorkspaceHeader.tsx` (Modify sticky and responsive navigation layout)
- `app/dashboard/courses/[batchId]/layout.tsx` (Add layout overflow containment)
- `app/dashboard/courses/[batchId]/overview/page.tsx` (Add responsive width containment)

# Requirements
- Let the complete course identity/progress header scroll naturally as one composition.
- Keep the section navigation usable beneath the existing 72px student navbar with a single sticky navigation container.
- Keep navigation items on one line and horizontally scrollable only within the navigation strip on narrow viewports.
- Preserve existing typography, colors, spacing, cards, icons, labels, routes, and active states.
- Make mobile/tablet content fit without changing data, authentication, payment, enrollment, or backend behavior.

# Acceptance Criteria
- The course title does not independently remain attached to the viewport while the page scrolls.
- The section navigation remains usable and reaches all tabs on mobile without page-wide horizontal overflow.
- Desktop layout and visual styling remain unchanged apart from corrected scroll positioning.
- No backend, API, authentication, payment, enrollment, or course-access files are modified.

# Validation & Checks
- [ ] TypeScript compilation passes
- [ ] ESLint reports no new warnings/errors
- [ ] Build succeeds

# Manual Testing Steps
1. Open `/dashboard/courses/[batchId]/overview` at desktop width.
2. Scroll down and confirm the title/header scrolls away as one unit while the section navigation remains positioned below the student navbar.
3. Open the same route at mobile/tablet widths.
4. Swipe the section navigation horizontally and verify Notes and later tabs are reachable without page-wide horizontal scrolling.
