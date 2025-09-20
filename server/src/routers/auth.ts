import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { db } from "../db";

const loginInput = z.object({ username: z.string().min(3), password: z.string().min(3) });

export const authRouter = router({
  login: publicProcedure.input(loginInput).mutation(async ({ input, ctx }) => {
    const { username, password } = input;

    const existing = await db.query("SELECT id, password FROM users WHERE username=$1", [username]);
    let userId: number;

    if (existing.rowCount === 0) {
      const ins = await db.query(
        "INSERT INTO users(username, password) VALUES($1,$2) RETURNING id",
        [username, password]
      );
      userId = ins.rows[0].id;
    } else {
      const row = existing.rows[0];
      if (row.password !== password) throw new Error("Invalid credentials");
      userId = row.id;
    }

    const cookieName = process.env.SESSION_COOKIE_NAME || "uid";
    ctx.res.cookie(cookieName, String(userId), { httpOnly: false }); // simple for demo

    return { userId, username };
  }),
  me: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) return null;
    const u = await db.query("SELECT id, username FROM users WHERE id=$1", [ctx.userId]);
    return u.rowCount ? u.rows[0] : null;
  }),
});
