import { GenericQueryCtx, GenericMutationCtx } from "convex/server";
import { DataModel } from "./_generated/dataModel";

type Context = GenericQueryCtx<DataModel> | GenericMutationCtx<DataModel>;

/**
 * Validates that the current request is authenticated and the user has admin or instructor privileges.
 * Returns the authenticated user object.
 * Throws if unauthorized.
 */
export async function requireAdminOrInstructor(ctx: Context) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized");
  }

  const authUser = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();

  if (!authUser) {
    throw new Error("Unauthorized: User not found");
  }

  if (authUser.role !== "admin" && authUser.role !== "instructor" && authUser.role !== "superadmin" && authUser.role !== "staff") {
    throw new Error("Unauthorized: Admin privileges required");
  }

  return authUser;
}

/**
 * Validates that the current request is authenticated and the user has ONLY admin privileges.
 * (e.g. for analytics and pure admin operations where instructors are not allowed)
 */
export async function requireAdmin(ctx: Context) {
  const authUser = await requireAdminOrInstructor(ctx);
  
  if (authUser.role !== "admin" && authUser.role !== "superadmin") {
    throw new Error("Unauthorized: Strict Admin privileges required");
  }
  
  return authUser;
}
