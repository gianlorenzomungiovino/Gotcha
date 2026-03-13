# GSD Roadmap - Gotcha Chat Application

## Overview

Questo documento definisce le fasi di sviluppo del progetto Gotcha con relativi obiettivi, dipendenze e deliverable.

---

## Fase 1: Authentication & Setup (Foundation)

**Obiettivo**: Configurazione infrastruttura base e sistema di autenticazione

### Sotto-fasi:
1. **Setup Backend**
   - Inizializzazione Express.js server
   - Configurazione Socket.IO
   - Connessione PostgreSQL
   - Setup JWT authentication middleware

2. **Authentication API**
   - Endpoints: `/register`, `/login`, `/me`
   - Password hashing con bcrypt
   - Token refresh logic

### Dipendenze:
- N/A (fase iniziale)

### Deliverable:
- Backend operativo con auth funzionante
- Database schema base definito

---

## Fase 2: User Management (Backend Core)

**Obiettivo**: Implementazione gestione utenti e persistenza dati

### Sotto-fasi:
3. **User Data Models**
   - Schema utente (ID, username, email, bio, avatar)
   - Relazioni many-to-many con chat rooms

4. **User API Endpoints**
   - CRUD completo utenti
   - Ricerca per nome/keyword
   - Filtro e paginazione

5. **Database Design**
   - Users table
   - Rooms table
   - Messages table
   - Indexing ottimizzato

### Dipendenze:
- Fase 1 (Auth setup)

### Deliverable:
- CRUD utenti funzionante
- Database schema completo

---

## Fase 3: Chat Rooms & Rooms API (Backend Core)

**Obiettivo**: Gestione rooms e API per creazione/attivazione

### Sotto-fasi:
6. **Rooms Management**
   - Creazione room pubblica/privata
   - Membership management
   - Room settings persistence

7. **Room API Endpoints**
   - `/rooms` (lista)
   - `/rooms/:id/join` (entry point socket)
   - `/rooms/:id/members`

### Dipendenze:
- Fase 2 (User models)

### Deliverable:
- Sistema rooms CRUD
- Room entry logic Socket.IO

---

## Fase 4: Messages & Broadcasting (Real-time Core)

**Obiettivo**: Implementazione sistema messaggistica real-time

### Sotto-fasi:
8. **Messages API**
   - Salvataggio messaggi su PostgreSQL
   - Retrieval storico chat
   - Message deletion/archival

9. **Socket Broadcasting**
   - Broadcast a tutti membri room
   - Presence updates (user online/offline)
   - Typing indicators
   - Read receipts

### Dipendenze:
- Fase 1-3 (Auth, Users, Rooms)

### Deliverable:
- Messaggi in tempo reale funzionanti
- Broadcasting system operativo

---

## Fase 5: Frontend Authentication (React Core)

**Obiettivo**: UI di login/registrazione e routing protected

### Sotto-fasi:
10. **Auth Pages**
    - Login form con validation
    - Registration flow
    - Password reset (opzionale)

11. **Protected Routes & AuthContext**
    - Route guard middleware
    - Token storage (localStorage/cookies)
    - Logout logic

### Dipendenze:
- Fase 4 (Auth API)

### Deliverable:
- Flusso auth frontend completo
- Protected routes implementate

---

## Fase 6: User Dashboard & Chat List (Frontend Core)

**Obiettivo**: Interfaccia utente principale e elenco rooms

### Sotto-fasi:
12. **Dashboard Layout**
    - Sidebar navigation
    - User profile header
    - Responsive design

13. **Chat Room List**
    - Grid/list view rooms
    - Last message preview
    - Online users indicator

14. **Room Selection & Detail View**
    - Room metadata display
    - Members list
    - Join/leave actions

### Dipendenze:
- Fase 5 (Auth UI)

### Deliverable:
- Dashboard UI completa
- Elenco rooms funzionante

---

## Fase 7: Chat Interface (Frontend Real-time)

**Obiettivo**: Interfaccia chat completa con messaggistica real-time

### Sotto-fasi:
15. **Message List Component**
    - Scrolling infinite messages
    - Message timestamp formatting
    - User avatar/name display

16. **Message Input Area**
    - Text input con validation
    - Emoji picker (opzionale)
    - File upload support (opzionale)

17. **Socket Integration UI**
    - Real-time message updates
    - Presence indicators
    - Typing animations

### Dipendenze:
- Fase 4 (Messages API), Fase 6 (Layout)

