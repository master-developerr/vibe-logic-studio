# UI Rules

Concise rules for building VibeLogic Studio UI. The attached Design System is the single source of truth for visual decisions. These rules cover the most important patterns and constraints to keep the UI consistent without over-specifying every detail.

---

## Font

Always import Inter via `next/font/google` in the root layout.

```typescript
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
```

The `--font-sans` variable is already declared in `@theme` in globals.css. Apply the font variable class to the `<html>` tag in root layout. Never use system fonts as the primary font.

---

## Color System

Use the following design system colors throughout the project. Never introduce additional color palettes.

- **Primary:** `#FF5A1F`
- **Secondary:** `#0D0D0D`
- **Accent:** `#FF5A1F`
- **Background:** `#FAF7F3` (Use for page backgrounds)
- **Surface:** `#FFFFFF` (Use for cards, dropdowns, modals)
- **Border:** `#E6E2DC`
- **Text Primary:** `#0D0D0D`
- **Text Secondary:** `#525252`
- **Muted Text:** `#8A8A8A`
- **Success:** `#22C55E`
- **Warning:** `#F59E0B`
- **Error:** `#EF4444`
- **Info:** `#3B82F6`

---

## Typography Hierarchy

Use the typography scale from the design system.

- **Display:** 56px, weight 700, line-height 110% (Hero / Big Headlines)
- **H1:** 40px, weight 700, line-height 120% (Section Titles)
- **H2:** 32px, weight 700, line-height 120% (Sub Section Titles)
- **H3:** 24px, weight 600, line-height 130% (Card Titles)
- **H4:** 16px, weight 600, line-height 140% (Small Titles)
- **Body Large:** 16px, weight 400, line-height 160% (Paragraph / Content)
- **Body Medium:** 14px, weight 400, line-height 160% (Supporting Text)
- **Body Small:** 13px, weight 400, line-height 150% (Descriptions / Notes)
- **Caption:** 13px, weight 400, line-height 140% (Captions / Meta)
- **Button:** 14px, weight 600, line-height 140% (Buttons)
- **Label / Input:** 11px, weight 600, line-height 140% (Labels / Inputs)

---

## Layout

- **Container Width:** 1280px max-width, centered
- **Columns:** 12-column grid
- **Margin / Gutters:** 24px
- **Base Spacing:** 4px scale (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160)
- **Responsive Breakpoints:** Desktop (1280px+), Tablet (768px-1279px), Mobile (375px-767px)
- **Layouts:** Use full-width headers for Marketing navigation. Dashboards may utilize a sidebar or top navigation depending on view complexity.

---

## Navigation

- **Marketing Navigation:** Navbar with Logo, Links (Home, Courses, About, Reviews, FAQ), and Auth/Dashboard button.
- **Student Dashboard Navigation:** Dashboard, Calendar, Live Classes, Recordings, Study Materials, Announcements, Profile, Settings.
- **Admin Dashboard Navigation:** Dashboard, Courses, Batches, Students, Payments, Reviews, Landing Page CMS, Media Library, Settings.
- **Tabs:** Underlined active state (Primary color), used for switching views inside a page (e.g., Course Details tabs).
- **Breadcrumbs:** Used for nested pages (e.g., Home > Courses > React Mastery).
- **Pagination:** Simple numbered boxes, active page uses primary color/border.

---

## Cards

Every content section lives in a card.

**Examples:** Course Card, Review Card, Instructor Card, Dashboard Card, Analytics Card, Announcement Card, Recording Card, Study Material Card, Student Card, Batch Card, Payment Card, Admin Card.

```
background: Surface (#FFFFFF)
border: 1px solid Border (#E6E2DC)
border-radius: 16px (or as required by token scale)
box-shadow: Small or Medium shadow token
```

