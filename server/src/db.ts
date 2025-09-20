import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
};

// Simple schema bootstrap on startup
export async function ensureSchema() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS threads (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMP NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS thread_participants (
      thread_id INT REFERENCES threads(id) ON DELETE CASCADE,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      PRIMARY KEY (thread_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      thread_id INT REFERENCES threads(id) ON DELETE CASCADE,
      sender_id INT REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT now()
    );
  `);
}

export type User = { id: number; username: string };
