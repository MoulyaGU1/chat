"use client";

import React, { useState, useEffect } from "react";
import { MessageList } from "./messagelist";
import { MessageInput } from "./messageinput";
import { useMessages } from "@/hooks/usemessages";
import { useTyping } from "@/hooks/usetyping";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { EmptyState } from "@/components/shared/emptystate";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Phone, Trash2, X } from "lucide-react"; // Using Lucide for cleaner UI

interface ChatWindowProps {
  conversation: Doc<"conversations"> | null;
  currentUserId: Id<"users"> | null;
  onBack?: () => void;
}

export function ChatWindow({
  conversation,
  currentUserId,
  onBack,
}: ChatWindowProps) {
  const messages = useMessages(conversation?._id ?? null);
  const typingUsers = useTyping(conversation?._id ?? null);

  const deleteMessage = useMutation(api.messages.deleteMessage);
  const addReaction = useMutation(api.reactions.addReaction);
  const markAsRead = useMutation(api.unread.markAsRead);
  const deleteConversation = useMutation(api.conversations.deleteConversation);

  const [reactionsMap] = useState<Record<string, any[]>>({});

  useEffect(() => {
    if (conversation && currentUserId) {
      markAsRead({
        conversationId: conversation._id,
        userId: currentUserId,
      });
    }
  }, [conversation?._id, currentUserId, markAsRead]);

  const handleDeleteMessage = async (messageId: Id<"messages">) => {
    if (!currentUserId) return;
    try {
      await deleteMessage({ messageId, requesterId: currentUserId });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleAddReaction = async (messageId: Id<"messages">) => {
    if (!currentUserId) return;
    await addReaction({ messageId, userId: currentUserId, emoji: "👍" });
  };

  const handleDeleteChat = async () => {
    if (!conversation || !currentUserId) return;
    if (!confirm("Delete entire conversation?")) return;
    await deleteConversation({
      conversationId: conversation._id,
      requesterId: currentUserId,
    });
  };

  if (!conversation) {
    return (
      <EmptyState
        icon="💬"
        title="Select a conversation"
        description="Choose a user or conversation to start chatting"
      />
    );
  }

  return (
    /* ✅ FIXED LAYOUT: h-full and overflow-hidden ensures the input stays at the bottom */
    <div className="flex flex-col h-full bg-[#0b141a] overflow-hidden">
      
      {/* 1. HEADER (Fixed height) */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between shrink-0">
        <h2 className="text-lg font-bold text-white">
          {(conversation as any)?.displayName ?? "Chat"}
        </h2>

        <div className="flex gap-4 items-center">
          <button onClick={() => alert("Calling...")} className="text-slate-300 hover:text-white">
            <Phone size={20} />
          </button>
          <button onClick={handleDeleteChat} className="text-red-400 hover:text-red-300">
            <Trash2 size={20} />
          </button>
          {onBack && (
            <button onClick={onBack} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* 2. MESSAGE LIST (Scrollable area) 
          flex-1 tells this div to take all available space.
          overflow-y-auto enables the scrollbar here only. */}
      <div className="flex-1 overflow-y-auto scrollbar-hide bg-slate-900 custom-scrollbar-css">
        <MessageList
          messages={messages}
          currentUserId={currentUserId}
          typingUserIds={typingUsers.map((t: any) => t.userId)}
          reactions={reactionsMap}
          onDeleteMessage={handleDeleteMessage}
          onReactionClick={handleAddReaction}
        />
      </div>

      {/* 3. INPUT BAR (Fixed at bottom) 
          shrink-0 ensures this area never gets compressed. */}
      {currentUserId && (
        <div className="bg-slate-800 p-2 shrink-0 border-t border-slate-700">
          <MessageInput
            conversationId={conversation._id}
            senderId={currentUserId}
          />
        </div>
      )}
    </div>
  );
}