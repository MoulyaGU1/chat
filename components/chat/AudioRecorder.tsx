"use client";
import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function AudioRecorder({ conversationId, senderId }: any) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);
  const sendAudioMessage = useMutation(api.messages.sendMessage);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.start();
    setIsRecording(true);
  };

  const stopRecording = async () => {
    mediaRecorder.current!.stop();
    setIsRecording(false);
    
    mediaRecorder.current!.ondataavailable = async (e) => {
      const audioBlob = new Blob([e.data], { type: "audio/webm" });
      
      // 1. Get Upload URL
      const postUrl = await generateUploadUrl();
      // 2. Upload to Convex Storage
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": audioBlob.type },
        body: audioBlob,
      });
      const { storageId } = await result.json();

      // 3. Send Message
      await sendAudioMessage({
        conversationId,
        senderId,
        type: "audio",
        audioUrl: storageId,
        
      });
    };
  };

  return (
    <button onMouseDown={startRecording} onMouseUp={stopRecording}>
      {isRecording ? "🔴 Recording..." : "🎤 Hold to Record"}
    </button>
  );
}