import { Pool } from "pg";

// Database connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
};

// Initialize database schema on startup
export async function ensureSchema() {
  await db.query(`
    -- Users table for authentication
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );

    -- Conversation threads
    CREATE TABLE IF NOT EXISTS threads (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMP NOT NULL DEFAULT now()
    );

    -- Many-to-many relationship between users and threads
    CREATE TABLE IF NOT EXISTS thread_participants (
      thread_id INT REFERENCES threads(id) ON DELETE CASCADE,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      PRIMARY KEY (thread_id, user_id)
    );

    -- Messages within threads
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
