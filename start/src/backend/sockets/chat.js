export default function chatSocket(io) {
  io.on("connection", (socket) => {
    console.log("🟢 Utente connesso:", socket.id);

    // L’utente entra in una conversazione (stanza)
    socket.on("join_conversation", (conversationId) => {
      socket.join(conversationId);
    });

    // Ricezione messaggio realtime
    socket.on("send_message", (data) => {
      const { conversationId, message } = data;

      // Invia a tutti tranne al mittente
      socket.to(conversationId).emit("receive_message", message);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Utente disconnesso:", socket.id);
    });
  });
}
