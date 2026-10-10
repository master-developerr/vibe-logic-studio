import { redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getPurchaseSessionFromCookies } from "@/lib/purchase-session";
import { OnboardingFlow } from "@/components/checkout/OnboardingFlow";
import type { Id } from "@/convex/_generated/dataModel";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ purchaseId?: string }>;
}) {
  const params = await searchParams;
  const sessionToken = await getPurchaseSessionFromCookies();

  if (!params.purchaseId || !sessionToken) {
    redirect("/");
  }

  // Authoritatively query purchase state from Convex using the HttpOnly session token
  const purchase = await fetchQuery(api.purchases.getPurchaseForOnboarding, {
    purchaseId: params.purchaseId as Id<"purchases">,
    sessionToken,
  });

  if (!purchase) {
    redirect("/");
  }

  // The thank-you / onboarding page must NOT be accessible without a verified payment!
  if (purchase.paymentStatus !== "verified" && purchase.claimStatus !== "claimed") {
    redirect(`/checkout?purchaseId=${params.purchaseId}`);
  }

  return (
    <main className="min-h-screen bg-background py-12 md:py-16 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        <OnboardingFlow
          purchaseId={purchase.purchaseId}
          initialName={purchase.buyerName}
          initialEmail={purchase.buyerEmail}
          courseTitle={purchase.course?.title || "VibeLogic Bootcamp"}
          whatsappLink={purchase.batch?.whatsappLink}
          batchTitle={purchase.batch?.title || "Cohort Batch"}
          detailsConfirmed={purchase.detailsConfirmed}
          whatsappJoined={purchase.whatsappJoined}
          onboardingCompleted={purchase.onboardingCompleted}
        />
      </div>
    </main>
  );
}
