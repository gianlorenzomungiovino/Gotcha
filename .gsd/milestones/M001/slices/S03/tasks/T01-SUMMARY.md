# Task T01 - Implement Server-Side Encryption - COMPLETED

**Slice:** S03 - Implementazione crittografia server-side  
**Task ID:** T01  
**Status:** Completed  
**Completed:** 2026-03-16

## Obiettivo

Implementare la crittografia server-side AES-GCM per tutti i messaggi (HTTP e WebSocket) in conformità con R-ACT-001.

## Attività Completate

### 1. Aggiornamento route /messages/:conversationId (GET) ✅

- Decrittografia dei messaggi prima di restituirli al frontend
- Gestione errori di decrittografia con fallback al ciphertext

### 2. Aggiornamento route /messages/ (POST) ✅

- Cifratura del testo del messaggio prima dell'inserimento in DB
- Salvataggio ciphertext, iv, tag nel database
- Decrittografia per il frontend nella risposta

### 3. Aggiornamento socket handler (chat.js) ✅

- Cifratura dei messaggi in arrivo via WebSocket
- Decrittografia per il broadcast
- Aggiornamento dello schema SQL dell'insert

## Verifica

- ✅ Tutti i messaggi sono cifrati nel DB
- ✅ Frontend riceve messaggi decrittografati
- ✅ Socket messages funzionano correttamente
- ✅ Nessun errore di decrittografia in produzione

## Evidenze

- ✅ Test HTTP POST/GET con messaggi cifrati
- ✅ Test WebSocket con messaggi cifrati
- ✅ Log di decrittografia senza errori

## File Modificati

- `start/src/backend/routes/messages.js` - Aggiunto server-side encryption
- `start/src/backend/sockets/chat.js` - Aggiunto server-side encryption
- `start/src/backend/utils/crypto.js` - Utility crittografia

## Note

- La crittografia è server-side (AES-GCM)
- I messaggi sono cifrati prima dell'inserimento in DB
- Il frontend riceve sempre messaggi decrittografati
- E2EE rimane Out of Scope (decisione approvata)
