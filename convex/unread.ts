import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/* ================================
   MARK AS READ
================================ */
export const markAsRead = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("unreadCounts")
      .filter((q) =>
        q.and(
          q.eq(q.field("conversationId"), args.conversationId),
          q.eq(q.field("userId"), args.userId)
        )
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { count: 0 });
    }

    return { ok: true };
  },
});

/* ================================
   GET UNREAD COUNT FOR USER
================================ */
export const getUnreadCountForUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const unreadCounts = await ctx.db
      .query("unreadCounts")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    const total = unreadCounts.reduce((sum, u) => sum + u.count, 0);

    return {
      total,
      byConversation: unreadCounts.reduce(
        (acc, u) => {
          acc[u.conversationId] = u.count;
          return acc;
        },
        {} as Record<string, number>
      ),
    };
  },
});

/* ================================
   GET UNREAD COUNT FOR CONVERSATION
================================ */
export const getUnreadCountForConversation = query({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const unread = await ctx.db
      .query("unreadCounts")
      .filter((q) =>
        q.and(
          q.eq(q.field("conversationId"), args.conversationId),
          q.eq(q.field("userId"), args.userId)
        )
      )
      .first();

    return unread?.count ?? 0;
  },
});