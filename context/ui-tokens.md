# UI Tokens

Design tokens for VibeLogic Studio. All colors, typography, spacing, and component values extracted from the delivered UI Design System. Use these exact values throughout the codebase — never hardcode colors or use raw Tailwind color classes in components.

---

## How to Use

This project uses **Tailwind CSS v4**. All design tokens are defined using the `@theme` directive in `app/globals.css`. No `tailwind.config.ts` needed for colors or tokens.

Tailwind v4 automatically generates utility classes from `@theme` variables:

- `--color-primary` → `bg-primary`, `text-primary`, `border-primary`
- `--color-surface` → `bg-surface`, `text-surface`, `border-surface`

```tsx
// Correct — uses generated utility classes
className="bg-surface text-text-primary border-border"

// Also correct — references CSS variable directly
style={{ color: 'var(--color-text-primary)' }}

// Never — hardcoded hex values
className="bg-[#0D0D0D] text-[#525252]"

// Never — raw Tailwind color classes
className="bg-orange-500 text-gray-800"
```

---

## globals.css — Complete Token Definition

```css
@import "tailwindcss";

@theme {
  /* Font */
  --font-sans: "Inter", sans-serif;

  /* Page and surface backgrounds */
  --color-background: #faf7f3;
  --color-surface: #ffffff;

  /* Borders */
  --color-border: #e6e2dc;

  /* Text */
  --color-text-primary: #0d0d0d;
  --color-text-secondary: #525252;
  --color-text-muted: #8a8a8a;

  /* Primary accent — orange */
  --color-primary: #ff5a1f;
  --color-accent: #ff5a1f;
  
  /* Secondary — dark */
  --color-secondary: #0d0d0d;

  /* Status Colors */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;

  /* Border radius */
  --radius-2xs: 2px;
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-2xl: 32px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0px 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0px 4px 8px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0px 12px 24px rgba(0, 0, 0, 0.12);
  --shadow-xl: 0px 20px 40px rgba(0, 0, 0, 0.16);

  /* Spacing */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-10: 40px;
  --spacing-12: 48px;
  --spacing-16: 64px;
  --spacing-20: 80px;
  --spacing-24: 96px;
  --spacing-32: 128px;
  --spacing-40: 160px;
}
```

Tailwind v4 generates utility classes automatically from every `--color-*` token above:

- `bg-primary`, `text-primary`, `border-primary`
- `bg-surface`, `text-text-muted`
- `bg-success`, `text-error`
- etc.

---

## Token Usage Guide

### Page Layout

| Element           | Token                  |
| ----------------- | ---------------------- |
| Page background   | `bg-background`        |
| Card / surface    | `bg-surface`           |
| Default border    | `border-border`        |

Used across the Landing Page, Dashboard, and Admin Dashboard.

### Typography

