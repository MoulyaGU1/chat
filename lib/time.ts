export function formatTime(timestamp?: number | null) {
  if (!timestamp) return "";

  const date = new Date(Number(timestamp));

  if (isNaN(date.getTime())) return "";

  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}