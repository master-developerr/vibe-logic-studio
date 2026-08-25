# Vibe Logic Studio

Vibe Logic Studio is an elite, high-performance EdTech SaaS platform designed to deliver a seamless, immersive, and premium learning experience.

---

## Features

* **Public Marketing & Course Catalog**: Breathtaking, SEO-optimized landing pages powered by a custom dynamic CMS.
* **Frictionless Authentication**: Single Sign-On and User Profile Management handled securely by Clerk.
* **Integrated Payments**: Frictionless INR checkout and automated student enrollment powered by Razorpay.
* **Immersive Student Dashboard**: A real-time synchronized LMS workspace with announcement boards, class schedules, study materials, and interactive recording players.
* **Operational Admin Panel**: Complete management console for batch allocation, scheduling, course catalogs, and student rosters.
* **Real-time Synchronization**: Powered entirely by Convex backend database triggers.
* **Analytics & Telemetry**: Full instrumentation with Sentry and PostHog.

---

## Tech Stack

* **Frontend**: Next.js (App Router, React 19, TypeScript)
* **Styling**: Vanilla CSS (Calibrated HSL palettes, smooth layout transitions, Framer Motion)
* **Backend & Database**: Convex (Real-time BaaS, File Storage)
* **Authentication**: Clerk
* **Payments**: Razorpay
* **Caching & Rate Limiting**: Upstash Redis
* **Error Tracking**: Sentry
* **User Analytics**: PostHog

---

## Setup Instructions

### 1. Prerequisites
Ensure you have the following installed:
* **Node.js**: `v20.x` or later
* **npm**: `v10.x` or later
* **Go** (Optional, for running the local Razorpay MCP server): `v1.26+`

### 2. Clone the Repository
```bash
git clone https://github.com/master-developerr/vibe-logic-studio.git
cd vibe-logic-studio
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.example` to create a local environment file:
```bash
cp .env.example .env.local
```
Open `.env.local` and configure your credentials (Clerk publishable/secret keys, Convex URL, Razorpay API credentials, Upstash Redis endpoints, and Sentry auth tokens).

---

## Local Development

Vibe Logic Studio uses Convex as its serverless backend. Start the Convex development backend and the Next.js dev server in parallel:

1. **Start the Convex backend sync (runs in terminal 1)**:
   ```bash
   npx convex dev
   ```
   *This command will deploy your schema, queries, and mutations to your Convex developer sandbox.*

2. **Start the Next.js development server (runs in terminal 2)**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Quality & Verification

To verify code quality and build compilation prior to staging or deployments, execute the following commands:

* **Typecheck**: Validate TypeScript compilation
  ```bash
  npx tsc --noEmit
  ```
* **Lint**: Run ESLint checks
  ```bash
  npm run lint
  ```
* **Production Build**: Verify production compilation and static page optimization
  ```bash
  npm run build
  ```

---

## Security

Please review [`SECURITY.md`](SECURITY.md) for full details on:
* Guidelines for secret management.
* Protecting payment credentials and server-side boundaries.
* Reporting vulnerabilities.
