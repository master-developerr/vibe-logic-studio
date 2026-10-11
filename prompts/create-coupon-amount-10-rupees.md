# Goal
Create and activate coupon codes (including `TEST10`, `VIBE10`, and `RUPEES10`) in Convex that discount the payable course amount down to exactly ₹10 for checkout testing and verification.

# Target Files
- `convex/coupons.ts` (To be modified: support `fixed_price` discount type, add `upsertCoupon` mutation and `listCoupons` query)
- `convex/schema.ts` (Inspect/verify `coupons` table supports coupon attributes)
- `tests/purchase-ownership.test.ts` (To be modified: add test coverage for ₹10 coupon calculation)

# Requirements
- **Discount Computation**: Support coupon calculation that brings any course purchase price (e.g. ₹999) down to ₹10 (`finalAmount: 10`, `discountAmount: 989`).
- **Resilient Discount Types**:
  - Support `discountType: "fixed_price"` with `discountValue: 10`, setting final payable amount strictly to ₹10 (`discountAmount = purchase.originalPrice - 10`).
  - Support standard `discountType: "fixed"` with `discountValue: 989` as fallback so standard fixed discount semantics also reduce ₹999 to ₹10.
- **Convex Administration**: Provide a clean `upsertCoupon` mutation in `convex/coupons.ts` so coupons can be created, updated, or re-activated reliably.
- **Multi-Deployment Synchronization**: Push changes and seed the coupons on both development (`joyous-egret-150`) and production (`acoustic-pigeon-151`) Convex deployments.
- **Razorpay Minimum Order Compliance**: ₹10 (1,000 paise) exceeds Razorpay's minimum transaction requirement of ₹1.00 (100 paise), guaranteeing successful order generation without gateway validation errors.

# Acceptance Criteria
- Entering coupon code `TEST10` or `VIBE10` on the `/checkout?purchaseId=...` page recalculates the checkout breakdown to:
  - Original price: ₹999
  - Discount: -₹989
  - Total Payable: ₹10
- Clicking "Proceed to Payment" creates a Razorpay order for ₹10 (1000 paise) and opens the Razorpay modal for ₹10.00.
- `npm test` passes with full coverage for the new coupon type.
- TypeScript compilation and Next.js build pass without errors.

# Validation & Checks
- [ ] TypeScript compilation passes (`npm run typecheck` / `npx tsc --noEmit`)
- [ ] Unit & integration tests pass (`npm test`)
- [ ] Coupon seeded and verified in Convex dev and prod environments
- [ ] Live checkout verification confirms order amount is 1,000 paise (₹10.00)

# Manual Testing Steps
1. Navigate to `https://vibe-logic-studio.vercel.app/checkout?purchaseId=mh7cg5hfheztz2g6e7wxbp05kx8g35an` (or initiate checkout on `/build-software-with-ai`).
2. In the "Have a coupon code?" input field, enter `TEST10` and click "Apply".
3. Verify the discount displays `-₹989` and the total payable updates to `₹10`.
4. Click "Proceed to Payment" and confirm the Razorpay modal requests ₹10.00.
