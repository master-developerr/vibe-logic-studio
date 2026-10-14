# Goal
Redesign the right-side visual of the hero section on `/ai-build-sprint` from a cluttered fake mockup with a floating phone into an authentic, desktop-first 16:10 landscape website showcase featuring genuine student project work with an understated prompt-to-product cue.

# Target Files
- `app/ai-build-sprint/_components/Hero.tsx` (To be modified)
- `prompts/redesign-hero-website-showcase.md` (Created)

# Requirements
- Remove the floating phone mockup and all overlapping secondary device frames.
- Remove the fake "Solstice Ceramics" mock illustration and replace it with a genuine, authentic project preview (TicketLelo default).
- Implement a 16:10 landscape desktop preview using fixed 1280×800 CSS viewport scaling via `ResizeObserver` and `transform: scale()`.
- Incorporate double-bezel / Doppelrand hardware architecture: outer dark shell with hairline border and inner compact browser core.
- Streamline the browser header: 3 minimal window dots, concise domain bar (`ticketlelo.in • 1280×800`), clean `Live` / `Snapshot` mode toggle, and direct external link.
- Add an understated prompt-to-product detail above or within the browser frame: `AI Prompt: "Build event ticketing platform with seat tier inventory"` with a live status indicator.
- Maintain the left column's typography, bold editorial tone, and primary CTAs:
  - "Build real web projects with AI."
  - "Join the Bootcamp — ₹999" (with button-in-button trailing arrow)
  - "Explore the Curriculum"
- Ensure responsive behavior: stacks naturally on mobile, scales the 1280×800 desktop preview down proportionally without horizontal scrollbars, letterboxing, or layout jumps.
- Maintain strict route isolation: do not modify `/build-software-with-ai`, `/`, checkout, or backend.

# Acceptance Criteria
- Floating phone mockup is 100% removed.
- Fake ceramic illustration is replaced with genuine project showcase.
- 16:10 landscape desktop preview renders real desktop layouts at 1280×800 scaled to container.
- Prompt-to-product detail is subtle, tasteful, and understated.
- Mobile layout stacks cleanly and scales proportionally without clipping.
- Left headline and CTAs remain prominent and functional.

# Validation & Checks
- [ ] TypeScript compilation passes (`npm run typecheck`)
- [ ] Automated tests pass (`npm test`)
- [ ] Production build succeeds (`npm run build`)

# Manual Testing Steps
1. Navigate to `http://localhost:3000/ai-build-sprint`.
2. Inspect the hero section at 1440px desktop width: verify 2-column layout, alignment with headline, authentic desktop preview, compact browser chrome, and prompt-to-product cue.
3. Test Live and Snapshot toggles on the hero preview.
4. Resize viewport to mobile (375px/390px): verify single-column natural stack, proportional preview scaling, and absence of floating phone mockup.
