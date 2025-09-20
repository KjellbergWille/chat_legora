# ChatLegora – super simple, type‑safe messaging app

A tiny, clean full‑stack chat application built with tRPC + SSE.

## Features

- **Frontend**: React + TypeScript + Tailwind
- **Backend**: Node.js (Express + tRPC + Zod)
- **Realtime**: Server‑Sent Events (SSE)
- **DB**: PostgreSQL (raw SQL via pg)
- **Auth**: ultra‑simple cookie (create user on first login with unique username)

## Quick Start

### Prerequisites

- Node 20+
- pnpm (or npm)
- Docker (for PostgreSQL)

### 1. Install Dependencies

```bash
# Copy environment file
cp env.example .env

# Install all dependencies
pnpm install
```

### 2. Start PostgreSQL Database

```bash
docker run --name pg-legora -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=legorachat -p 5432:5432 -d postgres:16
```

### 3. Run Development Servers

```bash
# Start both frontend and backend
pnpm dev
```

This will start:
- **Server**: http://localhost:4000
- **Web**: http://localhost:5173

### 4. Use the App

1. Open http://localhost:5173 in your browser
2. Login with any username + password → account is created automatically
3. Start a DM with another user's username
4. Open a second browser window, login as the other user
5. Send messages; they arrive in real‑time via SSE

## Project Structure

```
legorachat/
├── package.json          # Root workspace config
├── env.example          # Environment variables template
├── README.md
├── server/              # Backend (Express + tRPC)
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts     # Express server + SSE endpoint
│       ├── db.ts        # PostgreSQL connection + schema
│       ├── sse.ts       # Server-Sent Events pub/sub
│       ├── trpc.ts      # tRPC configuration
│       ├── router.ts    # Main tRPC router
│       └── routers/
│           ├── auth.ts     # Login/create user
│           ├── threads.ts  # Thread management
│           └── messages.ts # Send/receive messages
└── web/                 # Frontend (React + TypeScript)
    ├── package.json
    ├── tsconfig.json
    ├── index.html
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── trpc.ts       # tRPC client helpers
        ├── api.ts        # HTTP fetch utilities
        ├── sse.ts        # EventSource wrapper
        └── components/
            ├── Login.tsx
            ├── Messaging.tsx
            ├── ThreadList.tsx
            ├── ChatView.tsx
            ├── NewThread.tsx
            └── MessageInput.tsx
```

## Environment Variables

Create `.env` file from `env.example`:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/legorachat
PORT=4000
CORS_ORIGIN=http://localhost:5173
SESSION_COOKIE_NAME=uid
```

## Key Features

- **Type-Safe API**: tRPC procedures with Zod validation
- **Real-time Messaging**: Server-Sent Events for instant updates
- **Auto User Creation**: First login creates user account
- **DM Threads**: Start conversations by username
- **Chronological Messages**: SQL-ordered, auto-scroll UI
- **Clean UI**: Tailwind CSS with minimal, focused components

## Production Notes

- For production deployment, ensure proper headers for SSE (`Connection: keep-alive`)
- This demo uses plaintext passwords and simple cookies - use proper hashing and sessions for real apps
- Consider sticky connections for SSE in cloud environments

## Why This Design Works

- **Clean separation**: Server and web are independent with minimal coupling
- **Type safety**: tRPC ensures end-to-end type safety
- **Real-time**: SSE provides instant message delivery
- **Simple state**: React state management without complex libraries
- **Minimal files**: Each file has a single, clear responsibility
