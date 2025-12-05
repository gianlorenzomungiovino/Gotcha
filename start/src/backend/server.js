/* eslint-disable no-undef */
import express from "express";
import http from "http";
import cors from "cors";
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
app.use("/messages", messageRoutes);

// SOCKET.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Initialize Socket logic
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

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
