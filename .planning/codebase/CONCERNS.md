# Codebase Concerns

**Analysis Date:** 2026-03-11

## Tech Debt

### CORS Misconfiguration:
- Issue: Socket.IO server accepts all origins (`cors: { origin: "*" }`) and routes lack explicit CORS configuration
- Files: `start/src/backend/server.js:36-41`, `start/src/backend/routes/*.js`
- Impact: Potential XSS attacks, unauthorized access from any origin
- Fix approach: Configure specific allowed origins in Socket.IO options (`cors: { origin: process.env.FRONTEND_URL }`) and add CORS headers to backend routes

### Hardcoded URLs:
- Issue: Frontend components use hardcoded `http://localhost:3001` instead of environment variables
- Files: `start/src/frontend/componenti/CreateChat.jsx:18`, `start/src/frontend/componenti/login.jsx`, `start/src/frontend/componenti/Register.jsx`
- Impact: Code not portable to production, requires rebuilds when backend port changes
- Fix approach: Use `process.env.API_URL` with fallback, add `.env` template for deployment

### Database Connection Without Retry Logic:
- Issue: PostgreSQL connection fails silently on startup without health check or retry mechanism
- Files: `start/src/backend/db/index.js:8-16`
- Impact: Application crashes if DB unavailable during deployment, no graceful degradation
- Fix approach: Add connection pool with `pg-promise` retry logic and startup health check endpoint

### Missing Input Validation:
- Issue: Backend routes accept user input without sanitization for content fields (messages, titles)
- Files: `start/src/backend/routes/messages.js:62`, `start/src/backend/routes/conversation.js:142`
- Impact: Potential database injection attacks, storage of malformed data
- Fix approach: Use pg-promise validators or implement input sanitization layer

## Known Bugs

### Socket.IO Envelope Handling May Mask Client Errors:
- Symptoms: Postman client with envelope `{ event, data }` format logs parse errors but continues silently
- Files: `start/src/backend/sockets/chat.js:21-37`
- Trigger: Testing via Postman or clients using Socket.IO envelope format
- Workaround: Use direct payload format in testing tools

### Missing Message History on New Chat Creation:
- Symptoms: Creating a new chat shows empty message list until messages are sent
- Files: `start/src/backend/routes/messages.js:12-49` (only fetches existing messages)
- Trigger: Create new conversation via `/conversations/group` or `/conversations/private`
- Workaround: None - expected behavior but may confuse users expecting empty initial state

### User Deletion Cascade Not Handled:
- Symptoms: Deleting a user may leave orphaned records in `conversation_participants`, `messages`, and `conversations` tables
- Files: `start/src/backend/routes/auth.js:119-139` (only deletes from users table)
- Trigger: Calling DELETE /auth/delete
- Workaround: Manually cleanup database or implement cascade delete in schema

## Security Considerations

### JWT Secret in Environment Variable:
- Risk: JWT_SECRET exposed if `.env` committed to git or leaked
- Files: `start/src/backend/server.js:52`, `start/src/backend/routes/auth.js:86`
- Current mitigation: Uses process.env.JWT_SECRET (exists but not reviewed)
- Recommendations: Use strong random secret, rotate periodically, never commit `.env`, use dotenv-expand for development

### Session Storage for Token:
- Risk: Browser session storage vulnerable to XSS attacks, tokens retrievable via JavaScript injection
- Files: `start/src/backend/routes/auth.js:92`, `start/src/frontend/componenti/CreateChat.jsx:17`
- Current mitigation: None - uses sessionStorage
- Recommendations: Use httpOnly cookies for server-side sessions or implement token refresh with short expiry times

### Participant Bypass Potential:
- Risk: Socket.IO message handler relies on client-provided user_id in payload, even with auth middleware
- Files: `start/src/backend/sockets/chat.js:40`, `start/src/backend/sockets/chat.js:61`
- Current mitigation: Checks against conversation_participants table (line 54-59)
- Recommendations: Always trust socket.user.id from auth middleware, never client payload user_id

### Password Hashing Salt Factor:
- Risk: bcrypt with cost factor 10 is acceptable but could be increased for better security
- Files: `start/src/backend/routes/auth.js:28`
- Current mitigation: Using bcryptjs v3.0.3 with cost 10
- Recommendations: Increase to cost factor 12, consider moving to argon2

## Performance Bottlenecks

### N+1 Query Pattern in Conversation List:
- Problem: Getting conversations with last_message uses subqueries that may become slow with large message counts
- Files: `start/src/backend/routes/conversation.js:10-59`
- Cause: Multiple subqueries per conversation for last_message and last_message_time
- Improvement path: Use window functions or separate query to fetch last messages by conversation_id

### No Message Pagination:
- Problem: Fetching all messages via `/messages/:conversationId` returns entire history
- Files: `start/src/backend/routes/messages.js:12-49`
- Cause: No limit/offset parameters implemented
- Improvement path: Add `?limit=50&offset=0` query params with pagination logic

