import express from "express";
import db from "../db/index.js";
import { authMiddleware } from "../utils/authMiddleware.js";

const router = express.Router();

/* ============================================================
   GET messaggi di una conversazione
   /messages/:conversationId
   ============================================================ */
router.get("/:conversationId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    // 🔐 Verifica che l’utente faccia parte della conversazione
    const isParticipant = await db.oneOrNone(
      `
      SELECT 1 
      FROM conversation_participants 
      WHERE conversation_id = $1 AND user_id = $2;
      `,
      [conversationId, userId]
    );

    if (!isParticipant)
      return res.status(403).json({ error: "Accesso non autorizzato" });

    const messages = await db.any(
      `
      SELECT 
        m.id,
        m.text,
        m.sender_id,
        u.username AS sender_username,
        m.created_at
      FROM messages m
      JOIN users u ON u.id = m.sender_id
      WHERE m.conversation_id = $1
      ORDER BY m.created_at ASC;
      `,
      [conversationId]
    );

    res.json(messages);
  } catch (error) {
    console.error("Errore fetch messages:", error);
    res.status(500).json({ error: "Errore recupero messaggi" });
  }
});

/* ============================================================
   POST invia un messaggio
   body: { text }
   ============================================================ */
router.post("/:conversationId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Testo del messaggio mancante" });
    }

    // 🔐 Verifica che l’utente sia partecipante
    const isParticipant = await db.oneOrNone(
      `
      SELECT 1 
      FROM conversation_participants 
      WHERE conversation_id = $1 AND user_id = $2;
      `,
      [conversationId, userId]
    );

    if (!isParticipant)
      return res.status(403).json({ error: "Accesso non autorizzato" });

    // 📨 Inserisci messaggio
    const message = await db.one(
      `
      INSERT INTO messages (conversation_id, sender_id, text)
      VALUES ($1, $2, $3)
      RETURNING id, conversation_id, sender_id, text, created_at;
      `,
      [conversationId, userId, text]
    );

    // Aggiorna updated_at della conversazione
    await db.none(
      `
      UPDATE conversations 
      SET updated_at = now()
      WHERE id = $1;
      `,
      [conversationId]
    );

    res.json(message);
  } catch (error) {
    console.error("Errore send message:", error);
    res.status(500).json({ error: "Errore invio messaggio" });
  }
});

export default router;
