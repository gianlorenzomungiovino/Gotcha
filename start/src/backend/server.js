/* eslint-disable no-undef */
import express from "express";
import http from "http";
import cors from "cors";
import jwt from "jsonwebtoken";
import { Server as SocketIOServer } from "socket.io";

// Routes
import authRoutes from "./routes/auth.js";
import conversationRoutes from "./routes/conversation.js";
import messageRoutes from "./routes/messages.js";

// Socket
import chatSocket from "./sockets/chat.js";

const app = express();
const server = http.createServer(app);

// CORS
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/auth", authRoutes);
app.use("/conversations", conversationRoutes);

// SOCKET.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware per passare io alle route
app.use(
  "/messages",
  (req, res, next) => {
    req.io = io;
    next();
  },
  messageRoutes,
);

// Initialize Socket logic
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication error"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // id, username
    next();
  } catch (error) {
    console.error("Socket authentication error:", error);
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log(
    "🟢 New client connected:",
    socket.id,
    "User:",
    socket.user?.username,
  );

  chatSocket(io, socket); // Passa io e socket al file dei sockets

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// SERVER START
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
