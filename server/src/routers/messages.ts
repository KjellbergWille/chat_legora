import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { db } from "../db";
import { publish } from "../sse";

function requireUserId(ctx: any): number {
  if (!ctx.userId) throw new Error("Unauthenticated");
  return ctx.userId;
}

export const messagesRouter = router({
  list: publicProcedure.input(z.object({ threadId: z.number() }))
    .query(async ({ input, ctx }) => {
      const me = requireUserId(ctx);
      // ensure membership
      const mem = await db.query("SELECT 1 FROM thread_participants WHERE thread_id=$1 AND user_id=$2", [input.threadId, me]);
      if (!mem.rowCount) throw new Error("Not a participant");
      const r = await db.query(
        `SELECT m.id, m.content, m.created_at, u.username AS sender
         FROM messages m JOIN users u ON u.id=m.sender_id
         WHERE m.thread_id=$1 ORDER BY m.created_at ASC, m.id ASC`,
        [input.threadId]
      );
      return r.rows;
    }),

  send: publicProcedure.input(z.object({ threadId: z.number(), content: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const me = requireUserId(ctx);
      const mem = await db.query("SELECT user_id FROM thread_participants WHERE thread_id=$1", [input.threadId]);
      if (!mem.rowCount) throw new Error("Not a participant");

      const ins = await db.query(
        "INSERT INTO messages(thread_id, sender_id, content) VALUES($1,$2,$3) RETURNING id",
        [input.threadId, me, input.content]
      );
      const messageId = ins.rows[0].id;
      const toUserIds = mem.rows.map((r: any) => r.user_id);
      publish(toUserIds, { type: "message", threadId: input.threadId, messageId });
      return { messageId };
    }),
});
