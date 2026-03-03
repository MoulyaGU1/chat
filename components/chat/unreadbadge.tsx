"use client";

import React from "react";

interface UnreadBadgeProps {
  count: number;
}

export function UnreadBadge({ count }: UnreadBadgeProps) {
  if (count === 0) return null;
  return (
    <span className="ml-2 inline-flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5">
      {count > 99 ? "99+" : count}
    </span>
  );
}
