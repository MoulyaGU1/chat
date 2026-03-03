import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

/* =====================================================
   ADD / REMOVE REACTION (TOGGLE)
===================================================== */
export const addReaction = mutation({
  args: {
    messageId: v.id("messages"),
    userId: v.id("users"),
    emoji: v.string(),
  },

  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("reactions")
      .withIndex("byMessageUserEmoji", (q) =>
        q.eq("messageId", args.messageId)
         .eq("userId", args.userId)
         .eq("emoji", args.emoji)
      )
      .unique();

    // toggle remove
    if (existing) {
      await ctx.db.delete(existing._id);
      return { removed: true };
    }

    // add reaction
    await ctx.db.insert("reactions", args);
    return { added: true };
  },
});

/* =====================================================
   GET REACTIONS FOR MESSAGE
===================================================== */
export const getReactionsForMessage = query({
  args: { messageId: v.id("messages") },

  handler: async (ctx, args) => {
    const reactions = await ctx.db
      .query("reactions")
      .withIndex("byMessage", (q) =>
        q.eq("messageId", args.messageId)
      )
      .collect();

    /* ---------- group reactions ---------- */
    const grouped: Record<
      string,
      { emoji: string; count: number; userIds: Id<"users">[] }
    > = {};

    for (const reaction of reactions) {
      if (!grouped[reaction.emoji]) {
        grouped[reaction.emoji] = {
          emoji: reaction.emoji,
          count: 0,
          userIds: [],
        };
      }

      grouped[reaction.emoji].count += 1;
      grouped[reaction.emoji].userIds.push(reaction.userId);
    }

    return Object.values(grouped);
  },
});