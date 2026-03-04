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
        `Socket ${socket.id} joined room conversation_${conversationId}`
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
          parseErr.message
        );
        console.log("Received (raw):", data);
        return;
      }
    }

    const { conversation_id, sender_id, content } = data || {};

    if (!conversation_id || !sender_id || !content) {
      console.log("❌ Invalid message data received", data);
      return;
    }

    try {
      // 🔥 SECURITY CHECK: il sender deve essere parte della conversazione
      const isParticipant = await db.oneOrNone(
        `SELECT 1 
         FROM conversation_participants 
         WHERE conversation_id = $1 AND user_id = $2`,
        [conversation_id, sender_id]
      );

      if (!isParticipant) {
        console.log(
          `❌ User ${sender_id} tried to send message to conversation ${conversation_id} WITHOUT being a participant.`
        );
        return; // non invia né salva
      }

      // SAVE MESSAGE
      const message = await db.one(
        `INSERT INTO messages (conversation_id, sender_id, text)
         VALUES ($1, $2, $3)
         RETURNING id, conversation_id, sender_id, text, created_at`,
        [conversation_id, sender_id, content]
      );

      // BROADCAST TO ROOM
      io.to(`conversation_${conversation_id}`).emit("new_message", message);
      console.log("📩 Sent message:", message);
    } catch (error) {
      console.error("🔥 Error saving message:", error);
    }
  });
}
