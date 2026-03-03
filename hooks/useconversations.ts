import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useConversations(userId: Id<"users"> | null) {
  const conversations = useQuery(
    api.conversations.listConversationsForUser,
    userId ? { userId } : "skip"
  );

  return conversations;
}