import React, { useEffect, useState } from "react";
import { trpc } from "./trpc";
import Login from "./components/Login";
import Messaging from "./components/Messaging";

// Main app component - handles authentication state
export default function App() {
  const [me, setMe] = useState<{ id: number; username: string } | null>(null);

  // Check if user is logged in on app start
  useEffect(() => {
    trpc.auth.me.query()
      .then((u) => setMe(u))
      .catch(() => setMe(null)); // Not logged in
  }, []);

  // Show login form if not authenticated
  if (!me) return <Login onLoggedIn={(u) => setMe({ id: u.userId, username: u.username })} />;
  
  // Show messaging interface if authenticated
  return <Messaging me={me} />;
}
