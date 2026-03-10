# Gotcha Project Context

This file is automatically loaded by Claude Code at the start of every session.

## Project Overview

Gotcha is a real-time chat application with user management and persistent conversations.

- **Gotcha-start**: React 18/Vite frontend with Socket.IO for real-time messaging
- **Gotcha-start/src/backend**: Express.js backend with PostgreSQL database
- **Deprecated**: No deprecated directories

Both frontend and backend are located in the `start/` subdirectory.

## Auto-Loaded Context Files

The following context files are automatically loaded from the `.claude/` folder:

@./workflow-guide.md
@./session-report.md

## Git Configuration

- **Author**: gianlorenzomungiovino <gianlorenzomungiovino@gmail.com>
- **No Claude signatures**: Commits should NOT include Claude Code attribution or Co-Authored-By lines
- Use conventional commit format: `type(scope): description` (feat, fix, refactor, docs, style, etc.)

## 🔴 CRITICAL GIT RULES

### Rule 1: NEVER Auto-Commit or Auto-Push

**❌ FORBIDDEN:**
- Automatic commits after code changes
- Automatic push to remote repositories
- Committing without explicit user permission

**✅ REQUIRED:**
- WAIT for user's EXPLICIT and UNEQUIVOCAL request to commit
- WAIT for user's EXPLICIT and UNEQUIVOCAL request to push
- User must say words like: "commit", "push", "puoi committare", "puoi pushare"
- If in doubt, ASK the user: "Vuoi che committa e pusha le modifiche?"

**Example Flow:**
1. Claude: "Ho completato le modifiche. Vuoi che committa e pusha?"
2. User: "sì" or "commit e push" or "puoi committare e pushare"
3. Claude: [ONLY NOW commits and pushes]

## Repository Structure

```
Gotcha/
├── start/                          # Main application (separate git repo)
│   ├── src/
│   │   ├── frontend/              # React/Vite app
│   │   └── backend/               # Express.js API
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── .claude/                       # Shared context files
│   ├── CLAUDE.md                 # This file (auto-loaded)
│   ├── workflow-guide.md         # Development workflow guide
│   ├── session-report.md         # Session progress tracking
│   └── token-monitor.md          # Token usage tracking
└── TEMPLATE.claude/               # Template files for reference
```

## Technology Stack

**Frontend:**
- React 18 with Vite
- React Router for navigation
- Socket.IO client for real-time messaging
- Context API for state management (AuthContext, ChatContext)
- CSS modules and styled-components

**Backend:**
- Express.js REST API
- Socket.IO server for WebSocket connections
- PostgreSQL database with pg library
- JWT authentication
- bcrypt for password hashing
- dotenv for environment configuration

**Real-time Features:**
- Socket.IO rooms per conversation
- Message broadcasting to chat participants
- Persistent message storage in PostgreSQL

## Important Notes

1. The `start/` directory IS a git repository with its own history
2. Frontend and backend share the same git repo (monorepo structure)
3. All commits should use the account: gianlorenzomungiovino
4. Never include AI attribution in commit messages
5. **CRITICAL:** Never commit or push without explicit user permission
6. Always test Socket.IO connections before committing changes

---

**GitHub Repository**: https://github.com/gianlorenzomungiovino/Gotcha.git
**Personal GitHub**: https://github.com/gianlorenzomungiovino

**Last Updated**: 2026-03-10
