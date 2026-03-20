"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Phone, Video, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export function IncomingCallModal({ userId }: { userId: any }) {
  const router = useRouter();
  const incomingCall = useQuery(api.calls.getIncomingCall, { userId });
  const updateCall = useMutation(api.calls.updateCallSignal);
  
  // State for the ringtone
  const [ringtone] = useState(typeof Audio !== "undefined" ? new Audio("/sounds/ringtone.mp3") : null);

  useEffect(() => {
    if (incomingCall) {
      ringtone?.play().catch(() => console.log("Ringtone blocked by browser"));
      ringtone!.loop = true;
    } else {
      ringtone?.pause();
      if (ringtone) ringtone.currentTime = 0;
    }
    return () => ringtone?.pause();
  }, [incomingCall, ringtone]);

  if (!incomingCall) return null;

  const handleAccept = async () => {
    await updateCall({ 
      callId: incomingCall._id, 
      status: "ongoing" 
    });
    router.push(`/chat/${incomingCall.conversationId}?callId=${incomingCall._id}`);
  };

  const handleReject = async () => {
    await updateCall({ 
      callId: incomingCall._id, 
      status: "rejected" 
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-800 border border-slate-700 w-full max-w-sm rounded-3xl p-8 shadow-2xl text-center animate-in fade-in zoom-in duration-300">
        <div className="relative mx-auto w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20" />
          <div className="relative flex items-center justify-center w-full h-full bg-slate-700 rounded-full border-4 border-slate-600">
            {incomingCall.type === "video" ? <Video size={40} className="text-blue-400" /> : <Phone size={40} className="text-green-400" />}
          </div>
        </div>

        <h2 className="text-xl font-bold text-white mb-1">Incoming Call</h2>
        <p className="text-slate-400 mb-8">Someone is calling you...</p>

        <div className="flex items-center justify-center gap-6">
          <button 
            onClick={handleReject}
            className="flex items-center justify-center w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full transition-transform hover:scale-110"
          >
            <X size={32} />
          </button>
          <button 
            onClick={handleAccept}
            className="flex items-center justify-center w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full transition-transform hover:scale-110"
          >
            <Check size={32} />
          </button>
        </div>
      </div>
    </div>
  );
}