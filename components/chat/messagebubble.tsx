"use client";

import React from "react";
import { formatTime } from "@/lib/utils";
import { Doc } from "@/convex/_generated/dataModel";

interface MessageBubbleProps {
  message: Doc<"messages"> & { senderName?: string; senderImage?: string | null };
  isOwn: boolean;
  onDeleteClick?: () => void;
  onReactionClick?: () => void;
  reactions?: Array<{ emoji: string; count: number; userIds: string[] }>;
}

export function MessageBubble({ message, isOwn, onDeleteClick, onReactionClick, reactions }: MessageBubbleProps) {
  if (message.deleted) {
    return (
      <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-3`}>
        <div className={`max-w-xs ${isOwn ? "bg-blue-600" : "bg-slate-700"} text-slate-400 italic rounded-lg px-4 py-2 text-sm`}>
          This message was deleted
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-3 group`}>
      <div className={`max-w-xs ${isOwn ? "bg-blue-600" : "bg-slate-700"} text-white rounded-lg px-4 py-2`}>
        <p className="text-sm break-words">{message.content}</p>
        <p className="text-xs text-slate-300 mt-1">
  {formatTime(String(message.createdAt))}
</p>
        {reactions && reactions.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {reactions.map((r) => (
              <div
                key={r.emoji}
                onClick={onReactionClick}
                className="bg-slate-600 rounded px-2 py-1 cursor-pointer hover:bg-slate-500 transition text-xs flex items-center gap-1"
              >
                <span>{r.emoji}</span>
                <span>{r.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {isOwn && (
        <button
          onClick={onDeleteClick}
          className="ml-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition text-sm"
          aria-label="Delete message"
        >
          ✕
        </button>
      )}
    </div>
  );
}
