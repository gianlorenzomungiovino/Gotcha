# Gotcha - Applicazione Chat Real-time

Applicazione web full-stack per la gestione di chat in tempo reale, supportando conversazioni 1-to-1 e di gruppo.

---

## 🏗️ Architettura

```
┌────────────────┐      ┌─────────────────┐      ┌──────────────┐
│   Frontend     │◀───▶│    Backend      │◀───▶│  Database    │
│  (React SPA)   │      │(Express +       │      │PostgreSQL    │
│                │      │  Socket.IO)     │      │              │
└────────────────┘      └─────────────────┘      └──────────────┘
```

### Stack Tecnologico

- **Frontend**: React 18 + Hooks + React Router DOM
- **Backend**: Node.js + Express.js
- **Real-time**: Socket.IO
- **Database**: PostgreSQL con pg-promise
- **Autenticazione**: JWT (JSON Web Tokens)
- **Configurazione**: dotenv

---

## 📁 Struttura del Progetto

```
start/src/
├── backend/
│   ├── server.js              # Server Express + Socket.IO
│   ├── db/index.js            # Connessione PostgreSQL
│   ├── sql/database.sql       # Schema DB completo
│   ├── routes/
│   │   ├── auth.js            # Login, Register, Logout
│   │   ├── conversation.js    # CRUD conversazioni
│   │   └── messages.js        # Gestione messaggi (con Socket.IO)
│   ├── sockets/chat.js        # Logica real-time Socket.IO
│   └── utils/authMiddleware.js
├── frontend/
│   ├── App.jsx                # Routing principale con route protette
│   ├── main.jsx               # Entry point React
│   ├── componenti/
│   │   ├── Chat.jsx           # Visualizzazione messaggi con scroll automatico
│   │   ├── Chatlist.jsx       # Lista conversazioni dell'utente
│   │   ├── CreateChat.jsx     # Creazione nuove chat (1-to-1 o gruppo)
│   │   ├── InputBox.jsx       # Input utente + risposte bot simulate
│   │   ├── login.jsx          # Pagina di login
│   │   ├── Register.jsx       # Registrazione nuovi utenti
│   │   └── UserSettings.jsx   # Impostazioni profilo utente
│   └── hooks/
│       ├── useChat.jsx        # Hook per gestione messaggi
│       ├── useInputBox.jsx    # Hook per input utente
│       └── useChatlist.jsx    # Hook per lista chat
├── contesti/
│   ├── AuthContext.jsx        # Gestione autenticazione globale
│   ├── ProtectedRoute.jsx     # Wrapper per route protette
│   └── useAuth.js             # Custom hook per stato auth
└── ...
```

---

## ✨ Funzionalità Implementate

### 1. **Autenticazione Utenti**

- ✅ Registrazione con username e password
- ✅ Login/logout con JWT tokens
- ✅ Sessioni protette con middleware
- ✅ Eliminazione account utente

### 2. **Gestione Conversazioni**

- ✅ Creazione chat 1-to-1 (senza titolo)
- ✅ Creazione chat di gruppo (con titolo)
- ✅ Lista conversazioni dell'utente
- ✅ Gestione partecipanti tramite tabella `conversation_participants`
- ✅ Eliminazione account con cascata su chat e messaggi

### 3. **Messaggi Real-time**

- ✅ Invio messaggi istantaneo via WebSocket
- ✅ Risposte automatiche simulate (ritardo random 2-6s)
- ✅ Scroll automatico verso l'ultimo messaggio
- ✅ Distinzione visiva tra mittenti (user/bot)
- ✅ Timestamp per ogni messaggio

### 4. **Database Scalabile**

- ✅ Schema supportante chat 1-to-1 e di gruppo
- ✅ Indici ottimizzati su `messages(conversation_id, created_at DESC)`
- ✅ Relazioni con `ON DELETE CASCADE`
- ✅ Unicità partecipanti (conversation_id + user_id)

---

## 🗄️ Database Schema

### Tabele Principali

| Tabella                     | Descrizione                 | Chiavi                              |
| --------------------------- | --------------------------- | ----------------------------------- |
| `users`                     | Utenti autenticati          | PRIMARY KEY: id, UNIQUE: username   |
| `conversations`             | Conversazioni               | PRIMARY KEY: id, is_group: BOOLEAN  |
| `conversation_participants` | Partecipanti chat di gruppo | UNIQUE: (conversation_id, user_id)  |
| `messages`                  | Messaggi delle chat         | INDEX: conversation_id + created_at |

### Relazioni

```
users ──1── conversation_participants ──N── conversations
  │                                              │
  │                                              ├──1── messages
  │                                              │
  └───────────────────────N──────────────────────┘
```

---

## 🚀 API Endpoints

### Autenticazione (`/auth`)

| Metodo | Endpoint         | Descrizione                |
| ------ | ---------------- | -------------------------- |
| POST   | `/auth/register` | Registrazione nuovo utente |
| POST   | `/auth/login`    | Login e ricezione JWT      |
| POST   | `/auth/logout`   | Logout (revoca token)      |

### Conversazioni (`/conversations`)

| Metodo | Endpoint             | Descrizione                |
| ------ | -------------------- | -------------------------- |
| GET    | `/conversations`     | Lista conversazioni utente |
| GET    | `/conversations/:id` | Dettagli conversazione     |
| POST   | `/conversations`     | Creazione nuova chat       |
| DELETE | `/conversations/:id` | Eliminazione chat          |

### Messaggi (`/messages`)

| Metodo | Endpoint                       | Descrizione                 |
| ------ | ------------------------------ | --------------------------- |
| GET    | `/messages?conversationId=:id` | Lista messaggi (REST)       |
| POST   | `/messages`                    | Invio messaggio (Socket.IO) |

---

## 🔐 Configurazione

### Installazione

```bash
# Installa dipendenze backend
npm install

# Installa dipendenze frontend (se separato)
cd frontend && npm install

# Avvia server
npm run dev
```

---

## 📖 Flusso di Utilizzo

1. **Registrazione**: Nuovo utente si registra con username/password
2. **Login**: Autenticazione e ricezione JWT token
3. **Creazione Chat**:
   - 1-to-1: senza titolo, solo partecipanti
   - Gruppo: con titolo, gestione partecipanti
4. **Scambio Messaggi**: Real-time via WebSocket
5. **Impostazioni**: Gestione profilo utente

---

## 🛠️ Sviluppo

### Componenti Chiave

#### `ChatContext.jsx`

Gestisce lo stato dei messaggi tramite React Context API:

- `messages`: array di oggetti `{ content, sender }`
- `addMessage()`: funzione per aggiungere nuovi messaggi
- `useChatContext()`: custom hook per accedere allo stato

#### `Socket.IO Integration`

```javascript
io.on("connection", (socket) => {
  socket.on("new_message", (data) => {
    // Invia messaggio a tutti i partecipanti
    socket.to.emit("message_received", data);
  });
});
```

#### `Autenticazione JWT`

Il token viene verificato sia per le richieste REST che per le connessioni WebSocket:

```javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET);
socket.user = decoded; // { id, username }
```

---

## 📝 Note di Sviluppo

- **React Context**: Usato per condividere stato tra componenti (ChatProvider, AuthProvider)
- **Hooks Custom**: `useChat`, `useInputBox`, `useChatlist` per logica riutilizzabile
- **Protected Routes**: Route protette che richiedono autenticazione valida
- **CORS Configurato**: Permette richieste da frontend e WebSocket

---

---

## 📄 Licenza

Proprietaria - Tutti i diritti riservati.

---

## 👤 Autore

Gianlorenzo - Gotcha Project
