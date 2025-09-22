import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./router";
import { ensureSchema } from "./db";
import { subscribe } from "./sse";

// Server configuration
const PORT = Number(process.env.PORT || 4000);
const ORIGIN = process.env.CORS_ORIGIN || "http://192.168.10.130:5173";
const COOKIE = process.env.SESSION_COOKIE_NAME || "uid";

async function main() {
  // Initialize database schema
  await ensureSchema();
  
  const app = express();
  
  // Middleware setup
  app.use(cors({ origin: ["http://localhost:5173", "http://192.168.10.130:5173"], credentials: true }));
  app.use(cookieParser());
  app.use(express.json());

  // Server-Sent Events endpoint for real-time updates
  app.get("/events", (req, res) => {
    const uid = Number(req.cookies?.[COOKIE]);
    if (!uid) return res.status(401).end(); // Require authentication
    
    // Set up SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();
    
    // Send initial hello message
    res.write(`data: ${JSON.stringify({ type: "hello" })}\n\n`);
    
    // Subscribe user to real-time updates
    subscribe(uid, res);
  });

  // tRPC API endpoint
  app.use("/trpc", createExpressMiddleware({
    router: appRouter,
    createContext: ({ req, res }) => {
      // Extract user ID from session cookie
      const cookieName = process.env.SESSION_COOKIE_NAME || "uid";
      const userId = req.cookies?.[cookieName] ? Number(req.cookies[cookieName]) : undefined;
      return { req, res, userId };
    },
  }));

  // Start server
  app.listen(PORT, '0.0.0.0', () => console.log(`server on :${PORT}`));
}

main();
