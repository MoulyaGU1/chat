"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { ChatWindow } from "@/components/chat/chatwindow";
import { useCurrentUser } from "@/hooks/usecurrentuser";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMobile } from "@/hooks/usemobile";
import { Loader } from "@/components/shared/loader";

export default function ChatPage() {
  const { user: convexUser, clerkUser } = useCurrentUser();
  const isMobile = useMobile();

  // ✅ FIXED TYPE
  const [selectedConversationId, setSelectedConversationId] =
    useState<Id<"conversations"> | null>(null);

  const [showChat, setShowChat] = useState(false);

  const getOrCreateConversation = useMutation(
    api.conversations.getOrCreateConversation
  );
  const setPresence = useMutation(api.presence.setPresence);

  // ✅ Query conversation
  const selectedConversation = useQuery(
    api.conversations.getConversation,
    selectedConversationId && convexUser?._id
      ? {
          conversationId: selectedConversationId,
          userId: convexUser._id,
        }
      : "skip"
  );

  // ✅ Presence handling
  useEffect(() => {
    if (!convexUser) return;

    setPresence({ userId: convexUser._id, online: true });

    return () => {
      setPresence({ userId: convexUser._id, online: false });
    };
  }, [convexUser, setPresence]);

  // ✅ Create/Open conversation
  const handleSelectUser = async (userId: Id<"users">) => {
    if (!convexUser) return;

    try {
      const convId = await getOrCreateConversation({
        userAId: convexUser._id,
        userBId: userId,
      });

      setSelectedConversationId(convId);
      setShowChat(true);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  if (!convexUser || !clerkUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  // 📱 MOBILE LAYOUT
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-slate-900">
        <Navbar currentUser={convexUser} />

        {showChat ? (
          <ChatWindow
            conversation={selectedConversation ?? null}
            currentUserId={convexUser._id}
            onBack={() => setShowChat(false)}
          />
        ) : (
          <Sidebar
            userId={convexUser._id}
            selectedConversationId={null}
            onSelectConversation={(convId) => {
              setSelectedConversationId(convId);
              setShowChat(true);
            }}
            onSelectUser={handleSelectUser}
          />
        )}
      </div>
    );
  }

  // 🖥 DESKTOP LAYOUT
  return (
    <div className="h-screen flex flex-col bg-slate-900">
      <Navbar currentUser={convexUser} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          userId={convexUser._id}
          selectedConversationId={selectedConversationId}
          onSelectConversation={(id) =>
            setSelectedConversationId(id)
          }
          onSelectUser={handleSelectUser}
        />

        <ChatWindow
          conversation={selectedConversation ?? null}
          currentUserId={convexUser._id}
        />
      </div>
    </div>
  );
}