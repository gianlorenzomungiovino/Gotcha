# Coding Conventions

**Analysis Date:** 2026-03-11

## Code Style

### JavaScript/TypeScript
- **ESLint**: Linting rules enforced via ESLint config
- **Prettier**: Code formatting (if configured)
- **Semicolons**: Required (standard JS style)
- **Quotes**: Single quotes for strings
- **Braces**: Always on new line (JS standard style)

### React Components
- **Function Components**: All components are functional with hooks
- **Naming**: PascalCase for components, camelCase for functions
- **Props**: Named props with JSDoc comments
- **Hooks**: Ordered per React rules of hooks

## Naming Conventions

### Backend (Node.js)
| Type | Convention | Example |
|------|------------|---------|
| Routes | camelCase + `.js` | `auth.js`, `conversation.js` |
| Functions | camelCase | `sendMessage`, `getConversations` |
| Constants | UPPER_SNAKE_CASE | `PORT`, `JWT_SECRET` |
| Variables | camelCase | `userId`, `messageText` |

### Frontend (React)
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `CreateChat`, `Login` |
| Functions | camelCase | `handleLogin`, `sendMessage` |
| State Variables | camelCase | `messages`, `users` |
| Props | camelCase | `conversationId`, `onSubmit` |

### Database
| Type | Convention | Example |
|------|------------|---------|
| Tables | snake_case plural | `conversations`, `messages` |
| Columns | snake_case | `user_id`, `message_text` |
| Enums | UPPER_SNAKE_CASE | `PRIVATE_CHAT`, `GROUP_CHAT` |

## Error Handling Pattern

### Backend Errors
```javascript
try {
  // Operation
} catch (error) {
  console.error(error); // Log error
  res.status(500).json({ error: 'Internal server error' });
}
```

### Socket.IO Errors
```javascript
socket.on('new_message', async (data, socket) => {
  try {
    // Handle message
  } catch (error) {
    console.error(error);
    // Optional: Notify client of error
  }
});
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "error": "Error message here",
  "statusCode": 400
}
```

## Socket.IO Event Pattern

### Event Handler Structure
```javascript
socket.on('event_name', async (data, socket) => {
  // Validate data
  // Perform operation
  // Broadcast to room
});
```

### Room Naming Convention
- Pattern: `conversation_${conversationId}`
- Prefix: `conversation_`
- Separator: Underscore

## Database Query Patterns

### pg-promise Usage
```javascript
db.query(`SELECT * FROM messages WHERE conversation_id = $1`, [conversationId])
```

### Transaction Pattern
```javascript
await db.tx(async (tx) => {
  // Multiple operations
});
```

## Component Structure (React)

### Standard Component Template
```jsx
function ComponentName(props) {
  const { prop1, prop2 } = props;

  // State hooks
  const [state, setState] = useState(initial);

  // Effect hooks
  useEffect(() => {
    // Side effects
  }, [dependencies]);

  // Event handlers
  const handleClick = () => {
    // Handler logic
  };

  return (
    // JSX render
  );
}

export default ComponentName;
```

## File Organization

### Route Files
Each route file handles a specific domain:
- `auth.js` - All authentication-related endpoints
- `conversation.js` - Conversation CRUD operations
- `messages.js` - Message operations

### Socket Handlers
Single file for chat functionality:
- `chat.js` - All real-time messaging events

## Logging Conventions

### Log Levels
| Level | Usage | Example |
|-------|-------|---------|
| `console.log` | Debug info | Development only |
| `console.info` | General info | Info messages |
| `console.warn` | Warnings | Deprecations |
| `console.error` | Errors | Exceptions |

### Current Issue
- Mix of emoji logs (`🚀`, `📩`) with actual errors
- Recommendation: Use structured logging (winston/pino)

## Testing Conventions

### Test File Naming
- Pattern: `{filename}.test.js` or `{filename}.spec.js`
- Location: Same directory as source file

### Test Structure
```javascript
describe('Component/Function', () => {
  it('should do something', () => {
    // Test code
  });
});
```

## Documentation Conventions

### JSDoc Comments
```javascript
/**
 * @param {string} userId - User identifier
 * @returns {Promise<Object>} User data
 */
async function getUser(userId) { ... }
```

### README Sections
- Overview
- Installation
- Usage
- Configuration
- Contributing

---

*Conventions audit: 2026-03-11*
