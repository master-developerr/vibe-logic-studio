import { SignIn } from "@clerk/nextjs";
import { getSafeRedirectUrl } from "@/lib/auth-redirect";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const { forceUrl, fallbackUrl } = getSafeRedirectUrl(params, "/dashboard");

  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 bg-background">
      <SignIn
        forceRedirectUrl={forceUrl}
        fallbackRedirectUrl={fallbackUrl}
      />
    </div>
  );
}
