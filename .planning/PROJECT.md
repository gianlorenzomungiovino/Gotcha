# GSD Project - Gotcha Chat Application

## Project Definition

**Nome**: Gotcha
**Tipo**: Applicazione web in tempo reale per chat
**Stack Tecnologico**: React 18 + Vite (frontend), Express.js + Socket.IO + PostgreSQL (backend)

### Obiettivi Principali

- Consentire conversazioni in tempo reale tra utenti
- Gestione multiutente con rooms/chats persistenti
- Sistema di autenticazione JWT-based
- Interfaccia responsive con Tailwind CSS v4
- Notifiche e broadcasting in tempo reale via Socket.IO

### Requisiti Non Funzionali

- **Responsiveness**: UI adattiva per desktop, tablet e mobile
- **Real-time**: Latenza < 200ms per messaggi
- **Persistenza**: Messaggi salvati su PostgreSQL
- **Sicurezza**: Password hashate con bcrypt, JWT expire

### Quality Profile

| Metrica | Target |
|---------|--------|
| Responsiveness | 95%+ |
| Real-time Latency | < 200ms |
| Uptime Backend | 99% |
| Test Coverage | 80%+ |

## GSD Methodology Application

- **Goal Definition**: Obiettivi definiti in PROJECT.md e ROADMAP.md
- **Situation Analysis**: Stato corrente documentato in STATE.md
- **Design & Implementation**: Sviluppo iterativo per fasi
