# Gotcha - Session Context

**Last Updated: 2026-03-11 15:28:47 (Session update via pre-commit hook)** 2026-03-10 (Session N - Tailwind CSS + Import cleanup)
**Project:** Gotcha (Real-time Chat Application)

---

## 🏗️ Current Architecture

**Frontend (start/src/frontend/):** React 18 / Vite / React Router / Socket.IO client / Context API

**Backend (start/src/backend/):** Express.js / Socket.IO server / PostgreSQL / JWT auth / bcrypt

```
Gotcha/
├── start/                          # Main app (git repo)
│   ├── src/
│   │   ├── frontend/              # React components, pages, context
│   │   └── backend/               # Express API, Socket.IO, DB models
│   ├── public/                    # Static assets
│   ├── package.json               # Dependencies (frontend + backend)
│   └── vite.config.js             # Vite configuration
├── .claude/                       # Context files
│   ├── CLAUDE.md                 # Project overview
│   ├── workflow-guide.md         # Workflow guidelines
│   ├── session-report.md         # Session tracking
│   └── token-monitor.md          # Token usage
└── TEMPLATE.claude/               # Template references
```

**Frontend Modules:**
- Login/Register pages
- Chatlist (conversation list)
- Chat (real-time messaging with Socket.IO)
- CreateChat (new conversation setup)
- UserSettings (user profile management)
- AuthContext (authentication state)
- ChatContext (chat message state)

**Styling:**
- Tailwind CSS v4 unificato in `base.css` ✅
- Import corretti verificati in `main.jsx` ✅
- File CSS ridondanti eliminati (`theme.css`, `layout.css`) ✅

**Backend Features:**
- REST API routes: /api/auth, /api/users, /api/chats, /api/messages
- Socket.IO rooms per conversation
- PostgreSQL models: User, Conversation, Message
- JWT authentication with bcrypt password hashing
- CORS configured for frontend URL

**Database Schema:**
- Users (id, username, email, password_hash, avatar_url, created_at)
- Conversations (id, name, type, created_at)
- Messages (id, conversation_id, user_id, content, created_at)

**Auth Flow:**
- POST /api/auth/register - User registration
- POST /api/auth/login - Login + JWT token
- Protected routes via JWT verification
- Socket.IO connection requires valid session

---

## 📊 Current State

**Frontend — completato:**
- Routing: Login → Register → Chatlist/Chat/CreateChat/Settings ✅
- AuthContext: login/logout, user state management ✅
- ChatContext: message sending/receiving via Socket.IO ✅
- Socket.IO client: join-chat, new-message events ✅
- UI Components: Login, Register, Chatlist, Chat, CreateChat, UserSettings ✅
- Tailwind CSS integrato e import corretti ✅

**Backend — completato:**
- Express server with CORS ✅
- Socket.IO server con broadcast messaggi ✅
- PostgreSQL connection ✅
- Auth routes (register/login) ✅
- User routes (get list, delete account) ✅
- Chat routes (create, get list) ✅
- Message routes (send, get history con persistenza DB) ✅

**Database:**
- Schema Users, Conversations, Messages implementato ✅

**Deployment:** Local development (npm run dev)

---

## 🎯 Next Steps / TODO

- [ ] Miglioramenti UI: margini, pulsanti indietro, lista conversazioni
- [ ] Supporto allegati e immagini
- [ ] Implementare crittografia end-to-end (E2EE)
- [ ] Preparazione backend per AI Ollama

---

**For detailed code, use Read/Glob/Grep on demand.**
