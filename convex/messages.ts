import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

/**
 * Generates a short-lived URL to upload a file (like an audio message) 
 * directly to Convex storage.
 */
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const getUnread = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notifications")
      .withIndex("byUser", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("read"), false))
      .order("desc")
      .collect();
  },
});

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

    // Convert storageIds for both audio and files into viewable URLs
    const messagesWithUrls = await Promise.all(
      messages.map(async (msg) => ({
        ...msg,
        audioUrl: msg.audioUrl ? await ctx.storage.getUrl(msg.audioUrl) : null,
        fileUrl: msg.fileUrl ? await ctx.storage.getUrl(msg.fileUrl) : null,
      }))
    );

    return messagesWithUrls.reverse();
  },
});

/* =====================================================
   SEND MESSAGE - Single Combined Function
===================================================== */
export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.optional(v.string()),
    type: v.union(v.literal("text"), v.literal("audio"), v.literal("file"), v.literal("system")),
    audioUrl: v.optional(v.string()), 
    fileUrl: v.optional(v.string()), 
    fileName: v.optional(v.string()), 
    replyToMessageId: v.optional(v.id("messages")),
  },

  handler: async (ctx, args) => {
    // 1. Insert the message
    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: args.senderId,
      type: args.type,
      content: args.content,
      audioUrl: args.audioUrl,
      fileUrl: args.fileUrl,
      fileName: args.fileName,
      replyToMessageId: args.replyToMessageId,
      seen: false, 
      deleted: false,
      createdAt: Date.now(),
    });

    // 2. Update conversation timestamp
    await ctx.db.patch(args.conversationId, {
      lastMessageAt: Date.now(),
    });

    const conversation = await ctx.db.get(args.conversationId);
    
    if (conversation) {
      const recipients = conversation.memberIds.filter(id => id !== args.senderId);

      for (const userId of recipients) {
        // 3. In-App Notification
        await ctx.db.insert("notifications", {
          userId,
          conversationId: args.conversationId,
          messageId: messageId,
          type: "message",
          read: false,
          createdAt: Date.now(),
        });

        // 4. Update Unread Count
        const existingUnread = await ctx.db
          .query("unreadCounts")
          .withIndex("byConversationUser", (q) => 
            q.eq("conversationId", args.conversationId).eq("userId", userId)
          )
          .unique();

        if (existingUnread) {
          await ctx.db.patch(existingUnread._id, { count: existingUnread.count + 1 });
        } else {
          await ctx.db.insert("unreadCounts", {
            conversationId: args.conversationId,
            userId,
            count: 1,
          });
        }

        // 5. SCHEDULE GMAIL NOTIFICATION
        const recipient = await ctx.db.get(userId);
        const sender = await ctx.db.get(args.senderId);

        if (recipient?.email) {
          // Schedules Gmail action. Delay set to 0 for instant testing.
          await ctx.scheduler.runAfter(0, api.emails.sendChatNotificationEmail, {
            userEmail: recipient.email,
            senderName: sender?.name || "Someone",
            messageContent: args.type === "text" 
              ? (args.content ?? "") 
              : `Sent a file: ${args.fileName || args.type}`,
          });
        }
      }
    }

    return messageId;
  },
});

/* =====================================================
   MARK AS SEEN (For Blue Ticks)
===================================================== */
export const markAsSeen = mutation({
  args: { conversationId: v.id("conversations"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("byConversation", (q) => q.eq("conversationId", args.conversationId))
      .filter((q) => q.and(
          q.eq(q.field("seen"), false),
          q.neq(q.field("senderId"), args.userId)
      ))
      .collect();

    for (const msg of messages) {
      await ctx.db.patch(msg._id, { seen: true });
    }
    
    const unreadCount = await ctx.db
      .query("unreadCounts")
      .withIndex("byConversationUser", (q) => 
        q.eq("conversationId", args.conversationId).eq("userId", args.userId)
      )
      .unique();
      
    if (unreadCount) {
      await ctx.db.patch(unreadCount._id, { count: 0 });
    }
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
    if (!message) return { success: true };
    if (message.senderId !== args.requesterId) throw new Error("Not authorized");

    await ctx.db.patch(args.messageId, {
      content: undefined,
      audioUrl: undefined,
      fileUrl: undefined,
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
    if (message.senderId !== args.requesterId) throw new Error("Not authorized");
    if (message.deleted) throw new Error("Cannot edit deleted message");

    await ctx.db.patch(args.messageId, {
      content: args.newContent,
      editedAt: Date.now(),
    });

    return { success: true };
  },
});

/* =====================================================
   REACTIONS
===================================================== */
export const addReaction = mutation({
  args: { messageId: v.id("messages"), emoji: v.string(), userId: v.id("users") },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) return;
    
    await ctx.db.insert("reactions", {
      messageId: args.messageId,
      userId: args.userId,
      emoji: args.emoji,
    });
  },
});

export const toggleReaction = mutation({
  args: { 
    messageId: v.id("messages"), 
    emoji: v.string(), 
    userId: v.id("users") 
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("reactions")
      .withIndex("byMessageUser", (q) => 
        q.eq("messageId", args.messageId).eq("userId", args.userId)
      )
      .filter((q) => q.eq(q.field("emoji"), args.emoji))
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
    } else {
      await ctx.db.insert("reactions", {
        messageId: args.messageId,
        userId: args.userId,
        emoji: args.emoji,
      });
    }
  },
});