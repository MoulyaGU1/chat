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

  // Safely format time
  const time = formatTime(message?.createdAt);

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-xs md:max-w-md
          rounded-lg px-4 py-2
          text-white
          ${isOwn ? "bg-blue-600" : "bg-slate-700"}
        `}
      >
        {/* MESSAGE TEXT */}
        <p className="text-sm break-words">
          {message.content ?? ""}
        </p>

        {/* TIME */}
        {time && (
          <p className="text-xs text-slate-300 mt-1 text-right">
            {time}
          </p>
        )}

        {/* REACTIONS */}
        {reactions && reactions.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {reactions.map((reaction, index) => (
              <button
                key={index}
                onClick={onReactionClick}
                className="bg-slate-800 px-2 py-1 rounded text-xs hover:bg-slate-600 transition"
              >
                {reaction.emoji} {reaction.count}
              </button>
            ))}
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex gap-2 mt-2 justify-end">
          <button
            onClick={onReactionClick}
            className="text-xs text-slate-300 hover:text-white"
          >
            👍
          </button>

          {isOwn && (
            <button
              onClick={onDeleteClick}
              className="text-xs text-red-300 hover:text-red-100"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}