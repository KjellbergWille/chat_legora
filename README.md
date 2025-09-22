# ChatLegora – Multi-Device Real-time Group Chat

A modern, type-safe group messaging application with real-time updates and **multi-device network access**. Built using tRPC, React, and PostgreSQL. Connect from any device on your local network - phones, tablets, laptops, and more!

## Architecture

**Monorepo Structure:**
- `server/` - Node.js/Express backend with tRPC API
- `web/` - React frontend with Vite build system

**Key Features:**
- **🌐 Multi-Device Access**: Connect from any device on your local network
- **📱 Mobile Friendly**: Works on phones, tablets, laptops, and desktops
- **⚡ Real-time Updates**: Server-Sent Events for instant message delivery
- **👥 Group Conversations**: Create threads with multiple participants
- **🔐 Auto User Management**: Users created on first login
- **🎨 Modern UI**: Clean interface built with React + Tailwind CSS
- **🔒 Type-Safe Communication**: End-to-end TypeScript with tRPC

## 🚀 Quick Start Commands

**Essential startup commands for multi-device access:**

```bash
# Terminal 1: Backend Server
cd server && npm run dev

# Terminal 2: Frontend Server (with network access)
cd web && npm run dev -- --host
```

**Access from any device on your network:**
- Find your IP: `ifconfig | grep inet` (macOS/Linux) or `ipconfig` (Windows)
- Visit: `http://YOUR_IP_ADDRESS:5173`

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

# 3. Start the frontend with network access (Terminal 2) 
cd web
npm run dev -- --host
```

### 🌐 Multi-Device Access

**Find Your Network IP:**
```bash
# macOS/Linux
ifconfig | grep inet

# Windows
ipconfig
```

**Access URLs:**
- **Local Development**: http://localhost:5173
- **Network Access**: http://YOUR_IP_ADDRESS:5173
- **Backend API**: http://YOUR_IP_ADDRESS:4000

**Example:** If your IP is `192.168.1.100`, other devices would visit:
```
http://192.168.1.100:5173
```

### First Time Setup
1. **Start the servers** using the commands above
2. **On your computer**: Visit http://localhost:5173
3. **On other devices**: Visit http://YOUR_IP_ADDRESS:5173
4. Enter any username and password to create your account
5. Start chatting by creating a new conversation!

### 📱 Multi-Device Usage
- **Same WiFi Required**: All devices must be on the same local network
- **Real-time Sync**: Messages appear instantly across all connected devices
- **Cross-Platform**: Works on iOS, Android, Windows, macOS, Linux
- **No Installation**: Just open a web browser and visit the URL

### Troubleshooting

**🌐 Multi-Device Connection Issues:**
```bash
# Check if servers are running on all interfaces
lsof -i :4000 -i :5173

# Should show *:4000 and *:5173 (not localhost)
# If not, restart servers with correct commands:
cd server && npm run dev
cd web && npm run dev -- --host
```

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

**Network Access Issues:**
- Ensure all devices are on the same WiFi network
- Check firewall settings (may need to allow ports 4000 and 5173)
- Verify IP address hasn't changed (run `ifconfig` again)

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
# For local development
VITE_API_URL=http://localhost:4000

# For multi-device access (replace with your IP)
VITE_API_URL=http://10.0.1.120:4000
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
