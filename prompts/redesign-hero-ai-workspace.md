# Goal
Redesign only the right-side visual of the hero section on `/ai-build-sprint` by replacing the duplicate project portfolio website preview with a sophisticated, cohesive "AI Building Workspace" that communicates the process of turning an idea into working software.

# Target Files
- `app/ai-build-sprint/_components/Hero.tsx` (To be modified)

# Requirements & Architecture
1. **Remove Duplicate Portfolio Preview Completely:**
   - Eliminate `HERO_PROJECTS` array, `iframe` embedding, snapshot toggle, project switching buttons, and floating mockups.
   - Leave the dedicated Projects section (`ProjectShowcase.tsx`) below as the exclusive showcase for real student projects.

2. **Unified AI Building Workspace Composition:**
   - Construct one unified, single-window software-building interface styled specifically for Vibe Logic Studio:
     - **Window Chrome:** Minimal macOS/studio window header with window controls, workspace title (`vibe-studio // ticket-platform-spec`), and runtime status badge.
     - **Prompt Panel:** Concise example prompt: `"Build a modern event ticketing platform with QR check-in & responsive ticket tiers"` with a subtle blinking cursor.
     - **AI Build Pipeline Activity:** Clean status rows showing progression:
       - `Structuring pages & layout` (`app/tickets/page.tsx`)
       - `Building React components` (`<TicketTierCard />`, `<QRScanner />`)
       - `Synthesizing responsive styles` (`Tailwind v4`)
       - `Edge bundle optimization` (`Next.js Turbopack`)
     - **Authentic Code Editor:** Compact, legible code editor pane with file tab (`TicketTier.tsx`), line numbers, and crisp syntax highlighting for a modular React component.
     - **Deployment Success Footer:** Compact deployment state with green indicator (`● Ready to deploy · 0 errors`), target edge route (`https://tickets.vibelogic.build`), and verified latency indicator.

3. **Design System & Aesthetics:**
   - Double-bezel concentric frame (`#191919` surface, `#2A2A2A` border, `ring-1 ring-white/10`).
   - Deep obsidian editor background (`#0D0D0D`).
   - Signature Vibe Logic Studio orange (`#FF5722`) for active prompt tags, syntax highlights, and active pipeline indicator.
   - Subtle, tasteful micro-animation: blinking cursor, no disruptive particle animations.
   - Pristine readability across desktop and mobile screens.

4. **Preserve Left Column & Page Boundaries:**
   - Keep headline, paragraph, ₹999 CTA button-in-button, curriculum anchor, and 3-step milestone tags completely intact.
   - Do NOT touch `/build-software-with-ai`, root `/`, checkout, or backend APIs.

# Acceptance Criteria
- [ ] Right-side visual replaced with the cohesive AI Building Workspace.
- [ ] Zero duplicate project previews, iframes, or project switcher tabs in Hero.
- [ ] Left column headlines, CTAs, and layout rhythm preserved.
- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm test` passes all 88 tests.
- [ ] `npm run build` succeeds cleanly.
- [ ] Mobile and desktop responsive presentation verified in the browser.

# Manual Testing Steps
1. Navigate to `http://localhost:3000/ai-build-sprint`.
2. Observe Hero section right-hand visual: verify the cohesive AI Building Workspace window.
3. Check prompt panel, build pipeline activity rows, code preview with syntax highlighting, and green deployment outcome.
4. Verify no duplicated portfolio previews from the section below.
5. Click primary CTA to verify redirect to checkout remains seamless.
