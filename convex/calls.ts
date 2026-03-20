import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Start a new call
export const createCall = mutation({
  args: {
    conversationId: v.id("conversations"),
    callerId: v.id("users"),
    receiverId: v.id("users"),
    type: v.union(v.literal("audio"), v.literal("video")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("calls", {
      ...args,
      status: "dialing",
      createdAt: Date.now(),
    });
  },
});

// Update the call with WebRTC Offer/Answer strings
export const updateCallSignal = mutation({
  args: {
    callId: v.id("calls"),
    offer: v.optional(v.string()),
    answer: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("dialing"), 
      v.literal("ongoing"), 
      v.literal("ended"), 
      v.literal("rejected")
    )),
  },
  handler: async (ctx, args) => {
    const { callId, ...updates } = args;
    await ctx.db.patch(callId, updates);
  },
});

// Get active call for a user (to show the "Incoming Call" popup)
export const getIncomingCall = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("calls")
      .withIndex("byReceiver", (q) => 
        q.eq("receiverId", args.userId).eq("status", "dialing")
      )
      .unique();
  },
});
// Add this to convex/calls.ts
export const getCall = query({
  args: { callId: v.id("calls") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.callId);
  },
});
