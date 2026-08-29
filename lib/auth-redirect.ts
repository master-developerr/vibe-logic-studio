/**
 * Authentication redirect helper functions.
 * Validates and sanitizes redirect destinations to prevent open-redirect vulnerabilities
 * while preserving checkout intent through Clerk authentication.
 */

/**
 * Validates whether a string is a safe internal relative path.
 * Must start with a single "/" and must not start with "//", "http:", "https:", or "javascript:".
 */
export function isSafeInternalPath(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed.startsWith("/")) return false;
  if (trimmed.startsWith("//")) return false;
  if (trimmed.startsWith("/\\")) return false;
  if (/^\/[a-z0-9]+:/i.test(trimmed)) return false; // prevents /http:... or /javascript:...
  return true;
}

/**
 * Extracts and sanitizes the redirect target URL from standard query parameter variants:
 * - redirect_url (Clerk primary)
 * - fallback_redirect_url
 * - redirectUrl
 * - return_to
 * - next
 */
export function getSafeRedirectUrl(
  searchParams: Record<string, string | string[] | undefined> | null | undefined,
  defaultFallback = "/dashboard"
): { forceUrl: string | undefined; fallbackUrl: string } {
  if (!searchParams) {
    return { forceUrl: undefined, fallbackUrl: defaultFallback };
  }

  const rawCandidate =
    (typeof searchParams.redirect_url === "string" ? searchParams.redirect_url : undefined) ||
    (typeof searchParams.redirectUrl === "string" ? searchParams.redirectUrl : undefined) ||
    (typeof searchParams.return_to === "string" ? searchParams.return_to : undefined) ||
    (typeof searchParams.next === "string" ? searchParams.next : undefined) ||
    (typeof searchParams.fallback_redirect_url === "string" ? searchParams.fallback_redirect_url : undefined);

  if (rawCandidate) {
    let decoded = rawCandidate;
    try {
      decoded = decodeURIComponent(rawCandidate);
    } catch {}

    if (isSafeInternalPath(decoded)) {
      // If destination is checkout or course, we force the redirect unconditionally
      const isCheckoutIntent = decoded.startsWith("/checkout") || decoded.startsWith("/course");
      return {
        forceUrl: decoded,
        fallbackUrl: decoded,
      };
    }
  }

  return {
    forceUrl: undefined,
    fallbackUrl: defaultFallback,
  };
}
