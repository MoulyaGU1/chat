"use client";

import React from "react";
import { UserItem } from "./useritem";
import { Doc, Id } from "@/convex/_generated/dataModel";

interface UserListProps {
  users: Doc<"users">[];
  onSelectUser: (userId: Id<"users">, userName?: string) => void;
}

export function UserList({ users, onSelectUser }: UserListProps) {
  if (users.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400">
        <p>No users found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto space-y-1 p-2">
      {users.map((user) => (
        <UserItem
          key={user._id}
          userId={user._id}
          name={user.name}
          imageUrl={user.image}
          onClick={() => onSelectUser(user._id, user.name)}
        />
      ))}
    </div>
  );
}