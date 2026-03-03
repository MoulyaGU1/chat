"use client";

import React from "react";
import { MessageBubble } from "./messagebubble";
import { TypingIndicator } from "./typingindicator";
import { useAutoscroll } from "@/hooks/useautoscroll";
import { Doc, Id } from "@/convex/_generated/dataModel";

interface MessageListProps {
  messages: Doc<"messages">[];

  // ✅ Convex typed IDs
  currentUserId: Id<"users"> | null;
  typingUserIds: Id<"users">[];

  reactions: Record<
    string,
    Array<{ emoji: string; count: number; userIds: string[] }>
  >;

  // ✅ FIXED TYPES
  onDeleteMessage: (messageId: Id<"messages">) => void;
  onReactionClick: (messageId: Id<"messages">) => void;
}

export function MessageList({
  messages,
  currentUserId,
  typingUserIds,
  reactions,
  onDeleteMessage,
  onReactionClick,
}: MessageListProps) {
  const { containerRef, showNewMessagesButton, scrollToBottom } =
    useAutoscroll([messages]);

  return (
    <div
      className="flex-1 overflow-y-auto flex flex-col p-4 space-y-2 relative"
      ref={containerRef}
    >
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((msg) => (
          <MessageBubble
            key={msg._id}
            message={msg}
            isOwn={msg.senderId === currentUserId}
            onDeleteClick={() => onDeleteMessage(msg._id)}
            onReactionClick={() => onReactionClick(msg._id)}
            reactions={reactions[msg._id]}
          />
        ))
      )}

      {typingUserIds.length > 0 && <TypingIndicator />}

      {showNewMessagesButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition"
        >
          ↓ New Messages
        </button>
      )}
    </div>
  );
}