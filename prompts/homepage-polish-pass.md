# Goal

Production-quality polish of the existing VibeLogic Studio public homepage at `/`. The creative direction is approved — the task is to elevate execution quality: typography scale, layout width, responsive behavior, component modularity, micro-interactions, and The Lab visual realism.

# Target Files

- `app/page.tsx` (Modified — becomes thin orchestrator)
- `app/_components/home/ScrollReveal.tsx` (Created)
- `app/_components/home/Navbar.tsx` (Created)
- `app/_components/home/Hero.tsx` (Created)
- `app/_components/home/MetricsStrip.tsx` (Created)
- `app/_components/home/StudioIntro.tsx` (Created)
- `app/_components/home/Manifesto.tsx` (Created)
- `app/_components/home/SystemDiagram.tsx` (Created)
- `app/_components/home/FeaturedCourse.tsx` (Created)
- `app/_components/home/Lab.tsx` (Created)
- `app/_components/home/BuildPipeline.tsx` (Created)
- `app/_components/home/ProductShowcase.tsx` (Created)
- `app/_components/home/CourseIndex.tsx` (Created)
- `app/_components/home/BrandStatement.tsx` (Created)
- `app/_components/home/FAQ.tsx` (Created)
- `app/_components/home/FinalCTA.tsx` (Created)
- `app/_components/home/Footer.tsx` (Created)
- `app/globals.css` (Modified — easing vars, keyframes, reveal utilities)

# Requirements

- Preserve existing creative direction (warm off-white, black typography, orange accent, alternating dark sections)
- Hero becomes split composition: left text + right dark product artifact panel
- Typography scales to 72–110px on display elements
- Max content width: 1280px with px-8 lg:px-12
- All sections have intentional mobile collapse at 390/768/1024px
- The Lab shows realistic code editor with line numbers, syntax highlighting, blinking cursor
- Scroll-reveal animations using IntersectionObserver + CSS (no new libraries)
- No modification to /build-software-with-ai, /dashboard, auth, Convex, or payment routes
- Courses 02–04 remain "Coming Soon" at 50% opacity
- All CTAs route correctly: Get Started → /build-software-with-ai, course row 01 → /build-software-with-ai

# Acceptance Criteria

- [ ] Homepage has distinct VibeLogic Studio identity
- [ ] Current creative direction preserved (NOT replaced)
- [ ] /build-software-with-ai page is untouched
- [ ] All other routes untouched
- [ ] Typography has strong visual hierarchy (display at 72–110px)
- [ ] Desktop layout uses max-w-[1280px] with generous padding
- [ ] Mobile layout is intentionally designed (no overflow, no breakage)
- [ ] The Lab looks like a realistic code editor
- [ ] Black sections are visually impactful
- [ ] Orange accent is restrained and intentional
- [ ] No TypeScript errors
- [ ] No build errors
- [ ] No console errors
- [ ] No horizontal overflow

# Validation & Checks

- [ ] TypeScript compilation passes (`npm run typecheck`)
- [ ] ESLint throws no warnings/errors (`npm run lint` if available)
- [ ] Build succeeds (`npm run build`)

# Manual Testing Steps

1. Navigate to `/` — homepage loads without console errors
2. Scroll through all sections — reveals animate in on enter
3. Click "Get Started" in navbar → `/build-software-with-ai`
4. Click "Explore Courses" CTA → `/build-software-with-ai`
5. Click course row 01 → `/build-software-with-ai`
6. Click "Sign In" → Clerk auth flow
7. Resize to 390px width — no horizontal scroll, all sections stack correctly
8. Navigate to `/build-software-with-ai` — must be visually identical to pre-polish
9. Navigate to `/dashboard` — must be unaffected
