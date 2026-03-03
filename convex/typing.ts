import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";

/* =====================================================
   SET TYPING STATUS
===================================================== */
export const setTyping = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    isTyping: v.boolean(),
  },

  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("typingStatus")
      .withIndex("byConversationUser", (q) =>
        q.eq("conversationId", args.conversationId)
         .eq("userId", args.userId)
      )
      .unique();

    if (args.isTyping) {
      const doc = {
        conversationId: args.conversationId,
        userId: args.userId,
        lastTypedAt: Date.now(), // ✅ numeric timestamp
      };

      if (existing) {
        await ctx.db.patch(existing._id, doc);
      } else {
        await ctx.db.insert("typingStatus", doc);
      }
    } else if (existing) {
      await ctx.db.delete(existing._id);
    }

    return { ok: true };
  },
});

/* =====================================================
   GET TYPING USERS
===================================================== */
export const getTypingUsersForConversation = query({
  args: { conversationId: v.id("conversations") },

  handler: async (ctx, args) => {
    const typingUsers = await ctx.db
      .query("typingStatus")
      .withIndex("byConversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    const now = Date.now();

    // ✅ DO NOT delete — just filter active typers
    return typingUsers.filter(
      (t) => now - t.lastTypedAt <= 2000
    );
  },
});