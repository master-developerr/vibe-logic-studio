# Goal
Implement scroll-animated vertical typography extensions on `/ai-build-sprint` where the upper vertical stroke originating from 'I' in 'IMAGINE.' dynamically grows upward across the section boundary into the ivory section, and the lower vertical stroke originating from 'P' in 'SHIP IT.' dynamically grows downward toward the bottom boundary, both driven by scrubbed scroll progress.

# Target Files
- `app/ai-build-sprint/_components/EditorialTypography.tsx` (To be updated with scroll-growing extensions, overflow-visible, and unified glyph alignment)

# Requirements

## 1. Typography & Glyph Integration
- Preserve the three-line editorial composition:
  - `IMAGINE.` (Line 1)
  - `BUILD WITH AI` (Line 2 in vivid orange bar)
  - `SHIP IT.` (Line 3)
- Keep headline words completely stable and properly kerned. The words themselves do NOT jump, slide, or scale.
- Upper stroke connects seamlessly to the letter 'I' in `IMAGINE.` with matching stem width.
- Lower stroke connects seamlessly to the vertical stem of the uppercase 'P' in `SHIP` with matching stem width.
- Eliminate all detached or floating boxes.

## 2. Scroll-Linked Extension Growth
- **Upper Extension Growth**:
  - Anchored at the top of the letter 'I' (`transformOrigin: "bottom"`).
  - As user scrolls into and through the section, the stroke extends upward, crossing the top border of the black section and projecting into the preceding ivory section.
  - Section `#statement` must use `overflow-visible` (with page `overflow-x-hidden`) and `z-20` so the extension is not clipped.
  - High-contrast visibility across both dark and light sections (using `mix-blend-mode: difference` or two-tone precision).
- **Lower Extension Growth**:
  - Anchored at the baseline of the letter 'P' (`transformOrigin: "top"`).
  - As user scrolls through the section, the stroke extends downward toward the bottom boundary of the black section.
- **Controlled Reversibility**:
  - Bound directly to `scrollYProgress` using Framer Motion `useScroll` + `useTransform` + `useSpring`.
  - Scrolling upward smoothly reverses the extension growth.

## 3. Secondary Parallax Orange Bar
- The orange `BUILD WITH AI` bar translates vertically in secondary parallax while remaining horizontally aligned with its CTA button (`Build with AI →`).
- Links directly to `/checkout?courseSlug=ai-build-sprint`.

## 4. Accessibility & Reduced Motion
- Respects `prefers-reduced-motion`: renders the final static composition with full extensions visible and zero motion when reduced motion is preferred.

# Acceptance Criteria
- [ ] Upper stroke originates from 'I' and grows upward across the section boundary into the ivory section on scroll.
- [ ] Lower stroke originates from 'P' and grows downward toward the bottom edge on scroll.
- [ ] Headline words remain stable and do not drift or scale.
- [ ] Extensions do not suffer from clipping by overflow ancestors.
- [ ] Scrolling backward smoothly reverses the extensions.
- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm test` passes all 88 tests.
- [ ] `npm run build` succeeds.

# Validation & Checks
- [ ] TypeScript compilation passes (`npm run typecheck`)
- [ ] Automated tests pass (`npm test`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Browser visual inspection via subagent confirms upper stroke crossing into ivory section and lower stroke growing toward bottom

# Manual Testing Steps
1. Navigate to `http://localhost:3000/ai-build-sprint#statement`.
2. Scroll slowly down: verify upper stroke grows upward across the border into the ivory section above, and lower stroke grows downward from 'P'.
3. Scroll backward: verify both strokes retract smoothly.
4. Verify typography alignment remains stable.
