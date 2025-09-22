import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";
import type { Request, Response } from "express";

// Request context type
export type Ctx = { req: Request; res: Response; userId?: number };

// Initialize tRPC with custom error formatting
export const t = initTRPC.context<Ctx>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      // Include Zod validation errors in response
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
    };
  },
});

// Export tRPC utilities
export const router = t.router;
export const publicProcedure = t.procedure;
