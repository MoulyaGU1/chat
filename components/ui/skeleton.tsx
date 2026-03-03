"use client";

import React from "react";

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`bg-slate-700 rounded animate-pulse ${className}`}></div>;
}

export function MessageSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      ))}
    </div>
  );
}
