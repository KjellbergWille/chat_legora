import { router } from "./trpc";
import { authRouter } from "./routers/auth";
import { threadsRouter } from "./routers/threads";
import { messagesRouter } from "./routers/messages";

export const appRouter = router({ auth: authRouter, threads: threadsRouter, messages: messagesRouter });
export type AppRouter = typeof appRouter;
