# Chat Legora

A real-time chat application with multi-device support built with React, TypeScript, tRPC, and PostgreSQL.

## Features

- User authentication and registration
- Real-time messaging with Server-Sent Events (SSE)
- Thread-based conversations
- Multi-user chat support
- Multi-device access on the same network
- Fast and responsive UI with React and TypeScript
- Type-safe API with tRPC

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **tRPC** for type-safe API calls

### Backend
- **Node.js** with TypeScript
- **Express.js** for the web server
- **tRPC** for API layer
- **PostgreSQL** for data persistence
- **Server-Sent Events** for real-time updates

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KjellbergWille/chat_legora.git
   cd chat_legora
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   pnpm install
   
   # Install server dependencies
   cd server
   pnpm install
   
   # Install web dependencies
   cd ../web
   pnpm install
   ```

3. **Set up the database**
   ```bash
   # Create a PostgreSQL database
   createdb chatlegora
   
   # Or using psql
   psql -d postgres -c "CREATE DATABASE chatlegora;"
   ```

4. **Configure environment variables**
   ```bash
   # Create .env file in the root directory
   echo "DATABASE_URL=postgresql://username:password@localhost:5432/chatlegora" > .env
   ```

5. **Start the development servers**
   ```bash
   # Terminal 1 - Start the server
   cd server
   pnpm dev
   
   # Terminal 2 - Start the web client
   cd web
   pnpm dev
   ```

6. **Access the application**
   - Local: http://localhost:5173
   - Network: http://[your-ip]:5173 (for other devices)

## Multi-Device Setup

To allow other devices on your network to access the chat:

1. **Start the web client with network access**
   ```bash
   cd web
   pnpm dev -- --host
   ```

2. **Find your network IP address**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

3. **Access from other devices**
   - Open a web browser on any device on the same network
   - Navigate to `http://[your-ip]:5173`

## Project Structure

```
chat_legora/
├── server/                 # Backend API server
│   ├── src/
│   │   ├── index.ts       # Express server setup
│   │   ├── db.ts          # Database configuration
│   │   ├── router.ts      # Main tRPC router
│   │   ├── routers/       # Individual route handlers
│   │   │   ├── auth.ts    # Authentication routes
│   │   │   ├── messages.ts # Message routes
│   │   │   └── threads.ts # Thread routes
│   │   ├── sse.ts         # Server-Sent Events
│   │   ├── trpc.ts        # tRPC configuration
│   │   └── types.ts       # TypeScript types
│   └── package.json
├── web/                   # Frontend React app
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ChatView.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   ├── Messaging.tsx
│   │   │   ├── NewThread.tsx
│   │   │   └── ThreadList.tsx
│   │   ├── App.tsx        # Main app component
│   │   ├── main.tsx       # App entry point
│   │   ├── trpc.ts        # tRPC client setup
│   │   └── styles.css     # Global styles
│   └── package.json
└── package.json           # Root package.json
```

## API Endpoints

- `POST /trpc/auth.register` - User registration
- `POST /trpc/auth.login` - User login
- `GET /trpc/threads.list` - List user's threads
- `POST /trpc/threads.create` - Create new thread
- `GET /trpc/messages.list` - List messages in thread
- `POST /trpc/messages.send` - Send message
- `GET /events` - Server-Sent Events stream

## Database Schema

- **users** - User accounts
- **threads** - Chat threads/conversations
- **thread_participants** - Many-to-many relationship between users and threads
- **messages** - Individual messages in threads

## Development

### Available Scripts

**Server:**
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server

**Web:**
- `pnpm dev` - Start development server
- `pnpm dev -- --host` - Start with network access
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build

### Database Reset

To reset the database and start fresh:

```bash
# Connect to PostgreSQL and reset
psql -d postgres -c "DROP DATABASE IF EXISTS chatlegora; CREATE DATABASE chatlegora;"

# Recreate schema (will happen automatically on server start)
cd server && pnpm dev
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with modern web technologies for optimal performance
- Real-time capabilities powered by Server-Sent Events
- Type-safe development with TypeScript and tRPC