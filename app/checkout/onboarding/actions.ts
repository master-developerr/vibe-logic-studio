"use server";

import { headers } from "next/headers";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getPurchaseSessionFromCookies } from "@/lib/purchase-session";
import { dispatchPurchaseEmail } from "@/lib/email-dispatch-service";
import type { Id } from "@/convex/_generated/dataModel";

export async function updateBuyerDetailsAction(
  purchaseId: string,
  buyerName: string,
  buyerEmail: string
) {
  const sessionToken = await getPurchaseSessionFromCookies();
  if (!sessionToken) {
    throw new Error("Purchase session not found or expired. Please use your recovery link.");
  }

  return await fetchMutation(api.purchases.updateBuyerDetails, {
    purchaseId: purchaseId as Id<"purchases">,
    sessionToken,
    buyerName,
    buyerEmail,
  });
}

export async function updateOnboardingProgressAction(
  purchaseId: string,
  whatsappJoined: boolean,
  onboardingCompleted: boolean
) {
  const sessionToken = await getPurchaseSessionFromCookies();
  if (!sessionToken) {
    throw new Error("Purchase session not found or expired. Please use your recovery link.");
  }

  return await fetchMutation(api.purchases.updateOnboardingProgress, {
    purchaseId: purchaseId as Id<"purchases">,
    sessionToken,
    whatsappJoined,
    onboardingCompleted,
  });
}

export async function dispatchWelcomeEmailAction(purchaseId: string) {
  const sessionToken = await getPurchaseSessionFromCookies();
  if (!sessionToken) {
    throw new Error("Unauthorized purchase session");
  }

  const reqHeaders = await headers();
  const host = reqHeaders.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  return await dispatchPurchaseEmail(purchaseId, baseUrl);
}
