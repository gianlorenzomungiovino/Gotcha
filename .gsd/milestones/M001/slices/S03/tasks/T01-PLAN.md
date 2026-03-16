# Task T01 - Implement Server-Side Encryption

**Slice:** S03 - Implementazione crittografia server-side  
**Task ID:** T01  
**Status:** In Progress  
**Priority:** High

## Obiettivo

Implementare la crittografia server-side AES-GCM per tutti i messaggi (HTTP e WebSocket) in conformità con R-ACT-001.

## Prerequisiti

- [x] Decisione E2EE approvata (.gsd/decisions/e2ee-approach.md)
- [x] Schema DB aggiornato con campi cifrati (.gsd/db/migrations/001-add-encryption-fields.sql)
- [x] Utility crittografia creata (start/src/backend/utils/crypto.js)

## Attività

### 1. Aggiornamento route /messages/:conversationId (GET)

- [ ] Decrittografare i messaggi prima di restituirli al frontend
- [ ] Gestire errori di decrittografia con fallback al ciphertext

### 2. Aggiornamento route /messages/ (POST)

- [ ] Cifrare il testo del messaggio prima dell'inserimento in DB
- [ ] Salvare ciphertext, iv, tag nel database
- [ ] Decrittografare per il frontend nella risposta

### 3. Aggiornamento socket handler (chat.js)

- [ ] Cifrare i messaggi in arrivo via WebSocket
- [ ] Decrittografare per il broadcast
- [ ] Aggiornare lo schema SQL dell'insert

### 4. Migrazione dati esistente

- [ ] Cifrare i messaggi esistenti nel database
- [ ] Script di migrazione one-time

## Verifica

- [ ] Tutti i messaggi sono cifrati nel DB
- [ ] Frontend riceve messaggi decrittografati
- [ ] Socket messages funzionano correttamente
- [ ] Nessun errore di decrittografia in produzione

## Evidenze

- [ ] Test HTTP POST/GET con messaggi cifrati
- [ ] Test WebSocket con messaggi cifrati
- [ ] Log di decrittografia senza errori
