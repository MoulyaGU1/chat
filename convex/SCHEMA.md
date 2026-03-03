Convex Schema Design
====================

This document describes the Convex data model and recommended indexes for the chat app.

Tables
------

- users
  - id (Convex document id)
  - clerkId: string (Clerk user id)
  - name, email, imageUrl
  - createdAt, lastActiveAt
  - Indexes: byClerkId (clerkId)

- conversations
  - id
  - isGroup: boolean
  - name?: string
  - memberIds: string[] (user ids)
  - lastMessageAt: ISO timestamp
  - createdAt
  - Indexes: byMember (memberIds), byLastMessageAt (lastMessageAt)

- conversationMembers
  - conversationId
  - userId
  - joinedAt
  - role (optional)
  - Indexes: byUserId, byConversationId

- messages
  - id
  - conversationId
  - senderId
  - content
  - createdAt
  - editedAt
  - deleted: boolean
  - Indexes: byConversation (conversationId + createdAt desc)

- reactions
  - id
  - messageId
  - userId
  - emoji
  - createdAt
  - Indexes: byMessage

- presence
  - userId
  - online: boolean
  - lastSeenAt
  - Indexes: byUserId

- typingStatus
  - conversationId
  - userId
  - lastTypedAt
  - Indexes: byConversation

- unreadCounts
  - conversationId
  - userId
  - count
  - Indexes: byUser

Design notes
------------

- Keep messages append-only. Soft-delete messages by setting `deleted=true` and clearing `content`.
- Maintain `conversations.lastMessageAt` to query recent conversations quickly.
- Use composite indexes where Convex supports them (e.g., conversationId + createdAt) for efficient pagination.
- Presence and typing can be small documents updated frequently; consider TTL or periodic cleanup if needed.

Next steps
----------

- Implement Convex functions: createUser, getOrCreateConversation, sendMessage, listConversationsForUser, listMessagesForConversation, setPresence, setTyping, markAsRead, addReaction, deleteMessage
- Add server-side helpers in `convex/functions/` and tests for behavior.
