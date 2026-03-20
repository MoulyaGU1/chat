import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  /* USERS */
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    image: v.string(),
    pushToken: v.optional(v.string()), 
  }).index("byClerkId", ["clerkId"]),

  /* CONVERSATIONS */
  conversations: defineTable({
    memberIds: v.array(v.id("users")),
    isGroup: v.boolean(),
    name: v.optional(v.string()),
    createdAt: v.number(),
    lastMessageAt: v.optional(v.number()),
  }).index("byMember", ["memberIds"]),

  /* MESSAGES - ✅ Updated 'type' to allow 'audio' and 'text' specifically */
  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    type: v.union(v.literal("text"), v.literal("audio"),  v.literal("file"),v.literal("system")),  
    content: v.optional(v.string()),
    audioUrl: v.optional(v.string()), 
    replyToMessageId: v.optional(v.id("messages")),
    seen: v.boolean(),
    deleted: v.boolean(),
    createdAt: v.number(),
    editedAt: v.optional(v.number()),
    // Inside messages: defineTable({ ... })


fileUrl: v.optional(v.string()), // Added this
fileName: v.optional(v.string()), // Added this
  }).index("byConversation", ["conversationId"]),

  /* CALLS */
  calls: defineTable({
    conversationId: v.id("conversations"),
    callerId: v.id("users"),
    receiverId: v.id("users"),
    type: v.union(v.literal("audio"), v.literal("video")),
    status: v.union(
      v.literal("dialing"), 
      v.literal("ongoing"), 
      v.literal("ended"), 
      v.literal("missed"),
      v.literal("rejected")
    ),
    offer: v.optional(v.string()), 
    answer: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("byConversation", ["conversationId"])
    .index("byReceiver", ["receiverId", "status"]),

  /* TYPING STATUS */
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

  /* UNREAD COUNTS */
  unreadCounts: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    count: v.number(),
  }).index("byConversationUser", ["conversationId", "userId"]),

  /* NOTIFICATIONS */
  notifications: defineTable({
    userId: v.id("users"),
    conversationId: v.id("conversations"),
    messageId: v.optional(v.id("messages")),
    type: v.optional(v.string()), 
    read: v.boolean(),
    createdAt: v.number(),
  }).index("byUser", ["userId"]),

  /* REACTIONS - ✅ Fixed index names to match your mutation queries */
  reactions: defineTable({
    messageId: v.id("messages"),
    userId: v.id("users"),
    emoji: v.string(),
  })
    .index("byMessage", ["messageId"])
    // This allows .withIndex("byMessageUser", (q) => q.eq("messageId", ...).eq("userId", ...))
    .index("byMessageUser", ["messageId", "userId"]) 
    .index("byMessageUserEmoji", ["messageId", "userId", "emoji"]),
});