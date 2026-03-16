# Task T02 - Database Migration

**Slice:** S03 - Implementazione crittografia server-side  
**Task ID:** T02  
**Status:** In Progress  
**Priority:** High

## Obiettivo

Migrare i dati esistenti nel database aggiungendo i campi di crittografia (ciphertext, iv, tag) e mantenendo la compatibilità con i vecchi dati.

## Prerequisiti

- [x] Utility crittografia creata (start/src/backend/utils/crypto.js)
- [x] Schema DB aggiornato con campi cifrati

## Attività

### 1. Creazione script di migrazione

- [ ] Script SQL per aggiungere colonne ciphertext, iv, tag
- [ ] Script per cifrare i messaggi esistenti
- [ ] Script per mantenere la compatibilità con i vecchi dati

### 2. Applicazione migrazione

- [ ] Eseguire migrazione su database di sviluppo
- [ ] Verificare integrità dati
- [ ] Testare recupero messaggi cifrati

### 3. Aggiornamento schema.sql

- [ ] Aggiornare start/src/backend/db/schema.sql
- [ ] Aggiornare start/src/backend/sql/database.sql

## Verifica

- [ ] Migrazione completata senza errori
- [ ] Tutti i messaggi accessibili dopo migrazione
- [ ] Nessun dato corrotto

## Evidenze

- [ ] Log di migrazione
- [ ] Report integrità dati
- [ ] Test di recupero messaggi
