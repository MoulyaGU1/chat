// Utils for type exports and helpers used across convex functions
import { Doc } from "./_generated/dataModel";

export type User = Doc<"users">;
export type Conversation = Doc<"conversations">;
export type Message = Doc<"messages">;
export type Reaction = Doc<"reactions">;

export type TypingStatus = Doc<"typingStatus">;
export type UnreadCount = Doc<"unreadCounts">;

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const sameDay = today.getTime() === msgDate.getTime();
  const sameYear = now.getFullYear() === date.getFullYear();

  if (sameDay) {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  } else if (sameYear) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ", " + date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + ", " + date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  }
}
