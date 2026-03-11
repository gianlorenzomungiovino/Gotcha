# External Integrations

**Analysis Date:** 2026-03-11

## Database Integration

### PostgreSQL (Primary Storage)
- **Type**: Relational database
- **Driver**: pg-promise
- **Purpose**: Persistent storage for users, conversations, messages
- **Connection**: Environment variable `DATABASE_URL`
- **Features**:
  - Transaction support
  - Foreign key constraints
  - Indexes on frequently queried columns

### Connection Configuration
```javascript
// start/src/backend/db/index.js
const db = require('pg-promise')({
  // pg-promise specific options
});
```

## Authentication & Authorization

### JWT-Based Authentication
- **Provider**: Custom JWT implementation
- **Token Format**: JSON Web Tokens (JWT)
- **Storage**: Session storage (client-side)
- **Secret**: `JWT_SECRET` environment variable
- **Expiry**: Configurable token lifetime

### Password Security
- **Algorithm**: bcryptjs
- **Cost Factor**: 10 (configurable)
- **Hashing**: One-way hashing for password storage

## Real-Time Communication

### Socket.IO
- **Protocol**: WebSocket / fallback to long-polling
- **Room Management**: Conversation-based rooms (`conversation_${id}`)
- **Events**:
  - `new_message` → Broadcast to room participants
  - Custom event handling for chat operations
- **Reconnection**: Automatic reconnection with exponential backoff

## File Storage

### None (Current Implementation)
- Messages stored only in database
- No file uploads or attachments supported
- No external storage integration (S3, etc.)

## Third-Party Services

### Currently Integrated: None
The application is self-contained with no external API integrations:
- ❌ No email service (SendGrid, Mailgun)
- ❌ No analytics (Google Analytics, Mixpanel)
- ❌ No monitoring (Sentry, Datadog)
- ❌ No CDN integration
- ❌ No payment gateway

## Potential Future Integrations

| Service | Use Case | Complexity |
|---------|----------|------------|
| SendGrid/Mailgun | Email notifications for new messages | Medium |
| Sentry | Error tracking & monitoring | Low |
| Vercel/Netlify | Static hosting for frontend | Low |
| Supabase/Firebase | Alternative to PostgreSQL | Medium |
| Stripe/PayPal | Premium features monetization | High |

## Webhooks & Event Hooks

### Currently Implemented: None
- No webhook receivers configured
- No event-driven architecture beyond Socket.IO events

## API Endpoints (Internal)

The application exposes RESTful endpoints for CRUD operations:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/conversations` | List all conversations |
| POST | `/conversations/private` | Create private conversation |
| POST | `/conversations/group` | Create group conversation |
| GET | `/conversations/:id` | Get conversation details |
| DELETE | `/conversations/:id` | Delete conversation |
| GET | `/messages/:conversationId` | Get messages in conversation |
| POST | `/messages/:conversationId` | Send new message |
| DELETE | `/messages/:id` | Delete message |
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | User login |
| GET | `/auth/profile` | Get current user profile |
| DELETE | `/auth/delete` | Delete user account |

## Security Integrations

### Implemented
- JWT token validation on protected routes
- bcrypt password hashing
- CORS configuration (currently permissive - needs hardening)

### Missing
- Rate limiting (express-rate-limit)
- CSRF protection
- Helmet security headers
- Input sanitization layer

---

*Integrations audit: 2026-03-11*
