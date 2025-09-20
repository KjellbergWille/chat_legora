import React, { useEffect, useMemo, useState } from "react";
import { trpc } from "../trpc";
import { connectEvents } from "../sse";
import ThreadList from "./ThreadList";
import ChatView from "./ChatView";
import NewThread from "./NewThread";

export default function Messaging({ me }: { me: { id: number; username: string } }) {
  const [threads, setThreads] = useState<Array<{ id: number; participants: string[]; lastAt: string | null }>>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [triggerReload, setTriggerReload] = useState<number>(0);

  async function loadThreads() {
    const t = await trpc.threads.list.query() as Array<{ id: number; participants: string[]; lastAt: string | null }>;
    setThreads(t);
    if (t.length && !activeId) setActiveId(t[0].id);
  }

  useEffect(() => { loadThreads(); }, [triggerReload]);

  useEffect(() => {
    const off = connectEvents((e) => {
      if (e.type === "message") {
        // For simplicity, reload threads and if current thread, let ChatView react via its own SSE-less design
        setTriggerReload((x) => x + 1);
      }
    });
    return off;
  }, []);

  const active = useMemo(() => threads.find(t => t.id === activeId) || null, [threads, activeId]);

  return (
    <div className="h-screen grid grid-cols-[280px_1fr]">
      <aside className="border-r p-3 space-y-3">
        <div className="font-semibold">{me.username}</div>
        <NewThread onCreated={(id) => { setActiveId(id); setTriggerReload(x=>x+1); }} />
        <ThreadList threads={threads} activeId={activeId} onSelect={setActiveId} />
      </aside>
      <main className="p-3">
        {active ? <ChatView threadId={active.id} me={me} onNewMessage={()=>setTriggerReload(x=>x+1)} /> : <div className="text-gray-500">No thread selected</div>}
      </main>
    </div>
  );
}
