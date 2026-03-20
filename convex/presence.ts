import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";

/* =====================================================
    SET USER PRESENCE (Updated for Last Seen)
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

    const timestamp = Date.now();

    if (existing) {
      // If they are going offline, we update lastSeenAt to 'now'
      // If they are coming online, we keep the timestamp as the start of the session
      await ctx.db.patch(existing._id, {
        online: args.online,
        lastSeenAt: timestamp,
      });
      return existing._id;
    }

    return await ctx.db.insert("presence", {
      userId: args.userId,
      online: args.online,
      lastSeenAt: timestamp,
    });
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
    GET PRESENCE FOR MULTIPLE USERS (Optimized)
===================================================== */
export const getPresenceForUsers = query({
  args: { userIds: v.array(v.id("users")) },

  handler: async (ctx, args) => {
    // Instead of collecting all, we map through IDs for better performance
    const results = await Promise.all(
      args.userIds.map((userId) =>
        ctx.db
          .query("presence")
          .withIndex("byUser", (q) => q.eq("userId", userId))
          .unique()
      )
    );

    // Filter out any nulls (users who haven't set presence yet)
    return results.filter((p): p is Doc<"presence"> => p !== null);
  },
});