"use client";

import React from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { formatTime } from "@/lib/time";
import { CheckCheck, Phone, Video, Trash2, Smile, FileText, Download } from "lucide-react";

// ✅ 1. Update interface to be null-safe for all attachments
export interface MessageBubbleProps {
  message: Omit<Doc<"messages">, "audioUrl" | "fileUrl"> & {
    audioUrl?: string | null;
    fileUrl?: string | null;
    fileName?: string;
  };
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
  const isCall = message.type.includes("call");

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} group mb-1`}>
      <div
        className={`
          relative
          max-w-[85%] md:max-w-md
          rounded-2xl px-3 py-2
          shadow-sm
          ${message.deleted 
            ? "bg-slate-900/40 border border-slate-800 text-slate-500 italic" 
            : isOwn 
              ? "bg-blue-600 text-white rounded-tr-none" 
              : "bg-slate-700 text-white rounded-tl-none"
          }
        `}
      >
        {/* --- DELETE STATE --- */}
        {message.deleted ? (
          <p className="text-xs">This message was deleted</p>
        ) : (
          <>
            {/* --- AUDIO MESSAGES --- */}
            {message.type === "audio" && message.audioUrl && (
              <div className="flex items-center gap-2 py-1 min-w-[200px]">
                <audio 
                  src={message.audioUrl} 
                  controls 
                  className="h-8 w-full brightness-90 invert grayscale opacity-80" 
                />
              </div>
            )}

            {/* --- GENERIC FILE ATTACHMENTS (NEW) --- */}
            {message.type === "file" && message.fileUrl && (
              <div className={`flex items-center gap-3 p-2 rounded-lg mb-1 ${isOwn ? 'bg-blue-500/50' : 'bg-slate-600/50'}`}>
                <div className="p-2 bg-white/10 rounded-md">
                  <FileText size={24} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate max-w-[150px]">
                    {message.fileName || "Attachment"}
                  </p>
                  <p className="text-[10px] opacity-70 italic">Click to download</p>
                </div>
                <a 
                  href={message.fileUrl} 
                  download={message.fileName}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <Download size={18} />
                </a>
              </div>
            )}

            {/* --- CALL LOGS --- */}
            {isCall && (
              <div className="flex items-center gap-3 py-1 pr-2">
                <div className={`p-2 rounded-full ${isOwn ? "bg-blue-500" : "bg-slate-600"}`}>
                  {message.type.includes("video") ? <Video size={16} /> : <Phone size={16} />}
                </div>
                <div>
                  <p className="text-xs font-semibold capitalize">
                    {message.type.replace("_", " ")}
                  </p>
                  <p className="text-[10px] opacity-70">
                    {message.content || "No answer"}
                  </p>
                </div>
              </div>
            )}

            {/* --- TEXT CONTENT --- */}
            {message.type === "text" && message.content && (
              <p className="text-[13.5px] leading-relaxed break-words">
                {message.content}
                {message.editedAt && (
                  <span className="ml-1 text-[10px] opacity-50 not-italic">(edited)</span>
                )}
              </p>
            )}

            {/* --- FOOTER: TIME & BLUE TICKS --- */}
            <div className="flex items-center justify-end gap-1 mt-1 opacity-70">
              <span className="text-[10px] leading-none">{time}</span>
              {isOwn && (
                <CheckCheck 
                  size={14} 
                  className={message.seen ? "text-blue-200" : "text-slate-400"} 
                />
              )}
            </div>
          </>
        )}

        {/* --- REACTIONS LIST --- */}
        {!message.deleted && reactions && reactions.length > 0 && (
          <div className="absolute -bottom-3 left-2 flex gap-1 flex-wrap z-10">
            {reactions.map((reaction, index) => (
              <button
                key={index}
                onClick={onReactionClick}
                className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded-full text-[10px] hover:bg-slate-600 transition shadow-sm flex items-center gap-1"
              >
                <span>{reaction.emoji}</span>
                <span className="text-slate-300">{reaction.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* --- HOVER ACTIONS (DESKTOP) --- */}
        {!message.deleted && (
          <div className={`
            absolute top-0 
            ${isOwn ? "-left-12" : "-right-12"} 
            opacity-0 group-hover:opacity-100 
            transition-opacity flex gap-1 p-1
          `}>
            <button 
              onClick={onReactionClick}
              className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-full hover:bg-slate-700 transition"
            >
              <Smile size={16} />
            </button>
            {isOwn && (
              <button
                onClick={onDeleteClick}
                className="p-1.5 bg-slate-800 text-slate-400 hover:text-red-400 rounded-full hover:bg-slate-700 transition"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}