"use client";

import React, { useState } from "react";
import { ConversationList } from "@/components/chat/conversationlist";
import { UserList } from "@/components/chat/userlist";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface SidebarProps {
  userId: string | null;
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  onSelectUser: (userId: string, userName?: string) => void;
}

export function Sidebar({ userId, selectedConversationId, onSelectConversation, onSelectUser }: SidebarProps) {
  const [showUsers, setShowUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const allUsers = useQuery(api.users.listAllUsers, userId ? { excludeUserId: userId as any } : "skip");
  const searchResults = useQuery(api.users.searchUsers, searchQuery && userId ? { query: searchQuery, excludeUserId: userId as any } : "skip");

  const usersToDisplay = searchQuery ? searchResults : allUsers;

  return (
    <div className="w-full md:w-72 bg-slate-800 flex flex-col border-r border-slate-700 h-full">
      <div className="p-4 border-b border-slate-700">
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => {
              setShowUsers(false);
              setSearchQuery("");
            }}
            className={`flex-1 px-3 py-2 rounded transition text-sm font-medium ${!showUsers ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300"}`}
          >
            Chats
          </button>
          <button
            onClick={() => setShowUsers(true)}
            className={`flex-1 px-3 py-2 rounded transition text-sm font-medium ${showUsers ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300"}`}
          >
            Users
          </button>
        </div>
        {showUsers && (
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>

      {showUsers ? (
        <UserList users={usersToDisplay ?? []} onSelectUser={onSelectUser} />
      ) : (
        <ConversationList userId={userId} selectedConversationId={selectedConversationId} onSelectConversation={onSelectConversation} />
      )}
    </div>
  );
}
