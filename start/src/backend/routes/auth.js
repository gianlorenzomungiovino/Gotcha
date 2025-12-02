import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db/index.js";

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
      [username, hashed]
    );

    res.status(201).json(user);
  } catch (error) {
    console.error("Errore registrazione:", error);
    res.status(500).json({ error: "Errore registrazione" });
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
      { expiresIn: "7d" }
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

export default router;
