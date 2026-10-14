# Goal
Execute a comprehensive `/redesign-existing-projects` audit and targeted polish upgrade on `/ai-build-sprint` to refine visual depth, unify concentric double-bezel styling, polish tactile micro-interactions, and elevate typography rhythm across all remaining sections.

# Target Files
- `app/ai-build-sprint/_components/ProjectShowcase.tsx` (To be upgraded: concentric double-bezel chassis, ambient lighting gradient, tactile tab depression, typography tracking)
- `app/ai-build-sprint/_components/CurriculumSection.tsx` (To be polished: refined module cards depth, active day pill tracking, optical typography balance)
- `app/ai-build-sprint/_components/StudentOutcomes.tsx` (To be polished: verified student quote cards, terminal glow, optical alignment)
- `app/ai-build-sprint/_components/PricingOffer.tsx` (To be polished: concentric bezel, tactile trust micro-copy, refined contrast)

# Requirements & Planned Upgrades
1. **Surface Depth & Concentric Bezel Unification (`ProjectShowcase.tsx`)**:
   - Upgrade the project preview container from a basic single-border box to a concentric double-bezel chassis matching the Hero AI Workspace (`bg-[#1A1A1A] p-2 rounded-2xl border border-[#2D2D2D] ring-1 ring-white/10`).
   - Add a subtle, restrained ambient radial glow at the top of the dark section (`radial-gradient(ellipse 60% 30% at 50% 0%, rgba(255,87,34,0.06), transparent)`) to break digital flatness.
   - Add `active:scale-[0.98]` physical depression to all project selector buttons.

2. **Typography & Optical Rhythm**:
   - Enforce optical tracking (`tracking-[-0.03em]` to `tracking-[-0.035em]`) and `[text-wrap:balance]` on all display headlines.
   - Ensure paragraph copy is strictly bounded to `max-w-[65ch]` for optimal reading cadence.
   - Maintain monospace tabular numerals (`tabular-nums font-mono`) for metrics and days.

3. **Micro-Motion & Interactive Feedback**:
   - Ensure all clickable tabs, accordions, and external links incorporate `active:scale-[0.98]` and smooth cubic-bezier easing (`ease-[cubic-bezier(0.16,1,0.3,1)]`).
   - Validate keyboard focus rings (`focus-visible:ring-2 focus-visible:ring-[#FF5722] focus-visible:ring-offset-2`).

4. **Scope Isolation**:
   - Modify ONLY `/ai-build-sprint` and its isolated components.
   - Do NOT touch `/build-software-with-ai`, root `/`, checkout, or backend APIs.

# Acceptance Criteria
- [ ] Concentric double-bezel chassis applied to `ProjectShowcase` browser mockup.
- [ ] Ambient lighting gradient added to dark anchor section without visual clutter.
- [ ] Tactile `active:scale-[0.98]` applied across all selector tabs.
- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm test` passes 88/88 tests.
- [ ] `npm run build` compiles successfully.
