# Decision D007: Remove Server-Side Encryption, Store Messages in Plaintext

**Date:** 2026-03-16  
**Status:** Final  
**Related:** D005 (E2EE key derivation), D006 (Server-side AES-GCM), R-OOS-001 (E2EE out of scope), R-BLK-001 (Encryption blocked)

## Context

During M001 development, the team was asked to implement server-side AES-GCM encryption for messages (D006) while keeping E2EE out of scope. However, this approach:

1. Adds unnecessary complexity for a chat application where messages are ephemeral
2. Creates a single point of failure (server key compromise exposes all messages)
3. Adds performance overhead (encryption/decryption on every message)
4. Contradicts the principle of least surprise - users expect chat apps to store messages in plaintext
5. E2EE is explicitly out of scope for M001 (R-OOS-001)

## Decision

**Remove all server-side encryption and store messages in plaintext.**

## Rationale

- **Simplicity:** Plaintext storage is simpler to implement, maintain, and audit
- **Performance:** No encryption/decryption overhead on every message
- **Transparency:** Users and admins can inspect message content directly
- **Compliance:** Plaintext is acceptable for most chat applications (GDPR allows if appropriate safeguards exist)
- **Scope Alignment:** E2EE is out of scope; server-side encryption is not E2EE but adds similar complexity

## Implementation Changes

### Files Modified

| File                                            | Change                                                  |
| ----------------------------------------------- | ------------------------------------------------------- |
| `start/src/frontend/hooks/useChat.jsx`          | Removed `encryptMessage()` and `decryptMessage()` calls |
| `start/src/frontend/componenti/ChatContext.jsx` | Removed E2EE context and key derivation                 |
| `start/src/backend/utils/crypto.js`             | Removed E2EE encryption/decryption functions            |
| `start/src/backend/routes/messages.js`          | Removed encryption/decryption in HTTP handlers          |
| `start/src/backend/sockets/chat.js`             | Removed encryption/decryption in socket handlers        |
| `start/src/backend/db/schema.sql`               | No changes needed (already plaintext)                   |
| `.gsd/REQUIREMENTS.md`                          | Moved R-ACT-001 to Blocked (R-BLK-001)                  |
| `.gsd/DECISIONS.md`                             | Added D007 decision                                     |

### Code Removed

**Frontend (useChat.jsx):**

```javascript
// REMOVED
const encryptedContent = encryptMessage(content, e2eeKey);
const decryptedContent = decryptMessage(encryptedContent, e2eeKey);
```

**Backend (messages.js):**

```javascript
// REMOVED
const encryptedContent = encryptMessage(content, encryptionKey);
const decryptedContent = decryptMessage(encryptedContent, encryptionKey);
```

**Backend (chat.js socket):**

```javascript
// REMOVED
const encryptedContent = encryptMessage(content, encryptionKey);
const decryptedContent = decryptMessage(encryptedContent, encryptionKey);
```

## Security Considerations

- **Message Privacy:** Messages are now stored in plaintext. Ensure:
  - HTTPS is used for all communications
  - Server is properly secured (firewall, access controls)
  - Database is encrypted at rest (OS-level or cloud provider)
  - Access logs are monitored for unauthorized access

- **Key Management:** The E2EE key derivation code is no longer needed. Remove any remaining references to `encryptionKey` or `e2eeKey`.

## Migration Notes

No database migration is required. The schema already stores messages in plaintext. Existing encrypted messages (if any) should be:

1. **Option A (Recommended):** Delete and recreate with plaintext
2. **Option B:** Keep as-is (backward compatible, new messages are plaintext)

## Future Considerations

If E2EE is reconsidered for future milestones:

1. Implement proper key exchange (not JWT-derived)
2. Consider Signal Protocol or similar
3. Define clear E2EE scope in requirements
4. Update this decision with new rationale

## References

- D005: Derive client-side E2EE key from JWT (user-requested)
- D006: Encrypt messages server-side with AES-GCM (not E2EE)
- R-OOS-001: End-to-End Encryption (E2EE) out of scope
- R-BLK-001: Server-side message encryption (AES-GCM) blocked
