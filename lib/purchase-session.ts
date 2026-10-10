import crypto from "crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

export const PURCHASE_SESSION_COOKIE = "vls_purchase_session";

export function generateSecureTokens() {
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const rawRecoveryToken = crypto.randomBytes(32).toString("hex");
  const recoveryTokenHash = crypto
    .createHash("sha256")
    .update(rawRecoveryToken)
    .digest("hex");

  return {
    sessionToken,
    rawRecoveryToken,
    recoveryTokenHash,
  };
}

export function hashRecoveryToken(token: string): string {
  return crypto.createHash("sha256").update(token.trim()).digest("hex");
}

export async function getPurchaseSessionFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(PURCHASE_SESSION_COOKIE);
  return sessionCookie?.value ?? null;
}

export function setPurchaseSessionOnResponse(
  response: NextResponse,
  sessionToken: string
): void {
  response.cookies.set({
    name: PURCHASE_SESSION_COOKIE,
    value: sessionToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}
