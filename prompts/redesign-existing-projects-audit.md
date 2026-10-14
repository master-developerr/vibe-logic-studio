# Goal
Execute a comprehensive `/redesign-existing-projects` design audit and targeted polish upgrade on the `/ai-build-sprint` course landing page to eliminate generic patterns, elevate tactile surfaces, unify interactive states, and deliver an uncompromising, world-class software studio aesthetic.

# Target Files
- `app/ai-build-sprint/_components/Navbar.tsx` (To be refined: skip-to-content link, active focus rings, micro-interactions)
- `app/ai-build-sprint/_components/LearningExperience.tsx` (To be refined: tactile card surfaces, balanced headlines, mono indices)
- `app/ai-build-sprint/_components/BuildProcess.tsx` (To be refined: active indicator progress bar, optical balance, tactile mockups)
- `app/ai-build-sprint/_components/CurriculumSection.tsx` (To be refined: signature button-in-button CTA, smooth easing, tabular metrics)
- `app/ai-build-sprint/_components/StudentOutcomes.tsx` (To be refined: refined terminal bezel, optical quote alignment, verified badge)
- `app/ai-build-sprint/_components/PricingOffer.tsx` (To be refined: signature button-in-button CTA, tactile dark surface depth, tabular pricing)
- `app/ai-build-sprint/_components/FAQ.tsx` (To be refined: balanced headlines, spring-like accordion rotation, refined contact box)
- `app/ai-build-sprint/_components/FinalCTA.tsx` (To be refined: signature button-in-button CTA, optical letter-spacing, tactile secondary CTA)
- `app/ai-build-sprint/_components/Footer.tsx` (To be refined: editorial typography hierarchy, crisp legal links, studio badge)

# Strict Scope & Boundary Rules
- Modify ONLY `/ai-build-sprint` and its isolated components in `app/ai-build-sprint/_components/`.
- DO NOT touch `/build-software-with-ai` (must stay 100% identical).
- DO NOT touch the root homepage `/`.
- DO NOT touch `/checkout?courseSlug=ai-build-sprint`, Razorpay APIs, Clerk auth, or Convex backend logic.
- DO NOT push to Git (`git push`) or deploy to Vercel without explicit instruction.

# Requirements & Planned Upgrades

## 1. Typography & Hierarchy Refinements
- Add `text-wrap: balance` and optical tracking (`tracking-[-0.03em]`) to all major section titles (`h2`) and module headings (`h3`).
- Constrain all descriptive body copy to `max-w-[65ch]` to guarantee comfortable reading line lengths.
- Enable `tabular-nums` on all numbers, day counters, pricing numerals, and performance metrics.

## 2. Surfaces, Depth & Tactile Double-Bezel Styling
- Upgrade light card containers from generic flat borders to tactile dual-tone surfaces:
  - Add subtle inner border refraction (`ring-1 ring-inset ring-black/5` on light cards, `ring-1 ring-inset ring-white/10` on dark cards).
  - Use calibrated multi-layer shadows (`shadow-[0_2px_8px_-2px_rgba(23,23,23,0.06),0_1px_3px_-1px_rgba(23,23,23,0.04)]`) tinted to the `#171717` neutral family.
- Enhance the dark terminal demonstration in `StudentOutcomes.tsx` and dark offer card in `PricingOffer.tsx` with refined obsidian depth.

## 3. Studio Brand Uniformity (Signature Button-in-Button CTAs)
- Unify the dominant action buttons across `PricingOffer`, `CurriculumSection` footer, and `FinalCTA` to adopt the signature button-in-button design pattern introduced in `Hero.tsx` (high-contrast orange button with nested circular icon pod and `active:scale-[0.98]` physical feedback).

## 4. Interactivity & Micro-Motion
- Standardize all clickable cards, tab selectors, and accordion triggers with tactile `active:scale-[0.98]` press feedback.
- Replace generic ease transitions with physical spring-like curves (`transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]`).
- Add visible keyboard focus-visible rings (`focus-visible:ring-2 focus-visible:ring-[#FF5722] focus-visible:ring-offset-2`).
- Add accessible "Skip to main content" link to `Navbar.tsx`.

## 5. Blueprint Monospace Indexing
- Standardize eyebrow section badges with crisp studio notation (e.g. `[01] // PROGRESSION`, `[02] // PROCESS`, `[03] // CURRICULUM`, `[04] // EVIDENCE`, `[05] // INVESTMENT`, `[06] // FAQ`).

# Acceptance Criteria
- [ ] Visual polish pass applied cleanly to all target components on `/ai-build-sprint`.
- [ ] No regression on Hero preview scaling, Diligence Live framing toggle, or Tool Marquee.
- [ ] No changes made to `/build-software-with-ai` or `/`.
- [ ] All checkout links continue to point accurately to `/checkout?courseSlug=ai-build-sprint`.
- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm test` passes 88/88 tests.
- [ ] `npm run build` succeeds cleanly.

# Validation & Checks
- [ ] TypeScript compilation passes (`npm run typecheck`)
- [ ] Test suite passes (`npm test`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Visual review of `/ai-build-sprint` across desktop (1440px) and mobile (390px)

# Manual Testing Steps
1. Navigate to `http://localhost:3000/ai-build-sprint`.
2. Scroll through all sections and verify typography balance, tactile card depth, and crisp monospace eyebrow tags.
3. Test interaction: click through the 5 Build Process tabs and verify active indicator transition.
4. Expand curriculum modules and FAQ items; verify smooth spring-like open/close motion.
5. Click primary CTAs and verify physical `active:scale-[0.98]` feedback and seamless redirection to `/checkout?courseSlug=ai-build-sprint`.
