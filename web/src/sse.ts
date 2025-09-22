// Connect to Server-Sent Events for real-time updates
export function connectEvents(onEvent: (e: any) => void) {
  const url = `${import.meta.env?.VITE_API_URL || "http://localhost:4000"}/events`;
  const es = new EventSource(url, { withCredentials: true });
  
  // Handle incoming events
  es.onmessage = (msg) => {
    try { 
      onEvent(JSON.parse(msg.data)); 
    } catch {
      // Ignore malformed messages
    }
  };
  
  // Return cleanup function
  return () => es.close();
}
