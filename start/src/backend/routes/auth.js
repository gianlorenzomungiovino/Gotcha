import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db/index.js";

const router = express.Router();

// REGISTRAZIONE
router.post("/register", async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const exists = await db.oneOrNone("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (exists) return res.status(400).json({ error: "Email già registrata" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await db.one(
      `INSERT INTO users (email, username, password)
       VALUES ($1, $2, $3)
       RETURNING id, email, username`,
      [email, username, hashed]
    );

    res.json(user);
  } catch (error) {
    console.error("Errore registrazione:", error);
    res.status(500).json({ error: "Errore registrazione" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.oneOrNone("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (!user) return res.status(400).json({ error: "Credenziali errate" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Password errata" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error("Errore login:", error);
    res.status(500).json({ error: "Errore login" });
  }
});

export default router;
