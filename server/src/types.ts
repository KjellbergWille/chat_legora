export type SseEvent =
  | { type: "message"; threadId: number; messageId: number };
