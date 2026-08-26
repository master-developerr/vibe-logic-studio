# Goal
Correct the course dashboard's responsive scrolling modes without changing its visual design or application behavior.

# Target Files
- `components/layout/StudentBatchWorkspaceHeader.tsx` (Keep the desktop header coherent and isolate tab scrolling; wrap tabs on mobile)
- `app/dashboard/layout.tsx` (Contain page-level horizontal overflow)

# Requirements
- At `md` and wider, keep the course header and section navigation together as one sticky region.
- Allow only the section navigation strip to horizontally scroll on desktop/tablet, with a thin visible scrollbar.
- At mobile widths, disable horizontal navigation scrolling and wrap all section links within the viewport.
- Preserve existing tab labels, icons, active styling, typography, colors, spacing, and cards.
- Do not modify backend, authentication, payments, enrollment, course access, or data behavior.

# Acceptance Criteria
- Desktop/tablet tabs remain accessible without page-level horizontal overflow.
- The full desktop course header remains structurally coherent while scrolling.
- Mobile content and navigation reflow with no horizontal scrolling.
- Existing desktop visual design remains unchanged apart from scroll behavior.

# Validation & Checks
- [ ] TypeScript compilation passes
- [ ] ESLint has no new errors
- [ ] Production build succeeds

# Manual Testing Steps
1. Open the course overview at desktop width and scroll vertically.
2. Confirm the course header remains coherent and only the tab strip scrolls horizontally.
3. Resize to tablet and confirm the tab scrollbar remains confined to the tab strip.
4. Resize below the mobile breakpoint and confirm tabs wrap and the page has no horizontal overflow.
