# Development Guide

## 🛠️ Development Setup

### Prerequisites

- **Node.js** 18.x or later
- **PostgreSQL** 14.x or later
- **Redis** (for queue management and caching)
- **MeiliSearch** (for search functionality)

### Environment Configuration

#### Frontend (.env)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=ws://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Server (.env)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/team_talk
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password
MEILISEARCH_URL=http://localhost:7700
NODE_ENV=development
```

### Installation Steps

#### 1. Clone and Install Dependencies

```bash
git clone https://github.com/yourusername/team-talk.git
cd team-talk

# Install frontend dependencies
cd frontend
npm install

# Install server dependencies
cd ../server
npm install
```

#### 2. Database Setup

```bash
cd server

# Generate Drizzle migrations
npm run db:generate

# Apply migrations to database
npm run db:push

# Optional: Seed with sample data
npm run db:seed
```

#### 3. Redis Setup

```bash
# Start Redis (Docker)
docker run -d --name redis -p 6379:6379 redis:7-alpine redis-server --requirepass yourpassword

# Or install locally on Ubuntu/WSL
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
```

#### 4. Start Development Servers

```bash
# Terminal 1: Start backend server
cd server
npm run dev

# Terminal 2: Queue worker
cd server && npm run start:worker

# Terminal 3: Frontend
cd frontend && npm run dev
```

### 🔍 Development Tools

#### Worker Monitoring

Access the development dashboard at: `http://localhost:5000/api/worker/dashboard`

#### Database Management

```bash
# View database
npm run db:studio

# Reset database
npm run db:reset

# Generate new migration
npm run db:generate

# View migration status
npm run db:status
```

#### Redis Management

```bash
# Connect to Redis CLI
redis-cli -a yourpassword

# View queue length
LLEN conversations:queue

# View online team leaders
HGETALL users:online_teamleaders

# View team leader basket
SMEMBERS tl:teamleader_id:basket

# View online agents
SMEMBERS users:online_agents
```

## 🏗️ Project Architecture

### State Management (Frontend)

The frontend uses **Zustand** with persistence for state management:

```typescript
// useUserStore.ts - User authentication, profile, and status
const useUserStore = create(
	persist(
		(set) => ({
			user: null,
			userStatus: "offline",
			setUser: (user) => set({ user }),
			setUserStatus: (status) => set({ userStatus: status }),
		}),
		{ name: "user-store" }
	)
);

// useUIStore.ts - UI state, basket management, conversation selection
const useUIStore = create(
	persist(
		(set) => ({
			selectedConversationId: "",
			basket: [], // Team leader's assigned conversations
			viewMode: "csr-inbox", // 'csr-inbox' | 'team-leader-multi' | 'single-conversation'
			setSelectedConversationId: (id) => set({ selectedConversationId: id }),
			addToBasket: (id) => set((state) => ({ basket: [...state.basket, id] })),
			removeFromBasket: (id) =>
				set((state) => ({
					basket: state.basket.filter((convId) => convId !== id),
				})),
		}),
		{ name: "ui-store" }
	)
);
```

### Queue Worker System

The worker system uses **adaptive polling** and **Redis pub/sub coordination**:

```typescript
class QueueWorker {
	private pollInterval = 1000; // Start at 1 second

	async processQueue() {
		// Process up to 5 assignments per cycle
		for (let i = 0; i < 5; i++) {
			const assignment = await this.assignNextConversation();
			if (!assignment) break;

			// Assign in database and publish event
			const success = await assignConversationToTeamleader(assignment, true);

			if (success) {
				// Speed up when busy
				this.pollInterval = Math.max(this.minInterval, this.pollInterval / 2);
			} else {
				// Rollback on failure
				await this.rollbackAssignment(assignment);
			}
		}

		if (processedCount === 0) {
			// Slow down when idle
			this.pollInterval = Math.min(this.maxInterval, this.pollInterval * 1.5);
		}
	}
}
```

### Socket Event System

Real-time updates use **Socket.IO** with **Redis pub/sub coordination**:

```typescript
// Server publishes assignment events to Redis for worker coordination
await redisClient.publish(
	"assignment_events",
	JSON.stringify({
		type: "assign_conversation",
		teamleaderId: assignment.teamleaderId,
		conversation: updatedConversation,
	})
);

// Assignment event handler subscribes and emits socket events
socket.to(`user_${teamleaderId}`).emit("assign_conversation", {
	conversation: updatedConversation,
});

// Frontend subscribes to socket events
socket.on("assign_conversation", (data) => {
	// Add to basket and update React Query cache
	useUIStore.getState().addToBasket(data.conversation.id);
	queryClient.setQueryData(
		["conversation", data.conversation.id],
		data.conversation
	);
});
```

## �� Testing Strategy

### Unit Tests

```bash
# Run frontend tests
cd frontend
npm test

# Run server tests
cd server
npm test

# Run worker tests
cd server
npm run test:worker
```

