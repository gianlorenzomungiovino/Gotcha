# Decisions

<!-- Append-only register of architectural and pattern decisions -->

| ID | Decision | Rationale | Date |
|----|----------|-----------|------|
| D001 | Adopt modular monolith architecture with Express API + Socket.IO + PostgreSQL | Keeps backend and frontend in a single deployable unit while maintaining clear module boundaries; fits real-time chat needs and existing Node.js stack. | 2026-03-11 |
| D002 | Use React 18 + Vite + Tailwind CSS for the SPA frontend | Provides fast developer feedback, modern React tooling, and utility-first styling suitable for responsive real-time UI. | 2026-03-11 |
| D003 | Use JWT + bcrypt for authentication | Standard approach for stateless auth in SPAs; balances security and implementation complexity, aligns with existing Node ecosystem. | 2026-03-12 |
| D004 | Use Socket.IO for real-time messaging | Mature real-time library with reconnection, room management, and good Node integration, ideal for multi-room chat scenarios. | 2026-03-11 |
