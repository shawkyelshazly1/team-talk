# Team Talk

<div align="center">
  <img src="https://i.ibb.co/XrsmVjHC/team-talk-logo.png" alt="Team Talk Logo" width="200"/>
  
  <p>Internal customer service support platform with autonomous queue assignment</p>

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

## 📖 What is Team Talk?

Team Talk is an **internal customer service support platform** that enables CSR agents to get real-time help from team leaders when handling complex customer inquiries.

**The Problem:** Customer service agents traditionally use Chat Apps for internal support, which lacks:

- ❌ Message tracking and metrics
- ❌ Thread management for unanswered requests
- ❌ Queue visibility and workload distribution
- ❌ Performance analytics for remote teams

**The Solution:** A dedicated platform that automatically routes agent requests to available team leaders with full visibility and tracking.

**Perfect for:** Remote customer service teams, help desk operations, distributed support organizations

## ✨ Features

- 💬 **Real-time internal messaging** between CSR agents and team leaders
- 🤖 **Autonomous queue assignment** - instant routing to available team leaders
- 🗂️ **Smart conversation management** with team leader baskets (max 4 conversations)
- 📊 **Real-time monitoring dashboard** for queue operations and metrics
- 🔄 **Event-driven updates** with Socket.IO for instant responsiveness
- 🔐 **Secure authentication** with role-based access (CSR vs Team Leader)
- 📚 **Conversation history** tracking for performance analysis
- 🟢 **Live user status** monitoring with cross-tab synchronization
- 🔗 **URL-based routing** for conversation navigation
- 📱 **Responsive design** optimized for remote work environments
- 🛡️ **Auto-cleanup system** with TTL expiration and graceful shutdown handling

## 🚀 Quick Start

### 1. **Clone & Install**

```bash
git clone https://github.com/yourusername/team-talk.git
cd team-talk

# Install dependencies (both frontend and server)
npm install
```

### 2. **Environment Setup**

```bash
# Copy environment templates
cp frontend/.env.example frontend/.env
cp server/.env.example server/.env

# Configure your database and Redis URLs in the .env files
```

### 3. **Database Setup**

```bash
cd server
npm run db:generate  # Generate migrations
npm run db:push      # Apply to database
```

### 4. **Start Development**

```bash
# Terminal 1: Backend server
cd server && npm run dev

# Terminal 2: Queue worker
cd server && npx ts-node src/workers/index.ts

# Terminal 3: Frontend
cd frontend && npm run dev
```

🎛️ **Monitor**: Visit `http://localhost:5000/api/worker/dashboard` to see the queue system in action!

## 🏗️ Project Structure

```
team-talk/
├── frontend/                    # Next.js frontend application
│   ├── src/
│   │   ├── app/                # Next.js app router pages
│   │   │   ├── app/           # Team leader routes (/app, /app/inbox, etc.)
│   │   │   ├── layout.tsx     # Root layout
│   │   │   └── page.tsx       # Landing page
│   │   ├── components/         # Reusable UI components
│   │   ├── stores/            # Zustand state management
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # Socket events & API services
│   │   └── lib/               # Utilities and configurations
│   └── public/                # Static assets
│
├── server/                     # Node.js backend application
│   ├── src/
│   │   ├── workers/           # 🤖 Queue assignment workers
│   │   ├── services/          # Core business services
│   │   ├── socketio/          # Real-time event handlers
│   │   ├── db/                # Database schema and connections
│   │   ├── redis/             # Caching layer & queue management
│   │   ├── routers/           # API route handlers
│   │   └── main.ts            # Application entry point
│   └── docs/                  # Documentation
│
└── shared/                     # Shared TypeScript types
    ├── types.ts               # Common data types
    └── socket-types.ts        # Socket event types
```

## 📖 Documentation

- **[Architecture Guide](docs/ARCHITECTURE.md)** - Queue system and technical details
- **[Development Guide](docs/DEVELOPMENT.md)** - Setup and development workflow
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment and monitoring

## 🛠️ Tech Stack

### **Frontend**

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Real-time**: Socket.IO + React Query

### **Backend**

- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Queue System**: Redis with background workers
- **Real-time**: Socket.IO with Redis pub/sub
- **Search**: MeiliSearch integration

### **Infrastructure**

- **Queue Processing**: Autonomous workers with adaptive polling
- **Event System**: Socket.IO events with Redis pub/sub for worker coordination
- **State Persistence**: Zustand with localStorage sync
- **Monitoring**: Built-in dashboard with health checks

## 🤝 Contributing

We welcome contributions! Please see our [Development Guide](docs/DEVELOPMENT.md) for setup instructions.

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 🗺️ Roadmap

### **✅ Completed**

- [x] User status monitoring and presence system
- [x] Smart conversation routing and assignment
- [x] **Autonomous queue worker with Redis coordination**
- [x] **Worker monitoring dashboard**
- [x] **Cross-tab state synchronization**

### **🚧 In Progress**

- [ ] Real-time messaging for team leads
- [ ] Real-time messaging for customer service representatives

### **📋 Planned**

- [ ] Automatic conversation reassignment for inactive chats
- [ ] Comprehensive conversation history and analytics
- [ ] Team lead intervention in unassigned conversations
- [ ] Conversation priority queuing
- [ ] SLA monitoring and alerts
- [ ] Worker auto-scaling based on queue depth

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [Redis](https://redis.io/) - In-memory data structure store
- [Socket.IO](https://socket.io/) - Real-time communication

## 🐛 Issues

- [ ] Refactor teamleader status management to remove unnecessary conversation_id parameter in online/offline state transitions
- [ ] Fix removing assignee on conversation assignment, handle in better logic

<div align="center">
  <p>Built with ❤️ for remote customer service teams</p>
</div>
