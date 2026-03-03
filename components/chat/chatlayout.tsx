"use client";

import React from "react";
import BackButton from "@/components/shared/backbutton";

interface ChatLayoutProps {
  children: React.ReactNode;
  onBack?: () => void;
  title?: string;
}

export function ChatLayout({ children, onBack, title }: ChatLayoutProps) {
  return (
    <div className="flex flex-col h-full bg-slate-900">
      {title && (
        <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center gap-3">
          {onBack && <BackButton />}
          <h1 className="text-lg font-bold text-white">{title}</h1>
        </div>
      )}
      {children}
    </div>
  );
}
