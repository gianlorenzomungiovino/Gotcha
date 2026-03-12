---
created: 2026-03-12T11:14:23.533Z
title: Aggiungi navigazione indietro, crittografia messaggi, allegati e AI riassunto
area: general
files: []
---

## Problem

Durante la discussione sono emerse diverse funzionalità future da implementare nel progetto Gotcha (chat app):

### ✅ Completato:
1. **Pulsanti "torna indietro"** - Implementati in tutte le pagine con componente `BackButton`

### 🚧 In corso / Pending:
2. **Messaggi non letti** - Implementare broadcasting Socket.IO per aggiornare il counter e styling glow visivo
3. **Swipe left gestures** - Swipe a sinistra per eliminare chat e segnare come letti

4. **Crittografia messaggi** - Attualmente manca l'implementazione della crittografia end-to-end per i messaggi
5. **Caricamento allegati/immagini** - Possibilità di caricare file e immagini nella chat
6. **AI backend su Ollama** - Integrare un piccolo AI locale che al richiamo di un button:
   - Legga i messaggi della chat
   - Faccia un brevissimo riassunto del punto a cui si è arrivati
   - Suggerisca delle risposte potenziali

## Solution

### Task 1: Messaggi non letti (Broadcasting Socket.IO)
- Quando un utente invia un messaggio a una room esistente → broadcasting all'ultimo messaggio nella room
- Incrementare `count unread` per tutti gli altri utenti nella room
- Aggiornare lo stato `isRead` dell'utente ricevente
- **Frontend**: Styling glow attorno al div `.chat-item` in Chatlist quando ci sono messaggi non letti

### Task 2: Swipe left gestures
- Implementare swipe a sinistra su ogni chat in Chatlist
- Swipe completo mostra overlay con due opzioni:
  - **Box rosso** (icona cestino): Elimina la chat (rimuovi room dal server e dalla lista utente)
  - **Box verde/blu** (icona check): Segna tutti i messaggi come letti (aggiorna `isRead` per l'utente)

### Task 3-6: Altre feature future
- **Crittografia**: Integrare libreria crittografica (es. crypto-js) per E2EE
- **Allegati**: Implementare drag-drop + file picker con preview immagini
- **AI Ollama**: Setup container locale, endpoint API per riassunti, button "Riassumi" nella UI

Priorità: Task 1 e 2 sono da implementare ora (messaggi non letti + swipe).

---
*Aggiornato: 2026-03-12*
