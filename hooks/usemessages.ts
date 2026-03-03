"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useMessages(conversationId: Id<"conversations"> | null) {
  const messages = useQuery(
    api.messages.listMessagesForConversation,
    conversationId
      ? { conversationId, limit: 200 }
      : "skip"
  );

  return messages ?? [];
}