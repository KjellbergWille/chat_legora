# ChatLegora – Real-time Group Chat

A modern, type-safe group messaging application with real-time updates, built using tRPC, React, and PostgreSQL.

## Architecture

**Monorepo Structure:**
- `server/` - Node.js/Express backend with tRPC API
- `web/` - React frontend with Vite build system

**Key Features:**
- **Type-Safe Communication**: End-to-end TypeScript with tRPC
- **Real-time Updates**: Server-Sent Events for instant message delivery
- **Group Conversations**: Create threads with multiple participants
- **Auto User Management**: Users created on first login
- **Modern UI**: Clean interface built with React + Tailwind CSS

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 16+
- pnpm (recommended) or npm

### Database Setup

**Option 1: Docker (Recommended)**
```bash
# Start PostgreSQL with Docker
docker run --name pg-chatlegora \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=chatlegora \
  -p 5432:5432 \
  -d postgres:16

# Verify database is running
docker ps | grep pg-chatlegora
```

**Option 2: Local PostgreSQL**
```bash
# Create database locally
createdb chatlegora
```

### Installation & Startup

```bash
# 1. Install dependencies
pnpm install

# 2. Start the backend server (Terminal 1)
cd server
npm run dev

# 3. Start the frontend (Terminal 2) 
cd web
npm run dev -- --host
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **Network Access**: http://10.0.1.120:5173 (for mobile/other devices)

### First Time Setup
1. Visit http://localhost:5173
2. Enter any username and password to create your account
3. Start chatting by creating a new conversation!

### Troubleshooting

**Database Connection Issues:**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart database if needed
docker restart pg-chatlegora

# Clear database and restart fresh
docker exec pg-chatlegora psql -U postgres -d chatlegora -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
```

**Port Conflicts:**
- Backend runs on port 4000
- Frontend runs on port 5173
- Change ports in respective `.env` files if needed

## Usage

**Creating Conversations:**
- Enter comma-separated usernames: `alice, bob, charlie`
- System automatically creates users if they don't exist
- Prevents duplicate conversations with the same participants

**Real-time Features:**
- Messages appear instantly across all connected clients
- Thread list updates automatically when new messages arrive
- Auto-scroll to latest messages

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite for development and building
- Tailwind CSS for styling
- tRPC client for type-safe API calls

**Backend:**
- Node.js + Express
- tRPC for type-safe API layer
- PostgreSQL with connection pooling
- Server-Sent Events for real-time updates
- Zod for input validation

**Database Schema:**
- `users` - User accounts (id, username, password)
- `threads` - Conversation threads
- `thread_participants` - Many-to-many relationship
- `messages` - Individual messages with timestamps

## Development

### Running Individual Services

```bash
# Backend server only (Terminal 1)
cd server
npm run dev

# Frontend only (Terminal 2)
cd web  
npm run dev -- --host

# Build for production
cd server && npm run build
cd web && npm run build

# Start production server
cd server && npm start
```

### Development Workflow

1. **Database**: Ensure PostgreSQL is running (Docker or local)
2. **Backend**: Start server first - it will create database schema automatically
3. **Frontend**: Start web client - it will connect to backend API
4. **Testing**: Open multiple browser tabs/windows to test real-time features

### Environment Variables

**Server (server/.env):**
```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/chatlegora
PORT=4000
CORS_ORIGIN=http://localhost:5173
SESSION_COOKIE_NAME=uid
```

**Web (web/.env):**
```env
VITE_API_URL=http://localhost:4000
```

## API Endpoints

**Authentication:**
- `auth.login` - Login or create user
- `auth.me` - Get current user info

**Threads:**
- `threads.list` - Get user's conversations
- `threads.start` - Create new conversation

**Messages:**
- `messages.list` - Get thread messages
- `messages.send` - Send new message

**Real-time:**
- `/events` - Server-Sent Events endpoint
