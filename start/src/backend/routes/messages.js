import express from "express";
import db from "../db/index.js";
import { authMiddleware } from "../utils/authMiddleware.js";

const router = express.Router();

// Messaggi di una conversazione
router.get("/:conversationId", authMiddleware, async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await db.any(
      `
      SELECT *
      FROM messages
      WHERE conversation_id = $1
      ORDER BY created_at ASC
    `,
      [conversationId]
    );

    res.json(messages);
  } catch (err) {
    console.error("Errore caricamento messaggi:", err);
    res.status(500).json({ error: "Errore caricamento messaggi" });
  }
});

// Creare un messaggio
router.post("/", authMiddleware, async (req, res) => {
  const { conversationId, text } = req.body;

  try {
    const msg = await db.one(
      `
      INSERT INTO messages (conversation_id, sender_id, text)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
      [conversationId, req.user.id, text]
    );

    // Aggiorna la data di modifica della conversazione
    await db.none(
      `
      UPDATE conversations
      SET updated_at = NOW()
      WHERE id = $1
      `,
      [conversationId]
    );

    res.json(msg);
  } catch (err) {
    console.error("Errore invio messaggio:", err);
    res.status(500).json({ error: "Errore invio messaggio" });
  }
});

export default router;
