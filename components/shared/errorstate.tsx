"use client";

import React from "react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title = "Something went wrong", message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center flex-col gap-4 p-4 bg-red-900/20 border border-red-700 rounded-lg">
      <div>
        <h3 className="font-bold text-red-400">{title}</h3>
        <p className="text-sm text-red-300">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition">
          Retry
        </button>
      )}
    </div>
  );
}
