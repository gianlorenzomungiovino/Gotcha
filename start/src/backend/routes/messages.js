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
      [conversationId, userId],
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
      [conversationId],
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
      [conversationId, userId],
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
      [conversationId, userId, text],
    );

    // Aggiorna updated_at della conversazione
    await db.none(
      `
      UPDATE conversations
      SET updated_at = now()
      WHERE id = $1;
      `,
      [conversationId],
    );

    // 🚀 BROADCAST MESSAGE VIA SOCKET.IO
    req.io.to(`conversation_${conversationId}`).emit("new_message", message);
    console.log("📩 HTTP message sent and broadcasted:", message);

    res.json(message);
  } catch (error) {
    console.error("Errore send message:", error);
    res.status(500).json({ error: "Errore invio messaggio" });
  }
});

/* ============================================================
   GET recupera tutte le reazioni di una conversazione
   ============================================================ */
router.get("/:conversationId/reaction", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    // 🔐 Verifica che l'utente sia partecipante
    const isParticipant = await db.oneOrNone(
      `
      SELECT 1
      FROM conversation_participants
      WHERE conversation_id = $1 AND user_id = $2;
      `,
      [conversationId, userId],
    );

    if (!isParticipant)
      return res.status(403).json({ error: "Accesso non autorizzato" });

    // 🎯 Recupera tutte le reazioni distinte per questa conversazione
    const reactions = await db.any(
      `
      SELECT DISTINCT emoji
      FROM message_reactions
      WHERE conversation_id = $1;
      `,
      [conversationId],
    );

    res.json({ reactions });
  } catch (error) {
    console.error("Errore fetch reactions:", error);
    res.status(500).json({ error: "Errore recupero reazioni" });
  }
});

/* ============================================================
   POST aggiungi/rimuovi reazione emoji
   body: { emoji }
   ============================================================ */
router.post("/:conversationId/reaction", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;
    const { emoji } = req.body;

    if (!emoji || emoji.trim() === "") {
      return res.status(400).json({ error: "Emoji mancante" });
    }

    // 🔐 Verifica che l'utente sia partecipante
    const isParticipant = await db.oneOrNone(
      `
      SELECT 1
      FROM conversation_participants
      WHERE conversation_id = $1 AND user_id = $2;
      `,
      [conversationId, userId],
    );

    if (!isParticipant)
      return res.status(403).json({ error: "Accesso non autorizzato" });

    // 🎯 Cerca o crea la reazione
    const existingReaction = await db.oneOrNone(
      `
      SELECT id, emoji
      FROM message_reactions
      WHERE conversation_id = $1 AND user_id = $2 AND emoji = $3;
      `,
      [conversationId, userId, emoji],
    );

    if (existingReaction) {
      // Rimuovi reazione esistente
      await db.none(
        `
        DELETE FROM message_reactions
        WHERE id = $1;
        `,
        [existingReaction.id],
      );

      res.json({
        success: true,
        message: `Reazione ${emoji} rimossa`,
        reactions: [],
      });
    } else {
      // Aggiungi nuova reazione
      const reaction = await db.one(
        `
        INSERT INTO message_reactions (conversation_id, user_id, emoji)
        VALUES ($1, $2, $3)
        RETURNING id, conversation_id, user_id, emoji;
        `,
        [conversationId, userId, emoji],
      );

      // Recupera tutte le reazioni per questa conversazione
      const reactions = await db.any(
        `
        SELECT DISTINCT emoji
        FROM message_reactions
        WHERE conversation_id = $1;
        `,
        [conversationId],
      );

      res.status(201).json({
        success: true,
        message: `Reazione ${emoji} aggiunta`,
        reactions,
      });
    }
  } catch (error) {
    console.error("Errore toggle reaction:", error);
    res.status(500).json({ error: "Errore gestione reazioni" });
  }
});

export default router;
