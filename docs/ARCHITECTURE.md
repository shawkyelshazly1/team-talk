# Team Talk Architecture

## 🤖 Queue Assignment System

### Overview

Team Talk enables **CSR agents to get real-time support from team leaders** through an autonomous queue assignment system. When agents create support requests, they're automatically routed to available team leaders without manual intervention.

```
CSR Creates Support Request → Redis Queue → Background Worker → Assignment → Database + Socket Events
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
users:online_agents             # SET - online CSR agent IDs
```

#### 2. **Background Worker Features**

- **Adaptive Polling**: Speeds up when busy (100ms), slows down when idle (30s)
- **Atomic Assignment**: Lua scripts ensure race-condition-free assignment
- **Load Balancing**: Assigns to team leader with most available slots (max 4 per team leader)
- **Database Integration**: Updates PostgreSQL and triggers socket events
- **Worker Coordination**: Redis pub/sub for worker-to-server communication

#### 3. **Assignment Algorithm**

The worker uses a **Lua script for atomic operations**:

1. **Pop conversation** from queue (LPOP)
2. **Find team leader** with most available slots (HGETALL)
3. **Assign conversation** to chosen team leader
4. **Update Redis** counters atomically
5. **Trigger database** update and socket events

#### 4. **Pub/Sub Events**

```typescript
// Conversation assigned → UI updates
channel.publish("conversation:assigned", { conversationId, teamleaderId });
```

## 🏗️ Detailed Project Structure

### Frontend Architecture

```
frontend/src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── app/               # Team leader multi-conversation view
│   ├── inbox/             # CSR agent inbox view
│   ├── conversation/[id]  # Single conversation view
│   └── layout.tsx         # Root layout
│
├── components/            # UI Components
│   ├── app/               # Application-specific components
│   │   ├── common/        # Shared components (messages, cards)
│   │   ├── queue/         # Queue management components
│   │   └── conversation/  # Conversation components
│   ├── layout/            # Layout components (status selector)
│   └── ui/                # Base UI components
│
├── stores/                # Zustand State Management
│   ├── useUserStore.ts    # User state, authentication, status
│   ├── useUIStore.ts      # UI state, basket, conversation selection
│   └── useSocketStore.ts  # Socket connection state
│
├── hooks/                 # Custom React Hooks
│   ├── use-socket-connection.ts  # Socket connection management
│   ├── use-conversation-rooms.ts # Room join/leave logic
│   └── use-basket.ts            # Basket operations for team leaders
│
├── services/              # External Services
│   ├── socketService.ts   # Socket emission functions
│   ├── socketEventService.ts # Socket event handlers
│   └── api.ts             # REST API client
│
└── providers/             # Context Providers
    └── UserStoreInitializer.tsx  # Store initialization
```

### Backend Architecture

```
server/src/
├── db/                    # Database Layer
│   ├── schema/            # Drizzle schema definitions
│   └── connection.ts      # Database connection
│
├── routers/               # API Routes
│   ├── auth.ts            # Authentication endpoints
│   ├── conversation.ts    # Conversation CRUD
│   ├── user.ts            # User management
│   └── monitoring.ts      # Worker monitoring endpoints
│
├── services/              # Business Logic
│   ├── conversation.ts    # Conversation operations & assignment
│   ├── user.ts            # User operations
│   └── assignmentEventHandler.ts # Redis pub/sub event handler
│
├── workers/               # Queue Processing
│   ├── queueWorker.ts     # Main worker class with adaptive polling
│   └── index.ts           # Production entry point
│
├── socketio/              # Real-time Layer
│   ├── listeners/         # Socket event listeners
│   │   ├── user.ts        # User status and authentication
│   │   └── conversation.ts # Conversation room management
│   └── types.ts           # Socket type definitions
│
├── redis/                 # Redis Layer
│   ├── connection.ts      # Redis client
│   ├── utils.ts           # Redis operations (baskets, queues)
│   └── pubsub.ts          # Pub/sub handling
│
├── repos/                 # Data Access Layer
│   ├── conversation.ts    # Conversation database operations
│   └── user.ts            # User database operations
│
└── utils/                 # Utilities
    ├── workerStats.ts     # Worker monitoring statistics
    └── verifyConnections.ts # Health checks
```

## 🔄 Data Flow

### 1. **CSR Support Request Flow**

```
CSR creates conversation → API validation → Database insert → Redis queue add → Worker processes
```

### 2. **Assignment Flow**

```
Worker polls → Finds conversation + available team leader → Atomic assignment → Database update → Redis pub/sub → Socket event to team leader
```

### 3. **Real-time Updates Flow**

```
Status change → Socket event → Frontend store update → UI refresh → Cross-tab sync via localStorage
```

### 4. **Team Leader Status Management**

```
Team leader goes online → Redis update → Worker processes pending queue
Team leader goes offline → Clear basket → Return conversations to queue
```

## 🚀 Performance Considerations

### **Redis Optimization**

- **Lua scripts** for atomic queue operations
- **Hash structures** for team leader status tracking
- **Set operations** for basket management
- **Pub/sub channels** for worker coordination

### **Database Optimization**

- **Indexed queries** on conversation status and assignee
- **Batch operations** for conversation updates
- **Connection pooling** with Drizzle
- **Optimistic updates** on frontend

### **Worker Optimization**

- **Adaptive polling** reduces Redis load when idle
- **Batch processing** (up to 5 assignments per cycle)
- **Graceful rollback** on assignment failures
- **Health monitoring** with statistics

### **Socket.IO Optimization**

- **Room-based messaging** for targeted updates
- **Event consolidation** to minimize network traffic
- **Connection pooling** for high concurrency
- **Cross-tab coordination** to prevent duplicate connections

## 🔒 Security Considerations

### **Authentication**

- **Socket authentication** before joining user rooms
- **Role-based access** (CSR vs Team Leader)
- **Session validation** on each socket event

### **Real-time Security**

- **Room access control** based on user roles
- **Event validation** before processing
- **Rate limiting** on status changes

### **Data Protection**

- **Environment variables** for all secrets
- **Redis AUTH** for cache security
- **Database connection encryption**

## 📊 Monitoring & Observability

### **Worker Metrics**

- **Queue length** monitoring
- **Assignment success rate**
- **Team leader availability**
- **Processing latency**

### **Real-time Metrics**

- **Socket connection count**
- **Event emission rates**
- **Room membership tracking**
- **Cross-tab sync effectiveness**

### **Business Metrics**

- **Average response time** for CSR requests
- **Team leader workload distribution**
- **Conversation completion rates**
- **Peak usage patterns**
