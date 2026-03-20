"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { ChatWindow } from "@/components/chat/chatwindow";
import { IncomingCallModal } from "@/components/chat/IncomingCallModal"; // ✅ New Component
import { useCurrentUser } from "@/hooks/usecurrentuser";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMobile } from "@/hooks/usemobile";
import { Loader } from "@/components/shared/loader";
import { useNotificationListener } from "@/hooks/useNotificationListener";

export default function ChatPage() {
  const { user: convexUser, clerkUser } = useCurrentUser();
  const isMobile = useMobile();

  // ✅ 1. Real-time Notification & Call Listener
  // Handles background sounds and standard message toasts
  useNotificationListener();

  const [selectedConversationId, setSelectedConversationId] =
    useState<Id<"conversations"> | null>(null);

  const [showChat, setShowChat] = useState(false);

  // --- Mutations & Queries ---
  const getOrCreateConversation = useMutation(api.conversations.getOrCreateConversation);
  const setPresence = useMutation(api.presence.setPresence);
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAsSeen = useMutation(api.messages.markAsSeen); // ✅ Powers Blue Ticks

  // Watch unread notifications to clear them when a chat is opened
  const unreadNotifications = useQuery(
    api.notifications.getUnread,
    convexUser ? { userId: convexUser._id } : "skip"
  );

  const selectedConversation = useQuery(
    api.conversations.getConversation,
    selectedConversationId && convexUser?._id
      ? {
          conversationId: selectedConversationId,
          userId: convexUser._id,
        }
      : "skip"
  );

  // ✅ 2. Presence Handling (Online/Offline & Last Seen)
  useEffect(() => {
    if (!convexUser) return;

    // Set online on mount
    setPresence({ userId: convexUser._id, online: true });

    // Mark offline on unmount or tab close
    return () => {
      setPresence({ userId: convexUser._id, online: false });
    };
  }, [convexUser, setPresence]);

  // ✅ 3. Clear Notifications & Mark Messages as Seen (Blue Ticks)
  useEffect(() => {
    if (selectedConversationId && convexUser) {
      // Clear the "Notification" table records for the UI
      if (unreadNotifications) {
        const relevantNotifications = unreadNotifications.filter(
          (n) => n.conversationId === selectedConversationId
        );
        relevantNotifications.forEach((n) => {
          markAsRead({ notificationId: n._id });
        });
      }

      // Mark actual message documents as "seen" for the sender's blue ticks
      markAsSeen({ 
        conversationId: selectedConversationId, 
        userId: convexUser._id 
      });
    }
  }, [selectedConversationId, unreadNotifications, markAsRead, markAsSeen, convexUser]);

  // ✅ 4. Create/Open conversation handler
  const handleSelectUser = async (userId: Id<"users">) => {
    if (!convexUser) return;

    try {
      const convId = await getOrCreateConversation({
        userAId: convexUser._id,
        userBId: userId,
      });

      setSelectedConversationId(convId as Id<"conversations">);
      setShowChat(true);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  if (!convexUser || !clerkUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <Loader />
      </div>
    );
  }

  // --- Shared Elements ---
  const sharedUI = (
    <>
      {/* ✅ This modal stays hidden until a call is detected */}
      <IncomingCallModal userId={convexUser._id} />
    </>
  );

  // 📱 MOBILE LAYOUT
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-slate-900 overflow-hidden">
        {sharedUI}
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
    <div className="h-screen flex flex-col bg-slate-900 overflow-hidden">
      {sharedUI}
      <Navbar currentUser={convexUser} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          userId={convexUser._id}
          selectedConversationId={selectedConversationId}
          onSelectConversation={(id) => setSelectedConversationId(id)}
          onSelectUser={handleSelectUser}
        />

        <div className="flex-1 flex flex-col min-w-0 border-l border-slate-800">
          <ChatWindow
            conversation={selectedConversation ?? null}
            currentUserId={convexUser._id}
          />
        </div>
      </div>
    </div>
  );
}