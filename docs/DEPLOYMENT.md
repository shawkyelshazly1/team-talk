# Deployment Guide

## 🚀 Production Deployment

### Prerequisites

- **Node.js** 18.x or later
- **PostgreSQL** 14.x or later
- **Redis** 6.x or later (with AUTH enabled)
- **MeiliSearch** 1.x or later
- **Process Manager** (PM2 recommended)

## 📋 Environment Setup

### Frontend Environment (.env)

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_WS_URL=wss://your-api-domain.com
NEXT_PUBLIC_APP_URL=https://your-app-domain.com
```

### Server Environment (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/team_talk

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_secure_redis_password

# Search
MEILISEARCH_URL=http://localhost:7700
MEILISEARCH_API_KEY=your_meilisearch_key

# Security
JWT_SECRET=your_jwt_secret_key
NEXTAUTH_SECRET=your_nextauth_secret

# Application
NODE_ENV=production
PORT=5000
```

## 🔧 Worker Management

### Option 1: PM2 (Recommended)

#### Install PM2

```bash
npm install -g pm2
```

#### Create PM2 Ecosystem File

```javascript
// ecosystem.config.js
module.exports = {
	apps: [
		{
			name: "team-talk-server",
			script: "dist/index.js",
			cwd: "./server",
			instances: 2,
			exec_mode: "cluster",
			env: {
				NODE_ENV: "production",
				PORT: 5000,
			},
		},
		{
			name: "queue-worker",
			script: "dist/workers/index.js",
			cwd: "./server",
			instances: 1,
			exec_mode: "fork",
			env: {
				NODE_ENV: "production",
			},
			restart_delay: 5000,
			max_restarts: 10,
		},
	],
};
```

#### Deploy with PM2

```bash
# Build the application
npm run build

# Start services
pm2 start ecosystem.config.js

# Monitor services
pm2 monit

# View logs
pm2 logs queue-worker
pm2 logs team-talk-server

# Save PM2 configuration
pm2 save
pm2 startup
```

### Option 2: systemd Service

#### Create Service Files

**Main Server Service** (`/etc/systemd/system/team-talk-server.service`):

```ini
[Unit]
Description=Team Talk Server
After=network.target postgresql.service redis.service

[Service]
Type=simple
User=teamtalk
WorkingDirectory=/opt/team-talk/server
Environment=NODE_ENV=production
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=team-talk-server

[Install]
WantedBy=multi-user.target
```

**Queue Worker Service** (`/etc/systemd/system/team-talk-worker.service`):

```ini
[Unit]
Description=Team Talk Queue Worker
After=network.target redis.service postgresql.service

[Service]
Type=simple
User=teamtalk
WorkingDirectory=/opt/team-talk/server
Environment=NODE_ENV=production
ExecStart=/usr/bin/node dist/workers/index.js
Restart=always
RestartSec=5
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=team-talk-worker

[Install]
WantedBy=multi-user.target
```

#### Enable and Start Services

```bash
# Enable services
sudo systemctl enable team-talk-server
sudo systemctl enable team-talk-worker

# Start services
sudo systemctl start team-talk-server
sudo systemctl start team-talk-worker

# Check status
sudo systemctl status team-talk-server
sudo systemctl status team-talk-worker

# View logs
sudo journalctl -u team-talk-worker -f
sudo journalctl -u team-talk-server -f
```

### Option 3: Docker Deployment

#### Dockerfile

```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

# Build server
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --only=production

COPY server/ ./
RUN npm run build

# Production image
FROM node:18-alpine AS production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S teamtalk -u 1001

WORKDIR /app/server
COPY --from=builder --chown=teamtalk:nodejs /app/server/dist ./dist
COPY --from=builder --chown=teamtalk:nodejs /app/server/node_modules ./node_modules
COPY --from=builder --chown=teamtalk:nodejs /app/server/package.json ./package.json

USER teamtalk
EXPOSE 5000

# Default to server, override for worker
CMD ["node", "dist/index.js"]
```

#### Docker Compose

```yaml
version: "3.8"

services:
  server:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - REDIS_PASSWORD=${REDIS_PASSWORD}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  worker:
    build: .
    command: ["node", "dist/workers/index.js"]
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - REDIS_PASSWORD=${REDIS_PASSWORD}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: team_talk
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

## 📊 Worker Monitoring

### Built-in Dashboard

Access the monitoring dashboard at: `https://your-domain.com/api/worker/dashboard`

### Health Check Endpoint

```bash
# Check worker health
curl https://your-domain.com/api/worker/health

# Expected response
{
  "status": "healthy",
  "queueLength": 0,
  "onlineTeamLeaders": 3,
  "uptime": "2h 45m",
  "processed": 1247
}
```

### Performance Metrics

Monitor these key metrics:

- **Queue Length**: Should stay low (< 10)
- **Processing Rate**: Assignments per minute
- **Error Rate**: Failed assignments percentage
- **Response Time**: Time from queue to assignment
- **Team Leader Availability**: Online team leaders count

### Alerts Setup

Set up alerts for:

```bash
# High queue length
if queue_length > 50 then alert "High queue backlog"

# No team leaders online
if online_team_leaders == 0 then alert "No team leaders available"

# Worker down
if worker_last_seen > 60s then alert "Worker not responding"

# High error rate
if error_rate > 10% then alert "High assignment failure rate"
```

## 🔒 Security Checklist

### Environment Security

- ✅ All secrets in environment variables
- ✅ Redis password authentication enabled
- ✅ Database connection encrypted (SSL)
- ✅ JWT secrets are cryptographically secure

### Network Security

- ✅ Firewall rules restrict database/Redis access
- ✅ HTTPS/WSS for all client communication
- ✅ VPN or private network for service communication

### Application Security

- ✅ Input validation on all endpoints
- ✅ Rate limiting enabled
- ✅ CORS configured properly
- ✅ Helmet.js for security headers

## 🚀 Scaling Considerations

### Horizontal Scaling

**Multiple Workers**:

```bash
# Run multiple worker instances
pm2 start dist/workers/index.js -i 3 --name queue-worker
```

**Load Balancing**:

```nginx
upstream team_talk_backend {
    server localhost:5000;
    server localhost:5001;
    server localhost:5002;
}
```

### Vertical Scaling

**Redis Optimization**:

- Increase `maxmemory` for larger queues
- Enable `maxmemory-policy allkeys-lru`
- Use Redis clustering for high availability

**Database Optimization**:

- Connection pooling (max 20-30 connections)
- Read replicas for analytics queries
- Proper indexing on conversation status

## 🛠️ Troubleshooting

### Common Issues

**Worker not processing**:

```bash
# Check Redis connection
redis-cli -a $REDIS_PASSWORD ping

# Check queue length
redis-cli -a $REDIS_PASSWORD llen conversations:queue

# Restart worker
pm2 restart queue-worker
```

**High memory usage**:

```bash
# Check Node.js memory
pm2 show queue-worker

# Monitor Redis memory
redis-cli -a $REDIS_PASSWORD info memory
```

**Database connection errors**:

```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1;"

# Check connection pool
# Look for "connection pool exhausted" errors
```

### Monitoring Commands

```bash
# Real-time worker stats
watch -n 1 'curl -s localhost:5000/api/worker/health | jq'

# Redis queue monitoring
watch -n 1 'redis-cli -a $REDIS_PASSWORD llen conversations:queue'

# System resources
htop
```
