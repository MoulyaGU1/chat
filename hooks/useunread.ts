import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useUnread(userId: Id<"users"> | null) {
  const unreadData = useQuery(
    api.unread.getUnreadCountForUser,
    userId ? { userId } : "skip"
  );

  return unreadData;
}