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

  /* ================================
     CONVEX MUTATIONS
  ================================ */
  const deleteMessage = useMutation(api.messages.deleteMessage);
  const addReaction = useMutation(api.reactions.addReaction);
  const markAsRead = useMutation(api.unread.markAsRead);
  const deleteConversation = useMutation(
    api.conversations.deleteConversation
  );

  const [reactionsMap] = useState<Record<string, any[]>>({});

  /* ================================
     MARK CHAT AS READ
  ================================ */
  useEffect(() => {
    if (conversation && currentUserId) {
      markAsRead({
        conversationId: conversation._id,
        userId: currentUserId,
      });
    }
  }, [conversation?._id, currentUserId, markAsRead]);

  /* ================================
     DELETE MESSAGE (FIXED ✅)
  ================================ */
  const handleDeleteMessage = async (
    messageId: Id<"messages">
  ) => {
    if (!currentUserId) return;

    try {
      await deleteMessage({
        messageId,
        requesterId: currentUserId,
      });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  /* ================================
     ADD REACTION
  ================================ */
  const handleAddReaction = async (
    messageId: Id<"messages">
  ) => {
    if (!currentUserId) return;

    await addReaction({
      messageId,
      userId: currentUserId,
      emoji: "👍",
    });
  };

  /* ================================
     DELETE ENTIRE CHAT ⭐
  ================================ */
  const handleDeleteChat = async () => {
    if (!conversation || !currentUserId) return;

    const confirmDelete = confirm(
      "Delete entire conversation?"
    );

    if (!confirmDelete) return;

    await deleteConversation({
      conversationId: conversation._id,
      requesterId: currentUserId,
    });
  };

  /* ================================
     START CALL (UI placeholder)
  ================================ */
  const startCall = () => {
    alert("Call feature starting...");
    // later connect WebRTC here
  };

  /* ================================
     NO CHAT SELECTED
  ================================ */
  if (!conversation) {
    return (
      <EmptyState
        icon="💬"
        title="Select a conversation"
        description="Choose a user or conversation to start chatting"
      />
    );
  }

  /* ================================
     MAIN UI
  ================================ */
  return (
    <div className="flex-1 flex flex-col bg-slate-900">

      {/* HEADER */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">
          {(conversation as any)?.displayName ?? "Chat"}
        </h2>

        <div className="flex gap-3 items-center">

          {/* Voice Call */}
          <button
            onClick={startCall}
            className="text-slate-300 hover:text-white"
          >
            📞
          </button>

          {/* Delete Chat */}
          <button
            onClick={handleDeleteChat}
            className="text-red-400 hover:text-red-200"
          >
            🗑
          </button>

          {onBack && (
            <button
              onClick={onBack}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* MESSAGE LIST */}
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        typingUserIds={typingUsers.map((t: any) => t.userId)}
        reactions={reactionsMap}
        onDeleteMessage={handleDeleteMessage}
        onReactionClick={handleAddReaction}
      />

      {/* INPUT */}
      {currentUserId && (
        <MessageInput
          conversationId={conversation._id}
          senderId={currentUserId}
        />
      )}
    </div>
  );
}