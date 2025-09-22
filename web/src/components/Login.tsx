import React, { useState } from "react";
import { trpc } from "../trpc";

// Login form - creates new users or authenticates existing ones
export default function Login({ onLoggedIn }: { onLoggedIn: (u: { userId: number; username: string }) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Handle login form submission
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); 
    setErr(null);
    try {
      const u = await trpc.auth.login.mutate({ username, password });
      onLoggedIn(u); // Notify parent of successful login
    } catch (e: any) {
      setErr(e.message); // Show error message
    } finally { 
      setLoading(false); 
    }
  }

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <form onSubmit={submit} className="card max-w-sm w-full space-y-3">
        <h1 className="text-xl font-semibold">LegoraChat – Login</h1>
        <input 
          className="input" 
          placeholder="Username" 
          value={username} 
          onChange={e=>setUsername(e.target.value)} 
        />
        <input 
          className="input" 
          placeholder="Password" 
          type="password" 
          value={password} 
          onChange={e=>setPassword(e.target.value)} 
        />
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <button 
          className="btn w-full" 
          disabled={loading || !username || !password}
        >
          {loading ? "Logging in..." : "Log in / Create"}
        </button>
        <p className="text-xs text-gray-500">
          First login creates a user with this username (must be unique).
        </p>
      </form>
    </div>
  );
}
