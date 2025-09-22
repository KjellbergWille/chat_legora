import React, { useEffect, useRef, useState } from "react";
import { trpc } from "../trpc";
import { connectEvents } from "../sse";
import MessageInput from "./MessageInput";

// Main chat interface - displays messages and handles sending
export default function ChatView({ threadId, me, onNewMessage }:{
  threadId: number,
  me: { id:number; username:string },
  onNewMessage: ()=>void,
}){
  const [msgs, setMsgs] = useState<Array<{ id:number; content:string; created_at:string; sender:string }>>([]);

  // Load messages from server for this thread
  async function load(){
    const r = await trpc.messages.list.query({ threadId });
    setMsgs(r);
  }

  // Load messages when thread changes
  useEffect(()=>{ load(); }, [threadId]);

  // Listen for real-time message updates via Server-Sent Events
  useEffect(() => {
    const off = connectEvents((e) => {
      if (e.type === "message" && e.threadId === threadId) {
        load(); // Reload messages when a new message arrives in this thread
      }
    });
    return off;
  }, [threadId]);

  // Auto-scroll to bottom when new messages arrive
  const endRef = useRef<HTMLDivElement|null>(null);
  useEffect(()=>{ endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  // Send a new message to the server
  async function send(content:string){
    await trpc.messages.send.mutate({ threadId, content });
    onNewMessage(); // Notify parent component
  }

  return (
    <div className="h-full flex flex-col">
      {/* Messages list */}
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
      {/* Message input at bottom */}
      <MessageInput onSend={send} />
    </div>
  );
}
