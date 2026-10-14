---
name: "Vibe Logic Studio"
description: "Think it. Build it. Ship it."
colors:
  primary: "#FF5722"
  primary-hover: "#E64B17"
  surface-canvas: "#171717"
  surface-card: "#1F1F1F"
  surface-elevated: "#242424"
  surface-inset: "#0E0E0E"
  border-subtle: "#2D2D2D"
  border-default: "#333333"
  border-strong: "#3A3A3A"
  text-primary: "#FFFFFF"
  text-secondary: "#A3A3A3"
  text-muted: "#737373"
  success: "#22C55E"
  warning: "#F59E0B"
  paper: "#FAF7F2"
  ink: "#121212"
typography:
  display:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Poppins, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "GeistMono, monospace"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.12em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  card-default:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.lg}"
    padding: "20px"
---

# Design System: Vibe Logic Studio

## Overview

**Creative North Star: "The Maker's Foundry"**

Vibe Logic Studio embodies high-heat engineering energy, hot ember accents, precision developer chrome, and tactile dark surfaces. It is designed for students, non-technical founders, and builders who want to stop consuming passive courses and start forging real production software. The visual atmosphere feels like a late-night command center or engineering workshop: high-contrast dark canvas depths, 1px mechanical borders, functional status dots, and crisp typography that prioritizes scannability and build progress.

Rather than relying on sterile corporate blues or generic SaaS illustrations, the system draws its visual authority from genuine engineering artifacts: terminal logs, realistic browser chrome mockups, vector brand logos with true brand colors, live code diffs, and verified deployment URLs. The warmth comes from focused "Ember Flare" accents that ignite actions, milestone badges, and active selections.

**Key Characteristics:**
- Deep multi-tone slate surfaces (`#171717` to `#242424`) providing spatial hierarchy without heavy ambient blur.
- High-heat "Ember Flare" (`#FF5722`) deployed with surgical discipline for maximum action conversion.
- Authentic developer telemetry: live status dots (`#22C55E`), domain pills, monospaced lesson tags, and terminal windows.
- Compact, asymmetric layouts balancing clear information architecture on desktop with fluid responsive stacking on mobile.

## Colors

The palette balances intense dark slate foundations with a high-visibility warm ember accent and crisp functional feedback hues.

### Primary
- **Ember Flare** (`#FF5722`): The primary brand heat and action catalyst. Used strictly on high-conversion CTAs, active selector borders, progress highlights, and urgent milestone badges.
- **Ember Deep** (`#E64B17`): Hover state for interactive primary actions and pressed buttons.

### Secondary
- **Foundry Canvas** (`#171717`): The foundational deep dark background across core course and showcase pages.
- **Foundry Slate** (`#1F1F1F`): Primary container and card surface offering distinct tonal lift from the canvas.
- **Foundry Elevation** (`#242424`): Elevated cards, active tab backgrounds, and browser chrome top-bars.
- **Foundry Inset** (`#0E0E0E`): Deep inset surfaces for terminal viewports, code windows, and embedded browser panes.

### Neutral
- **Pure White** (`#FFFFFF`): Display headlines, prominent metric numbers, and active navigation labels.
- **Warm Parchment** (`#F1EDE4` / `#FAF7F2`): High-legibility body text and editorial light surfaces where applicable.
- **Cool Mist** (`#A3A3A3`): Secondary descriptions, explanatory subheadings, and inactive URLs.
- **Foundry Muted** (`#737373`): Monospaced timestamps, category tags, and subtle metadata labels.
- **Foundry Border Subtle** (`#2D2D2D`): Internal panel dividers and inactive element boundaries.
- **Foundry Border Default** (`#333333`): Section dividers and standard card borders.
- **Foundry Border Strong** (`#3A3A3A`): Outer window frames and modal contours.

