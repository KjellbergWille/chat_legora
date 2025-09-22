// Server-Sent Events types for real-time communication
export type SseEvent =
  | { type: "message"; threadId: number; messageId: number };
