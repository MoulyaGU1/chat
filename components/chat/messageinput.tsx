"use client";

import React, { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import EmojiPicker from "emoji-picker-react";
import { Id } from "@/convex/_generated/dataModel";
import { Mic, Send, Square, Paperclip, Smile } from "lucide-react";
import { toast } from "sonner";

interface MessageInputProps {
  conversationId: Id<"conversations">;
  senderId: Id<"users">;
}

export function MessageInput({ conversationId, senderId }: MessageInputProps) {
  const [content, setContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // ✅ Added missing state
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const sendMessage = useMutation(api.messages.sendMessage);
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm; codecs=opus" });
        await handleUpload(blob, "audio");
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000);
    } catch (err) {
      toast.error("Please allow microphone access");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // ✅ Consolidated single handleUpload function
  const handleUpload = async (file: File | Blob, type: "audio" | "file") => {
    setIsUploading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        body: file,
      });

      if (!result.ok) throw new Error("Upload failed");
      const { storageId } = await result.json();
      const fileName = "name" in file ? file.name : `voice_note_${Date.now()}.webm`;

      await sendMessage({
        conversationId,
        senderId,
        type,
        fileUrl: type === "file" ? storageId : undefined,
        audioUrl: type === "audio" ? storageId : undefined,
        fileName: fileName,
      });
      
      toast.success(`${type === 'audio' ? 'Voice note' : 'File'} sent`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send attachment");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isUploading) return;

    await sendMessage({
      conversationId,
      senderId,
      content,
      type: "text",
    });
    setContent("");
    setShowEmojiPicker(false);
  };

  return (
    <div className="relative bg-slate-900 border-t border-slate-800 p-3">
      <input 
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file, "file");
        }}
      />
      <div className="flex items-center gap-2 max-w-6xl mx-auto">
        {!isRecording && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
            >
              <Smile size={24} />
            </button>
            <button 
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-400 hover:text-blue-500 transition-colors disabled:opacity-50"
            >
              <Paperclip size={22} />
            </button>
          </div>
        )}

        <div className="flex-1 relative">
          {isRecording ? (
            <div className="flex items-center justify-between bg-slate-800 rounded-full px-4 py-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-white font-mono text-sm">
                  {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <button 
                onClick={stopRecording}
                className="text-red-500 p-2"
              >
                <Square size={16} fill="currentColor" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={content}
                disabled={isUploading}
                onChange={(e) => setContent(e.target.value)}
                placeholder={isUploading ? "Uploading..." : "Type a message..."}
                className="flex-1 bg-slate-800 text-white rounded-full px-5 py-2.5 outline-none text-sm"
              />
              <button
                type="submit"
                disabled={!content.trim() || isUploading}
                className="bg-blue-600 text-white p-2.5 rounded-full disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}