import React, { useEffect, useMemo, useState } from "react";
import { trpc } from "../trpc";
import { connectEvents } from "../sse";
import ThreadList from "./ThreadList";
import ChatView from "./ChatView";
import NewThread from "./NewThread";

// Main messaging interface - manages threads and chat views
export default function Messaging({ me }: { me: { id: number; username: string } }) {
  const [threads, setThreads] = useState<Array<{ id: number; participants: string[]; lastAt: string | null }>>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [triggerReload, setTriggerReload] = useState<number>(0); // Force reload counter

  // Load all threads for the current user
  async function loadThreads() {
    const t = await trpc.threads.list.query() as Array<{ id: number; participants: string[]; lastAt: string | null }>;
    setThreads(t);
    // Auto-select first thread if none selected
    if (t.length && !activeId) setActiveId(t[0].id);
  }

  // Reload threads when trigger changes
  useEffect(() => { loadThreads(); }, [triggerReload]);

  // Listen for real-time updates and refresh thread list
  useEffect(() => {
    const off = connectEvents((e) => {
      if (e.type === "message") {
        // Refresh thread list when new messages arrive
        setTriggerReload((x) => x + 1);
      }
    });
    return off;
  }, []);

  // Find the currently active thread
  const active = useMemo(() => threads.find(t => t.id === activeId) || null, [threads, activeId]);

  return (
    <div className="h-screen grid grid-cols-[280px_1fr]">
      {/* Left sidebar with threads */}
      <aside className="border-r p-3 space-y-3">
        <div className="font-semibold">{me.username}</div>
        <NewThread onCreated={(id) => { setActiveId(id); setTriggerReload(x=>x+1); }} />
        <ThreadList threads={threads} activeId={activeId} onSelect={setActiveId} />
      </aside>
      {/* Right side with chat view */}
      <main className="p-3">
        {active ? (
          <ChatView 
            threadId={active.id} 
            me={me} 
            onNewMessage={()=>setTriggerReload(x=>x+1)} 
          />
        ) : (
          <div className="text-gray-500">No thread selected</div>
        )}
      </main>
    </div>
  );
}
