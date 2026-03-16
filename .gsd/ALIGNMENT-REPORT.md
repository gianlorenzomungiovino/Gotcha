# GSD Alignment Report - Gotcha M001

**Generated**: 2026-03-16 13:02  
**Status**: ⚠️ DRIFT DETECTED - Implementation pending

---

## Executive Summary

The project has **GSD drift** between `.gsd/REQUIREMENTS.md` (R-ACT-001: Server-side encryption) and the actual implementation.

### Current State

| Component            | Expected (per R-ACT-001)  | Actual        |
| -------------------- | ------------------------- | ------------- |
| **Database Schema**  | `ciphertext`, `iv` fields | ❌ Missing    |
| **messages.js**      | Encrypt before save       | ❌ Plain text |
| **chat.js (socket)** | Encrypt before save       | ❌ Plain text |
| **S03 Summary**      | Encryption tasks          | 0 completed   |

---

## Drift Details

### 1. Database Schema Drift

**Expected**: Messages table should have `ciphertext` and `iv` columns.

**Current**:

```sql
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Action Required**: Add `ciphertext` and `iv` columns.

---

### 2. Backend API Drift

**Expected**: `/messages/:conversationId` should return encrypted/decrypted content.

**Current**: Returns plain `text` field directly.

**Action Required**: Implement encryption/decryption middleware.

---

### 3. Socket Handler Drift

**Expected**: Socket messages should be encrypted before DB save.

**Current**: Saves `content` directly to `text` column.

**Action Required**: Encrypt before save, decrypt before broadcast.

---

## Implementation Plan

### Phase 1: Schema Migration

1. Add `ciphertext` (TEXT) and `iv` (TEXT) columns to `messages` table.
2. Create migration script.
3. Backfill existing messages (decrypt if possible, else mark as plaintext).

### Phase 2: Encryption Layer

1. Create `crypto.js` utility with AES-GCM functions.
2. Load encryption key from environment (`ENCRYPTION_KEY`).
3. Update `messages.js` to encrypt on POST, decrypt on GET.
4. Update `chat.js` to encrypt on socket save, decrypt on broadcast.

### Phase 3: Key Management

1. Document key rotation policy.
2. Add key validation on startup.
3. Add health check endpoint for encryption status.

---

## Compliance Checklist

- [ ] Schema migration completed
- [ ] Encryption utility implemented
- [ ] messages.js updated
- [ ] chat.js updated
- [ ] S03 tasks created in `.gsd/milestones/M001/S03/slices/`
- [ ] S03 tasks marked as active/completed

---

## Next Steps

1. **Immediate**: Create schema migration script.
2. **Short-term**: Implement encryption layer.
3. **Long-term**: Document key rotation policy.

---

## References

- `.gsd/REQUIREMENTS.md` - R-ACT-001
- `.gsd/decisions/server-side-encryption-aes-gcm.md`
- `.gsd/DECISIONS.md` - D006
- `.gsd/milestones/M001/S03-SUMMARY.md`
