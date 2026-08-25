import { SignIn } from "@clerk/nextjs";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ fallback_redirect_url?: string }>;
}) {
  const params = await searchParams;
  const fallbackUrl = params.fallback_redirect_url || "/dashboard";

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn fallbackRedirectUrl={fallbackUrl} />
    </div>
  );
}

