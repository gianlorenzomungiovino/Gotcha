# Decisione: Approccio E2EE (Out of Scope per M001)

## Data

2026-03-16

## Contesto

È stato richiesto di utilizzare il JWT come seed per la cifratura client-side, ma questo approccio presenta compromessi di sicurezza significativi (token rotation, server minting).

## Decisione

**E2EE rimane OUT OF SCOPE per M001**.

Invece, si adotta:

- **Server-side encryption (AES-GCM)** come soluzione intermedia (R-ACT-001).
- Il server può decifrare i messaggi (non è E2EE).
- Nessuna gestione di chiavi pubbliche o key exchange.

## Riferimenti

- `.gsd/REQUIREMENTS.md` - Sezione "Out of Scope: R-OOS-001"
- `.gsd/DECISIONS.md` - D005, D006

## Implicazioni

- Il frontend non deve implementare logica E2EE.
- Il backend gestisce la cifratura/de-cifratura dei messaggi.
- Eventuali richieste future per E2EE richiederanno un nuovo milestone.
