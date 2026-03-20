"use client";

import { CheckCheck, Phone, Video, PhoneMissed, VideoOff } from "lucide-react";

export function MessageItem({ message, isCurrentUser }: any) {
  const isCall = ["audio_call", "video_call"].includes(message.type);

  return (
    <div className={`flex mb-3 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${
          message.deleted 
            ? "bg-slate-900/50 border border-slate-800 text-slate-500 italic" 
            : isCurrentUser
            ? "bg-blue-600 text-white rounded-tr-none"
            : "bg-slate-800 text-slate-100 rounded-tl-none"
        }`}
      >
        {/* --- 1. Handle Deleted Messages --- */}
        {message.deleted ? (
          <p className="text-[13px]">This message was deleted</p>
        ) : (
          <>
            {/* --- 2. Handle Audio Messages --- */}
            {message.type === "audio" && message.audioUrl && (
              <div className="flex items-center gap-2 py-1">
                <audio controls className="h-8 w-48 brightness-90 invert grayscale opacity-80">
                  <source src={message.audioUrl} type="audio/webm" />
                </audio>
              </div>
            )}

            {/* --- 3. Handle Call Logs --- */}
            {isCall && (
              <div className="flex items-center gap-3 py-1 pr-4">
                <div className={`p-2 rounded-full ${isCurrentUser ? "bg-blue-500" : "bg-slate-700"}`}>
                  {message.type === "video_call" ? <Video size={18} /> : <Phone size={18} />}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {message.type === "video_call" ? "Video Call" : "Voice Call"}
                  </p>
                  <p className="text-[11px] opacity-70">
                    {message.content || "No answer"}
                  </p>
                </div>
              </div>
            )}

            {/* --- 4. Handle Text Messages --- */}
            {message.type === "text" && (
              <p className="text-[14px] leading-relaxed break-words">
                {message.content}
                {message.editedAt && (
                  <span className="ml-2 text-[10px] opacity-50 not-italic">(edited)</span>
                )}
              </p>
            )}
          </>
        )}

        {/* --- 5. Footer: Timestamp and Blue Tick --- */}
        <div className="flex items-center justify-end gap-1 mt-1 opacity-70">
          <span className="text-[10px]">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {isCurrentUser && !message.deleted && (
            <CheckCheck
              size={15}
              className={message.seen ? "text-blue-300" : "text-slate-400"}
            />
          )}
        </div>
      </div>
    </div>
  );
}