# Library Docs

Project-specific usage patterns for every third party library in this project. This file only covers how we use each library in this specific project — rules, patterns, and constraints specific to VibeLogic Studio.

Read the relevant section before implementing any feature that touches these libraries.

---

## Before Using Any Library

Before implementing any feature that uses a third party library:

1. **Check AGENTS.md** at the project root — it lists every skill installed for this project and how to use them. Skills contain up-to-date API documentation, usage patterns, and best practices specific to this codebase.

2. **Check if an MCP server is configured** for that library. Some tools have MCP servers that give the AI agent direct access to documentation, logs, and debugging tools. If an MCP server is available — use it before falling back to general knowledge.

3. **Read this file** for project-specific patterns that override general library knowledge.

The order of authority is:

```
MCP server (real-time docs) → Skills via AGENTS.md → This file (project rules) → General training knowledge
```

Never rely on general training knowledge alone for library APIs — they change frequently and training data may be outdated.

---

## Engineering Philosophy (YAGNI)

The project follows the YAGNI (You Aren't Gonna Need It) principle. 
Developers should always prefer integrating mature libraries instead of rebuilding them. 
This file describes HOW we use those libraries inside this project, not how the libraries work internally. 
Only build custom infrastructure if it creates a direct competitive advantage.

---

## Convex

**Check first:** Check AGENTS.md for an installed Convex skill. If a Convex MCP server is configured — use it.

### Client vs Server

Convex is the single source of truth for the database.

```typescript
// app/layout.tsx — browser context
"use client";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function RootLayout({ children }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
```

```typescript
// Server Actions / Route Handlers (Server Context)
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

const data = await fetchQuery(api.courses.getActive);
```

**Rules:**

- Browser client — Client Components (`useQuery`, `useMutation`, `useAction`).
- Server client — Server Components (`fetchQuery`), API routes (`fetchMutation`), Server Actions.
- Realtime happens automatically via `useQuery`. Do not build manual WebSockets.

---

### DB Queries & Mutations

```typescript
// Read (React Component)
const enrollments = useQuery(api.enrollments.getUserEnrollments, { userId });

// Read (Convex Server Function - convex/courses.ts)
export const getActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("courses")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

// Insert / Update (Convex Server Function - convex/enrollments.ts)
export const create = mutation({
  args: { courseId: v.id("courses"), batchId: v.id("batches") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    
    return await ctx.db.insert("enrollments", {
      userId: identity.subject,
      courseId: args.courseId,
      batchId: args.batchId,
      status: "active",
      progress: 0,
      enrolledAt: Date.now(),
    });
  },
});
```

**Rules:**

- Always scope user data queries to the authenticated user's ID via `ctx.auth.getUserIdentity()`.
- Always validate arguments using `v` from `convex/values`.
- Always use `.withIndex` for efficient querying. Ensure indexes are defined in `convex/schema.ts`.

---

## Clerk Authentication

**Check first:** Check AGENTS.md for an installed Clerk skill.

### Current User

```typescript
// Server Component / Server Action
import { auth, currentUser } from "@clerk/nextjs/server";

const { userId } = await auth();
const user = await currentUser();
if (!userId) redirect("/sign-in");
```

```typescript
// Convex Backend
const identity = await ctx.auth.getUserIdentity();
const userId = identity.subject; // Maps to Clerk's user ID
```

### Protecting Routes & Middleware

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/student(.*)", "/admin(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});
```

**Rules:**

- Never build custom session handling. Clerk handles JWTs and sessions.
- Role Checking: If building an admin area, verify the user's role metadata stored in Clerk or via a Convex query before rendering the page or executing a mutation.

---

## Razorpay

Payments use Razorpay. Do not store credit card numbers.

### Creating Orders & Payment Verification

```typescript
// Server Action (actions/checkout.ts)
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const order = await razorpay.orders.create({
  amount: coursePrice * 100, // in paise
  currency: "INR",
  receipt: `receipt_${Date.now()}`,
});
```

### Webhook Handling (Successful Payment Flow)

```typescript
// app/api/webhooks/razorpay/route.ts
import { verifyRazorpaySignature } from "@/lib/razorpay";

// Validate signature using razorpay utility
verifyRazorpaySignature(body, req.headers.get("x-razorpay-signature"));

