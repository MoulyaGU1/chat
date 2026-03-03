"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useTyping(conversationId: Id<"conversations"> | null) {
  const typingUsers = useQuery(
    api.typing.getTypingUsersForConversation,
    conversationId
      ? { conversationId }
      : "skip"
  );

  return typingUsers ?? [];
}