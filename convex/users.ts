import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/* ================================
   GET USER BY CLERK ID
================================ */
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    // 🔐 Auth check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();
  },
});

/* ================================
   CREATE USER
================================ */
export const createUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    // 🔐 Auth check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (existing) return existing;

    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      name: args.name,
      email: args.email,
      image: args.image,
    });
  },
});

/* ================================
   LIST ALL USERS
================================ */
export const listAllUsers = query({
  args: {
    excludeUserId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    // 🔐 Auth check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    let users = await ctx.db.query("users").collect();

    if (args.excludeUserId) {
      users = users.filter((u) => u._id !== args.excludeUserId);
    }

    return users;
  },
});

/* ================================
   SEARCH USERS
================================ */
export const searchUsers = query({
  args: {
    query: v.string(),
    excludeUserId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    // 🔐 Auth check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    let users = await ctx.db.query("users").collect();

    users = users.filter((u) =>
      u.name.toLowerCase().includes(args.query.toLowerCase())
    );

    if (args.excludeUserId) {
      users = users.filter((u) => u._id !== args.excludeUserId);
    }

    return users;
  },
});