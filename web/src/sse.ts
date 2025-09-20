export function connectEvents(onEvent: (e: any) => void) {
  const url = `${(import.meta as any).env?.VITE_API_URL || "http://localhost:4000"}/events`;
  const es = new EventSource(url, { withCredentials: true });
  es.onmessage = (msg) => {
    try { onEvent(JSON.parse(msg.data)); } catch {}
  };
  return () => es.close();
}