### Functional
- **Live Terminal Green** (`#22C55E`): Live embed indicators, successful build checkmarks, and active status pulses.
- **Snapshot Amber** (`#F59E0B`): Verified production snapshot badges and warning/framing disclosures.

### Named Rules
**The Ember Rarity Rule.** Ember Flare (`#FF5722`) must never coat large background blocks or dominate layout containers. It occupies ≤10% of any viewport so its appearance instantly directs the visitor's eye to conversion and live actions.

**The Mechanical Border Rule.** Dividers and card borders use crisp 1px solid lines in calibrated slate tones (`#2D2D2D` to `#3A3A3A`), never thick decorative colored borders or fuzzy zero-offset drop halos.

## Typography

**Display Font:** Poppins (fallback: system-ui, sans-serif)  
**Body Font:** Poppins (fallback: system-ui, sans-serif)  
**Label/Mono Font:** GeistMono (fallback: ui-monospace, SFMono-Regular, Menlo, monospace)

**Character:** Clean, structural, and energetic. Geometric sans typography conveys confidence and velocity, while monospaced accents anchor the interface in developer craftsmanship.

### Hierarchy
- **Display** (Bold 700, `clamp(2.5rem, 5.5vw, 4.5rem)` [40px–72px], line-height 1.05, tracking `-0.04em`): Hero headlines and major outcome statements.
- **Headline** (Bold 700, `clamp(1.75rem, 3.5vw, 2.5rem)` [28px–40px], line-height 1.15, tracking `-0.03em`): Section headings ("From ideas to live websites", "The Developer Tool Ecosystem").
- **Title** (Semi-bold 600, `1.25rem` [20px] / `1.125rem` [18px], line-height 1.3, tracking `-0.02em`): Card titles, project names, and curriculum phase markers.
- **Body** (Regular 400, `1rem` [16px] / `0.875rem` [14px], line-height 1.6, max measure 65–75ch): Explanatory paragraphs, feature copy, and FAQ answers.
- **Body Small** (Regular 400 / Medium 500, `0.8125rem` [13px] / `0.75rem` [12px], line-height 1.5): Compact project descriptions, button labels, and secondary supporting copy.
- **Label / Caption** (Semi-bold 600, `0.6875rem` [11px] / `0.625rem` [10px], line-height 1.4, tracking `0.12em`, uppercase): Section badges (`REAL PROJECTS`, `CURRICULUM`), tool categories, status dots, and monospaced terminal specs.

### Named Rules
**The Monospace Purpose Rule.** Monospace typography is strictly reserved for code, telemetry, URLs, lesson hours, and terminal labels. Never use monospace as general decorative body copy or feature narrative.

**The Display Balance Rule.** Display and headline text must use tight negative letter-spacing (`-0.03em` to `-0.05em`) and line heights under 1.15 to prevent awkward wrapping and maintain editorial punch.

## Layout

The spatial model uses an asymmetric 12-column grid inside a centered content container capped at `1240px` (or `1280px` for hero and curriculum matrices). Padding scales smoothly from `20px` on mobile to `40px` on desktop viewports.

- **Desktop Density:** Balanced, multi-column compositions. The Project Showcase employs a compact 40% (selection & context) / 60% (contained browser preview) split that prevents vertical scroll fatigue.
- **Mobile Density:** Sequential stacking with headings leading, followed by compact interactive controls, and visual media below.
- **Spacing Rhythm:** Standard section blocks use `py-16` to `py-24` (64px–96px) with 1px border dividers (`border-[#333333]`) separating distinct content domains.

## Elevation & Depth

Vibe Logic Studio relies on **tactile tonal layering** rather than heavy diffused blur. Depth is established through stepped surface values: `#171717` (canvas floor) → `#1F1F1F` (structural card) → `#242424` (elevated interaction layer) → `#0E0E0E` (inset viewport).

