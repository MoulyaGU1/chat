import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function usePresence(userIds: Id<"users">[]) {
  const presences = useQuery(api.presence.getPresenceForUsers, { userIds });
  return presences ?? [];
}
