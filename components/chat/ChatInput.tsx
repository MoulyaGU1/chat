"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Mic, Send, StopCircle, X } from "lucide-react";
import { toast } from "sonner";

export function ChatInput({ conversationId, senderId }: any) {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- Mutations ---
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);
  const sendMessage = useMutation(api.messages.sendMessage);
  const setTyping = useMutation(api.typing.setTyping); // Ensure this matches typing.ts

  // ✅ 1. Typing Indicator Logic
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);

    // Set typing to true
    setTyping({ conversationId, userId: senderId, isTyping: true });

    // Clear existing timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // Automatically set typing to false after 3 seconds of no keystrokes
    typingTimeoutRef.current = setTimeout(() => {
      setTyping({ conversationId, userId: senderId, isTyping: false });
    }, 3000);
  };

  // ✅ 2. Audio Message Logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.current.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": blob.type },
          body: blob,
        });
        
        const { storageId } = await result.json();

        await sendMessage({
          conversationId,
          senderId,
          type: "audio",
          audioUrl: storageId,
        });
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
  };

  const handleSendText = async () => {
    if (!text.trim()) return;
    
    await sendMessage({
      conversationId,
      senderId,
      type: "text",
      content: text,
    });
    
    setText("");
    // Immediately clear typing status on send
    setTyping({ conversationId, userId: senderId, isTyping: false });
  };

  return (
    <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-3">
      {/* Voice Record Button */}
      <button
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        className={`p-3 rounded-full transition-all duration-200 ${
          isRecording 
            ? "bg-red-500 text-white scale-125 animate-pulse" 
            : "bg-slate-800 text-slate-400 hover:text-white"
        }`}
        title="Hold to record"
      >
        {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
      </button>

      {/* Input Field */}
      <div className="flex-1 relative">
        <input
          value={text}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSendText()}
          placeholder={isRecording ? "Recording voice..." : "Type a message..."}
          disabled={isRecording}
          className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
        />
      </div>

      {/* Send Button */}
      <button
        onClick={handleSendText}
        disabled={!text.trim() || isRecording}
        className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all disabled:opacity-50 disabled:bg-slate-700"
      >
        <Send size={20} />
      </button>
    </div>
  );
}