### Integration Tests

```bash
# Test queue assignment flow
cd server
npm run test:integration

# Test socket events
npm run test:sockets
```

### Manual Testing

#### Test CSR Support Request Flow

1. Start server and worker
2. Login as CSR agent
3. Create support conversation
4. Verify it appears in queue
5. Login as team leader and go online
6. Verify assignment in dashboard and UI

#### Test Real-time Updates

1. Open app in two browser tabs
2. Assign conversation in tab 1 (team leader)
3. Verify UI updates in tab 2
4. Test cross-tab synchronization

#### Test Error Scenarios

1. Stop Redis → Verify graceful degradation
2. Stop worker → Verify queue builds up
3. Team leader goes offline → Verify basket cleared and conversations returned to queue

## 🚀 Development Workflow

### Feature Development

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# ... development ...

# Test changes
npm test
npm run lint
npm run type-check

# Commit and push
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

### Database Changes

```bash
# Make schema changes in db/schema/
# Generate migration
npm run db:generate

# Test migration
npm run db:push

# Test rollback (if needed)
npm run db:rollback
```

### Worker Development

```bash
# Test worker locally
cd server
npx ts-node src/workers/index.ts

# Monitor worker performance
curl localhost:5000/api/worker/dashboard

# Debug worker issues
DEBUG=worker:* npx ts-node src/workers/index.ts
```

## 🐛 Debugging

### Common Issues

#### Worker Not Processing

```bash
# Check Redis connection
redis-cli -a yourpassword ping

# Check queue status
redis-cli -a yourpassword llen conversations:queue

# Check team leader availability
redis-cli -a yourpassword hgetall users:online_teamleaders

# Check worker logs
tail -f logs/worker.log
```

#### Socket Events Not Working

```bash
# Check Socket.IO connection
curl http://localhost:5000/socket.io/

# Monitor socket events
DEBUG=socket.io:* npm run dev

# Check Redis pub/sub
redis-cli -a yourpassword MONITOR

# Test assignment event handler
redis-cli -a yourpassword publish assignment_events '{"type":"test"}'
```

#### Database Connection Issues

```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1;"

# Check connection pool
# Look for connection limit errors in logs

# Reset database if needed
npm run db:reset
```

### Development Tools

#### Useful Commands

```bash
# Watch worker stats
watch -n 1 'curl -s localhost:5000/api/worker/health | jq'

# Monitor Redis operations
redis-cli -a yourpassword MONITOR

# Watch database queries (with Drizzle debug)
DEBUG=drizzle:query npm run dev

# Monitor socket connections
DEBUG=socket.io:* npm run dev

# Watch queue in real-time
watch -n 1 'redis-cli -a yourpassword llen conversations:queue'
```

#### VS Code Extensions

- **Drizzle Kit** - Database schema management
- **Redis** - Redis client integration
- **Socket.IO** - Socket event debugging
- **Thunder Client** - API testing

## 📝 Code Style

### TypeScript Configuration

- Strict mode enabled
- Path mapping for clean imports
- Shared types in `/shared` directory

### Socket Event Types

```typescript
// All socket events are properly typed in shared/socket-types.ts
interface ServerToClientEvents {
	assign_conversation: (data: { conversation: Conversation }) => void;
	update_conversation: (data: { conversation: Conversation }) => void;
	remove_from_basket: (data: { conversation_id: string }) => void;
	ack_status: (data: { success: boolean; status: UserStatus }) => void;
}

interface ClientToServerEvents {
	set_status: (data: { status: "online" | "offline" }) => void;
	authenticate: (data: { user: User }) => void;
	join_conversation: (data: { conversation_id: string }) => void;
}
```

### Linting Rules

```json
{
	"extends": ["next/core-web-vitals", "@typescript-eslint/recommended"],
	"rules": {
		"@typescript-eslint/no-unused-vars": "error",
		"prefer-const": "error",
		"no-console": "warn"
	}
}
```

### Commit Convention

```bash
# Format: type(scope): description
feat(worker): add adaptive polling
fix(ui): resolve basket sync issue
docs(readme): update setup instructions
test(queue): add assignment flow tests
```

## 🔧 Performance Tips

### Frontend Optimization

- Use React Query for server state caching
- Implement proper loading states for CSR/team leader views
- Optimize bundle size with code splitting
- Use Zustand persist selectively (user and UI state only)

### Backend Optimization

- Use Redis Lua scripts for atomic queue operations
- Implement database connection pooling
- Cache team leader status in Redis hash
- Use Socket.IO rooms for targeted message delivery

### Worker Optimization

- Monitor queue length and adjust polling frequency
- Use batch processing (up to 5 assignments per cycle)
- Implement graceful rollback for failed assignments
- Log performance metrics for tuning

### Socket.IO Best Practices

- Use room-based messaging (`user_${userId}` rooms)
- Minimize event payload size
- Implement proper error handling for disconnections
- Use typed events for better development experience
