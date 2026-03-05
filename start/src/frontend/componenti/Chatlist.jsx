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
    </div>
  );
}
