# Goal
Redesign and refine the "IMAGINE → SHIP" Editorial Manifesto section on `/ai-build-sprint` (`app/ai-build-sprint/_components/EditorialTypography.tsx`) to eliminate excessive vertical gaps, structurally integrate the orange phase band without floating cards or glow, ensure mathematically seamless alignment for the vertical typographic extensions, and implement correct scroll-linked reveal directions (IMAGINE revealed from top downward to letter; SHIP revealed from letter downward to section bottom).

# Target Files
- `app/ai-build-sprint/_components/EditorialTypography.tsx` (To be refactored)

# Requirements

## 1. Vertical Spacing Compression
- Drastically compress section vertical space (reduce top/bottom padding from ~144px to ~48-64px).
- Sequence:
  `MANIFESTO METADATA` → `IMAGINE.` → `ORANGE PHASE BAND` → `SHIP.` → `COHORT METADATA`.
- Remove large blank gaps between lines and metadata.
- Entire composition fits comfortably within a single desktop viewport while maintaining bold typography.

## 2. Integrated Orange Phase Band (No Floating Card / No Glow)
- Eliminate floating card appearance, rounded pill styling, and excessive glowing shadow (`shadow-[0_16px_40px_rgba(255,87,34,0.32)]`).
- Structure as a solid horizontal editorial band (`h-[72px]-h-[84px]`) integrated into the container grid.
- Keep content: `PHASE // 01` badge, `BUILD WITH AI` bold title, and `Build with AI →` interactive link.
- Remove independent secondary parallax drift that caused it to float detached across typography.

## 3. "IMAGINE." Typography & Extension Architecture
- Text is `IMAGINE.`.
- Vertical extension originates at the top section boundary and extends DOWNWARD to meet the stem of "I".
- Extension and "I" stem share identical width, color (`#F1EDE4`), and optical center with zero horizontal drift or offset.
- Scroll-driven reveal: at 0% scroll progress through the section, the extension is hidden at the top; as the user scrolls, it physically draws/reveals downward to connect with the "I".

## 4. "SHIP." Typography & Extension Architecture
- Text is `SHIP.`.
- Extension originates from the typography (stem of letter) and extends DOWNWARD toward the bottom boundary.
- Scroll-driven reveal: as user scrolls through the section, the extension physically draws downward toward the bottom edge. It does NOT rise or grow upward from the bottom.
- Two complementary scroll-linked movements:
  - IMAGINE: revealed from TOP downward.
  - SHIP: revealed from LETTER downward.

## 5. Grid Alignment & Editorial Typography
- Standard container alignment (`max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12`).
- Manifesto index label, supporting description, giant typography, orange band, and cohort details all share the exact same grid boundaries.
- Respect `prefers-reduced-motion` with static fully-drawn extensions.

# Acceptance Criteria
- [ ] Section vertical height is compressed and cohesive without excessive empty gaps.
- [ ] Orange phase bar is structurally integrated, with no heavy glow or floating-card elevation.
- [ ] "IMAGINE." upper extension is revealed downward from the top of the section to the "I".
- [ ] "SHIP." lower extension extends downward from the letter to the bottom of the section.
- [ ] No detached or floating white rectangles.
- [ ] Responsive layout on mobile without horizontal overflow.
- [ ] All automated tests (`npm test`) pass.
- [ ] TypeScript compilation (`npm run typecheck`) passes.

# Validation & Checks
- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm test` passes all tests.
- [ ] Visual verification via browser subagent on `/ai-build-sprint#statement`.

# Manual Testing Steps
1. Navigate to `/ai-build-sprint#statement`.
2. Observe vertical compactness: verify that the manifesto label, IMAGINE., orange phase bar, SHIP., and cohort metadata form a tight, architectural editorial block.
3. Scroll down into section: verify IMAGINE stroke reveals downward from the top edge to the I.
4. Scroll further down: verify SHIP stroke extends downward from the letter toward the bottom border.
5. Verify orange phase bar is cleanly grounded between IMAGINE. and SHIP. without floating glow or detached parallax.
