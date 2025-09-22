import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { db } from "../db";

// Input validation schema for login
const loginInput = z.object({ username: z.string().min(3), password: z.string().min(3) });

export const authRouter = router({
  // Login or create new user
  login: publicProcedure.input(loginInput).mutation(async ({ input, ctx }) => {
    const { username, password } = input;
    const normalizedUsername = username.toLowerCase();

    // Check if user already exists
    const existing = await db.query("SELECT id, password FROM users WHERE username=$1", [normalizedUsername]);
    let userId: number;

    if (existing.rowCount === 0) {
      // Create new user
      const ins = await db.query(
        "INSERT INTO users(username, password) VALUES($1,$2) RETURNING id",
        [normalizedUsername, password]
      );
      userId = ins.rows[0].id;
    } else {
      // Verify existing user password
      const row = existing.rows[0];
      if (row.password !== password) throw new Error("Invalid credentials");
      userId = row.id;
    }

    // Set session cookie for authentication
    const cookieName = process.env.SESSION_COOKIE_NAME || "uid";
    ctx.res.cookie(cookieName, String(userId), { httpOnly: false }); // simple for demo

    return { userId, username: normalizedUsername };
  }),
  
  // Get current user info
  me: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) return null; // Not logged in
    const u = await db.query("SELECT id, username FROM users WHERE id=$1", [ctx.userId]);
    return u.rowCount ? u.rows[0] : null;
  }),
});
