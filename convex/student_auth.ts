import { GenericQueryCtx, GenericMutationCtx } from "convex/server";
import { DataModel, Id } from "./_generated/dataModel";

type Context = GenericQueryCtx<DataModel> | GenericMutationCtx<DataModel>;

/**
 * Validates that the current request is authenticated and the user has access
 * to the specified batch (either by active enrollment, or by being an admin).
 * Returns the authenticated user object.
 * Throws if unauthorized.
 */
export async function requireStudentEnrolledInBatch(ctx: Context, batchId: Id<"batches">) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    return null;
  }

  const targetClerkId = identity.subject;

  const authUser = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", targetClerkId))
    .unique();

  if (!authUser) {
    return null;
  }

  // Admins and superadmins can view any batch workspace for testing
  if (authUser.role === "admin" || authUser.role === "superadmin") {
    return authUser;
  }

  // For students, verify active enrollment in this specific batch
  const enrollment = await ctx.db
    .query("enrollments")
    .withIndex("by_user_id", (q) => q.eq("userId", authUser._id))
    .filter((q) => q.eq(q.field("batchId"), batchId))
    .first();

  if (!enrollment || enrollment.status !== "active") {
    return null;
  }

  return authUser;
}
