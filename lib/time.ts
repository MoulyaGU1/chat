export function formatTime(timestamp?: number) {
  if (!timestamp) return "";

  const diff = Date.now() - timestamp;

  if (diff < 60000) return "now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;

  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}