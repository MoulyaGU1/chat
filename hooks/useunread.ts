import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useUnread(userId: Id<"users"> | null) {
  const unreadData = useQuery(
    userId ? api.unread.getUnreadCountForUser : null,
    userId ? { userId } : "skip"
  );

  return unreadData ?? { total: 0, byConversation: {} };
}
