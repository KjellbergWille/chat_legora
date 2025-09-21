# ChatLegora – Simple Type-Safe Messaging

Real-time group chat app built with tRPC + SSE + PostgreSQL.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start PostgreSQL
docker run --name pg-legora -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=legorachat -p 5432:5432 -d postgres:16

# Run app
pnpm dev
```

Open http://localhost:5173, login with any username/password, and start conversations:
- **Single user**: `alice` 
- **Multiple users**: `alice, bob, charlie`

## Features

- **Type-Safe API**: tRPC + Zod validation
- **Real-time**: Server-Sent Events
- **Group Chats**: Single or multiple users (comma-separated)
- **Auto User Creation**: First login creates account
- **PostgreSQL**: Raw SQL with connection pooling

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind
- **Backend**: Node.js + Express + tRPC
- **Database**: PostgreSQL
- **Real-time**: Server-Sent Events
