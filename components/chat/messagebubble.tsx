"use client";

import React from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { formatTime } from "@/lib/time";

interface MessageBubbleProps {
  message: Doc<"messages">;
  isOwn: boolean;

  reactions?: Array<{
    emoji: string;
    count: number;
    userIds: string[];
  }>;

  onDeleteClick: () => void;
  onReactionClick: () => void;
}

export function MessageBubble({
  message,
  isOwn,
  reactions,
  onDeleteClick,
  onReactionClick,
}: MessageBubbleProps) {

  const time = formatTime(message.createdAt);

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} group`}>
      <div
        className={`
          relative
          max-w-xs md:max-w-md
          rounded-lg px-4 py-2
          text-white
          ${isOwn ? "bg-blue-600" : "bg-slate-700"}
        `}
      >
        {/* MESSAGE CONTENT */}
        {message.deleted ? (
          <p className="text-sm italic text-gray-300">
            This message was deleted
          </p>
        ) : (
          <p className="text-sm break-words">
            {message.content}
          </p>
        )}

        {/* TIME */}
        {time && (
          <p className="text-xs text-slate-300 mt-1 text-right">
            {time}
          </p>
        )}

        {/* REACTIONS */}
        {!message.deleted && reactions && reactions.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {reactions.map((reaction, index) => (
              <button
                key={index}
                onClick={onReactionClick}
                className="bg-slate-800 px-2 py-1 rounded text-xs hover:bg-slate-600"
              >
                {reaction.emoji} {reaction.count}
              </button>
            ))}
          </div>
        )}

        {/* DELETE BUTTON (HOVER ONLY) */}
        {isOwn && !message.deleted && (
          <button
            onClick={onDeleteClick}
            className="
              absolute
              -top-2
              -right-2
              opacity-0
              group-hover:opacity-100
              transition
              bg-red-500
              text-white
              text-xs
              px-2
              py-1
              rounded
            "
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}