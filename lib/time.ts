// lib/time.ts

/**
 * Safely formats Convex timestamp
 * Prevents "Invalid Date" during SSR + loading renders
 */
export function formatTime(timestamp?: number | null): string {
  if (!timestamp) return "";

  const date = new Date(timestamp);

  // prevent invalid date crash
  if (isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}