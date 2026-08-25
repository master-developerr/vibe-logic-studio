import { SignIn } from "@clerk/nextjs";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string; fallback_redirect_url?: string }>;
}) {
  const params = await searchParams;
  // `redirect_url` preserves purchase intent through authentication (highest priority).
  // `fallback_redirect_url` is used for normal sign-ins with no specific destination.
  const forceUrl = params.redirect_url;
  const fallbackUrl = params.fallback_redirect_url || "/dashboard";

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        forceRedirectUrl={forceUrl}
        fallbackRedirectUrl={fallbackUrl}
      />
    </div>
  );
}
