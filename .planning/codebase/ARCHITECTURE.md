# Architecture

**Analysis Date:** 2026-03-11

## Pattern Overview

### Architectural Style: Modular Monolith
The application follows a **modular monolith** pattern with clear separation between backend API and frontend SPA.

```
┌─────────────────────────────────────────────────────────┐
│                    React SPA (Frontend)                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Login     │  │  Chat UI    │  │ CreateChat  │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                    ▲              ▲
                    │ HTTP/WS      │ Socket.IO
                    │              │
┌───────────────────┴──────────────┴──────────────────────┐
│              Express API Server (Backend)                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Routes    │  │   Sockets   │  │      DB     │     │
│  │  (REST API) │  │  (Real-time)│  │  (PostgreSQL)│    │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
```

## Layered Architecture

### Presentation Layer (Frontend)
- **Framework**: React 18 + ReactDOM
- **Components**: Functional components with hooks
- **State Management**: Local component state, no global store
- **Routing**: Client-side routing via React Router (implicit in structure)
- **Styling**: Tailwind CSS utility classes

### Application Layer (Backend Routes)
- **Framework**: Express.js v5.x
- **Pattern**: Route-based controllers
- **Location**: `start/src/backend/routes/`
- **Structure**:
  ```
  routes/
  ├── auth.js        # Authentication endpoints
  ├── conversation.js # Conversation CRUD
  ├── messages.js    # Message operations
  └── index.js       # Route aggregation
  ```

### Real-Time Layer (Socket.IO)
- **Framework**: Socket.IO v4.x
- **Location**: `start/src/backend/sockets/`
- **Pattern**: Event-driven handlers
- **Structure**:
  ```
  sockets/
  └── chat.js        # Chat room event handlers
  ```

### Data Access Layer
- **ORM/ODM**: pg-promise (query builder)
- **Database**: PostgreSQL
- **Location**: `start/src/backend/db/`
- **Pattern**: Repository-style queries with connection pooling

## Data Flow

### REST API Flow
```
Client Request → Express Router → Route Handler → DB Query → Response
```

### Socket.IO Flow
```
Client Event → Socket.IO Server → Room Broadcast → Connected Clients
```

### Authentication Flow
```
Login Request → JWT Generation → Token Storage → Protected Routes → Token Validation
```

## Entry Points

### Frontend Entry
- **File**: `start/src/frontend/index.html`
- **Bundled by**: Vite
- **Served by**: Express static middleware

### Backend Entry
- **File**: `start/src/backend/server.js`
- **Port**: 3001 (configurable via env)
- **Routes**: Mounted at `/api` prefix
- **Socket.IO**: Mounted at `/socket.io`

## Module Boundaries

### Backend Modules
| Module | Responsibility | Location |
|--------|----------------|----------|
| `auth` | User registration, login, profile | `routes/auth.js` |
| `conversation` | Conversation CRUD operations | `routes/conversation.js` |
| `messages` | Message send/retrieve/delete | `routes/messages.js` |
| `chat` | Real-time messaging events | `sockets/chat.js` |
| `db` | Database connection & queries | `db/index.js` |

### Frontend Modules
| Module | Responsibility | Location |
|--------|----------------|----------|
| `Login` | User authentication UI | `componenti/login.jsx` |
| `Register` | User registration UI | `componenti/Register.jsx` |
| `CreateChat` | New conversation creation | `componenti/CreateChat.jsx` |
| `App` | Root component & routing | `App.jsx` |

## Abstractions

### Database Abstraction
- **Layer**: pg-promise query builder
- **Abstraction Level**: SQL-like syntax with promise support
- **Transaction Support**: Built-in transaction management

### Authentication Abstraction
- **Token Format**: JWT (JSON Web Tokens)
- **Validation**: Middleware-based token verification
- **Session Storage**: Browser sessionStorage

### Real-Time Abstraction
- **Protocol**: Socket.IO protocol
- **Room Management**: Namespace-based rooms
- **Broadcast Pattern**: Room-based message distribution

## Scalability Considerations

### Current Limitations
- Single Express instance (no clustering)
- No Redis adapter for Socket.IO (session loss on restart)
- Database connection pool size not tuned for high load

### Potential Improvements
- Horizontal scaling with multiple backend instances
- Redis adapter for Socket.IO session persistence
- Message queue for async operations (email notifications)
- CDN for static asset delivery

## Deployment Architecture

### Current Setup
```
┌─────────────────┐
│   Frontend SPA  │ ← Served by Express static middleware
└────────┬────────┘
         │
┌────────▼────────┐
│   Express API   │ ← Single instance
│   + Socket.IO   │
└────────┬────────┘
         │
┌────────▼────────┐
│  PostgreSQL DB  │ ← Single instance
└─────────────────┘
```

### Recommended Production Setup
```
┌─────────────────┐     ┌─────────────────┐
│   CDN/Static    │     │   Load Balancer  │
│   Host (Vercel) │────▶│                 │
└─────────────────┘     └────────┬────────┘
                                │
                    ┌───────────▼───────────┐
                    │   Express Cluster      │
                    │   (multiple instances) │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │   PostgreSQL + Replicas│
                    └────────────────────────┘
```

## Technology Decisions

### Why Express?
- Lightweight, flexible framework
- Large ecosystem of middleware
- Easy to learn and extend

### Why Socket.IO?
- Robust real-time communication
- Automatic reconnection logic
- Room management built-in

### Why PostgreSQL?
- ACID compliance
- Relational data model fits use case
- Strong typing with pg-promise

### Why React?
- Component-based architecture
- Large ecosystem
- Virtual DOM for performance

---

*Architecture audit: 2026-03-11*
