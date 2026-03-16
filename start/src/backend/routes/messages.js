import express from "express";
import db from "../db/index.js";
import { authMiddleware } from "../utils/authMiddleware.js";

// Router per gestire le richieste ai messaggi
const router = express.Router();

/* ====================
   GET messaggi di una conversazione
   /messages/:conversationId
   ==================== */
router.get("/:conversationId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    // Verifica che l'utente sia partecipante alla conversazione
    const participation = await db.query(
      "SELECT * FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2",
      [conversationId, userId],
    );

    if (participation.rows.length === 0) {
      return res
        .status(403)
        .json({ error: "Non sei un partecipante a questa conversazione" });
    }

    // Recupera i messaggi ordinati per data
    const messages = await db.query(
      `SELECT 
          m.id,
          m.conversation_id,
          m.sender_id,
          m.text,
          m.created_at,
          u.username as sender_username,
          u.avatar_url as sender_avatar_url,
          m.reactions
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.conversation_id = $1
        ORDER BY m.created_at ASC`,
      [conversationId],
    );

    // Formatta i messaggi per il frontend (plaintext)
    const formattedMessages = messages.rows.map((msg) => {
      return {
        id: msg.id,
        text: msg.text,
        sender: {
          id: msg.sender_id,
          username: msg.sender_username,
          avatar_url: msg.sender_avatar_url,
        },
        reactions: msg.reactions ? JSON.parse(msg.reactions) : [],
      };
    });

    res.json(formattedMessages);
  } catch (error) {
    console.error("Errore nel recupero dei messaggi:", error);
    res.status(500).json({ error: "Errore nel recupero dei messaggi" });
  }
});

// POST - Nuovo messaggio
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId, text } = req.body;

    // Verifica che l'utente sia partecipante alla conversazione
    const participation = await db.query(
      "SELECT * FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2",
      [conversationId, userId],
    );

    if (participation.rows.length === 0) {
      return res
        .status(403)
        .json({ error: "Non sei un partecipante a questa conversazione" });
    }

    // Crea il messaggio in plaintext (no E2EE)
    const result = await db.query(
      `INSERT INTO messages (conversation_id, sender_id, text, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id, conversation_id, sender_id, text, created_at`,
      [conversationId, userId, text],
    );

    res.json({
      id: result.rows[0].id,
      text: result.rows[0].text,
      sender: {
        id: userId,
        username: req.user.username,
        avatar_url: req.user.avatar_url,
      },
    });
  } catch (error) {
    console.error("Errore nella creazione del messaggio:", error);
    res.status(500).json({ error: "Errore nella creazione del messaggio" });
  }
});

export default router;
