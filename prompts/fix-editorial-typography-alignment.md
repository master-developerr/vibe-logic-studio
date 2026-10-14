# Goal
Rebuild the editorial typography statement section on `/ai-build-sprint` at the glyph level using continuous, seamless vector letterforms (extended stem on 'I' in 'IMAGINE.' and extended descender on 'p' in 'SHIP IT.') and bind the vivid orange 'BUILD WITH AI' bar to scroll progress with controlled, reversible parallax motion.

# Target Files
- `app/ai-build-sprint/_components/EditorialTypography.tsx` (To be refactored)

# Requirements

## 1. Glyph-Level Typographic Architecture
- Rebuild the headline as three distinct, independently positioned typographic layers:
  1. `IMAGINE.` (top line, left-aligned)
  2. `BUILD WITH AI` (middle line, intersecting orange bar)
  3. `SHIP IT.` (bottom line, right/asymmetrically aligned)
- **Unified Letterforms (No Disconnected Rectangles)**:
  - The extended stem on 'I' must be a single continuous vertical column with matching font stroke weight, reaching upward from the baseline into the upper boundary without seams.
  - The extended descender on 'p' in `SHIP` must originate from the actual letterform—a single continuous vector path where the bowl sits on the baseline and the stem drops continuously downward deep into the section space.
  - Eliminate all detached `<span>` rectangles and arbitrary pseudo-elements.
  - Maintain matching font metrics, tight kerning (`tracking-[-0.04em]`), and heavy display proportions.

## 2. Scroll-Linked Orange Bar Motion
- The vivid orange rectangular CTA bar (`#FF5722`) must be scroll-linked:
  - At the top of the section, it sits between the upper and lower typography.
  - As the visitor scrolls down, the bar translates downward through the vertical composition in a controlled, smooth parallax motion (`translateY`).
  - Scrolling upward naturally reverses the motion with zero jumpiness.
  - Avoid competing transform animations; drive vertical motion purely via scroll interpolation with spring damping.
  - Keep the text (`PHASE // 01 · BUILD WITH AI` and `Build with AI →`) locked inside the rectangle throughout the movement.
  - Connect the CTA directly to `/checkout?courseSlug=ai-build-sprint`.

## 3. Responsive Behavior & Accessibility
- Full responsiveness:
  - Desktop: oversized scale with dramatic vertical extensions and edge-to-edge asymmetry.
  - Mobile: fluid typography, contained vertical parallax, zero horizontal overflow.
- Full `prefers-reduced-motion` support: renders a pristine static composition when reduced motion is preferred.

## 4. Scope Protection
- Only modify `app/ai-build-sprint/_components/EditorialTypography.tsx`.
- Do not modify any other sections, courses, or backend logic.

# Acceptance Criteria
- [ ] No detached or floating rectangles; extended strokes are integral parts of the 'I' and 'p' glyphs.
- [ ] The orange bar moves downward smoothly with scroll progress and reverses cleanly on scroll up.
- [ ] Text inside the orange bar stays perfectly aligned throughout the motion.
- [ ] CTA links directly to `/checkout?courseSlug=ai-build-sprint`.
- [ ] `prefers-reduced-motion` renders static layout with zero motion artifacts.
- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm test` passes all 88 test suites.
- [ ] `npm run build` succeeds.

# Validation & Checks
- [ ] TypeScript compilation passes (`npm run typecheck`)
- [ ] Automated tests pass (`npm test`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Browser visual inspection verifies glyph continuity and scroll parallax behavior

# Manual Testing Steps
1. Navigate to `http://localhost:3000/ai-build-sprint#statement`.
2. Inspect the headline: verify the letter 'I' in 'IMAGINE.' and 'p' in 'SHIP' are continuous, seamless glyphs with no detached boxes.
3. Scroll down slowly through the section: observe the orange bar gliding downward in parallax through the composition.
4. Scroll back up: observe the orange bar returning smoothly to its initial position.
5. Click "Build with AI →" and verify navigation to `/checkout?courseSlug=ai-build-sprint`.
