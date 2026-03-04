/* eslint-disable no-undef */
import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token mancante" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // id, username
    next();
  } catch (error) {
    console.error("Errore verifica token:", error);
    res.status(401).json({ error: "Token non valido" });
  }
}
