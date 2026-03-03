"use client";

import React from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { Doc } from "@/convex/_generated/dataModel";

interface NavbarProps {
  currentUser?: Doc<"users">;
}

export function Navbar({ currentUser }: NavbarProps) {
  const { user: clerkUser } = useUser();

  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-white">💬 Chat</h1>
          {currentUser?.name && <span className="text-sm text-slate-300">({currentUser.name})</span>}
        </div>
        <UserButton />
      </div>
    </nav>
  );
}
