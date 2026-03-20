"use client";

import React from "react";
import { MessageBubble } from "./messagebubble";
import { TypingIndicator } from "./typingindicator";
import { useAutoscroll } from "@/hooks/useautoscroll";
import { Doc, Id } from "@/convex/_generated/dataModel";

// ✅ Type is now fully compatible with Convex storage URLs
export type Message = Omit<Doc<"messages">, "audioUrl" | "fileUrl"> & {
  audioUrl?: string | null; 
  fileUrl?: string | null;
  fileName?: string;
};

interface MessageListProps {
  messages: Message[];
  currentUserId: Id<"users"> | null;
  typingUserIds: Id<"users">[];
  reactions: Record<
    string,
    Array<{ emoji: string; count: number; userIds: string[] }>
  >;
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
  // useAutoscroll handles the logic to jump to the newest "hi" or Synopsis file
  const { containerRef, showNewMessagesButton, scrollToBottom } =
    useAutoscroll([messages, typingUserIds]);

  return (
    <div
      className="flex-1 overflow-y-auto flex flex-col p-4 relative scrollbar-hide"
      ref={containerRef}
    >
      {/* Wrapping messages in a div with min-h-full + justify-end 
         makes the chat feel like WhatsApp (growing from bottom)
      */}
      <div className="flex flex-col justify-end min-h-full space-y-3">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-500 pb-20">
            <div className="text-center">
              <p className="text-sm font-medium">No messages yet</p>
              <p className="text-xs opacity-70">Start the conversation below!</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg._id}
              message={msg}
              isOwn={msg.senderId === currentUserId}
              onDeleteClick={() => onDeleteMessage(msg._id)}
              onReactionClick={() => onReactionClick(msg._id)}
              reactions={reactions[msg._id] || []}
            />
          ))
        )}

        {typingUserIds.length > 0 && (
          <div className="pb-2">
            <TypingIndicator />
          </div>
        )}
      </div>

      {/* Floating Button for New Messages */}
      {showNewMessagesButton && (
        <button
          onClick={scrollToBottom}
          className="sticky bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg hover:bg-blue-600 transition-all animate-bounce z-20"
        >
          ↓ New Messages
        </button>
      )}
    </div>
  );
}