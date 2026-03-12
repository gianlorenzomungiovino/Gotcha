---
created: 2026-03-12T11:14:23.533Z
title: Aggiungi navigazione indietro, crittografia messaggi, allegati e AI riassunto
area: general
files: []
---

## Problem

Durante la discussione sono emerse diverse funzionalità future da implementare nel progetto Gotcha (chat app):

1. **Pulsanti "torna indietro"** - Mancano in tutte le pagine per permettere la navigazione indietro
2. **Crittografia messaggi** - Attualmente manca l'implementazione della crittografia end-to-end per i messaggi
3. **Caricamento allegati/immagini** - Possibilità di caricare file e immagini nella chat
4. **AI backend su Ollama** - Integrare un piccolo AI locale che al richiamo di un button:
   - Legga i messaggi della chat
   - Faccia un brevissimo riassunto del punto a cui si è arrivati
   - Suggerisca delle risposte potenziali

## Solution

Implementare queste feature come task separati in ordine di priorità (da definire):

- **Navigazione**: Creare componente `BackButton` riutilizzabile e posizionarlo strategicamente
- **Crittografia**: Integrare libreria crittografica (es. libsodium, crypto-js) per E2EE
- **Allegati**: Implementare drag-drop + file picker con preview immagini
- **AI Ollama**:
  - Setup container Ollama locale o self-hosted
  - Creare endpoint API per riassunti conversazioni
  - Integrare button "Riassumi" nella UI chat
  - Mostrare suggerimenti risposte in modo non intrusivo

Priorità da definire con l'utente.