| Element                | Token                           |
| ---------------------- | ------------------------------- |
| Headings, primary text | `text-text-primary` (#0D0D0D)   |
| Secondary text, labels | `text-text-secondary` (#525252) |
| Placeholder, muted     | `text-text-muted` (#8A8A8A)     |

### Primary Accent

Used for: primary buttons, active nav items, tailored badges, focus rings, call to actions.

| Element                | Token                    |
| ---------------------- | ------------------------ |
| Button background      | `bg-primary`             |
| Text highlight         | `text-primary`           |
| Interactive borders    | `border-primary`         |
| Focus rings            | `ring-primary`           |

### Status Chips & Badges

| Type     | Background             | Text                  |
| -------- | ---------------------- | --------------------- |
| Success  | `bg-success/10`        | `text-success`        |
| Warning  | `bg-warning/10`        | `text-warning`        |
| Error    | `bg-error/10`          | `text-error`          |
| Info     | `bg-info/10`           | `text-info`           |
| Neutral  | `bg-surface`           | `text-text-secondary` |

---

## Typography

| Element        | Font Size | Weight | Line Height | Usage                     |
| -------------- | --------- | ------ | ----------- | ------------------------- |
| **Display**    | 56px      | 700    | 110%        | Hero / Big Headlines      |
| **H1**         | 40px      | 700    | 120%        | Section Titles            |
| **H2**         | 32px      | 700    | 120%        | Sub Section Titles        |
| **H3**         | 24px      | 600    | 130%        | Card Titles               |
| **H4**         | 16px      | 600    | 140%        | Small Titles              |
| **Body Large** | 16px      | 400    | 160%        | Paragraph / Content       |
| **Body Medium**| 14px      | 400    | 160%        | Supporting Text           |
| **Body Small** | 13px      | 400    | 150%        | Descriptions / Notes      |
| **Caption**    | 13px      | 400    | 140%        | Captions / Meta           |
| **Button**     | 14px      | 600    | 140%        | Buttons                   |
| **Input/Label**| 11px      | 600    | 140%        | Labels / Inputs           |

Font family: **Inter** — import from Google Fonts or use next/font/google.

---

## Grid System

| Property        | Value    |
| --------------- | -------- |
| Container Width | 1280px   |
| Columns         | 12       |
| Margin          | 24px     |
| Gutter          | 24px     |

Responsive breakpoints apply standard shifts (Desktop 1280+, Tablet 768-1279, Mobile < 768).

---

## Spacing

| Token       | Value  | Usage                 |
| ----------- | ------ | --------------------- |
| `gap-1`     | 4px    | Tight inline gaps     |
| `gap-2`     | 8px    | Badge and tag gaps    |
| `gap-3`     | 12px   | Form field gaps       |
| `gap-4`     | 16px   | Section internal gaps |
| `gap-5`     | 20px   | Component spacing     |
| `gap-6`     | 24px   | Between sections      |
| `gap-8`     | 32px   | Standard page padding |
| `gap-10`    | 40px   | Large padding         |
| `gap-12`    | 48px   | Hero padding          |
| `gap-16`    | 64px   | Section spacing       |
| `gap-20`    | 80px   | Wide spacing          |
| `gap-24`    | 96px   | Huge spacing          |
| `gap-32`    | 128px  | Massive gaps          |
| `gap-40`    | 160px  | Ultra gaps            |

---

## Radius Tokens

| Token           | Value  | Usage                   |
| --------------- | ------ | ----------------------- |
| `rounded-2xs`   | 2px    | Small interactive areas |
| `rounded-xs`    | 4px    | Checkboxes, toggles     |
| `rounded-sm`    | 8px    | Inputs, small cards     |
| `rounded-md`    | 12px   | Inner containers        |
| `rounded-lg`    | 16px   | Standard Cards          |
| `rounded-xl`    | 24px   | Large Cards, Modals     |
| `rounded-2xl`   | 32px   | Hero sections           |
| `rounded-full`  | 9999px | Buttons, Avatars, Badges|

---

## Shadow Tokens

| Token         | Value                                  | Usage               |
| ------------- | -------------------------------------- | ------------------- |
| `shadow-sm`   | 0px 1px 2px rgba(0, 0, 0, 0.05)        | Buttons, Inputs     |
| `shadow-md`   | 0px 4px 8px rgba(0, 0, 0, 0.08)        | Cards, Navbars      |
| `shadow-lg`   | 0px 12px 24px rgba(0, 0, 0, 0.12)      | Modals, Dropdowns   |
| `shadow-xl`   | 0px 20px 40px rgba(0, 0, 0, 0.16)      | Overlays, Popovers  |

---

## Component Tokens

### Cards
**Applies to:** Course Card, Review Card, Instructor Card, Dashboard Card, Announcement Card, Recording Card, Study Material Card, Calendar Card, Batch Card, Student Card, Payment Card.

```
background: bg-surface
border: 1px solid var(--border)
border-radius: rounded-lg (16px) or rounded-xl (24px)
padding: p-6 (24px)
box-shadow: shadow-sm or shadow-md
```

### Buttons
**Primary:**
```
background: bg-primary
text: text-surface
border-radius: rounded-full
padding: px-4 py-2
```

**Secondary:**
```
background: bg-secondary
text: text-surface
border-radius: rounded-full
padding: px-4 py-2
```

### Input Fields / Search / Dropdowns
```
background: bg-surface
border: border border-border
border-radius: rounded-sm (8px)
padding: px-3 py-2
text: text-text-primary
placeholder: text-text-muted
focus: ring-1 ring-primary
```

### Badges / Tags / Chips
```
border-radius: rounded-full
padding: px-2 py-0.5
font-size: text-xs
font-weight: font-medium
```

---

## State Tokens

| State     | Description                                           |
| --------- | ----------------------------------------------------- |
| Default   | Standard visual appearance.                           |
| Hover     | Use slight scale (`hover:scale-[1.02]`) or opacity.   |
| Focus     | Use `ring-1 ring-primary` to outline active elements. |
| Active    | Selected tabs/buttons use Primary color overrides.    |
| Selected  | Use a subtle background fill (e.g., `bg-primary/10`). |
| Pressed   | Slight scale down (`active:scale-95`).                |
| Disabled  | Add `opacity-50 cursor-not-allowed`.                  |
| Loading   | Include spinner icon, disable interaction.            |
| Success   | Border and Text use Success token.                    |
| Warning   | Border and Text use Warning token.                    |
| Error     | Border and Text use Error token.                      |

---

## Dashboard Tokens

**Applies to:** Student Dashboard, Admin Dashboard, Landing Page CMS, Analytics Cards, Statistics Cards, Calendar, Charts, Widgets.

- Layout is composed of `bg-surface` cards placed on a `bg-background` canvas.
- Gaps between widgets: `gap-6` (24px).
- Internal widget padding: `p-6` (24px).
- Highlight metrics use Typography `H2` or `H3` wrapped in `text-text-primary`.

---

## Invariants

- Never use hex values directly in components — always use CSS variables via Tailwind tokens.
- Font is Inter — always import via next/font/google, never use a fallback system font.
- Never use raw Tailwind color classes like `bg-orange-500` or `text-gray-800` — use project tokens only.
- Never introduce new spacing scales — strictly use the 4px interval scale.
- Never create alternative radius scales — stick to 2, 4, 8, 12, 16, 24, 32, 9999.
- Always use tokens defined in `globals.css` via `@theme`.

---

## Engineering Philosophy

This file defines the Design Token System for VibeLogic Studio. It does NOT explain component implementation. It establishes the project's visual foundation. Whenever there is uncertainty, developers should strictly follow the attached Design System.
