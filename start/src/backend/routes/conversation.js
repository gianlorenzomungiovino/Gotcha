import express from "express";
import db from "../db/index.js";
import { authMiddleware } from "../utils/authMiddleware.js";

const router = express.Router();

/* ============================================================
   GET tutte le conversazioni dell’utente loggato
   ============================================================ */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await db.any(
      `
      SELECT 
        c.id AS conversation_id,
        c.title,
        c.is_group,
        c.created_at,
        c.updated_at,
        CASE 
          WHEN c.is_group THEN c.title
          ELSE (
            SELECT u.username
            FROM conversation_participants cp
            JOIN users u ON u.id = cp.user_id
            WHERE cp.conversation_id = c.id AND cp.user_id != $1
            LIMIT 1
          )
        END AS other_username,
        (
          SELECT text 
          FROM messages m 
          WHERE m.conversation_id = c.id 
          ORDER BY m.created_at DESC 
          LIMIT 1
        ) AS last_message,
        (
          SELECT m.created_at
          FROM messages m
          WHERE m.conversation_id = c.id
          ORDER BY m.created_at DESC
          LIMIT 1
        ) AS last_message_time
      FROM conversations c
      JOIN conversation_participants cp ON cp.conversation_id = c.id
      WHERE cp.user_id = $1
      ORDER BY last_message_time DESC NULLS LAST;
      `,
      [userId],
    );

    res.json(conversations);
  } catch (error) {
    console.error("Errore fetch conversations:", error);
    res.status(500).json({ error: "Errore nel recupero delle conversazioni" });
  }
});

/* ============================================================
   POST crea o recupera una chat 1-to-1
   body: { otherUserId }
   ============================================================ */
router.post("/private", authMiddleware, async (req, res) => {
  try {
    const userA = req.user.id;

    const otherUserId =
      req.body?.otherUserId ??
      req.body?.OtherUserId ??
      req.query?.otherUserId ??
      req.query?.OtherUserId;

    if (!otherUserId)
      return res.status(400).json({ error: "otherUserId mancante" });

    const otherId = parseInt(otherUserId, 10);
    if (Number.isNaN(otherId))
      return res.status(400).json({ error: "otherUserId non valido" });

    if (otherId === userA)
      return res.status(400).json({ error: "Non puoi chattare con te stesso" });

    // Cerca se esiste già una chat privata (2 partecipanti)
    const existing = await db.oneOrNone(
      `
      SELECT c.id
      FROM conversations c
      JOIN conversation_participants cp1 
        ON cp1.conversation_id = c.id AND cp1.user_id = $1
      JOIN conversation_participants cp2 
        ON cp2.conversation_id = c.id AND cp2.user_id = $2
      WHERE c.is_group = FALSE
        AND (
          SELECT COUNT(*) 
          FROM conversation_participants cp 
          WHERE cp.conversation_id = c.id
        ) = 2
      LIMIT 1;
      `,
      [userA, otherId],
    );

    if (existing) {
      return res.json({ conversation_id: existing.id, already_exists: true });
    }

    // Non esiste: crea nuova conversazione 1-to-1
    const conversation = await db.one(
      `
      INSERT INTO conversations (title, is_group)
      VALUES (NULL, FALSE)
      RETURNING id;
      `,
    );

    await db.none(
      `
      INSERT INTO conversation_participants (conversation_id, user_id)
      VALUES ($1, $2), ($1, $3);
      `,
      [conversation.id, userA, otherId],
    );

    res.json({ conversation_id: conversation.id, already_exists: false });
  } catch (error) {
    console.error("Errore create private conversation:", error);
    res.status(500).json({ error: "Errore creazione chat privata" });
  }
});

/* ============================================================
   POST crea una chat di GRUPPO
   body: { title, participants: [id1, id2, ...] }
   ============================================================ */
router.post("/group", authMiddleware, async (req, res) => {
  try {
    const { title, participants } = req.body;
    const adminId = req.user.id;

    if (!title || !participants || !Array.isArray(participants)) {
      return res.status(400).json({ error: "Dati non validi" });
    }

    // Evita duplicati e assicura che l'admin sia incluso
    const uniqueParticipants = [...new Set([...participants, adminId])];

    const conversation = await db.one(
      `
      INSERT INTO conversations (title, is_group)
      VALUES ($1, TRUE)
      RETURNING id;
      `,
      [title],
    );

    const values = uniqueParticipants
      .map((u) => `(${conversation.id}, ${u})`)
      .join(",");

    await db.none(
      `
      INSERT INTO conversation_participants (conversation_id, user_id)
      VALUES ${values};
      `,
    );

    res.json({ conversation_id: conversation.id });
  } catch (error) {
    console.error("Errore create group conversation:", error);
    res.status(500).json({ error: "Errore creazione chat di gruppo" });
  }
});

export default router;
