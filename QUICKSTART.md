# Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn
- Git
- A Clerk account (https://clerk.com)
- A Convex account (https://convex.dev)

## Step 1: Clean Dependencies & Install

### Windows Users
Run the automated install script:

```bash
install.bat
```

### macOS/Linux Users
```bash
bash install.sh
```

### Manual Installation

```bash
# Remove old dependencies
rm -rf node_modules package-lock.json

# Install fresh dependencies
npm install
```

## Step 2: Set Up Clerk

1. Go to https://dashboard.clerk.com
2. Create a new application
3. Choose "Email and Social" for authentication
4. In the left sidebar, go to **API Keys**
5. Copy your:
   - Publishable Key
   - Secret Key

## Step 3: Set Up Convex

1. Go to https://dashboard.convex.dev
2. Create a new project
3. From the **Settings** page, copy your **Deployment URL**

## Step 4: Create `.env.local`

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local`:

```
NEXT_PUBLIC_CONVEX_URL=<your-convex-deployment-url>
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
CLERK_SECRET_KEY=<your-clerk-secret-key>
```

## Step 5: Deploy Convex Functions

This creates the database schema and deploys all backend functions:

```bash
npx convex deploy
```

**Important**: This generates `convex/_generated/api.ts` with proper TypeScript types.

## Step 6: Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

## Step 7: Create Your Account

1. Click "Get Started" or go to `/auth/sign-up`
2. Sign up with email or social login
3. Your profile is automatically created in Convex
4. Go to `/chat` to start messaging

## Troubleshooting

### "Convex URL is undefined"
- Verify `NEXT_PUBLIC_CONVEX_URL` is set in `.env.local`
- Make sure you ran `npx convex deploy`
- Restart the dev server: `npm run dev`

### "Clerk is undefined"  
- Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set in `.env.local`
- Restart the dev server

### TypeScript errors about missing API types
- Run `npx convex deploy` - this generates the types
- Wait for the command to complete (creates `convex/_generated/api.ts`)
- Restart VS Code TypeScript server (Cmd/Ctrl + Shift + P → "Restart TS Server")

### No users showing in search
- Make sure other users have signed up
- Create multiple accounts to test

### Messages not appearing
- Check the browser DevTools console for errors
- Verify Convex functions deployed: `npx convex dev` shows function logs

## Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Run production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript check
npx convex dev       # Run Convex dev mode with live reloading
npx convex deploy    # Deploy to production
```

## Structure Quick Reference

- `app/` - Next.js App Router pages
- `components/` - React components (17 components total)
- `convex/` - Backend functions and schema
- `hooks/` - Custom React hooks (8 hooks)
- `lib/` - Utility functions and helpers
- `types/` - TypeScript type definitions
- `public/` - Static assets

## Features Checklist

- ✅ Email + Social Sign-in (Clerk)
- ✅ Real-time Messaging (Convex subscriptions)
- ✅ User Search
- ✅ Conversation List with Smart Timestamps
- ✅ Online/Offline Status
- ✅ Typing Indicator
- ✅ Unread Message Badges
- ✅ Message Delete (soft delete)
- ✅ Emoji Reactions (5 fixed emojis)
- ✅ Auto-scroll to Bottom
- ✅ Responsive Mobile Layout
- ✅ Group Chat (create groups)
- ✅ Empty States
- ✅ Loading States & Error Handling

## Key API Endpoints

All functions are in `convex/*.ts`:
- `users.ts` - User management and search
- `conversations.ts` - Create/list conversations
- `messages.ts` - Send/delete messages
- `reactions.ts` - Add emoji reactions
- `presence.ts` - Online status
- `typing.ts` - Typing indicators
- `unread.ts` - Unread message tracking

## Next Steps

1. ✅ Deploy to Vercel for free hosting
2. ✅ Add more emoji reactions
3. ✅ Implement message editing
4. ✅ Add voice/video calling
5. ✅ Add message search
6. ✅ Implement message forwarding

## Deployment to Vercel

Once everything works locally:

```bash
vercel deploy
```

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

Your app is now live! 🎉

## Support & Resources

- Convex Docs: https://docs.convex.dev
- Clerk Docs: https://docs.clerk.com/docs/overview
- Next.js Docs: https://nextjs.org/docs
- GitHub: [your-repo-url]

---

Built with ❤️ using Next.js, Convex, and Clerk
