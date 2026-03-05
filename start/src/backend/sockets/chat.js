import db from "../db/index.js";

export default function chatSocket(io, socket) {
  // JOIN conversation room
  socket.on("join_conversation", async (conversationId) => {
    try {
      if (!conversationId) {
        console.log("❌ Invalid join_conversation data received");
        return;
      }
      socket.join(`conversation_${conversationId}`);
      console.log(
        `Socket ${socket.id} joined room conversation_${conversationId}`,
      );
    } catch (error) {
      console.error("join_conversation error:", error);
    }
  });

  // SEND MESSAGE with participant check
  socket.on("send_message", async (data) => {
    // Supporta envelope { event, data } usati da alcuni client (Postman)
    if (data && data.data) data = data.data;

    // Se il client ha inviato una stringa JSON (es. Postman), proviamo a fare il parse
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (parseErr) {
        console.log(
          "❌ Couldn't parse send_message payload string:",
          parseErr.message,
        );
        console.log("Received (raw):", data);
        return;
      }
    }

    const { conversation_id, sender_id, content } = data || {};
    const authenticatedUserId = socket.user.id;

    if (
      !conversation_id ||
      !sender_id ||
      !content ||
      sender_id !== authenticatedUserId
    ) {
      console.log("❌ Invalid message data or user mismatch", data);
      return;
    }

    try {
      // 🔥 SECURITY CHECK: il sender deve essere parte della conversazione
      const isParticipant = await db.oneOrNone(
        `SELECT 1 
         FROM conversation_participants 
         WHERE conversation_id = $1 AND user_id = $2`,
        [conversation_id, authenticatedUserId],
      );

      if (!isParticipant) {
        console.log(
          `❌ User ${authenticatedUserId} tried to send message to conversation ${conversation_id} WITHOUT being a participant.`,
        );
        return; // non invia né salva
      }

      // SAVE MESSAGE
      const message = await db.one(
        `INSERT INTO messages (conversation_id, sender_id, text)
         VALUES ($1, $2, $3)
         RETURNING id, conversation_id, sender_id, text, created_at`,
        [conversation_id, authenticatedUserId, content],
      );

      // BROADCAST TO ROOM (solo per messaggi via socket, non HTTP)
      io.to(`conversation_${conversation_id}`).emit("new_message", message);
      console.log("📩 Socket message sent and broadcasted:", message);
    } catch (error) {
      console.error("🔥 Error saving message:", error);
    }
  });

  // TYPING INDICATOR
  socket.on("typing", async (data) => {
    try {
      const { conversation_id, user_id, username } = data;
      const authenticatedUserId = socket.user.id;

      if (!conversation_id || !user_id || user_id !== authenticatedUserId) {
        console.log("❌ Invalid typing data or user mismatch", data);
        return;
      }

      // 🔥 SECURITY CHECK: l'utente deve essere parte della conversazione
      const isParticipant = await db.oneOrNone(
        `SELECT 1
         FROM conversation_participants
         WHERE conversation_id = $1 AND user_id = $2`,
        [conversation_id, authenticatedUserId],
      );

      if (!isParticipant) {
        console.log(
          `❌ User ${authenticatedUserId} tried to send typing indicator to conversation ${conversation_id} WITHOUT being a participant.`,
        );
        return;
      }

      // Invia a tutti gli altri utenti nella stanza (escludendo il sender)
      socket.to(`conversation_${conversation_id}`).emit("user_typing", {
        user_id: authenticatedUserId,
        username,
        conversation_id,
      });

      console.log(
        `⌨️ User ${username} is typing in conversation ${conversation_id}`,
      );
    } catch (error) {
      console.error("🔥 Error handling typing:", error);
    }
  });

  // STOP TYPING INDICATOR
  socket.on("stop_typing", async (data) => {
    try {
      const { conversation_id, user_id } = data;
      const authenticatedUserId = socket.user.id;

      if (!conversation_id || !user_id || user_id !== authenticatedUserId) {
        console.log("❌ Invalid stop_typing data or user mismatch", data);
        return;
      }

      // 🔥 SECURITY CHECK: l'utente deve essere parte della conversazione
      const isParticipant = await db.oneOrNone(
        `SELECT 1
         FROM conversation_participants
         WHERE conversation_id = $1 AND user_id = $2`,
        [conversation_id, authenticatedUserId],
      );

      if (!isParticipant) {
        console.log(
          `❌ User ${authenticatedUserId} tried to send stop_typing to conversation ${conversation_id} WITHOUT being a participant.`,
        );
        return;
      }

      // Invia a tutti gli altri utenti nella stanza (escludendo il sender)
      socket.to(`conversation_${conversation_id}`).emit("user_stop_typing", {
        user_id: authenticatedUserId,
        conversation_id,
      });

      console.log(
        `⏹️ User ${authenticatedUserId} stopped typing in conversation ${conversation_id}`,
      );
    } catch (error) {
      console.error("🔥 Error handling stop_typing:", error);
    }
  });
}