// On success: fetchMutation to create enrollment and update batch seats
```

**Rules:**

- Always verify the webhook signature before trusting the payload.
- Failed Payment Flow: Razorpay handles retries. Only process `payment.captured` webhooks.
- Refund considerations: Refunds are triggered manually via Razorpay dashboard unless automated refund action is explicitly requested.

---

## UploadThing

Uploads use UploadThing. Do not manage raw S3 buckets.

### Usage

- **Image uploads**: Course cover images, profile avatars.
- **Study materials**: PDF notes, assignments.
- **Landing page assets**: Dynamic CMS images.

```typescript
// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  courseCover: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      // verify admin auth
      return { adminId: "admin_123" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Store file.url in Convex DB
    }),
} satisfies FileRouter;
```

**Rules:**

- Always validate file types and sizes in `core.ts`.
- Use the provided `<UploadButton />` or `<UploadDropzone />` from `@uploadthing/react`.

---

## Resend

Emails use Resend. Do not configure SMTP.

**Use cases:**

- Enrollment confirmation
- Payment confirmation
- Welcome email (containing WhatsApp link)
- Batch assignment notifications
- Announcements

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: "VibeLogic Studio <hello@vibelogic.studio>",
  to: userEmail,
  subject: "Welcome to your new course!",
  react: WelcomeEmailTemplate({ courseName, whatsappLink }),
});
```

**Rules:**

- Email sending should typically happen within a Convex Action or an async Server Action.

---

## PostHog

**Check first:** Check AGENTS.md for an installed PostHog skill.

### Client Setup (Browser)

```typescript
// lib/posthog-client.ts
import posthog from "posthog-js";

export function initPostHog() {
  if (typeof window !== "undefined") {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
      capture_pageview: false, // manual pageview tracking
    });
  }
}
```

### Server Setup

```typescript
// lib/posthog-server.ts
import { PostHog } from "posthog-node";

export const createPostHogServer = () =>
  new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST!,
    flushAt: 1, // send immediately
    flushInterval: 0, // no batching — Next.js functions are short-lived
  });

const posthog = createPostHogServer();
posthog.capture({
  distinctId: userId,
  event: "course_enrolled",
  properties: { courseId, batchId },
});
await posthog.shutdown(); // required
```

### Project Events

All PostHog events must use these exact event names:

| Event                         | When                                       | Key Properties                     |
| ----------------------------- | ------------------------------------------ | ---------------------------------- |
| `landing_cta_clicked`         | Get Started clicked on Landing Page        | location                           |
| `course_viewed`               | User visits Course Details page            | courseId, title                    |
| `course_enrolled`             | Successful payment/enrollment completed    | userId, courseId, batchId          |
| `payment_started`             | User clicks Enroll Now button              | userId, courseId, price            |
| `payment_success`             | Razorpay payment succeeds                  | userId, amount, courseId           |
| `payment_failed`              | Razorpay payment fails                     | userId, amount, reason             |
| `batch_assigned`              | Student assigned to a batch                | userId, batchId                    |
| `dashboard_opened`            | Student visits their dashboard             | userId                             |
| `live_class_joined`           | Student clicks Join Google Meet            | userId, classId, batchId           |
| `recording_viewed`            | Student views past recording               | userId, classId                    |
| `study_material_downloaded`   | Student accesses PDF/video material        | userId, materialId                 |
| `announcement_opened`         | Student views an announcement              | userId, announcementId             |
| `review_published`            | Admin approves student review              | courseId, rating                   |

**Rules:**

- Always call `await posthog.shutdown()` in server-side functions.
- `flushAt: 1` and `flushInterval: 0` always set on server client.

---

## Sentry

Monitoring uses Sentry. 

**Rules:**

- Initialized via `@sentry/nextjs`.
- Automatically catches unhandled exceptions in API routes and Server Actions.
- Wrap critical logic blocks in `Sentry.captureException(error)` if gracefully degraded.

---

## Upstash Redis

Project usage for Upstash Redis focusing on performance, caching, and rate limiting.

### Client Initialization

```typescript
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
```

### Caching and TTL

Always use a TTL (Time-To-Live). Never cache forever.

```typescript
// Set cache with 60 seconds TTL
await redis.set(`course:${courseId}`, courseData, { ex: 60 });

// Get from cache
const cached = await redis.get(`course:${courseId}`);
if (cached) return cached;
```

### Rate Limiting

Use Upstash rate limiting capabilities to protect public endpoints and API routes.

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

