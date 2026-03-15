# M001: Core Gotcha Chat

**Vision:** Deliver a stable real-time chat experience with authenticated users, rooms, and a usable UI, and lay the groundwork for advanced features (unread messages, swipe gestures, E2EE, attachments, AI helpers).

## Success Criteria

- Users can register, log in, and access protected chat routes.
- Backend exposes stable APIs for users, rooms, and messages with PostgreSQL persistence.
- Real-time messaging works reliably for multiple users in rooms via Socket.IO.
- Dashboard and chat UI support basic daily usage (select room, read/send messages, see reactions).
- Advanced feature groundwork is captured as planned work and does not block core usage.

## Slices

- [ ] **S01: Backend Foundation & Authentication** `risk:medium` `depends:[]`
- [ ] **S02: User & Room Management (Backend Core)** `risk:medium` `depends:[S01]`
- [ ] **S03: Messages & Real-time Core** `risk:high` `depends:[S01,S02]`
- [ ] **S04: Frontend Authentication & Basic Navigation** `risk:medium` `depends:[S01]`
- [ ] **S05: Dashboard & Chat List** `risk:low` `depends:[S04]`
- [ ] **S06: Chat Interface Base** `risk:medium` `depends:[S03,S05]`
- [ ] **S07: Advanced Chat UX (Unread, Swipe, Reactions)** `risk:high` `depends:[S03,S06]`
