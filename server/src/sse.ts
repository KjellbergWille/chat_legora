import type { SseEvent } from "./types";
import type { Response } from "express";

const listeners = new Map<number, Set<Response>>(); // userId -> clients

export function subscribe(userId: number, res: Response) {
  let set = listeners.get(userId);
  if (!set) listeners.set(userId, (set = new Set()));
  set.add(res);
  res.on("close", () => {
    set!.delete(res);
    if (set!.size === 0) listeners.delete(userId);
  });
}

export function publish(toUserIds: number[], event: SseEvent) {
  const payload = `data: ${JSON.stringify(event)}\n\n`;
  for (const uid of toUserIds) {
    const set = listeners.get(uid);
    if (!set) continue;
    for (const res of set) res.write(payload);
  }
}