const { success } = await ratelimit.limit(`ratelimit_${userId}`);
if (!success) throw new Error("Rate limit exceeded");
```

### Idempotency and Webhooks

Use Redis to deduplicate incoming webhooks (e.g. Razorpay).

```typescript
const isProcessed = await redis.setnx(`webhook:${webhookId}`, "1");
if (!isProcessed) return { message: "Already processed" };
await redis.expire(`webhook:${webhookId}`, 86400); // Expire after 24 hours
```

### Locking and Cache Invalidation

- Use `redis.del(key)` immediately after a Convex mutation modifies that data.
- Temporary enrollment locks can be created using `setnx` with a short TTL to hold a seat temporarily during checkout.

### Best Practices

- Convex remains the source of truth. If Redis fails or returns an error, catch the error and fallback to querying Convex directly.
- Never require Redis for application correctness.
- Never cache authenticated private data without scoping the cache key to the user ID.

---

## FullCalendar

Calendar uses FullCalendar.

**Use cases:**

- Displaying scheduled live classes in the Student dashboard.
- Admin scheduling of upcoming sessions.

**Rules:**

- Do not document FullCalendar internals.
- Fetch `liveClasses` from Convex, map them to FullCalendar event objects `{ id, title, start, end, url }`.
- Read-only for students. Admins can drag-and-drop to reschedule (triggers Convex mutation).

---

## Google Meet

Video meetings use Google Meet links.

**Rules:**

- Meeting link storage: Admins paste the generated Google Meet link into the CMS when scheduling a class. The link is stored in the `liveClasses` Convex collection.
- Join button: The Student Dashboard and Calendar display a "Join Class" button linking to this URL.
- Permissions: Admissions to the meeting are managed by the instructor via Google Meet natively. We do not build WebRTC.

---

## YouTube (Unlisted)

Class recordings use YouTube (Unlisted).

**Rules:**

- Storage pattern: Admins upload the raw video to YouTube natively, mark it as Unlisted, and paste the Video ID into the CMS.
- Embedding: Use `@next/third-parties/google` YouTube embed component.
- Access control: Only students with an active enrollment for the specific batch can view the embedding page.

---

## React Hook Form & Zod

Forms use React Hook Form. Validation uses Zod.

**Rules:**

- Define the Zod schema first.
- Share the Zod schema between the client (React Hook Form resolver) and the server (Server Action/Convex mutation validation).
- Standard form pattern:
  ```typescript
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  ```

---

## Animations (GSAP & Framer Motion)

**Use cases:**

- Landing page hero animations and scroll reveals (GSAP).
- Dashboard transitions, micro-interactions, modal popups (Framer Motion).

**Rules:**

- Do not overuse animations. Keep them subtle and professional.
- Always use `useGSAP` hook for GSAP within React to handle cleanup.
- Wrap Framer Motion components in `AnimatePresence` for exit animations.

---

## UI (shadcn/ui, Tailwind CSS, Lucide)

**Rules:**

- **shadcn/ui**: All components go in `components/ui/`. Do not modify them unless necessary.
- **Tailwind CSS**: Use utility classes. Use CSS variables from `globals.css` for theming.
- **Lucide**: Standard icon library. Use `<IconName className="w-4 h-4" />`.

---

## Recharts & TanStack Table

### Recharts

Charts use Recharts.

**Use cases:**

- Revenue tracking
- Student growth trends
- Dashboard analytics

**Rules:**

- Use ResponsiveContainer. Keep tooltips styled cleanly.

### TanStack Table

Tables use TanStack Table.

**Use cases:**

- Students lists
- Courses and Batches administration
- Payments history
- Announcements log

**Rules:**

- Use headless setup. Style with Tailwind.
- Implement server-side pagination for large datasets (e.g., all payments).

---

## Next/Image

Images use `next/image`.

**Rules:**

- Always provide `width` and `height` or use `fill`.
- Use `priority` for above-the-fold images (e.g., Hero background).
- Remote images (e.g., UploadThing URLs) must be configured in `next.config.js` or `next.config.ts`.

---

## AI (ChatGPT, Claude, Gemini)

The application may use AI APIs (ChatGPT, Claude, Gemini) in the future.

**Use cases:**

- Content generation (e.g., drafting course descriptions or announcements).
- Future AI assistant for students.

**Rules:**

- Never document model internals.
- Keep prompt templates in a dedicated server-side file.
- Always parse and validate AI JSON responses strictly using Zod before saving to Convex.
