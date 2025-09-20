import React, { useState } from "react";
import { trpc } from "../trpc";

export default function NewThread({ onCreated }: { onCreated:(id:number)=>void }){
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string|null>(null);
  async function submit(e: React.FormEvent){
    e.preventDefault(); setLoading(true); setErr(null);
    try {
      const r = await trpc.threads.start.mutate({ withUsername: name });
      onCreated(r.threadId);
      setName("");
    } catch (e:any) { setErr(e.message); } finally { setLoading(false); }
  }
  return (
    <form onSubmit={submit} className="card space-y-2">
      <div className="font-semibold text-sm">Start new DM</div>
      <input className="input" placeholder="Username" value={name} onChange={e=>setName(e.target.value)} />
      {err && <div className="text-xs text-red-600">{err}</div>}
      <button className="btn w-full" disabled={!name || loading}>Create</button>
    </form>
  );
}
