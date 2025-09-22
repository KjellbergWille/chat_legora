# ChatLegora – Multi-Device Real-time Group Chat

A modern, type-safe group messaging application with real-time updates and **multi-device network access**. Built using tRPC, React, and PostgreSQL. Connect from any device on your local network - phones, tablets, laptops, and more!

## 🚀 Quick Start (5 minutes)

**For developers who just want to run it:**

```bash
# 1. Clone and install
git clone <repository-url>
cd chatlegora
pnpm install

# 2. Start database (Docker)
docker run --name pg-chatlegora -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=chatlegora -p 5432:5432 -d postgres:16

# 3. Start both servers (one command!)
pnpm dev

# 4. Open http://localhost:5173 in your browser
# 5. For multi-device access, find your IP and visit http://YOUR_IP:5173
#    (The web server automatically starts with --host for network access)
```

**That's it!** The app will create the database schema automatically on first run.

## 📋 Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Docker** - [Download here](https://www.docker.com/) (for database)
- **pnpm** - Install with `npm install -g pnpm`

## 🏗️ Architecture

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

## 🛠️ Detailed Setup

### Step 1: Database Setup

**Option A: Docker (Recommended)**
```bash
# Start PostgreSQL container
docker run --name pg-chatlegora \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=chatlegora \
  -p 5432:5432 \
  -d postgres:16

# Verify it's running
docker ps | grep pg-chatlegora
```

**Option B: Local PostgreSQL**
```bash
# Install PostgreSQL locally, then:
createdb chatlegora
```

### Step 2: Environment Setup

**Create server/.env:**
```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/chatlegora
PORT=4000
CORS_ORIGIN=http://localhost:5173
SESSION_COOKIE_NAME=uid
```

**Create web/.env:**
```env
# For local development
VITE_API_URL=http://localhost:4000

# For multi-device access (replace with your IP)
# VITE_API_URL=http://192.168.1.100:4000
```

### Step 3: Install & Run

```bash
# Install all dependencies
pnpm install

# Option A: Run everything at once (recommended)
pnpm dev

# Option B: Run separately (if you prefer)
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend (with network access)
cd web && npm run dev -- --host
```

## 🌐 Multi-Device Access

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

### First Time Usage
1. **Start the servers** using the commands above
2. **On your computer**: Visit http://localhost:5173
3. **On other devices**: Visit http://YOUR_IP_ADDRESS:5173
4. Enter any username and password to create your account
5. Start chatting by creating a new conversation!

### 📱 Multi-Device Features
- **Same WiFi Required**: All devices must be on the same local network
- **Real-time Sync**: Messages appear instantly across all connected devices
- **Cross-Platform**: Works on iOS, Android, Windows, macOS, Linux
- **No Installation**: Just open a web browser and visit the URL

## 🗄️ Database Management

**Reset Database (if needed):**
```bash
# Stop the app first, then:
node reset-db.js

# Or manually with Docker:
docker exec pg-chatlegora psql -U postgres -d chatlegora -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
```

**Database Schema:**
- `users` - User accounts (id, username, password)
- `threads` - Conversation threads
- `thread_participants` - Many-to-many relationship
- `messages` - Individual messages with timestamps

## 🔧 Troubleshooting

### Common Issues & Solutions

**❌ "Cannot connect to database"**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# If not running, start it:
docker start pg-chatlegora

# If container doesn't exist, recreate it:
docker run --name pg-chatlegora -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=chatlegora -p 5432:5432 -d postgres:16
```

**❌ "Port already in use"**
```bash
# Check what's using the ports
lsof -i :4000 -i :5173

# Kill processes if needed
kill -9 <PID>

# Or change ports in .env files
```

**❌ "Multi-device access not working"**
```bash
# Check if servers are running on all interfaces
lsof -i :4000 -i :5173

# Should show *:4000 and *:5173 (not localhost)
# If not, restart with correct commands:
cd server && npm run dev
cd web && npm run dev -- --host
```

**❌ "Database schema errors"**
```bash
# Reset the database completely
node reset-db.js

# Or manually:
docker exec pg-chatlegora psql -U postgres -d chatlegora -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
```

**❌ "Other devices can't connect"**
- Ensure all devices are on the same WiFi network
- Check firewall settings (allow ports 4000 and 5173)
- Verify IP address hasn't changed: `ifconfig | grep inet`
- Try accessing from the same device first: http://localhost:5173

**❌ "pnpm command not found"**
```bash
# Install pnpm globally
npm install -g pnpm

# Or use npm instead (slower but works)
npm install
npm run dev
```

### Getting Help

1. **Check the logs** - Look at terminal output for error messages
2. **Verify prerequisites** - Node.js 18+, Docker, pnpm installed
3. **Try the reset** - `node reset-db.js` and restart everything
4. **Check ports** - Make sure 4000 and 5173 are available
5. **Network issues** - Try localhost first, then network access

## 💡 How to Use

**Creating Conversations:**
- Enter comma-separated usernames: `alice, bob, charlie`
- System automatically creates users if they don't exist
- Prevents duplicate conversations with the same participants

**Real-time Features:**
- Messages appear instantly across all connected clients
- Thread list updates automatically when new messages arrive
- Auto-scroll to latest messages

## 🛠️ Development

### Available Scripts

```bash
# Development (runs both server and web)
pnpm dev

# Individual services
pnpm dev:server    # Backend only
pnpm dev:web       # Frontend only

# Production
pnpm build         # Build everything
pnpm start         # Start production server
```

### Tech Stack

**Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + tRPC
**Backend:** Node.js + Express + tRPC + PostgreSQL + Server-Sent Events
**Database:** PostgreSQL with auto-created schema

### API Endpoints

- `auth.login` - Login or create user
- `auth.me` - Get current user info  
- `threads.list` - Get user's conversations
- `threads.start` - Create new conversation
- `messages.list` - Get thread messages
- `messages.send` - Send new message
- `/events` - Server-Sent Events for real-time updates
