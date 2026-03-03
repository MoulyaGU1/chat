"use client";

import React, { useState } from "react";
import { ALLOWED_REACTIONS } from "@/lib/constants";

interface ReactionBarProps {
  onReactionSelect: (emoji: string) => void;
}

export function ReactionBar({ onReactionSelect }: ReactionBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-xl hover:bg-slate-600 rounded p-1 transition"
        aria-label="Add reaction"
      >
        😊
      </button>
      {isOpen && (
        <div className="absolute bottom-full mb-2 bg-slate-700 rounded-lg shadow-lg p-2 flex gap-1 z-10">
          {ALLOWED_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                onReactionSelect(emoji);
                setIsOpen(false);
              }}
              className="text-lg hover:bg-slate-600 rounded p-1 transition"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
