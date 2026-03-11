# Technology Stack

**Analysis Date:** 2026-03-11

## Runtime Environment

| Component | Version | Purpose |
|-----------|---------|---------|
| Node.js | 20.x (LTS) | JavaScript runtime |
| npm | 10.x | Package manager |

## Backend Stack

### Core Framework
- **Express** v5.1.0 - Web framework for building APIs
- **socket.io** v4.8.1 - Real-time bidirectional event-based communication

### Database Layer
- **pg-promise** - PostgreSQL client with promise-based API
- **PostgreSQL** - Relational database for persistent storage

### Authentication & Security
- **jsonwebtoken** (jwt) - JWT token generation and verification
- **bcryptjs** v3.0.3 - Password hashing with configurable cost factor (10)
- **express-session** - Session management middleware

### Development Dependencies
- **nodemon** - Auto-restart on file changes
- **concurrently** - Run multiple commands in parallel
- **vite** - Frontend build tooling
- **postcss** - CSS preprocessing
- **autoprefixer** - Automatic vendor prefixing

## Frontend Stack

### Core Framework
- **React** 18.x - UI library for building user interfaces
- **ReactDOM** 18.x - React DOM renderer

### Styling
- **Tailwind CSS** v3.x - Utility-first CSS framework
- **postcss** - CSS processing pipeline

### Build & Dev Tools
- **vite** - Fast build tool and dev server
- **esbuild** - JavaScript bundler for Vite

## Project Structure

```
Gotcha/
├── start/                    # Main application entry
│   ├── src/
│   │   ├── backend/          # Express API server
│   │   │   ├── db/          # Database connection & schema
│   │   │   ├── routes/      # API route handlers
│   │   │   ├── sockets/     # Socket.IO event handlers
│   │   │   └── server.js    # Express + Socket.IO setup
│   │   └── frontend/        # React SPA
│   │       ├── componenti/  # React components
│   │       ├── App.jsx      # Root component
│   │       └── index.html   # Entry HTML
├── .env.example             # Environment variables template
├── package.json             # Dependencies & scripts
└── README.md                # Project documentation
```

## Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts, metadata |
| `.env.example` | Environment variable templates |
| `vite.config.js` | Vite build configuration |
| `postcss.config.js` | PostCSS plugins configuration |

## Key Dependencies Summary

### Production (`dependencies`)
- express: Web framework
- socket.io: Real-time messaging
- pg-promise: PostgreSQL client
- jsonwebtoken: JWT auth
- bcryptjs: Password hashing
- express-session: Session management
- react, react-dom: Frontend framework

### Development (`devDependencies`)
- nodemon: Auto-restart
- concurrently: Parallel commands
- vite: Build tooling
- eslint: Code linting
- postcss, autoprefixer: CSS processing

---

*Stack audit: 2026-03-11*
