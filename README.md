# Team Talk

<div align="center">
  <img src="public/logo.png" alt="Team Talk Logo" width="200"/>
  
  <p>A modern, real-time team communication platform built with Next.js</p>

  <div>
    <img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/>
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
    <img src="https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white" alt="Redux"/>
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind"/>
    <img src="https://img.shields.io/badge/Drizzle-000000?style=for-the-badge&logo=drizzle&logoColor=white" alt="Drizzle"/>
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  </div>
</div>

## ✨ Features

- 💬 Real-time messaging with WebSocket integration
- 🗂️ Smart conversation management with basket/queue system
- 🔐 Secure user authentication and authorization
- 📚 Historical conversation tracking and search
- 🟢 Live user status monitoring
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
│   │   ├── lib/           # Utility functions and configurations
│   │   ├── providers/     # Context providers
│   │   ├── stores/        # State management
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   └── utils/         # Helper functions
│   └── public/            # Static assets
│
└── server/                 # Node.js backend application
    ├── src/
    │   ├── db/            # Database schema and connections
    │   ├── routers/       # API route handlers
    │   ├── handlers/      # Business logic
    │   ├── middlewares/   # Request middleware
    │   ├── repos/         # Data access layer
    │   ├── utils/         # Helper functions
    │   ├── lib/           # Core utilities
    │   ├── meilisearch/   # Search functionality
    │   └── redis/         # Caching layer
    └── drizzle/           # Database migrations
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- PostgreSQL 14.x or later
- Redis (for caching)
- MeiliSearch (for search functionality)

### Environment Variables

Create `.env` files in both frontend and server directories:

```env
# Frontend (.env)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Server (.env)
DATABASE_URL=postgresql://user:password@localhost:5432/team_talk
REDIS_URL=redis://localhost:6379
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

4. Start the development servers:

```bash
# Start the backend server
cd server
npm run start:dev

# Start the frontend server
cd frontend
npm run dev
```

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Real-time**: WebSocket
- **Authentication**: BetterAuth

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Drizzle
- **Caching**: Redis
- **Search**: MeiliSearch
- **Real-time**: WebSocket

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

## 🗺 Roadmap

- [x] User status monitoring and presence system
- [x] Smart conversation routing and assignment
- [ ] Build worker dashboard for monitoring queue assignment
- [ ] Real-time messaging for team leads
- [ ] Real-time messaging for customer service representatives
- [ ] Automatic conversation reassignment for inactive chats
- [ ] Comprehensive conversation history and analytics
- [ ] Live performance metrics dashboard
- [ ] Team lead intervention in unassigned conversations
- [ ] Conversation priority queuing
- [ ] SLA monitoring and alerts
- [ ] Improve UI responsiveness

## 🐛 Issues

- [ ] Refactor teamleader status management to remove unnecessary conversation_id parameter in online/offline state transitions
- [ ] Fix removing assignee on conversation assignment, handle in better logic
