import { useNavigate } from "react-router-dom";
import useConversation from "../hooks/useChatlist";

export default function Chatlist() {
  const conversations = useConversation();
  const navigate = useNavigate();

  const handleOpenChat = (convId) => {
    console.log("Opening chat with conversation ID:", convId);
    navigate(`/chat/${convId}`);
  };

  return (
    <div className="chat-list">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <h3>Chat Recenti</h3>
        <button
          onClick={() => navigate("/create-chat")}
          className="btn-primary"
          style={{ fontSize: "0.9em" }}
        >
          + Crea Nuova Chat
        </button>
      </div>

      {conversations.map((conv) => (
        <div
          key={conv.conversation_id}
          className="chat-item"
          onClick={() => handleOpenChat(conv.conversation_id)}
        >
          <div className="chat-item-header">
            <strong>{conv.other_username}</strong>
          </div>
          <div className="chat-item-last">
            <span>{conv.last_message}</span>
            <small>
              {conv.last_message_time
                ? new Date(conv.last_message_time).toLocaleString()
                : "Nessun messaggio"}
            </small>
          </div>
        </div>
      ))}

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          background: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0" }}>Impostazioni</h4>
        <button
          onClick={() => navigate("/settings")}
          className="btn-secondary"
          style={{ fontSize: "0.9em" }}
        >
          Impostazioni Account
        </button>
      </div>
    </div>
  );
}
