# Goal

Create a responsive, conversion-focused VibeLogic Studio landing page that presents the flagship AI-development bootcamp as a premium AI startup product rather than a conventional LMS.

# Target Files

- `app/page.tsx` (replace starter page)
- `app/globals.css` (replace starter styles and add design tokens)
- `app/layout.tsx` (update metadata)

# Requirements

- Use the supplied reference only for its pacing, hierarchy, and editorial dark-surface composition; use wholly original VibeLogic branding and visuals.
- Build a desktop-first responsive page with a dark neutral palette and one warm orange accent.
- Include: navigation, split hero with a software-interface visual, key statistics, about/value section, flagship bootcamp, coming-soon course cards, curriculum, seven-day project timeline, technology stack, WhatsApp-style student reviews, FAQ, final CTA, and footer.
- Make the flagship enrolment CTA point to `/sign-in?redirect_url=/checkout` as the safe unauthenticated route placeholder. Keep coming-soon CTAs disabled.
- Use no new third-party dependencies; use semantic HTML, accessible labels, keyboard-focus styles, and CSS-only low-cost motion that honours `prefers-reduced-motion`.
- Add accurate SEO metadata in `app/layout.tsx`.

# Acceptance Criteria

- The landing page is fully responsive, visually polished, original, and communicates the product proposition within the hero.
- Every specified content area is represented and the primary conversion path is visually clear.
- Links and disabled actions expose clear accessible states.
- No external image requests or copied brand assets are used.

# Validation & Checks

- [ ] ESLint completes without errors.
- [ ] Next.js production build completes successfully.

# Manual Testing Steps

1. Run `npm run dev` and open the root route.
2. Check the layout at desktop, tablet, and 375px mobile widths.
3. Activate a flagship `Enroll now` CTA and verify it targets `/sign-in?redirect_url=/checkout`.
4. Verify coming-soon buttons are disabled and announce their status.
5. Navigate via keyboard and confirm focus indicators are visible.
6. Enable reduced-motion in the operating system and confirm decorative movement is removed.
