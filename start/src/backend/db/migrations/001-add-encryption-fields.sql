-- Migration: Add encryption fields to messages table
-- Purpose: Support server-side AES-GCM encryption (R-ACT-001)
-- Decision: D006, .gsd/decisions/server-side-encryption-aes-gcm.md

-- Add ciphertext column (encrypted message content)
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS ciphertext TEXT;

-- Add iv column (initialization vector for AES-GCM)
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS iv TEXT;

-- Add tag column (authentication tag for AES-GCM)
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS tag TEXT;

-- Add encrypted_at timestamp
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS encrypted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add index for encrypted messages
CREATE INDEX IF NOT EXISTS idx_messages_encrypted ON messages(encrypted_at);

-- Backfill existing messages (mark as plaintext if not encrypted)
UPDATE messages
SET ciphertext = text,
    iv = '0000000000000000000000000000000<write_to_file>
<path>start/src/backend/db/migrations/001-add-encryption-fields.sql</path>
<content>-- Migration: Add encryption fields to messages table
-- Purpose: Support server-side AES-GCM encryption (R-ACT-001)
-- Decision: D006, .gsd/decisions/server-side-encryption-aes-gcm.md

-- Add ciphertext column (encrypted message content)
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS ciphertext TEXT;

-- Add iv column (initialization vector for AES-GCM)
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS iv TEXT;

-- Add tag column (authentication tag for AES-GCM)
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS tag TEXT;

-- Add encrypted_at timestamp
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS encrypted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add index for encrypted messages
CREATE INDEX IF NOT EXISTS idx_messages_encrypted ON messages(encrypted_at);