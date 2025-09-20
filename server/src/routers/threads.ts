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

  start: publicProcedure.input(z.object({ usernames: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const me = requireUserId(ctx);
      
      // Parse comma-separated usernames and get user IDs
      const usernames = input.usernames.split(',').map(u => u.trim()).filter(Boolean);
      if (usernames.length === 0) throw new Error("At least one username required");
      
      const userIds = [me]; // Always include current user
      
      // Get user IDs for provided usernames
      for (const username of usernames) {
        if (username.length < 3) throw new Error(`Username "${username}" is too short`);
        const userQ = await db.query("SELECT id FROM users WHERE username=$1", [username]);
        if (!userQ.rowCount) throw new Error(`User "${username}" not found`);
        userIds.push(userQ.rows[0].id);
      }
      
      // Remove duplicates
      const uniqueUserIds = [...new Set(userIds)];
      
      // Check if exact same group conversation already exists
      const existing = await db.query(
        `SELECT t.id
         FROM threads t
         WHERE (
           SELECT COUNT(*) FROM thread_participants tp WHERE tp.thread_id=t.id
         ) = $1
         AND (
           SELECT COUNT(*) FROM thread_participants tp 
           WHERE tp.thread_id=t.id AND tp.user_id = ANY($2)
         ) = $1`,
        [uniqueUserIds.length, uniqueUserIds]
      );
      
      if (existing.rowCount) return { threadId: existing.rows[0].id };

      // Create new thread
      const t = await db.query("INSERT INTO threads DEFAULT VALUES RETURNING id");
      const threadId = t.rows[0].id;
      
      // Add all participants
      const values = uniqueUserIds.map(userId => `($1, ${userId})`).join(',');
      await db.query(`INSERT INTO thread_participants(thread_id, user_id) VALUES ${values}`, [threadId]);
      
      return { threadId };
    }),
});
