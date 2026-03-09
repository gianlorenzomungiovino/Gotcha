import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db/index.js";
import { authMiddleware } from "../utils/authMiddleware.js";

const router = express.Router();

// REGISTRAZIONE
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username e password sono obbligatori" });
    }

    // Verifica se username esiste già
    const exists = await db.oneOrNone("SELECT * FROM users WHERE username=$1", [
      username,
    ]);

    if (exists)
      return res.status(400).json({ error: "Username già esistente" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await db.one(
      `INSERT INTO users (username, password)
       VALUES ($1, $2)
       RETURNING id, username`,
      [username, hashed],
    );

    res.status(201).json(user);
  } catch (error) {
    console.error("Errore registrazione:", error);
    res.status(500).json({ error: "Errore registrazione" });
  }
});

// GET USER DATA
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await db.oneOrNone(
      "SELECT id, username FROM users WHERE id=$1",
      [req.user.id],
    );

    if (!user) {
      return res.status(404).json({ error: "Utente non trovato" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Errore recupero utente:", error);
    res.status(500).json({ error: "Errore recupero dati utente" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username e password sono obbligatori" });
    }

    const user = await db.oneOrNone("SELECT * FROM users WHERE username=$1", [
      username,
    ]);

    if (!user) return res.status(400).json({ error: "Credenziali errate" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Password errata" });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      // eslint-disable-next-line no-undef
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      token,
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error("Errore login:", error);
    res.status(500).json({ error: "Errore login" });
  }
});

// GET LISTA TUTTI GLI UTENTI (per creare chat)
router.get("/users", authMiddleware, async (req, res) => {
  try {
    const users = await db.any(
      "SELECT id, username FROM users ORDER BY username",
    );

    // Escludi l'utente loggato dalla lista
    const currentUser = req.user.id;
    const filteredUsers = users.filter((u) => u.id !== currentUser);

    res.json(filteredUsers);
  } catch (error) {
    console.error("Errore recupero utenti:", error);
    res.status(500).json({ error: "Errore recupero lista utenti" });
  }
});

// DELETE USER (eliminazione utente)
router.delete("/delete", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Verifica se l'utente esiste
    await db.oneOrNone("SELECT * FROM users WHERE id=$1", [userId]);

    // Elimina l'utente
    await db.none("DELETE FROM users WHERE id=$1", [userId]);

    // Rimuove token dal sessionStorage (client-side)
    const token = sessionStorage.getItem("token");
    if (token) {
      sessionStorage.removeItem("token");
    }

    res.json({ message: "Utente eliminato con successo" });
  } catch (error) {
    console.error("Errore eliminazione utente:", error);
    res.status(500).json({ error: "Errore eliminazione utente" });
  }
});

export default router;
