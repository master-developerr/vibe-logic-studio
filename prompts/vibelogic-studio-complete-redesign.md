# Goal
Redesign the existing Vibe Logic Studio homepage (`app/page.tsx` and its modular section components in `app/_components/home/`) into a distinctive, premium editorial technology education brand without modifying backend schemas, payment workflows, checkout architecture, or authentication logic.

# Target Files
- `app/globals.css` (To be updated with warm ivory palette, refined typography, and layout tokens)
- `app/page.tsx` (To be updated to orchestrate the new editorial section structure)
- `app/_components/home/Navbar.tsx` (To be redesigned: compact, sticky, warm ivory with wordmark and direct enrolment CTA)
- `app/_components/home/Hero.tsx` (To be redesigned: "Build real web projects with AI", realistic software desktop + mobile visual, primary + secondary CTAs)
- `app/_components/home/ToolEcosystem.tsx` (To be created: curated 4-group developer ecosystem grid with authentic brand logos)
- `app/_components/home/LearningExperience.tsx` (To be created: 4-benefit editorial layout replacing repetitive feature cards)
- `app/_components/home/ProjectShowcase.tsx` (To be refined/re-engineered: high-contrast dark section with realistic desktop/mobile responsive project previews)
- `app/_components/home/CurriculumSection.tsx` (To be updated: compact 7-module editorial list/accordion using canonical course curriculum)
- `app/_components/home/StudentOutcomes.tsx` (To be created: honest teaching demonstration and verified feedback without fabricated counts)
- `app/_components/home/PricingOffer.tsx` (To be created/updated: high-conversion ₹999 offer section linked directly to `/checkout?courseSlug=ai-build-sprint`)
- `app/_components/home/FAQ.tsx` (To be updated: accessible keyboard-friendly accordion with real bootcamp answers)
- `app/_components/home/FinalCTA.tsx` (To be redesigned: near-black, oversized typography "Your ideas deserve to be built.", ₹999 highlight)
- `app/_components/home/Footer.tsx` (To be updated: clean editorial footer with brand mark, tagline, real links, and copyright)

# Requirements
- **Brand & Visual System:**
  - Warm ivory primary surfaces (`#F1EDE4`), near-black high-contrast sections (`#171717`), selective bright orange accents (`#FF5722`), muted stone (`#D7D0C4`), and optional muted sage (`#D9E4D6`).
  - Strict anti-slop rules: ban generic AI purple-pink gradients, neon glows, repetitive 3-card grids, floating blobs, and abstract orbs.
  - Realistic software UI visuals constructed with CSS/HTML (browser chrome, responsive tabs, code editor view, live preview).
- **Tool Ecosystem Organization:**
  - 4 clean categories: Programming & Frontend, Backend & Database & Deployment, AI & Coding Tools, Developer & Design Tools.
  - Authentic vector logos, aligned sizing, restrained typography, no marquee sticker wall.
- **Canonical Data & Route Preservation:**
  - Primary CTA connects directly to existing checkout: `/checkout?courseSlug=ai-build-sprint` (and secondary anchor to `#curriculum` / `/build-software-with-ai`).
  - Curriculum reflects actual 7 modules: 7 days, 7 live instruction hours, recorded lifetime access.
  - No duplicated course models, parallel checkout routes, or database schema modifications.
- **Responsive Layout & Accessibility:**
  - Fully tested on Desktop (1440px, 1366px), Tablet (768px), and Mobile (390px, 360px).
  - Keyboard accessible accordions (`aria-expanded`, `aria-controls`), semantic HTML headings (`h1` through `h4`), visible focus rings.
  - Support `prefers-reduced-motion`.

# Acceptance Criteria
- Homepage features all 10 core editorial sections in sequence with consistent typography and palette.
- All enrolment buttons route directly to the active purchase flow (`/checkout?courseSlug=ai-build-sprint`).
- Zero console errors or layout shift regressions.
- Existing test suite (88/88 tests across 19 suites) continues to pass.
- `npm run typecheck` passes with 0 errors.
- `npm run build` succeeds cleanly.

# Validation & Checks
- [ ] TypeScript compilation passes (`npm run typecheck`)
- [ ] Automated test suite passes (`npm test`)
- [ ] Next.js production build compiles (`npm run build`)
- [ ] No regression on checkout or payment routes

# Manual Testing Steps
1. Navigate to `/` on desktop (1440px) and inspect typography, visual hierarchy, and color tokens.
2. Click "Join the Bootcamp — ₹999" in Navbar, Hero, Pricing, and Final CTA — verify each lands on `/checkout?courseSlug=ai-build-sprint` with prefilled cohort and ₹999 price.
3. Test curriculum and FAQ accordions with keyboard (Tab + Enter/Space) and verify smooth collapse/expansion.
4. Resize viewport to 390px mobile width and confirm zero horizontal overflow or clipping.
