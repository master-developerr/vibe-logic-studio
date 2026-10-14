# Goal
Implement a premium, scroll-animated editorial statement section on `/ai-build-sprint` featuring oversized typography with dramatic vertical letter extensions, tight kerning, asymmetrical word layout, an intersecting vivid orange rectangular CTA bar, and choreographed reveal animations.

# Target Files
- `app/ai-build-sprint/_components/EditorialTypography.tsx` (To be created)
- `app/ai-build-sprint/page.tsx` (To be modified to mount the new section)

# Requirements

## 1. Editorial Typography & Art Direction
- **Full-width near-black canvas**: `bg-[#111111]` with subtle architectural grain/border framing (`border-b border-[#262626]`).
- **Oversized Headline ("IMAGINE. BUILD WITH AI. SHIP IT.")**:
  - Asymmetric editorial layout spanning nearly edge-to-edge on desktop.
  - Upper headline: "IMAGINE." in heavy display typography (`#F1EDE4`) with an extended vertical stem reaching upwards.
  - Intersecting CTA bar: Vivid International Orange (`#FF5722`) rectangular bar that physically cuts through and intersects the typography composition. Inside it: "BUILD WITH AI" with a functional "Build with AI →" clickable link.
  - Lower headline: "SHIP IT." with an elongated descender on the letter "P" that extends dramatically toward the bottom edge.
  - Tight line-height (`leading-[0.82]`) and tight negative tracking (`tracking-[-0.04em]`).
  - True letterforms constructed with precision SVG/CSS geometry (never disproportionate font stretching).

## 2. Supporting Content & Bootcamp Specifications
- **Understated supporting paragraph on right**:
  - *"Seven days. Real projects. Go from an idea to a live website using modern AI tools."* (max-w-[42ch], text-[#A3A3A3]).
- **Minimal index label**:
  - `01 / AI BUILD SPRINT` minimal studio vertical or inline badge with thin divider lines.
- **Accurate bootcamp details (bottom-left)**:
  - `7 Days · 7 Modules · 7 Live Hours · Lifetime Recordings` with green production indicator.
- **Functional CTA Hand-off**:
  - Orange bar connects directly to `/checkout?courseSlug=ai-build-sprint` (preserves ₹999 launch price and direct gateway flow).

## 3. Choreographed Scroll Motion
- **Section Entrance**: Masked vertical reveal as the section enters the viewport.
- **Orange Rectangle Sweep**: Horizontal clipped reveal (`scaleX` from left or `clipPath: inset(0% 100% 0% 0%)` -> `clipPath: inset(0% 0% 0% 0%)`) slicing through the text composition.
- **Descender & Lower Headline Reveal**: "SHIP IT." reveals with its elongated "P" descender sliding into place.
- **Secondary Details Fade**: Supporting paragraph, index label, and bootcamp stats drift in smoothly.
- **Accessible & Performant**: Uses Framer Motion / CSS transforms; fully respects `prefers-reduced-motion` with static fallback. No scroll-jacking or layout shifts.

## 4. Scope Protection & Isolation
- Added exclusively to `/ai-build-sprint`.
- Does NOT replace the Hero, Tool Ecosystem Marquee, Project Showcase, Curriculum, Pricing, or FAQ.
- `/build-software-with-ai`, root `/`, checkout, and backend Convex APIs remain 100% untouched.

# Acceptance Criteria
- [ ] Oversized typography with extended ascender on upper headline and extended "P" descender on lower headline.
- [ ] Vivid orange rectangle physically intersects the typographic composition with clickable "Build with AI →" CTA.
- [ ] Accurate bootcamp specifications (7 days, 7 modules, 7 live hours, lifetime access).
- [ ] Smooth choreographed scroll entrance and sweep animation with `prefers-reduced-motion` support.
- [ ] Full responsiveness across desktop (1440px) and mobile (390px) without horizontal overflow.
- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm test` passes all 88 test suites.
- [ ] `npm run build` compiles cleanly.

# Validation & Checks
- [ ] TypeScript compilation passes (`npm run typecheck`)
- [ ] Automated tests pass (`npm test`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Browser visual inspection via browser subagent confirms responsive layout and smooth animation

# Manual Testing Steps
1. Navigate to `http://localhost:3000/ai-build-sprint`.
2. Scroll from the Hero and Tool Ecosystem down through the page.
3. Observe the Editorial Typography section entrance: headline mask reveals, vivid orange bar sweeps across the composition, and the extended "P" descender settles into place.
4. Click "Build with AI →" on the orange bar and confirm navigation to `/checkout?courseSlug=ai-build-sprint`.
5. Verify on mobile viewport (390px) that typography wraps fluidly without clipping or horizontal overflow.
