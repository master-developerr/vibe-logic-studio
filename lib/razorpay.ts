import crypto from "crypto";

/**
 * Verifies the signature of an incoming Razorpay webhook request.
 * 
 * @param body The raw stringified request body.
 * @param signature The signature from the `x-razorpay-signature` header.
 * @param secret The webhook secret configured in Razorpay.
 * @returns boolean indicating if the signature is valid.
 */
export function verifyRazorpaySignature(body: string, signature: string | null, secret: string): boolean {
  if (!signature) {
    return false;
  }
  
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
    
  return expectedSignature === signature;
}
