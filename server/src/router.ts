import { router } from "./trpc";
import { authRouter } from "./routers/auth";
import { threadsRouter } from "./routers/threads";
import { messagesRouter } from "./routers/messages";

// Main tRPC router combining all sub-routers
export const appRouter = router({ 
  auth: authRouter,        // Authentication endpoints
  threads: threadsRouter,  // Thread management
  messages: messagesRouter // Message handling
});

export type AppRouter = typeof appRouter;
