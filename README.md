# Chat Application - Production Ready

A real-time chat messaging web application built with Next.js, Convex, Clerk, and Tailwind CSS.

## Features

### ✅ Core Features
- **🔐 Authentication**: Clerk email + social login
- **👥 User List & Search**: Real-time search, discover users to chat with
- **💬 One-on-One Messaging**: Real-time private conversations
- **🕒 Smart Timestamps**: Today (time only), same year (Feb 15, 2:34 PM), different year
- **📭 Empty States**: Friendly UI for empty conversations and no messages
- **📱 Responsive Layout**: Desktop (sidebar + chat) and mobile (toggle view)
- **🟢 Online/Offline Status**: Real-time presence tracking
- **✍️ Typing Indicator**: "User is typing..." with animated dots
- **🔔 Unread Message Count**: Badge per conversation, clears when opened
- **⬇️ Smart Auto-Scroll**: Auto-scroll to bottom, "↓ New Messages" button when scrolled up

### ⭐ Optional Features
- **🗑️ Delete Messages**: Soft delete with "This message was deleted" placeholder
- **😀 Message Reactions**: Fixed emojis (👍 ❤️ 😂 😮 😢), toggle on/off
- **⏳ Loading & Error States**: Skeleton loaders, retry buttons
- **👨‍👩‍👧‍👦 Group Chat**: Create groups, show member count

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, React 18
- **Backend**: Convex (database + real-time subscriptions)
- **Authentication**: Clerk
- **Styling**: Tailwind CSS (dark theme)
- **Deployment**: Vercel

## Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_CONVEX_URL=<your-convex-url>
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-key>
CLERK_SECRET_KEY=<your-clerk-secret>
```

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Set Up Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Copy your **Publishable Key** and **Secret Key**
4. Add to `.env.local`

### 3. Set Up Convex

1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Create a new project
3. Copy your **Deployment URL**
4. Add to `.env.local` as `NEXT_PUBLIC_CONVEX_URL`

### 4. Deploy Convex Functions

```bash
npx convex deploy
```

This will:
- Create the Convex schema
- Deploy all functions (users, conversations, messages, reactions, presence, typing, unread)
- Generate TypeScript types in `convex/_generated/api.ts`

### 5. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
app/
  ├── layout.tsx                 # Root layout with Clerk & Convex providers
  ├── page.tsx                   # Home page (redirects to /chat)
  ├── globals.css                # Global Tailwind styles
  ├── providers.tsx              # Clerk/Convex providers
  ├── auth/                      # Authentication pages
  │   ├── sign-in/page.tsx
  │   ├── sign-up/page.tsx
  │   └── layout.tsx
  └── chat/                      # Chat pages
      ├── page.tsx               # Main chat interface
      ├── layout.tsx
      └── loading.tsx

components/
  ├── chat/
  │   ├── chatwindow.tsx         # Main chat view
  │   ├── messagelist.tsx        # Message display
  │   ├── messagebubble.tsx      # Individual message
  │   ├── messageinput.tsx       # Input form
  │   ├── conversationlist.tsx   # Sidebar conversations
  │   ├── userlist.tsx           # User search results
  │   ├── typingindicator.tsx    # Typing animation
  │   ├── reactionbar.tsx        # Emoji reactions UI
  │   ├── unreadbadge.tsx        # Unread count badge
  │   └── onlinestatus.tsx       # Online indicator dot
  ├── layout/
  │   ├── navbar.tsx             # Top navigation
  │   └── sidebar.tsx            # Conversation sidebar
  ├── shared/
  │   ├── backbutton.tsx         # Mobile back button
  │   ├── emptystate.tsx         # Empty state UI
  │   ├── errorstate.tsx         # Error UI
  │   └── loader.tsx             # Loading spinner
  └── ui/
      └── skeleton.tsx           # Skeleton loaders

convex/
  ├── schema.ts                  # Database schema definition
  ├── users.ts                   # User functions (CRUD, search)
  ├── conversations.ts           # Conversation functions
  ├── messages.ts                # Message functions (send, delete)
  ├── reactions.ts               # Reaction functions
  ├── presence.ts                # Online status
  ├── typing.ts                  # Typing indicator
  ├── unread.ts                  # Unread count tracking
  ├── utils.ts                   # Shared utilities
  └── _generated/                # Auto-generated types

hooks/
  ├── usecurrentuser.ts          # Current logged-in user
  ├── useconversations.ts        # Load conversations
  ├── usemessages.ts             # Load messages for conversation
  ├── usetyping.ts               # Load typing users
  ├── usepresence.ts             # Load online status
  ├── useunread.ts               # Load unread counts
  ├── usemobile.ts               # Detect Mobile viewport
  └── useautoscroll.ts           # Auto-scroll to bottom logic

lib/
  ├── auth.ts                    # Server-side auth helpers
  ├── utils.ts                   # Helper functions (formatTime, getInitials, cn)
  ├── constants.ts               # App constants (allowed reactions)
  └── convexclient.ts            # Convex client instance

types/
  ├── user.ts                    # User type
  ├── conversation.ts            # Conversation type
  ├── message.ts                 # Message type
  ├── reaction.ts                # Reaction type
  ├── presence.ts                # Presence type
  └── index.ts                   # Export all types

```

