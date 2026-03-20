export function CallModal({ call, onAccept, onDecline }: any) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-8 rounded-2xl text-center">
        <h2 className="text-xl font-bold mb-4">
          Incoming {call.type} Call...
        </h2>
        <div className="flex gap-4">
          <button onClick={onAccept} className="bg-green-500 p-4 rounded-full">📞 Accept</button>
          <button onClick={onDecline} className="bg-red-500 p-4 rounded-full">🚫 Decline</button>
        </div>
      </div>
    </div>
  );
}