### Shadow Vocabulary
- **Subtle Elevation** (`box-shadow: 0 1px 2px rgba(0,0,0,0.2)`): Standard button rest states and small chips.
- **Card Depth** (`box-shadow: 0 12px 24px -8px rgba(0,0,0,0.4)`): Browser window frames and pricing offer containers.
- **Ember Glow** (`box-shadow: 0 0 0 1px rgba(255,87,34,0.35)`): Selected project tabs, active inputs, and focused controls.

### Named Rules
**The Tonal Depth Rule.** Surfaces establish z-index hierarchy through background tone shifts and 1px borders. Heavy blurred shadows are banned on static elements and reserved solely for elevated dialogs or floating window chrome.

## Shapes

- **Form Language:** Architectural, crisp, and restrained.
- **Corners:**
  - Micro-controls & Badges: `4px` to `8px` (`rounded-md`).
  - Standard Cards & Windows: `12px` to `16px` (`rounded-xl`).
  - Hero Stages & Outer Shells: `20px` to `24px` (`rounded-2xl`).
  - Pills & Status Tags: `9999px` (`rounded-full`).
- **Clipping:** All browser and terminal window frames enforce `overflow: hidden` to ensure embedded contents, iframes, and screenshots respect the window's border radius.

## Components

### Buttons
- **Shape:** Rounded rectangle (`8px` radius).
- **Primary:** High-heat Ember background (`#FF5722`), white text (`#FFFFFF`), semi-bold 600, padding `10px 20px`.
- **Primary Hover:** Deepens to `#E64B17` with subtle scale/translate micro-motion (`translateY(-1px)`).
- **Secondary / Inset:** Dark elevated surface (`#242424`), 1px border (`#333333`), crisp white text, hover `bg-[#2A2A2A]`.

### Chips & Badges
- **Style:** Pill shape (`rounded-full`), `1px solid #333333`, background `#222222`, text `11px font-mono uppercase tracking-widest`.
- **Live State:** Includes a `6px` circular pulse dot in Live Green (`#22C55E`) or Snapshot Amber (`#F59E0B`).

### Cards & Project Selectors
- **Corner Style:** `12px` (`rounded-xl`).
- **Inactive:** Background `#1A1A1A`, border `#2C2C2C`, hover background `#202020`.
- **Active / Selected:** Background `#242424`, border `#FF5722`, subtle ember glow ring (`rgba(255,87,34,0.35)`).
- **Internal Padding:** `14px` (`p-3.5`) for compact project selectors; `24px` (`p-6`) for overview modules.

### Browser & Terminal Window Mockups
- **Header Bar:** Dark surface (`#191919`), `1px border-b #2D2D2D`, macOS traffic-light window controls (red `#FF5F56`, yellow `#FFBD2E`, green `#27C93F`), and centered URL pill with lock icon.
- **Screen Viewport:** Contained `overflow: hidden` frame maintaining strict height bounds (`~300px–360px` on desktop, `~240px` on mobile) so previews do not swallow the page.

## Do's and Don'ts

### Do:
- **Do** preserve the rare, high-contrast role of Ember Flare (`#FF5722`) for conversion actions, active states, and verified milestones.
- **Do** anchor project showcases and tool representations with real brand SVGs, live URLs, and actual student builds.
- **Do** maintain strict responsive split layouts (side-by-side on desktop, cleanly stacked on mobile) without horizontal clipping.
- **Do** wrap embedded website previews in contained browser mockups with `overflow: hidden` and explicit maximum heights.
- **Do** accompany every live embed with a visible, working "Open live website" external link.

### Don't:
- **Don't** use generic stock illustrations, abstract floating 3D shapes, or purple-pink AI gradients.
- **Don't** allow embedded iframes to expand uncontrollably or dominate full section heights.
- **Don't** use decorative monospace for long-form narrative or body paragraphs.
- **Don't** apply heavy drop shadows with zero-blur colored halos.
- **Don't** alter canonical course routes (`/build-software-with-ai`) or payment workflows when styling landing surfaces.
