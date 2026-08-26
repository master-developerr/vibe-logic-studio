# Goal
Make the existing course dashboard header region remain sticky beneath the global student navbar during vertical scrolling.

# Target Files
- `components/layout/StudentBatchWorkspaceHeader.tsx` (Make the existing complete header region sticky)
- `app/dashboard/layout.tsx` (Remove the ancestor overflow scrolling context that interferes with sticky positioning)

# Requirements
- Keep breadcrumb, title, progress card, metadata, tabs, and the existing tab scrollbar together in one sticky region.
- Use the existing 72px student navbar height as the sticky offset.
- Keep the existing tab strip horizontal scrolling unchanged.
- Preserve the opaque surface, borders, spacing, typography, colors, and all content.
- Do not modify mobile layout, backend behavior, authentication, payments, enrollment, or business logic.

# Acceptance Criteria
- The entire course-header region remains visible beneath the global navbar during vertical scrolling.
- Course content scrolls behind the opaque header region without visual bleed-through.
- Existing tab scrolling remains confined to the tab strip.
- No application flow or backend source is changed.

# Validation & Checks
- [ ] TypeScript compilation passes
- [ ] ESLint has no new errors
- [ ] Production build succeeds

# Manual Testing Steps
1. Open `/dashboard/courses/[batchId]/overview`.
2. Confirm the initial header appearance is unchanged.
3. Scroll to the middle and bottom of the page.
4. Confirm the complete header remains beneath the global navbar.
5. Confirm tabs still scroll horizontally within their existing strip.
6. Scroll back to the top and confirm the header returns naturally.