Never use colored card backgrounds — always Surface (#FFFFFF). Color goes inside cards via badges, buttons, and text.

---

## Buttons

Never invent styles outside the design system.

- **Primary Button:** Background Primary (`#FF5A1F`), text white, `border-radius: 9999px` (pill).
- **Secondary Button:** Background Secondary (`#0D0D0D`), text white, `border-radius: 9999px`.
- **Outline Button:** Border only (`#E6E2DC`), transparent background, text Secondary.
- **Ghost Button:** No border, transparent background, text Secondary, hover state light gray.
- **Icon Button:** Square or circular padding around an icon.
- **Text Button:** Simple text link with an arrow or icon.
- **States:** Hover (slight opacity or color shift), Active (pressed scale down slightly), Disabled (opacity 0.5, cursor not-allowed), Loading (show spinner).

---

## Forms

- **Supported Components:** Input, Textarea, Dropdown, Checkbox, Radio, Toggle Switch, OTP Input, Search Input.
- **Styles:** Surface background, Border `#E6E2DC`, rounded corners (4px or 8px).
- **Validation / States:** 
  - **Success:** Border and text Success (`#22C55E`).
  - **Error:** Border and text Error (`#EF4444`).
  - **Focus:** Ring Primary (`#FF5A1F`).
  - **Disabled:** Muted background, opacity reduced.
- Always pair inputs with a clear label using the Label typography token.

---

## Badges / Tags / Chips

- **Types:** Status Chips (Active, In Progress, Completed, Cancelled), Category Chips, Filter Chips, Tags, Badges, Pills.
- **Radius:** `9999px` (pill shape).
- **Colors:** Use Success, Warning, Error, or Info colors for Status chips. Use surface/border for standard tags.
- Never introduce styles outside the design system.

---

## Tables

Used for: Students, Courses, Payments, Reviews, Batches, Announcements, Study Materials.

- **Headers:** Uppercase, muted text, font-weight 500 or 600.
- **Rows:** White background, separated by Border (`#E6E2DC`).
- **Hover:** Light background shift (e.g., `#FAF7F3`).
- **Sorting / Pagination / Selection:** Include sorting arrows on headers, standard pagination controls at bottom, checkbox column for bulk actions.
- **Empty State:** Minimal centered message when no data.

---

## Dashboard Rules

- **Student / Admin Dashboards:** Clean layouts using a grid system. Cards contain the widgets.
- **Analytics:** Use charts (Recharts) inside Surface cards.
- **Calendar:** Full width or large card, clearly distinct events.
- **Statistics:** Use large typography (H2/H3) for numbers, paired with Trend badges.

---

## Empty States

Every section that can be empty must have an empty state. Keep it minimal.

**Examples:** No Courses, No Students, No Announcements, No Recordings, No Materials, No Reviews, No Batches.

- Short descriptive text in Muted Text (`#8A8A8A`).
- Optional icon above text.
- Primary or Secondary button if there's a logical next action (e.g., "Create Course").

---

## Responsive Design

- **Desktop (1280px+):** Full 12-column grid. Multi-column cards and tables.
- **Tablet (768px - 1279px):** Collapse grids to 2 columns or stack. Sidebars may become drawers.
- **Mobile (375px - 767px):** Stack everything vertically. Tables should overflow horizontally or turn into card lists. Hide complex UI elements behind menus. Full-width buttons.

---

## Accessibility

- **Keyboard navigation:** All interactive elements must be reachable via Tab.
- **Visible focus states:** Always show focus rings on inputs and buttons.
- **Color contrast:** Adhere to WCAG standards (Primary/Secondary on Surface is safe).
- **ARIA labels:** Use where visual text is missing (e.g., Icon buttons).
- **Touch targets:** Minimum 44x44px for mobile targets.
- **Screen reader support:** Use semantic HTML (`<nav>`, `<main>`, `<section>`).

---

## Tailwind

This project uses Tailwind v4. Tokens are defined with `@theme` in `globals.css` — do not introduce `tailwind.config.ts` unless absolutely necessary. Never define colors in a config file. Always use `@theme` for new tokens.

---

## Animations

- **GSAP:** Use for landing page scroll reveals and hero animations.
- **Framer Motion:** Use for UI micro-interactions, layout transitions, modal popups.
- **Hover:** Subtle opacity, color shifts, or slight scale up (`hover:scale-[1.02]`).
- **Page transitions:** Keep fast and subtle.
- **Rule:** Keep animations subtle. Do not slow down the user's workflow.

---

## Do Nots

- Never create components that ignore the Design System.
- Never introduce new colors (use the defined palette only).
- Never use inconsistent spacing (stick to the 4px scale).
- Never hardcode values already defined as design tokens.
- Never mix different border radius scales randomly (use the defined tokens: 2px, 4px, 8px, 12px, 16px, 24px, 32px, 9999px).
- Never create alternative button styles.
- Never use gradients unless explicitly defined in the Design System.
- Never use multiple visual styles for the same component (e.g., two different styles for a CourseCard).

---

## Engineering Philosophy

This file defines HOW UI is built inside VibeLogic Studio. It establishes visual consistency rather than explaining implementation details. Whenever there is uncertainty, developers should strictly follow the attached Design System tokens and principles.
