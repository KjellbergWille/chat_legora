import React, { useState } from "react";
import { trpc } from "../trpc";

// Form to create new conversation threads
export default function NewThread({ onCreated }: { onCreated:(id:number)=>void }){
  const [usernames, setUsernames] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string|null>(null);
  
  // Handle form submission - create new thread
  async function submit(e: React.FormEvent){
    e.preventDefault(); 
    setLoading(true); 
    setErr(null);
    try {
      const r = await trpc.threads.start.mutate({ usernames });
      onCreated(r.threadId); // Notify parent of new thread
      setUsernames(""); // Clear form
    } catch (e:any) { 
      setErr(e.message); // Show error message
    } finally { 
      setLoading(false); 
    }
  }
  
  return (
    <form onSubmit={submit} className="card space-y-2">
      <div className="font-semibold text-sm">Start conversation</div>
      <input 
        className="input" 
        placeholder="usernames (comma separated)" 
        value={usernames} 
        onChange={e=>setUsernames(e.target.value)} 
      />
      <div className="text-xs text-gray-500">
        Enter usernames separated by commas, e.g., "user1, user2"
      </div>
      {err && <div className="text-xs text-red-600">{err}</div>}
      <button className="btn w-full" disabled={!usernames.trim() || loading}>
        {loading ? "Creating..." : "Create"}
      </button>
    </form>
  );
}
