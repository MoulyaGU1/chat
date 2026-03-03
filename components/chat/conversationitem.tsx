"use client";

import React from "react";
import { formatTime } from "@/lib/utils";
import { UnreadBadge } from "./unreadbadge";
import { Doc } from "@/convex/_generated/dataModel";

interface ConversationItemProps {
  conversation: Doc<"conversations"> & {
    lastMessage?: { content: string | null; senderId: string; createdAt: string } | null;
    unreadCount?: number;
  };
  isSelected: boolean;
  onClick: () => void;
}

export function ConversationItem({ conversation, isSelected, onClick }: ConversationItemProps) {
  const lastMessagePreview = conversation.lastMessage?.content ? conversation.lastMessage.content.slice(0, 50) : "No messages yet";
  const lastMessageTime = conversation.lastMessage ? formatTime(conversation.lastMessage.createdAt) : "";

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 rounded-lg transition text-left ${isSelected ? "bg-blue-600" : "hover:bg-slate-700"}`}
      aria-label={`Conversation with ${conversation.name || "Unknown"}`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{conversation.name || "Unknown"}</p>
        <p className="text-xs text-slate-400 truncate">{lastMessagePreview}</p>
      </div>
      <div className="ml-2 flex-shrink-0 flex flex-col items-end">
        <p className="text-xs text-slate-400">{lastMessageTime}</p>
        {conversation.unreadCount && <UnreadBadge count={conversation.unreadCount} />}
      </div>
    </button>
  );
}
