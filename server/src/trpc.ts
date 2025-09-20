import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";
import type { Request, Response } from "express";

export type Ctx = { req: Request; res: Response; userId?: number };

export const t = initTRPC.context<Ctx>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
