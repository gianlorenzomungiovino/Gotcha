import express from "express";
import http from "http";
import cors from "cors";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import conversationRoutes from "./routes/conversation.js";
import messageRoutes from "./routes/messages.js";
import chatSocket from "./sockets/chat.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

chatSocket(io);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`🚀 Server avviato sulla porta ${PORT}`);
});
