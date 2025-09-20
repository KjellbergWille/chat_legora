import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { db } from "../db";

function requireUserId(ctx: any): number {
  if (!ctx.userId) throw new Error("Unauthenticated");
  return ctx.userId;
}

export const threadsRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    const me = requireUserId(ctx);
    const r = await db.query(
      `SELECT t.id, MAX(m.created_at) AS last_at,
              STRING_AGG(DISTINCT u.username, ',') FILTER (WHERE u.id<>$1) AS participants
       FROM threads t
       JOIN thread_participants tp ON tp.thread_id=t.id
       JOIN users u ON u.id=tp.user_id
       LEFT JOIN messages m ON m.thread_id=t.id
       WHERE t.id IN (
         SELECT thread_id FROM thread_participants WHERE user_id=$1
       )
       GROUP BY t.id
       ORDER BY COALESCE(MAX(m.created_at), t.created_at) ASC`,
      [me]
    );
    return r.rows.map((row: any) => ({ id: row.id, participants: (row.participants||"").split(",").filter(Boolean), lastAt: row.last_at }));
  }),

  start: publicProcedure.input(z.object({ withUsername: z.string().min(3) }))
    .mutation(async ({ input, ctx }) => {
      const me = requireUserId(ctx);
      const otherQ = await db.query("SELECT id FROM users WHERE username=$1", [input.withUsername]);
      if (!otherQ.rowCount) throw new Error("User not found");
      const otherId = otherQ.rows[0].id;

      // Reuse existing DM if any (two-participant thread)
      const existing = await db.query(
        `SELECT t.id
         FROM threads t
         WHERE EXISTS (
           SELECT 1 FROM thread_participants tp1 WHERE tp1.thread_id=t.id AND tp1.user_id=$1
         ) AND EXISTS (
           SELECT 1 FROM thread_participants tp2 WHERE tp2.thread_id=t.id AND tp2.user_id=$2
         ) AND (
           SELECT COUNT(*) FROM thread_participants tp WHERE tp.thread_id=t.id
         )=2
         LIMIT 1`,
        [me, otherId]
      );
      if (existing.rowCount) return { threadId: existing.rows[0].id };

      const t = await db.query("INSERT INTO threads DEFAULT VALUES RETURNING id");
      const threadId = t.rows[0].id;
      await db.query("INSERT INTO thread_participants(thread_id,user_id) VALUES($1,$2),($1,$3)", [threadId, me, otherId]);
      return { threadId };
    }),
});
