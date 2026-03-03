import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/* =====================================================
   LIST MESSAGES FOR CONVERSATION
===================================================== */
export const listMessagesForConversation = query({
  args: {
    conversationId: v.id("conversations"),
    limit: v.optional(v.number()),
  },

  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    const messages = await ctx.db
      .query("messages")
      .withIndex("byConversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("desc")
      .take(limit);

    return messages.reverse();
  },
});

/* =====================================================
   SEND MESSAGE
===================================================== */
export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    senderId: v.id("users"),

    content: v.optional(v.string()),
    type: v.optional(
      v.union(
        v.literal("text"),
        v.literal("voice"),
        v.literal("system")
      )
    ),
    audioUrl: v.optional(v.string()),
    replyToMessageId: v.optional(v.id("messages")),
  },

  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: args.senderId,

      type: args.type ?? "text",

      // ✅ optional fields → no null
      content: args.content,
      audioUrl: args.audioUrl,
      replyToMessageId: args.replyToMessageId,

      deleted: false,
      createdAt: Date.now(),
      editedAt: undefined,
    });

    return messageId;
  },
});

/* =====================================================
   DELETE MESSAGE (SOFT DELETE)
===================================================== */
export const deleteMessage = mutation({
  args: {
    messageId: v.id("messages"),
    requesterId: v.id("users"),
  },

  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);

    if (!message) {
      console.log("Message already deleted");
      return { success: true };
    }

    if (message.senderId !== args.requesterId) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.messageId, {
      content: undefined,
      audioUrl: undefined,
      deleted: true,
      editedAt: Date.now(),
    });

    return { success: true };
  },
});

/* =====================================================
   EDIT MESSAGE
===================================================== */
export const editMessage = mutation({
  args: {
    messageId: v.id("messages"),
    requesterId: v.id("users"),
    newContent: v.string(),
  },

  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);

    if (!message) throw new Error("Message not found");

    if (message.senderId !== args.requesterId) {
      throw new Error("Not authorized");
    }

    if (message.deleted) {
      throw new Error("Cannot edit deleted message");
    }

    await ctx.db.patch(args.messageId, {
      content: args.newContent,
      editedAt: Date.now(),
    });

    return { success: true };
  },
});