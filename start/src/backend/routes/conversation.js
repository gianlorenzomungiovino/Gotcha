import express from "express";
import db from "../db/index.js";
import { authMiddleware } from "../utils/authMiddleware.js";

const router = express.Router();

// Tutte le conversazioni dell'utente loggato
router.get("/", authMiddleware, async (req, res) => {
  try {
    const conversations = await db.any(
      `
      SELECT *
      FROM conversations
      WHERE user_id = $1
      ORDER BY updated_at DESC
    `,
      [req.user.id]
    );

    res.json(conversations);
  } catch (err) {
    console.error("Errore caricamento conversazioni:", err);
    res.status(500).json({ error: "Errore caricamento conversazioni" });
  }
});

// Creare una conversazione
router.post("/", authMiddleware, async (req, res) => {
  const { title } = req.body;

  try {
    const conversation = await db.one(
      `
      INSERT INTO conversations (user_id, title)
      VALUES ($1, $2)
      RETURNING *
    `,
      [req.user.id, title]
    );

    res.json(conversation);
  } catch (err) {
    console.error("Errore creazione conversazione:", err);
    res.status(500).json({ error: "Errore creazione conversazione" });
  }
});

export default router;
