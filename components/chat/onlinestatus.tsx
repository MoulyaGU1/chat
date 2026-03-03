"use client";

import React from "react";

interface OnlineStatusProps {
  online: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-2 h-2",
  md: "w-3 h-3",
  lg: "w-4 h-4",
};

export function OnlineStatus({ online, size = "md" }: OnlineStatusProps) {
  return (
    <div className={`${sizeClasses[size]} ${online ? "bg-green-500" : "bg-slate-500"} rounded-full inline-block`} aria-label={online ? "Online" : "Offline"}></div>
  );
}
