import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// List all users — to debug what emails are in the DB
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("users").take(50);
    return all.map((u) => ({ email: u.email, name: u.name, role: u.role }));
  },
});

// Grant admin by email (user must already exist via sign-in)
export const grantAdmin = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (!user) {
      return { success: false, message: `No user found with email: ${args.email}` };
    }

    await ctx.db.patch(user._id, { role: "admin" });
    return { success: true, message: `Granted admin to ${user.name} (${user.email})` };
  },
});

// Use this when the Clerk webhook hasn't fired yet (local dev without a tunnel)
// Pass your real Clerk userId from your browser session
export const forceCreateAdmin = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { role: "admin" });
      return { success: true, message: `Updated existing user ${args.email} to admin` };
    }

    await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      role: "admin",
      avatarUrl: "",
      createdAt: Date.now(),
    });
    return { success: true, message: `Created admin user: ${args.email}` };
  },
});

