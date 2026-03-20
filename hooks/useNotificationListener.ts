"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";

export const useNotificationListener = () => {
  const { user } = useUser();
  const params = useParams();
  const router = useRouter();
  
  // Ensure this matches your folder structure (e.g., /chat/[conversationId])
  const currentConversationId = params?.conversationId; 

  const dbUser = useQuery(api.users.getUserByClerkId, 
    user ? { clerkId: user.id } : "skip"
  );
  
  const notifications = useQuery(api.notifications.getUnread, 
    dbUser ? { userId: dbUser._id } : "skip"
  );

  const lastProcessedId = useRef<string | null>(null);

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      const latest = notifications[0];

      // Prevent duplicate processing of the same notification
      if (latest._id === lastProcessedId.current) return;

      // LOGIC: Only alert if the user is NOT currently looking at this conversation
      if (latest.conversationId !== currentConversationId) {
        
        // 1. 🔊 PLAY SOUND
        const playNotificationSound = () => {
          const audio = new Audio("/sounds/notification.mp3");
          audio.play().catch((err) => console.log("Sound blocked by browser:", err));
        };
        playNotificationSound();

        // 2. 🔔 SHOW TOAST (Handled by Type)
        const isCall = latest.type === "audio_call" || latest.type === "video_call";
        
        toast(isCall ? "Incoming Call" : "New Message", {
          description: isCall 
            ? "Someone is calling you..." 
            : "You have a new unread message.",
          duration: isCall ? 10000 : 4000, // Calls last longer
          action: {
            label: "View",
            onClick: () => {
              // Use router.push for better SPA performance than window.location
              router.push(`/chat/${latest.conversationId}`);
            },
          },
        });

        lastProcessedId.current = latest._id;
      }
    }
  }, [notifications, currentConversationId, router]);
};