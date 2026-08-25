# Security Policy

## Security Commitments

At Vibe Logic Studio, we prioritize the security of our application, our users, and our payment integrations. We enforce strict data isolation and zero-trust policies throughout development, staging, and production environments.

---

## 1. Credentials & Secrets Management

* **Never Commit Secrets**: Under no circumstances should real API keys, secrets, private keys, or credentials be committed to the repository.
* **Environment Files**: Local variables must be placed in `.env.local` or defined in your local system environment. `.env.local` is ignored globally.
* **Server-Only Isolation**: Private credentials (e.g., `CLERK_SECRET_KEY`, `RAZORPAY_KEY_SECRET`, `UPSTASH_REDIS_REST_TOKEN`) must never be prefixed with `NEXT_PUBLIC_` or imported into client components. Keep them restricted to API routes, Next.js Server Actions, or Convex mutations/actions.

---

## 2. Payment Security (Razorpay)

* **Server-Side Verification**: All payment creation and signature verification must happen strictly on the server (`app/api/checkout/order` and `app/api/webhooks/razorpay`).
* **Webhook Signatures**: Incoming webhooks from Razorpay must be verified using the `RAZORPAY_WEBHOOK_SECRET` before updating enrollment states.
* **No Client-Side Override**: Never allow the client-side to supply payment state, prices, or enrollment confirmation directly. The database must remain the sole source of truth.

---

## 3. Server-Side Authorization

* **The Client is NOT a Security Boundary**: Any UI customization (hiding buttons, page redirects) is for UX only.
* **Strict Role Checks**: Every sensitive Convex mutation/action must authorize the user's role using Clerk identity context before performing read or write operations.

---

## 4. Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it immediately:

1. **Email**: Send details to [security@vibelogic.studio](mailto:security@vibelogic.studio).
2. **Details to Include**:
   * Description of the vulnerability.
   * Steps to reproduce (proof of concept).
   * Potential impact.
3. **Coordinated Disclosure**: We request that you do not disclose the vulnerability publicly or to third parties until we have had an opportunity to address and patch it.
