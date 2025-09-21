import React, { useEffect, useRef, useState } from "react";
import { trpc } from "../trpc";
import { connectEvents } from "../sse";
import MessageInput from "./MessageInput";

export default function ChatView({ threadId, me, onNewMessage }:{
  threadId: number,
  me: { id:number; username:string },
  onNewMessage: ()=>void,
}){
  const [msgs, setMsgs] = useState<Array<{ id:number; content:string; created_at:string; sender:string }>>([]);

  async function load(){
    const r = await trpc.messages.list.query({ threadId });
    setMsgs(r);
  }

  useEffect(()=>{ load(); }, [threadId]);

  // Listen for SSE events to reload messages in real-time
  useEffect(() => {
    const off = connectEvents((e) => {
      if (e.type === "message" && e.threadId === threadId) {
        load(); // Reload messages when a new message arrives in this thread
      }
    });
    return off;
  }, [threadId]);

  const endRef = useRef<HTMLDivElement|null>(null);
  useEffect(()=>{ endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  async function send(content:string){
    await trpc.messages.send.mutate({ threadId, content });
    onNewMessage();
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto space-y-2 p-2">
        {msgs.map(m => (
          <div key={m.id} className={`max-w-[75%] px-3 py-2 rounded ${m.sender===me.username? 'bg-black text-white ml-auto' : 'bg-gray-200'}`}>
            <div className="text-xs opacity-70">{m.sender}</div>
            <div>{m.content}</div>
            <div className="text-[10px] opacity-60">{new Date(m.created_at).toLocaleTimeString()}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <MessageInput onSend={send} />
    </div>
  );
}
