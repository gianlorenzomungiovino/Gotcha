# Directory Structure

**Analysis Date:** 2026-03-11

## Root Level

```
Gotcha/
├── .git/                    # Git repository metadata
├── start/                   # Main application directory
│   ├── src/                 # Source code
│   │   ├── backend/         # Express API server
│   │   │   ├── db/         # Database connection & schema
│   │   │   │   └── index.js    # pg-promise setup
│   │   │   ├── routes/      # REST API route handlers
│   │   │   │   ├── auth.js     # Authentication endpoints
│   │   │   │   ├── conversation.js  # Conversation CRUD
│   │   │   │   ├── messages.js   # Message operations
│   │   │   │   └── index.js     # Route aggregation
│   │   │   ├── sockets/      # Socket.IO event handlers
│   │   │   │   └── chat.js    # Real-time chat events
│   │   │   └── server.js     # Express + Socket.IO setup
│   │   └── frontend/         # React SPA
│   │       ├── componenti/   # React components
│   │       │   ├── CreateChat.jsx
│   │       │   ├── login.jsx
│   │       │   └── Register.jsx
│   │       ├── App.jsx      # Root component
│   │       └── index.html   # Entry HTML
│   ├── .env.example         # Environment variables template
│   ├── package.json         # Dependencies & scripts
│   └── README.md            # Project documentation
├── .gitignore               # Git ignore rules
└── README.md                # Repository root documentation
```

## Key Directories Explained

### `start/src/backend/`
Main backend directory containing:
- **db/** - Database connection and query helpers
- **routes/** - REST API endpoint handlers
- **sockets/** - Socket.IO event handlers
- **server.js** - Express application entry point

### `start/src/frontend/componenti/`
React components organized by feature:
- **CreateChat.jsx** - New conversation creation UI
- **login.jsx** - User login form
- **Register.jsx** - User registration form

### `start/src/frontend/App.jsx`
Root React component that:
- Sets up routing (implicit)
- Renders conditional UI based on auth state
- Manages chat room visibility

## File Naming Conventions

### Backend Files
| Pattern | Example | Purpose |
|---------|---------|---------|
| `*.js` | `server.js`, `auth.js` | Node.js modules |
| `routes/*.js` | `conversation.js` | Route handlers |
| `sockets/*.js` | `chat.js` | Socket event handlers |

### Frontend Files
| Pattern | Example | Purpose |
|---------|---------|---------|
| `*.jsx` | `login.jsx`, `CreateChat.jsx` | React components |
| `App.jsx` | `App.jsx` | Root component |
| `index.html` | `index.html` | Entry HTML |

### Database Files
| Pattern | Example | Purpose |
|---------|---------|---------|
| `db/index.js` | `index.js` | Database connection setup |

## Configuration Files Location

| File | Location | Purpose |
|------|----------|---------|
| `package.json` | `start/` | Dependencies, scripts, metadata |
| `.env.example` | `start/` | Environment variable templates |
| `vite.config.js` | Root or `start/` | Vite build configuration |
| `postcss.config.js` | Root or `start/` | PostCSS plugins config |

## Entry Points Summary

### Application Start
1. **Frontend**: `index.html` → Vite bundler → React app
2. **Backend**: `server.js` → Express server + Socket.IO

### API Endpoints
- Base path: `/api` (mounted in server.js)
- Auth: `/api/auth/*`
- Conversations: `/api/conversations/*`
- Messages: `/api/messages/*`

### Socket.IO Events
- Namespace: `/socket.io`
- Room pattern: `conversation_${id}`
- Events: `new_message`, custom handlers

## Build Artifacts Location

### Frontend Build Output
- **Default**: `dist/` or `build/` (Vite default)
- **Contains**: Optimized React bundle, static assets

### Backend Dependencies
- **Node modules**: `node_modules/`
- **Lock file**: `package-lock.json`

## Environment Variables Location

| Variable | File | Description |
|----------|------|-------------|
| `PORT` | `.env` | Server port (default: 3001) |
| `DATABASE_URL` | `.env` | PostgreSQL connection string |
| `JWT_SECRET` | `.env` | JWT signing secret |
| `FRONTEND_URL` | `.env` | Allowed CORS origin |

## Git Structure

### Root Level
- `.git/` - Repository metadata
- `README.md` - Project documentation
- `.gitignore` - Ignore rules

### Start Directory
- `package.json` - Package manifest
- `src/` - Source code directory
- `.env.example` - Environment template

## Key Locations Summary

| Location | Contains | Access Level |
|----------|----------|--------------|
| `start/src/backend/routes/` | API endpoints | Protected (auth required) |
| `start/src/backend/sockets/` | Real-time events | Public (room-based) |
| `start/src/frontend/componenti/` | React components | Client-side only |
| `start/src/backend/db/` | Database layer | Internal use |

---

*Structure audit: 2026-03-11*