### Socket.IO Broadcast to All Connected Clients:
- Problem: `io.to()` broadcasts new_message to all connected users in room, not just unread participants
- Files: `start/src/backend/sockets/chat.js:77`, `start/src/backend/routes/messages.js:100`
- Cause: Real-time broadcast designed for live updates
- Improvement path: Implement message acknowledgement and mark-as-read functionality to reduce noise

## Fragile Areas

### Conversation Schema Assumption:
- Files: `start/src/backend/db/index.js`, all DB queries throughout codebase
- Why fragile: Code assumes 3-table schema (users, conversations, conversation_participants, messages) with specific column names
- Safe modification: Add migrations before changing schema, maintain compatibility layer
- Test coverage: Schema changes break all dependent routes and socket handlers

### Socket.IO Room Naming Convention:
- Files: `start/src/backend/sockets/chat.js`
- Why fragile: Hardcoded room prefix `conversation_${conversationId}` throughout socket logic
- Safe modification: Centralize room naming strategy in config object
- Test coverage: Room changes require updates to client connection code

### PostgreSQL pg-promise Default Pool Settings:
- Files: `start/src/backend/db/index.js`
- Why fragile: Uses default pool settings which may not suit high-traffic scenarios
- Safe modification: Configure connection pool parameters (max, idleTimeout, etc.) based on expected load
- Test coverage: Underload testing with sustained message rate

## Dependencies at Risk

### Express v5.x Breaking Changes:
- Risk: Using Express 5.1.0 which has breaking changes vs 4.x
- Impact: Middleware order matters more, some edge cases may behave differently
- Migration plan: Document middleware requirements clearly, test thoroughly when upgrading

### socket.io@4.8.1 Version Lock:
- Risk: Older Socket.IO version with known CVEs in older releases
- Impact: Potential DoS vulnerabilities if not patched
- Migration plan: Update to latest 4.x release or 5.x when ready

### Missing Dependency Pinning for DevTools:
- Risk: eslint, vite, postcss versions may drift causing build inconsistencies
- Impact: CI/CD pipeline failures across different environments
- Migration plan: Add npm ci script with lockfile enforcement

## Missing Critical Features

### Message Acknowledgement System:
- Problem: No way to know if client received socket broadcast successfully
- Files: All socket handlers in `start/src/backend/sockets/chat.js`
- Blocks: Cannot implement offline message queuing or delivery receipts
- Priority: High - prevents infinite loop scenarios with disconnected clients

### Connection Reconnection Logic on Client:
- Problem: Client-side reconnection strategy undefined
- Files: Frontend Socket.IO client initialization in multiple components
- Blocks: Users lose connection without notification, may need to restart app
- Priority: Medium - standard Socket.IO reconnect options need configuration

### Rate Limiting Implementation:
- Problem: No rate limiting on API endpoints or socket message posting
- Files: All routes in `start/src/backend/routes/`
- Blocks: Abuse possible via rapid message flooding, brute force attempts
- Priority: High - add express-rate-limit middleware

## Test Coverage Gaps

### User Deletion Flow:
- What's not tested: Deleting a user who is part of active conversations
- Files: `start/src/backend/routes/auth.js:119-139`
- Risk: Orphaned participant records may cause permission errors later
- Priority: High - data integrity issue

### Concurrent Message Sending:
- What's not tested: Two clients sending messages to same conversation simultaneously
- Files: `start/src/backend/sockets/chat.js:21-82`
- Risk: Race conditions in message persistence, lost messages possible
- Priority: Medium - requires async/await edge case testing

### Empty Participants Array Handling:
- What's not tested: Creating group chat with empty participants array validation
- Files: `start/src/backend/routes/conversation.js:137-174`
- Risk: Invalid database insert if validation missing
- Priority: Medium - input validation gap

## Logging Strategy Issues

### Console Log Pollution:
- Problem: Mix of emoji logs (`🚀`, `📩`, `🔴`) with actual errors, making log parsing difficult
- Files: All backend files using console.log/console.error
- Cause: Development-style logging not suited for production monitoring
- Recommendations: Use winston or pino with structured logs, separate dev/prod log levels

### No Centralized Error Handler:
- Problem: Each route catches errors individually with `console.error` and generic JSON response
- Files: All route files have identical error handling pattern
- Cause: Repetitive code, inconsistent error messages
- Recommendations: Implement express middleware for centralized 404/500 handlers

## Database Concerns

### No Indexes Documented:
- Problem: Queries on conversations_participants and messages may degrade with data growth
- Files: All DB queries in `start/src/backend/db/index.js` usage
- Cause: Missing index specifications for foreign key columns
- Recommendations: Create indexes on (conversation_id, user_id) in conversation_participants

### No Migration History:
- Problem: Database schema changes tracked only in git history
- Files: Schema implied by queries in all route files
- Cause: No db/migrations folder or ORM migrations
- Recommendations: Implement migration system for schema evolution

---

*Concerns audit: 2026-03-11*
