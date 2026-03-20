"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Phone, Video, ChevronLeft, MoreVertical, Info } from "lucide-react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

interface ChatHeaderProps {
  otherUser: {
    _id: Id<"users">;
    name: string;
    image: string;
  };
  conversationId: Id<"conversations">;
  currentUserId: Id<"users">;
  onBack?: () => void;
}

export function ChatHeader({ otherUser, conversationId, currentUserId, onBack }: ChatHeaderProps) {
  // 1. Real-time Status & Typing Queries
  const presence = useQuery(api.presence.getPresenceForUser, { userId: otherUser._id });
  const typing = useQuery(api.typing.getTypingUsersForConversation, { conversationId });
  const isTyping = typing?.some(t => t.userId === otherUser._id);

  // 2. Call Mutation
  const startCall = useMutation(api.calls.createCall);

  const handleCall = async (type: "audio" | "video") => {
    try {
      // Create the call record in Convex
      await startCall({
        conversationId,
        callerId: currentUserId,
        receiverId: otherUser._id,
        type,
      });
      
      toast.success(`Calling ${otherUser.name}...`, {
        description: `Starting ${type} call`,
        position: "top-center",
      });
      
    } catch (error) {
      console.error("Call failed:", error);
      toast.error("Could not start call. Check your connection.");
    }
  };

  return (
    <div className="p-3 md:p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center gap-2">
        {/* Back button for mobile users */}
        <button 
          onClick={onBack} 
          className="md:hidden p-1 mr-1 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <img 
              src={otherUser.image} 
              className="w-10 h-10 rounded-full object-cover border-2 border-slate-700 group-hover:border-blue-500 transition-all" 
              alt={otherUser.name} 
            />
            {presence?.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full shadow-lg" />
            )}
          </div>
          
          <div className="flex flex-col">
            <h2 className="font-bold text-white text-[14px] md:text-base leading-tight">
              {otherUser.name}
            </h2>
            <div className="h-4 flex items-center">
              {isTyping ? (
                <span className="text-green-400 animate-pulse text-[11px] font-semibold tracking-wide">
                  typing...
                </span>
              ) : (
                <span className="text-slate-500 text-[11px] font-medium">
                  {presence?.online ? (
                    <span className="text-blue-400">Online</span>
                  ) : presence?.lastSeenAt ? (
                    `Last seen ${new Date(presence.lastSeenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  ) : (
                    "Offline"
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Communication Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        <button 
          onClick={() => handleCall("audio")}
          className="text-slate-400 hover:text-green-400 p-2 hover:bg-slate-800 rounded-full transition-all active:scale-90"
          title="Audio Call"
        >
          <Phone size={20} fill="currentColor" className="fill-transparent hover:fill-green-400/10" />
        </button>
        <button 
          onClick={() => handleCall("video")}
          className="text-slate-400 hover:text-blue-400 p-2 hover:bg-slate-800 rounded-full transition-all active:scale-90"
          title="Video Call"
        >
          <Video size={22} fill="currentColor" className="fill-transparent hover:fill-blue-400/10" />
        </button>
        <div className="w-[1px] h-6 bg-slate-800 mx-1 hidden md:block" />
        <button className="text-slate-500 hover:text-white p-2 transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
}