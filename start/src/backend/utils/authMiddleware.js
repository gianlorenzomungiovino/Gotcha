import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token mancante" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // salva userId dentro req.user
    next();
  } catch (error) {
    console.error("Errore di autenticazione:", error);
    res.status(403).json({ error: "Token non valido" });
  }
};
