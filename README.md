# Team Talk

<div align="center">
  <img src="https://i.ibb.co/XrsmVjHC/team-talk-logo.png" alt="Team Talk Logo" width="200"/>
  
  <p>A modern, real-time team communication platform with autonomous queue assignment</p>

  <div>
    <img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/>
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
    <img src="https://img.shields.io/badge/Zustand-FF6B6B?style=for-the-badge&logo=react&logoColor=white" alt="Zustand"/>
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind"/>
    <img src="https://img.shields.io/badge/Drizzle-000000?style=for-the-badge&logo=drizzle&logoColor=white" alt="Drizzle"/>
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
    <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis"/>
  </div>
</div>

## ✨ Features

- 💬 Real-time messaging with WebSocket integration
- 🤖 **Autonomous queue assignment system** with background workers
- 🗂️ Smart conversation management with basket/queue system
- 📊 **Real-time worker monitoring dashboard**
- 🔄 **Redis pub/sub event system** for instant responsiveness
- 🔐 Secure user authentication and authorization
- 📚 Historical conversation tracking and search
- 🟢 Live user status monitoring with cross-tab sync
- 🔗 URL-based conversation routing
- 📱 Responsive design for all devices
- 🎨 Modern UI with Tailwind CSS

## 🏗️ Project Structure

```
team-talk/
├── frontend/                # Next.js frontend application
│   ├── src/
│   │   ├── app/            # Next.js app router pages
│   │   ├── components/     # Reusable UI components
│   │   ├── lib/            # Utility functions and configurations
│   │   ├── providers/      # Context providers & store initializers
│   │   ├── stores/         # Zustand state management
│   │   │   ├── useUserStore.ts     # User state & persistence
│   │   │   ├── useUIStore.ts       # UI state & basket management
│   │   │   └── useSocketStore.ts   # Socket connection state
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services & socket managers
│   │   └── utils/          # Helper functions
│   └── public/             # Static assets
│
└── server/                  # Node.js backend application
    ├── src/
    │   ├── db/             # Database schema and connections
    │   ├── routers/        # API route handlers
    │   ├── handlers/       # Business logic
    │   ├── middlewares/    # Request middleware
    │   ├── repos/          # Data access layer
    │   ├── services/       # Core business services
    │   ├── workers/        # 🆕 Queue assignment workers
    │   │   ├── queueWorker.ts      # Main worker class
    │   │   └── index.ts            # Production worker entry
    │   ├── utils/          # Helper functions & worker stats
    │   ├── lib/            # Core utilities
    │   ├── meilisearch/    # Search functionality
    │   └── redis/          # Caching layer & queue management
    └── drizzle/            # Database migrations
```

## 🤖 Queue Assignment Architecture

### Overview

The system uses an **autonomous background worker** that continuously processes conversation assignments without manual triggers:

```
CSR Creates Conversation → Redis Queue → Background Worker → Assignment → Database + Socket Events
                              ↓              ↓                   ↓              ↓
                         (conversations:   (Lua Script)    (Team Leader)   (Real-time UI)
                          queue)          (FIFO + Load      (Basket)        (Updates)
                                          Balancing)
```

### Key Components

#### 1. **Redis Data Structures**

```redis
conversations:queue              # LIST - FIFO conversation queue
users:online_teamleaders        # HASH - team leader ID → available slots
tl:{teamleaderId}:basket        # SET - assigned conversation IDs per team leader
```

#### 2. **Background Worker Features**

- **Adaptive Polling**: Speeds up when busy (100ms), slows down when idle (30s)
- **Atomic Assignment**: Lua scripts ensure race-condition-free assignment
- **Load Balancing**: Assigns to team leader with most available slots
- **Database Integration**: Updates PostgreSQL and triggers socket events
- **Event-Driven**: Redis pub/sub for instant response to team leader status changes

#### 3. **Pub/Sub Events**

```typescript
// Conversation assigned → UI updates in real-time
channel.publish("conversation:assigned", { conversationId, teamleaderId });
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- PostgreSQL 14.x or later
- Redis (for caching and queue management)
- MeiliSearch (for search functionality)

### Environment Variables

Create `.env` files in both frontend and server directories:

```env
# Frontend (.env)
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=ws://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Server (.env)
DATABASE_URL=postgresql://user:password@localhost:5432/team_talk
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password
MEILISEARCH_URL=http://localhost:7700
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/team-talk.git
cd team-talk
```

2. Install dependencies:

```bash
# Install frontend dependencies
cd frontend
npm install

# Install server dependencies
cd ../server
npm install
```

3. Set up the database:

```bash
cd server
npm run db:generate  # Generate migrations
npm run db:push     # Apply migrations
```

4. Start the services:

```bash
# 1. Start the backend server
cd server
npm run start:dev

# 2. Start the queue worker (in a separate terminal)
cd server
npx ts-node src/workers/index.ts

# 3. Start the frontend server (in another terminal)
cd frontend
npm run dev
```

### 🎛️ Worker Monitoring

Access the worker dashboard at: `http://localhost:5000/api/worker/dashboard`

**Features:**

- Real-time queue status
- Team leader availability
- Processing statistics
- Auto-refresh every 5 seconds
- System health monitoring

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Real-time**: WebSocket + React Query
- **Authentication**: BetterAuth

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Drizzle
- **Caching**: Redis (with queue management)
- **Search**: MeiliSearch
- **Real-time**: WebSocket + Redis Pub/Sub
- **Queue Workers**: Background processing with Lua scripts

## 🔧 Worker Management

### Production Deployment

```bash
# Option 1: PM2 (Recommended)
npm install -g pm2
pm2 start src/workers/index.ts --name queue-worker --interpreter ts-node

# Option 2: systemd service
sudo cp worker.service /etc/systemd/system/
sudo systemctl enable queue-worker
sudo systemctl start queue-worker

# Option 3: Docker
docker run -d --name queue-worker your-app:latest node dist/workers/index.js
```

### Worker Statistics

Monitor worker performance:

- **Processed assignments**: Total successful assignments
- **Error rate**: Failed assignment attempts
- **Current interval**: Adaptive polling speed
- **Queue depth**: Pending conversations
- **Team leader availability**: Online team leaders and slots

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Tailwind CSS](https://tailwindcss.com/)
- [BetterAuth](https://better-auth.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Redis](https://redis.io/)

## 🗺 Roadmap

- [x] User status monitoring and presence system
- [x] Smart conversation routing and assignment
- [x] **Autonomous queue worker with Redis pub/sub**
- [x] **Worker monitoring dashboard**
- [x] **Cross-tab state synchronization**
- [ ] Real-time messaging for team leads
- [ ] Real-time messaging for customer service representatives
- [ ] Automatic conversation reassignment for inactive chats
- [ ] Comprehensive conversation history and analytics
- [ ] Live performance metrics dashboard
- [ ] Team lead intervention in unassigned conversations
- [ ] Conversation priority queuing
- [ ] SLA monitoring and alerts
- [ ] Worker auto-scaling based on queue depth
- [ ] Improve UI responsiveness

## 🐛 Issues

- [ ] Refactor teamleader status management to remove unnecessary conversation_id parameter in online/offline state transitions
- [ ] Fix removing assignee on conversation assignment, handle in better logic
