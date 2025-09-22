import type { SseEvent } from "./types";
import type { Response } from "express";

// Map of user IDs to their connected SSE clients
const listeners = new Map<number, Set<Response>>();

// Subscribe a user's client to real-time updates
export function subscribe(userId: number, res: Response) {
  let set = listeners.get(userId);
  if (!set) listeners.set(userId, (set = new Set()));
  set.add(res);
  
  // Clean up when client disconnects
  res.on("close", () => {
    set!.delete(res);
    if (set!.size === 0) listeners.delete(userId);
  });
}

// Broadcast an event to specific users
export function publish(toUserIds: number[], event: SseEvent) {
  const payload = `data: ${JSON.stringify(event)}\n\n`;
  
  // Send to all connected clients of the specified users
  for (const uid of toUserIds) {
    const set = listeners.get(uid);
    if (!set) continue; // User not connected
    for (const res of set) res.write(payload);
  }
}