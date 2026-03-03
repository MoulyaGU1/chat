export default function ChatLoading() {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-900">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400">Loading chat...</p>
      </div>
    </div>
  );
}
