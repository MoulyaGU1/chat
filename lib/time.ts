// lib/time.ts

export function formatTime(
  timestamp: string | number | Date
): string {
  const date =
    timestamp instanceof Date
      ? timestamp
      : new Date(timestamp);

  if (isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}