"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface ConversationListProps {
  userId: Id<"users"> | null;
  selectedConversationId: Id<"conversations"> | null;
  onSelectConversation: (conversationId: Id<"conversations">) => void;
}

export function ConversationList({
  userId,
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) {
  /* =====================================================
     FETCH CONVERSATIONS (Convex realtime query)
  ===================================================== */
  const conversations = useQuery(
    api.conversations.listConversationsForUser,
    userId ? { userId } : undefined
  );

  /* =====================================================
     LOADING STATE
     (Only show loading when user exists)
  ===================================================== */
  if (userId && conversations === undefined) {
    return (
      <div className="p-4 text-slate-400 text-sm">
        Loading chats...
      </div>
    );
  }

  /* =====================================================
     EMPTY STATE
  ===================================================== */
  if (!conversations || conversations.length === 0) {
    return (
      <div className="p-4 text-slate-400 text-sm">
        No conversations yet
      </div>
    );
  }

  /* =====================================================
     UI
  ===================================================== */
  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conversation) => {
        const lastTimestamp =
          conversation.lastMessage?.createdAt ??
          conversation.createdAt;

        return (
          <div
            key={conversation._id}
            onClick={() => onSelectConversation(conversation._id)}
            className={`p-4 cursor-pointer border-b border-slate-700 hover:bg-slate-700 transition ${
              selectedConversationId === conversation._id
                ? "bg-slate-700"
                : ""
            }`}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center">
              <div className="font-semibold text-white truncate">
                {conversation.displayName}
              </div>

              {/* UNREAD BADGE */}
              {conversation.unreadCount > 0 && (
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                  {conversation.unreadCount}
                </span>
              )}
            </div>

            {/* LAST MESSAGE */}
            <div className="text-sm text-slate-400 truncate">
              {conversation.lastMessage?.content ??
                "No messages yet"}
            </div>

            {/* TIME */}
            <div className="text-xs text-slate-500 mt-1">
              {new Date(lastTimestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}