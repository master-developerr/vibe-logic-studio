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

/**
 * Verifies the signature of a Razorpay payment success callback.
 * 
 * @param orderId The order ID returned from Razorpay.
 * @param paymentId The payment ID returned from Razorpay.
 * @param signature The signature from Razorpay callback.
 * @param secret The webhook secret or key secret configured in Razorpay.
 * @returns boolean indicating if the signature is valid.
 */
export function verifyRazorpayPaymentSignature(orderId: string, paymentId: string, signature: string, secret: string): boolean {
  if (!signature || !orderId || !paymentId) {
    return false;
  }
  
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(orderId + "|" + paymentId)
    .digest("hex");
    
  return expectedSignature === signature;
}
