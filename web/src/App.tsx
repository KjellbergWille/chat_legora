import React, { useEffect, useState } from "react";
import { trpc } from "./trpc";
import Login from "./components/Login";
import Messaging from "./components/Messaging";

export default function App() {
  const [me, setMe] = useState<{ id: number; username: string } | null>(null);

  useEffect(() => {
    trpc.auth.me.query().then((u) => setMe(u)).catch(() => setMe(null));
  }, []);

  if (!me) return <Login onLoggedIn={(u) => setMe(u)} />;
  return <Messaging me={me} />;
}
