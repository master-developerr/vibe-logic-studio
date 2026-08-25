# Code Standards

Implementation rules and conventions for the entire project. The AI agent must follow these in every session without exception. These rules prevent pattern drift across sessions.

---

## Engineering Mindset

The AI agent on this project operates as a senior engineer. This means:

- **Think before implementing** — understand what is being built and why before writing a single line
- **Read context files first** — never assume, always verify against architecture.md and project-overview.md
- **Scope is sacred** — only build what the current feature requires. Never go beyond scope even if it seems helpful
- **Every feature must be testable** — if it cannot be verified immediately after implementation, it is incomplete
- **Clean over clever** — simple readable code that a junior developer can understand is always preferred over clever abstractions
- **One thing at a time** — complete one feature fully before touching the next
- **Failures are expected** — wrap operations in try/catch, log failures, never let one failure crash everything

---

## Engineering Philosophy (YAGNI)

This project strictly follows the **YAGNI (You Aren't Gonna Need It)** principle. We do not build infrastructure that already exists. 

Prefer integrating mature, production-ready services over building custom implementations. We only build software that creates a direct competitive advantage.

Examples of our delegated infrastructure:
- **Authentication** → Clerk
- **Payments** → Razorpay
- **Calendar** → FullCalendar
- **Video Meetings** → Google Meet
- **Video Hosting** → YouTube (Unlisted)
- **Uploads** → UploadThing
- **Emails** → Resend
- **Analytics** → PostHog
- **Monitoring** → Sentry
- **Cache & Rate Limiting** → Upstash Redis

---

## Upstash Redis

Convex is the single source of truth. Redis is used as a cache only.
- Always check Redis before expensive Convex queries.
- Never cache authenticated private data without proper keys.
- Always invalidate cache after Convex mutations.
- Use TTL for cached items. Never cache forever.
- Never duplicate business logic in Redis.
- Never use Redis as a primary database.
- Use Redis for: API cache, Rate limiting, Locks, Temporary data, Idempotency.

---

## TypeScript

- Strict mode enabled in tsconfig.json — no exceptions
- Never use `any` — use `unknown` and narrow the type
- Never use type assertions (`as SomeType`) unless absolutely necessary and commented why
- All function parameters and return types must be explicitly typed
- Use `type` for object shapes and unions — use `interface` only for extendable component props
- All async functions must have proper error handling — never let promises float unhandled
- Use `const` by default — only use `let` when reassignment is necessary

---

## Next.js 16 Conventions

- App Router only — no Pages Router
- React 19 — use React 19 APIs throughout
- All components are Server Components by default
- Only add `"use client"` when the component requires:
  - useState or useReducer
  - useEffect
  - Browser APIs
  - Event listeners
  - Third party client-only libraries (PostHog browser side, Framer Motion)
- Never add `"use client"` to layout files unless absolutely required
- Data fetching happens in Server Components or via Convex React hooks (`useQuery`)
- Route handlers live in `app/api/` — never put business logic directly in route handlers
- Server Actions live in `actions/` — never define Server Actions inline in components
- Caching is uncached by default — all dynamic code runs at request time
- Always read Next.js documentation before implementing any Next.js specific feature — APIs may differ from training data

---

## File and Folder Naming

- Folders: kebab-case — `course-details`, `admin-dashboard`
- Component files: PascalCase — `CourseCard.tsx`, `BatchSelector.tsx`
- Utility files: camelCase — `razorpay.ts`, `posthog-client.ts`
- Type files: camelCase — `index.ts`
- API route files: always `route.ts`
- Server Action files: camelCase — `saveProfile.ts`, `assignBatch.ts`
- One component per file — never export multiple components from one file
- Index files only in `components/ui/` — never barrel export from other folders

---

## Component Structure

Every component follows this exact order:

```typescript
"use client"; // only if needed

// 1. External imports
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// 2. Internal imports
import { BatchSelector } from "@/components/courses/BatchSelector";

// 3. Type definitions
type Props = {
  courseId: string;
  initialPrice: number;
};

// 4. Component
export function CourseCard({ courseId, initialPrice }: Props) {
  // state
  // derived values / convex queries
  // handlers
  // return JSX
}
```

- Never use default exports for components — always named exports
- Props type defined directly above the component — not in a separate types file unless shared
- No inline styles — all styling via Tailwind classes using CSS variables from ui-tokens.md

---

## API Route Handlers

```typescript
// app/api/webhooks/razorpay/route.ts

import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // validate signature
    verifyRazorpaySignature(body, req.headers.get("x-razorpay-signature"));
    
    // call Convex mutation
    await fetchMutation(api.enrollments.create, { 
      courseId: body.payload.payment.entity.notes.courseId 
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[webhooks/razorpay]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
```

- API Routes are strictly for webhooks (e.g., `/api/payment`, `/api/webhooks/razorpay`, `/api/upload`)
- Every route handler has a try/catch
- Every route handler validates the request body or signature before processing
- Errors are logged with the route path as prefix: `[webhooks/razorpay]`
- Always return `{ success: boolean, data?: T, error?: string }`

---

## Server Actions

```typescript
// actions/saveProfile.ts

"use server";

import { revalidatePath } from "next/cache";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export async function saveProfile(formData: ProfileFormData) {
  try {
    // validate
    await fetchMutation(api.users.updateProfile, { 
      name: formData.name 
    });
    
    revalidatePath("/student/profile");
    return { success: true };
  } catch (error) {
    console.error("[actions/saveProfile]", error);
    return { success: false, error: "Failed to save profile" };
  }
}
```

- Realistic Server Actions: `saveProfile`, `createCourse`, `updateBatch`, `publishReview`, `uploadStudyMaterial`, `createAnnouncement`, `assignBatch`, `publishLandingPage`
- Every Server Action has a try/catch
- Every Server Action returns `{ success: boolean, error?: string }`
- Always call `revalidatePath` after mutations that affect page data when not relying on Convex Realtime
- Never throw from Server Actions — always return the error

---

## Convex Backend

Convex is the single source of truth. We do not use SQL, Tables, or manual RPCs. 

- **Collections:** Define all schema in `convex/schema.ts`
- **Indexes:** Always define indexes for fields you query frequently (e.g., `by_clerk_id`)
- **Queries:** Pure, read-only functions. Reactive by default. Use `useQuery` in React.
- **Mutations:** Write operations. Must validate arguments.
- **Actions:** Used to call external APIs (e.g., fetching from Razorpay, Resend). Cannot directly query the DB without using `ctx.runQuery` or `ctx.runMutation`.
- **Realtime:** Convex handles WebSocket subscriptions automatically via `useQuery`. Do not build manual polling or custom WebSocket connections.

```typescript
// convex/courses.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("courses")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const create = mutation({
  args: { title: v.string(), price: v.number() },
  handler: async (ctx, args) => {
    // admin role check logic here
    return await ctx.db.insert("courses", {
      title: args.title,
      price: args.price,
      isActive: false,
      createdAt: Date.now(),
    });
  },
});
```

---

## Error Handling

- Never use empty catch blocks — always log or handle
- Console errors always include context prefix: `[component/function name]`
- User-facing errors must be human readable — never expose raw error messages
- Database/Convex errors should be logged internally — never surface raw DB errors to the UI
- API route errors return `status: 500` with generic message — never expose internals

---

## Analytics (PostHog)

All PostHog events must use these exact event names. Never invent new event names without adding them here first.

| Event                         | When                                       | Key Properties                     |
| ----------------------------- | ------------------------------------------ | ---------------------------------- |
| `landing_cta_clicked`         | Get Started clicked on Landing Page        | location                           |
| `course_viewed`               | User visits Course Details page            | courseId, title                    |
| `course_enrolled`             | Successful payment/enrollment completed    | userId, courseId, batchId          |
| `payment_success`             | Razorpay payment succeeds                  | userId, amount, courseId           |
| `payment_failed`              | Razorpay payment fails                     | userId, amount, reason             |
| `batch_assigned`              | Student assigned to a batch                | userId, batchId                    |
| `live_class_joined`           | Student clicks Join Google Meet            | userId, classId, batchId           |
| `recording_viewed`            | Student views past recording               | userId, classId                    |
| `study_material_downloaded`   | Student accesses PDF/video material        | userId, materialId                 |
| `announcement_read`           | Student views an announcement              | userId, announcementId             |
| `review_published`            | Admin approves student review              | courseId, rating                   |

Always fire these with correct properties.

---

## Environment Variables

All environment variables defined in `.env.local` for development. Never hardcode any key, URL, or secret anywhere in the codebase.

| Variable                              | Used In                         |
| ------------------------------------- | ------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`   | Auth UI, Client                 |
| `CLERK_SECRET_KEY`                    | API Webhooks, Server Actions    |
| `NEXT_PUBLIC_CONVEX_URL`              | ConvexProvider                  |
| `CONVEX_DEPLOYMENT`                   | Convex backend                  |
| `RAZORPAY_KEY_ID`                     | Razorpay Client UI              |
| `RAZORPAY_KEY_SECRET`                 | Razorpay Webhooks               |
| `UPLOADTHING_TOKEN`                   | UploadThing Core                |
| `RESEND_API_KEY`                      | Convex Actions (Email sending)  |
| `NEXT_PUBLIC_POSTHOG_KEY`             | lib/posthog-client.ts           |
| `NEXT_PUBLIC_POSTHOG_HOST`            | lib/posthog-client.ts           |
| `SENTRY_AUTH_TOKEN`                   | Sentry Config                   |
| `UPSTASH_REDIS_REST_URL`              | Upstash Redis Client            |
| `UPSTASH_REDIS_REST_TOKEN`            | Upstash Redis Client            |

`NEXT_PUBLIC_` prefix means the variable is exposed to the browser. Never add `NEXT_PUBLIC_` to secret keys.

---

## Import Aliases

Always use the `@/` alias — never use relative imports that go up more than one level.

```typescript
// Correct
import { Button } from "@/components/ui/button";
import { MATCH_THRESHOLD } from "@/lib/utils";

// Never
import { Button } from "../../../components/ui/button";
```

---

## Comments

- No comments explaining what the code does — code must be self-explanatory
- Comments only for why — explaining a non-obvious decision
- Never leave TODO comments in committed code

---

## Dependencies

Never install a new package without a clear reason. Before installing anything check:

1. Does shadcn/ui already have this component?
2. Does Next.js already provide this functionality?
3. Is there a simpler native solution?

Approved dependencies for this project:

- `next` — Next.js Framework
- `react` — UI Library
- `typescript` — Type checking
- `tailwindcss` — Styling
- `shadcn/ui` components — UI primitives
- `convex` — Serverless Database and Backend
- `@clerk/nextjs` — Authentication
- `razorpay` — Payments
- `uploadthing` — Media storage
- `resend` — Transactional emails
- `react-hook-form` — Form state
- `zod` — Schema validation
- `lucide-react` — Icons
- `gsap` — Advanced landing page animations
- `framer-motion` — Micro-interactions and UI animations
- `@fullcalendar/react` — Calendar components
- `recharts` — Dashboard charts
- `@tanstack/react-table` — Data grids
- `posthog-js` — Analytics client
- `@sentry/nextjs` — Error tracking
- `@upstash/redis` — Distributed caching and rate limiting
- `@next/third-parties/google` — YouTube Embed (if required)

Do not install any other packages without updating this list first.
