import { NextRequest, NextResponse } from "next/server";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getPurchaseSessionFromCookies } from "@/lib/purchase-session";
import type { Id } from "@/convex/_generated/dataModel";

export async function POST(req: NextRequest) {
  try {
    const sessionToken = await getPurchaseSessionFromCookies();
    if (!sessionToken) {
      return NextResponse.json({ error: "Purchase session expired. Please refresh the page." }, { status: 401 });
    }

    const body = await req.json();
    const { purchaseId, code } = body;

    if (!purchaseId || !code) {
      return NextResponse.json({ error: "Missing purchaseId or coupon code" }, { status: 400 });
    }

    const result = await fetchMutation(api.coupons.applyCouponToPurchase, {
      purchaseId: purchaseId as Id<"purchases">,
      sessionToken,
      code: String(code).trim(),
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("[CouponAPI] Error:", error);
    const msg = error instanceof Error ? error.message : "Failed to apply coupon";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
