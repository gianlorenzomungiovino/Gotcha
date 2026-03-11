# Testing Strategy

**Analysis Date:** 2026-03-11

## Current Testing Setup

### Frameworks & Tools
| Tool | Status | Purpose |
|------|--------|---------|
| Jest | Not configured | Unit testing framework |
| React Testing Library | Not configured | React component testing |
| Supertest | Not configured | API endpoint testing |
| Socket.IO Adapter | Not configured | Real-time event testing |

### Test Coverage
- **Current**: 0% (no tests configured)
- **Target**: >80% for critical paths
- **Tools Missing**: jest, @testing-library/react, supertest

## Recommended Testing Structure

### Directory Layout
```
start/
├── src/
│   ├── backend/
│   │   ├── routes/
│   │   │   ├── auth.test.js
│   │   │   ├── conversation.test.js
│   │   │   └── messages.test.js
│   │   ├── sockets/
│   │   │   └── chat.test.js
│   │   └── db/
│   │       └── index.test.js
│   └── frontend/
│       ├── componenti/
│       │   ├── login.test.jsx
│       │   ├── Register.test.jsx
│       │   └── CreateChat.test.jsx
│       └── App.test.jsx
├── __tests__/
│   ├── integration/
│   │   ├── auth-flow.test.js
│   │   ├── conversation-flow.test.js
│   │   └── message-flow.test.js
│   └── e2e/
│       └── chat-app.test.js
```

## Unit Testing Strategy

### Backend Route Tests (Supertest)
```javascript
const request = require('supertest');
const app = require('../server');

describe('Auth Routes', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'password123' });

    expect(response.statusCode).toBe(201);
    expect(response.body.user).toHaveProperty('username');
  });
});
```

### Socket.IO Event Tests (Socket.IO Adapter)
```javascript
const io = require('socket.io-client');
const { Server } = require('socket.io');

describe('Chat Socket Events', () => {
  let server;

  beforeEach(() => {
    server = new Server();
  });

  it('should broadcast new_message to room', async () => {
    const socket = await io.connect(server.url);

    server.to('conversation_1').emit('new_message', { text: 'Hello' });

    expect(socket.listenerCount('new_message')).toBeGreaterThan(0);
  });
});
```

### React Component Tests (React Testing Library)
```javascript
import { render, screen } from '@testing-library/react';
import Login from '../componenti/login';

describe('Login Component', () => {
  it('renders login form', () => {
    render(<Login />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('submits form on button click', async () => {
    const { user } = render(<Login />);

    await user.click(screen.getByRole('button', { name: /login/i }));

    // Assert navigation or API call
  });
});
```

## Integration Testing Strategy

### Authentication Flow Tests
```javascript
describe('Auth Flow Integration', () => {
  it('should complete login after registration', async () => {
    // Register user
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'password123' });

    expect(registerResponse.statusCode).toBe(201);

    // Login with registered credentials
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'password123' });

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.token).toBeDefined();
  });
});
```

### Conversation Flow Tests
```javascript
describe('Conversation Flow', () => {
  it('should create conversation and send message', async () => {
    // Create private conversation
    const convResponse = await request(app)
      .post('/api/conversations/private')
      .send({ userId: 'user2' });

    expect(convResponse.statusCode).toBe(201);

    // Send message
    const msgResponse = await request(app)
      .post(`/api/messages/${convResponse.body.conversation.id}`)
      .send({ text: 'Hello!' });

    expect(msgResponse.statusCode).toBe(201);
  });
});
```

## E2E Testing Strategy

### Playwright/Cypress Setup
```javascript
// e2e/chat-app.test.js
import { test, expect } from '@playwright/test';

test.describe('Chat Application', () => {
  test('user can register, login, and send messages', async ({ page }) => {
    // Navigate to app
    await page.goto('http://localhost:3001');

    // Register
    await page.fill('[data-testid="username"]', 'testuser');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="register-button"]');

    // Login
    await page.goto('http://localhost:3001/login');
    await page.fill('[data-testid="username"]', 'testuser');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // Send message
    await page.fill('[data-testid="message-input"]', 'Hello!');
    await page.click('[data-testid="send-button"]');

    // Verify message appears
    await expect(page.locator('[data-testid="message-list"]')).toContainText('Hello!');
  });
});
```

## Test Data Management

### Database Seeding for Tests
```javascript
// __tests__/setup.js
const db = require('../src/backend/db');

beforeEach(async () => {
  // Clear test data
  await db.query('DELETE FROM messages');
  await db.query('DELETE FROM conversation_participants');
  await db.query('DELETE FROM conversations');
  await db.query('DELETE FROM users');

  // Seed test users
  await db.query(
    'INSERT INTO users (username, password_hash) VALUES ($1, $2)',
    ['testuser', bcrypt.hashSync('password123', 10)]
  );
});

afterEach(async () => {
  // Cleanup after each test
  await db.query('DELETE FROM messages');
  await db.query('DELETE FROM conversation_participants');
  await db.query('DELETE FROM conversations');
  await db.query('DELETE FROM users');
});
```

## Mocking Strategy

### API Client Mocks
```javascript
// __tests__/mocks/api-client.js
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('Component with API calls', () => {
  it('should handle successful API response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { id: 1, username: 'test' } })
    });

    // Test component
  });
});
```

### Socket.IO Mocks
```javascript
// __tests__/mocks/socket.js
const mockSocket = {
  on: jest.fn(),
  emit: jest.fn(),
  disconnect: jest.fn()
};

describe('Component with Socket.IO', () => {
  beforeEach(() => {
    mockSocket.on.mockClear();
    mockSocket.emit.mockClear();
  });

  it('should connect to socket', () => {
    // Test component using mockSocket
    expect(mockSocket.on).toHaveBeenCalledWith('new_message', expect.any(Function));
  });
});
```

## Coverage Targets

| Area | Target Coverage | Priority |
|------|-----------------|----------|
| Route handlers | >90% | High |
| Socket event handlers | >85% | High |
| React components | >80% | Medium |
| Database queries | >70% | Low |
| Utility functions | >60% | Low |

## CI/CD Integration

### GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Known Testing Gaps

### Critical Uncovered Areas
1. **User deletion cascade** - No tests for orphaned records
2. **Concurrent message sending** - No race condition testing
3. **Socket.IO reconnection** - No disconnect/reconnect scenarios
4. **Error handling paths** - Minimal error case coverage

### Recommended Test Cases
- [ ] Delete user with active conversations
- [ ] Send messages from multiple clients simultaneously
- [ ] Socket.IO reconnection after network failure
- [ ] Invalid input validation (SQL injection attempts)
- [ ] JWT token expiration and refresh flow
- [ ] CORS misconfiguration scenarios

---

*Testing audit: 2026-03-11*
