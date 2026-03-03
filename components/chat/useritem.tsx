"use client";

import React from "react";
import { OnlineStatus } from "./onlinestatus";
import { getInitials } from "@/lib/utils";

interface UserItemProps {
  userId: string;
  name?: string | null;
  imageUrl?: string | null;
  online?: boolean;
  onClick?: () => void;
}

export function UserItem({ userId, name, imageUrl, online, onClick }: UserItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition text-left"
      aria-label={`Chat with ${name || "Unknown user"}`}
    >
      <div className="relative">
        {imageUrl ? (
          <img src={imageUrl} alt={name || "User"} className="w-10 h-10 rounded-full" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-sm font-bold">{getInitials(name)}</div>
        )}
        {online !== undefined && (
          <div className="absolute bottom-0 right-0">
            <OnlineStatus online={online} size="sm" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{name || "Unknown User"}</p>
      </div>
    </button>
  );
}
