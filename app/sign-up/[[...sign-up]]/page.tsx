import { SignUp } from "@clerk/nextjs";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string; fallback_redirect_url?: string }>;
}) {
  const params = await searchParams;
  // `redirect_url` is Clerk's highest-priority redirect (forceRedirectUrl).
  // Used when purchase intent must be preserved through authentication.
  // `fallback_redirect_url` is used for normal sign-ups with no specific destination.
  const forceUrl = params.redirect_url;
  const fallbackUrl = params.fallback_redirect_url || "/dashboard";

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp
        forceRedirectUrl={forceUrl}
        fallbackRedirectUrl={fallbackUrl}
      />
    </div>
  );
}
