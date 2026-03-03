import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";

/* =====================================================
   SET USER PRESENCE
===================================================== */
export const setPresence = mutation({
  args: {
    userId: v.id("users"),
    online: v.boolean(),
  },

  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("presence")
      .withIndex("byUser", (q) =>
        q.eq("userId", args.userId)
      )
      .unique();

    const doc = {
      userId: args.userId,
      online: args.online,
      lastSeenAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, doc);
      return existing._id;
    }

    return await ctx.db.insert("presence", doc);
  },
});

/* =====================================================
   GET PRESENCE FOR ONE USER
===================================================== */
export const getPresenceForUser = query({
  args: { userId: v.id("users") },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("presence")
      .withIndex("byUser", (q) =>
        q.eq("userId", args.userId)
      )
      .unique();
  },
});

/* =====================================================
   GET PRESENCE FOR MULTIPLE USERS
===================================================== */
export const getPresenceForUsers = query({
  args: { userIds: v.array(v.id("users")) },

  handler: async (ctx, args) => {
    const presences = await ctx.db
      .query("presence")
      .collect();

    // typed filtering
    return presences.filter((p: Doc<"presence">) =>
      args.userIds.includes(p.userId)
    );
  },
});