### Deliverable:
- Interfaccia chat completa e responsiva
- Messaggi real-time aggiornati live

---

## Fase 8: User Management UI (Frontend Advanced)

**Obiettivo**: Gestione profilo utente e directory utenti

### Sotto-fasi:
18. **User Profile Page**
    - Foto, bio, stats display
    - Edit profile form
    - Privacy settings

19. **User Directory**
    - Search users by name
    - Filter options
    - User detail modal

20. **Room Management UI**
    - Create new room flow
    - Room settings panel
    - Delete/leave room confirmations

### Dipendenze:
- Fase 2 (User API), Fase 3 (Rooms API)

### Deliverable:
- Gestione utenti complete UI
- Room management funzionale

---

## Fase 9: Advanced Features (Optional Extensions)

**Obiettivo**: Implementazione feature avanzate opzionali

### Possible sotto-fasi:
21. **Notifications System**
    - Desktop notifications
    - Mobile push (opzionale)

22. **Message Reactions & Threads**
    - Like/reaction system
    - Reply threads

23. **Media Sharing**
    - Image upload
    - GIF support

### Dipendenze:
- Tutte le fasi precedenti

### Deliverable:
- Feature set completo (opzionale)

---

## Fase 10: Advanced Features & Enhancements (Future)

**Obiettivo**: Implementazione feature avanzate e miglioramenti UX

### Sotto-fasi:

#### 10.1 **Messaggi non letti (Unread Messages)**
- Broadcasting Socket.IO per aggiornare counter `count unread` in tempo reale
- Styling glow visivo attorno a `.chat-item` quando ci sono messaggi non letti
- Aggiornamento stato `isRead` al marcare come letti

#### 10.2 **Swipe Gestures**
- Swipe left su chat list per eliminare room o segnare come letti
- Overlay con opzioni: box rosso (elimina) / box verde (segna come letti)
- Integrazione con touch events e mouse emulation

#### 10.7 ✅ **Reazioni Emoji ai Messaggi** (COMPLETATO)
- Endpoint API `GET /messages/:id/reaction` per ottenere reazioni
- Endpoint API `POST /messages/:id/reaction` per aggiungere/togliere reazione
- UI: click su emoji nei messaggi esistenti → toggle reazione
- Backend: tabella `reactions` con conv_id, msg_id, emoji, created_at
- Frontend: componente Reactions.jsx con gestione click emoji

#### 10.3 **Crittografia End-to-End (E2EE)**
- Implementazione crittografia messaggi con `crypto-js` (AES-GCM)
- Key exchange sicuro tra utenti
- Decrittografia lato client solo
- Metadata non cifrati (timestamp, room ID)

#### 10.4 **Allegati & Immagini**
- Drag-drop + file picker per caricamento file
- Preview immagini con thumbnail generation
- Supporto PDF, video, audio
- Storage locale o cloud integration (opzionale)

#### 10.5 **AI Backend su Ollama**
- Setup container Ollama locale (Llama 3 / Mistral small)
- Endpoint API per:
  - Riassunto conversazione corrente
  - Suggerimenti risposte intelligenti
- UI button "Riassumi" nella chat
- Context window management

#### 10.6 **Messaggi non letti (Broadcasting Socket.IO)**
- Quando un utente invia messaggio a room esistente → broadcast ultimo messaggio
- Incrementare `count unread` per tutti gli altri utenti nella room
- Aggiornare stato `isRead` dell'utente ricevente
- Frontend: glow styling su `.chat-item` quando ci sono messaggi non letti

#### 10.7 **Swipe Left Gestures**
- Swipe left su ogni chat in Chatlist
- Overlay swipe completo con due opzioni:
  - Box rosso (icona cestino): Elimina room dal server e dalla lista utente
  - Box verde/blu (icona check): Segna tutti i messaggi come letti

### Dipendenze:
- Tutte le fasi precedenti (1-9)
- Fase 4 (per Socket.IO broadcasting)

### Deliverable:
- Messaggi non letti con visualizzazione glow
- Swipe gestures implementati
- Crittografia E2EE operativa
- Upload allegati funzionante
- AI riassunti conversazioni
- Swipe left per eliminare/leggere chat

---

## Stato Attuale

| Fase | Stato | Note |
|------|-------|------|
| 1 | ✅ Completa | Auth setup necessario |
| 2 | 🔜 Imminente | User management |
| 3 | 🔜 Imminente | Rooms API |
| 4 | 🔜 Imminente | Messages real-time |
| 5-23 | 📋 Future | Frontend & advanced features |