## Key Features Explained

### Real-Time Messaging
- Uses Convex subscriptions for instant message updates
- Live presence tracking (online/offline status)
- Typing indicators with 2-second timeout

### Smart Timestamps
- **Today**: "2:34 PM"
- **This Year**: "Feb 15, 2:34 PM"
- **Other Years**: "Feb 15, 2024, 2:34 PM"

### Responsive Design
- **Desktop**: Sidebar always visible (conversations + users search)
- **Mobile**: Toggle between conversations and chat view

### Message Management
- Soft delete messages (keeps record, shows "deleted" placeholder)
- Add/remove reactions with animated emojis
- Mark conversations as read automatically

### Unread Tracking
- Badge shows unread count per conversation
- Increments on new messages
- Clears when conversation is opened

## Deployment

### Deploy to Vercel

```bash
vercel deploy
```

**Important**: Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

### Database Persistence

Convex automatically handles all data persistence. No separate database setup needed!

## API Endpoints (Convex Functions)

### Users
- `createUser(clerkId, name, email, imageUrl)` - Create/update user
- `getUserByClerkId(clerkId)` - Get user by Clerk ID
- `listAllUsers(excludeUserId)` - List all users
- `searchUsers(query, excludeUserId)` - Search by name/email

### Conversations
- `getOrCreateConversation(userAId, userBId)` - Get or create 1-on-1 chat
- `listConversationsForUser(userId)` - List user's conversations
- `createGroupConversation(name, memberIds)` - Create group chat

### Messages
- `sendMessage(conversationId, senderId, content)` - Send message
- `listMessagesForConversation(conversationId, limit)` - Load messages
- `deleteMessage(messageId, requesterId)` - Soft delete message

### Reactions
- `addReaction(messageId, userId, emoji)` - Add/toggle reaction
- `getReactionsForMessage(messageId)` - Get all reactions for message

### Presence
- `setPresence(userId, online)` - Set user online/offline status

### Typing
- `setTyping(conversationId, userId, isTyping)` - Update typing status
- `getTypingUsersForConversation(conversationId)` - Get typing users

### Unread Count
- `markAsRead(conversationId, userId)` - Clear unread count
- `getUnreadCountForUser(userId)` - Total unread count

## Troubleshooting

### "Convex URL not found"
- Ensure `NEXT_PUBLIC_CONVEX_URL` is set in `.env.local`
- Run `npx convex deploy` to create your Convex deployment

### "Clerk keys missing"
- Check Clerk dashboard for correct keys
- Ensure keys are added to `.env.local`

### Messages not syncing
- Check browser console for errors
- Verify Convex functions deployed: `npx convex deploy`
- Clear browser cache and reload

### Typing indicator not working
- Verify `api.typing.setTyping` is called from `MessageInput`
- Check Convex function logs in dashboard

## Performance Tips

1. **Message Pagination**: Load 200 messages by default, implement infinite scroll for older messages
2. **Presence Updates**: Presence checks happen every 30 seconds
3. **Unread Counts**: Cached on client, updated in real-time
4. **Auto-scroll**: Threshold set to 100px from bottom

## Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Tests (if configured)
npm test
```

## Security

- ✅ All Convex functions check user ID (prevent cross-user access)
- ✅ Clerk handles authentication (JWT verification)
- ✅ Message deletion only allowed by sender
- ✅ Unread access limited to conversation members

## License

MIT

## Support

For issues or questions:
1. Check Convex docs: https://docs.convex.dev
2. Check Clerk docs: https://docs.clerk.com
3. Check Next.js docs: https://nextjs.org/docs

---

**Built with ❤️ for real-time communication**
# chat
