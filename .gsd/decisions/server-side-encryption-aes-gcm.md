# Decisione: Cifratura server-side dei messaggi (AES-GCM)

## Data

2026-03-16

## Contesto

Per il milestone **M001** vogliamo evitare E2EE (fuori scope), ma mantenere una forma di protezione dei contenuti dei messaggi a riposo (application-layer encryption) nel database.

## Decisione

Implementare **cifratura server-side AES-GCM** dei messaggi:

- La cifratura avviene **nel backend** prima del salvataggio.
- Nel DB si salva **ciphertext** + metadati necessari (es. `iv`).
- La chiave è **server-managed** (env/secret), non derivata da JWT e non gestita dal client.

## Non obiettivi

- **Non è E2EE**: il server può decifrare.
- Nessun key exchange, nessuna gestione di chiavi pubbliche.

## Implicazioni

- Richiede migrazione DB per campi ciphertext/iv + flag.
- Le API `/messages` devono gestire encrypt/decrypt coerentemente.
- Va definita rotazione chiavi (non in questa fase se non richiesto).
