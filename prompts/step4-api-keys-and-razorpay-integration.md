# Goal
Audit environment variable configuration, secure Razorpay Test Mode integration, verify multi-service bindings (Clerk, Convex, Resend, Upstash Redis), add comprehensive automated tests covering all 18 specified scenarios, and author authoritative setup documentation in `docs/RAZORPAY_SETUP.md`.

# Target Files
- `.env.example` (To be updated with complete, safe placeholders)
- `lib/resend.ts` (To be modified to support RESEND_API_KEY and RESEND alias)
- `convex/payments.ts` (To be modified to add recordFailedPayment mutation)
- `app/api/webhooks/razorpay/route.ts` (To be modified to handle order.paid and payment.failed events)
- `tests/purchase-ownership.test.ts` (To be modified to add comprehensive test cases for all 18 payment scenarios)
- `docs/RAZORPAY_SETUP.md` (To be created)

# Requirements
1. **Phase 1 — Configuration Audit**:
   - Audit all environment variables referenced across Next.js, Convex, Clerk, Razorpay, Upstash Redis, Resend, and PostHog.
   - Catalog each variable: service, requirement status, visibility (public vs secret), consumption points, acquisition steps, and local state.
   - Zero disclosure of secrets.

2. **Phase 2 — Environment Template & Hygiene**:
   - Update `.env.example` with clean placeholders for all discovered variables (`CRON_SECRET`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CLERK_WEBHOOK_SECRET`, etc.).
   - Ensure `.gitignore` properly excludes `.env.local` and secret files.
   - Support graceful fallback when optional services (e.g. Redis, PostHog) are disabled.

3. **Phase 3 — Razorpay Test Mode & Webhook Lifecycle**:
   - Validate server-authoritative pricing and order generation.
   - Handle `payment.captured`, `order.paid`, and `payment.failed` in the webhook.
   - Retain constant-time HMAC signature verification for callbacks and webhooks.
   - Retain concurrency safety, idempotent fulfillment, and `pending_reconciliation` capacity handling.

4. **Phase 4 — Integration Verification**:
   - Verify Clerk auth, Convex outbox, Resend sender config, and Upstash Redis cache invalidation.
   - Ensure email failures cannot rollback verified payments or grant unauthorized entitlements.

5. **Phase 5 — Automated Testing**:
   - Cover all 18 scenarios requested in the prompt via executable Node.js tests.
   - Pass `npm test`, `npx convex codegen`, `npm run typecheck`, `npm run lint`, and `npm run build`.

6. **Phase 6 & 7 — Documentation & Reporting**:
   - Author `docs/RAZORPAY_SETUP.md` with complete instructions for Razorpay test mode, webhook URLs, and dashboard setup.
   - Provide executive audit report distinguishing verified code from required dashboard actions.

# Acceptance Criteria
- [ ] Complete environment audit produced without secret exposure.
- [ ] `.env.example` updated with all required and optional application variables.
- [ ] Webhook route handles `order.paid` and `payment.failed` with `recordFailedPayment`.
- [ ] All 18 automated payment test scenarios pass in `npm test`.
- [ ] TypeScript typecheck, ESLint, Convex codegen, and production build succeed with code 0.
- [ ] `docs/RAZORPAY_SETUP.md` created with step-by-step instructions.

# Validation & Checks
- [ ] `npm test` passes with 0 failures
- [ ] `npm run typecheck` passes with code 0
- [ ] `npm run lint` passes with 0 errors
- [ ] `npx convex codegen` passes with code 0
- [ ] `npm run build` succeeds with code 0
