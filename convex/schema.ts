import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  /* USERS */
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    image: v.string(),
  }).index("byClerkId", ["clerkId"]),

  /* CONVERSATIONS */
  conversations: defineTable({
    memberIds: v.array(v.id("users")),
    isGroup: v.boolean(),
    name: v.optional(v.string()),
    createdAt: v.number(),
    lastMessageAt: v.optional(v.number()),
  }).index("byMember", ["memberIds"]),

  /* MESSAGES */
  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    type: v.string(),
    content: v.optional(v.string()),
    audioUrl: v.optional(v.string()),
    replyToMessageId: v.optional(v.id("messages")),
    deleted: v.boolean(),
    createdAt: v.number(),
    editedAt: v.optional(v.number()),
  }).index("byConversation", ["conversationId"]),

  /* REACTIONS */
  reactions: defineTable({
    messageId: v.id("messages"),
    userId: v.id("users"),
    emoji: v.string(),
  })
    .index("byMessage", ["messageId"])
    .index("byMessageUserEmoji", ["messageId", "userId", "emoji"]),

  /* UNREAD COUNTS */
  unreadCounts: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    count: v.number(),
  })
    .index("byUser", ["userId"])
    .index("byConversationUser", ["conversationId", "userId"]),

  /* TYPING STATUS ✅ FIXED */
  typingStatus: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    lastTypedAt: v.number(),
  })
    .index("byConversation", ["conversationId"])
    .index("byConversationUser", ["conversationId", "userId"]),

  /* PRESENCE */
  presence: defineTable({
    userId: v.id("users"),
    online: v.boolean(),
    lastSeenAt: v.number(),
  }).index("byUser", ["userId"]),

  /* NOTIFICATIONS */
  notifications: defineTable({
    userId: v.id("users"),
    conversationId: v.id("conversations"),
    messageId: v.optional(v.id("messages")),
    read: v.boolean(),
    createdAt: v.number(),
  }).index("byUser", ["userId"]),

  /* CALL SIGNALING */
  calls: defineTable({
    conversationId: v.id("conversations"),
    callerId: v.id("users"),
    receiverId: v.id("users"),
    status: v.string(),
    offer: v.optional(v.any()),
    answer: v.optional(v.any()),
    createdAt: v.number(),
  }).index("byConversation", ["conversationId"]),
});