import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/* ======================================================
   GET OR CREATE 1-TO-1 CONVERSATION
====================================================== */
export const getOrCreateConversation = mutation({
  args: {
    userAId: v.id("users"),
    userBId: v.id("users"),
  },

  handler: async (ctx, args) => {
    const { userAId, userBId } = args;

    // sort IDs so order doesn't matter
    const members = [userAId, userBId].sort();

    // find existing conversation
    const conversations = await ctx.db
      .query("conversations")
      .collect();

    const existing = conversations.find(
      (c) =>
        !c.isGroup &&
        c.memberIds.length === 2 &&
        [...c.memberIds].sort().every((id, i) => id === members[i])
    );

    if (existing) {
      return existing._id;
    }

    // create new conversation
    const newConversationId = await ctx.db.insert("conversations", {
      isGroup: false,
      memberIds: members,
      createdAt: Date.now(),
      lastMessageAt: Date.now(),
    });

    // initialize unread counters
    for (const userId of members) {
      await ctx.db.insert("unreadCounts", {
        conversationId: newConversationId,
        userId,
        count: 0,
      });
    }

    return newConversationId;
  },
});

/* ======================================================
   LIST CONVERSATIONS FOR USER (FAST VERSION)
====================================================== */
export const listConversationsForUser = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },

  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    const conversations = await ctx.db
      .query("conversations")
      .collect();

    const userConversations = conversations
      .filter((conv) => conv.memberIds.includes(args.userId))
      .sort(
        (a, b) =>
          (b.lastMessageAt ?? b.createdAt) -
          (a.lastMessageAt ?? a.createdAt)
      )
      .slice(0, limit);

    return await Promise.all(
      userConversations.map(async (conv) => {
        const otherUserId = conv.memberIds.find(
          (id) => id !== args.userId
        );

        const otherUser = otherUserId
          ? await ctx.db.get(otherUserId)
          : null;

        // last message using index
        const lastMessage = await ctx.db
          .query("messages")
          .withIndex("byConversation", (q) =>
            q.eq("conversationId", conv._id)
          )
          .order("desc")
          .first();

        const unread = await ctx.db
          .query("unreadCounts")
          .withIndex("byConversationUser", (q) =>
            q.eq("conversationId", conv._id).eq("userId", args.userId)
          )
          .unique();

        return {
          ...conv,
          displayName: conv.isGroup
            ? conv.name ?? "Group"
            : otherUser?.name ?? "Chat",

          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                senderId: lastMessage.senderId,
                createdAt: lastMessage.createdAt,
              }
            : null,

          unreadCount: unread?.count ?? 0,
        };
      })
    );
  },
});

/* ======================================================
   GET SINGLE CONVERSATION
====================================================== */
export const getConversation = query({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },

  handler: async (ctx, args) => {
    const conv = await ctx.db.get(args.conversationId);
    if (!conv) return null;

    if (!conv.isGroup) {
      const otherUserId = conv.memberIds.find(
        (id) => id !== args.userId
      );

      const otherUser = otherUserId
        ? await ctx.db.get(otherUserId)
        : null;

      return {
        ...conv,
        displayName: otherUser?.name ?? "Chat",
      };
    }

    return {
      ...conv,
      displayName: conv.name ?? "Group",
    };
  },
});

/* ======================================================
   CREATE GROUP CONVERSATION
====================================================== */
export const createGroupConversation = mutation({
  args: {
    name: v.string(),
    memberIds: v.array(v.id("users")),
  },

  handler: async (ctx, args) => {
    const newConversationId = await ctx.db.insert("conversations", {
      isGroup: true,
      name: args.name,
      memberIds: args.memberIds,
      createdAt: Date.now(),
      lastMessageAt: Date.now(),
    });

    for (const userId of args.memberIds) {
      await ctx.db.insert("unreadCounts", {
        conversationId: newConversationId,
        userId,
        count: 0,
      });
    }

    return newConversationId;
  },
});

/* ======================================================
   DELETE COMPLETE CONVERSATION ⭐
====================================================== */
export const deleteConversation = mutation({
  args: {
    conversationId: v.id("conversations"),
    requesterId: v.id("users"),
  },

  handler: async (ctx, args) => {
    const conv = await ctx.db.get(args.conversationId);
    if (!conv) throw new Error("Conversation not found");

    if (!conv.memberIds.includes(args.requesterId)) {
      throw new Error("Unauthorized");
    }

    // delete messages
    const messages = await ctx.db
      .query("messages")
      .withIndex("byConversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }

    // delete unread counters
    const unread = await ctx.db
      .query("unreadCounts")
      .collect();

    for (const u of unread.filter(
      (u) => u.conversationId === args.conversationId
    )) {
      await ctx.db.delete(u._id);
    }

    // delete conversation
    await ctx.db.delete(args.conversationId);

    return { success: true };
  },
});