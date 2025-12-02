import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function ChatList() {
  const { user } = useAuth(); // contiene { id, username }
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/conversations/${user.id}`
        );
        const data = await res.json();
        setConversations(data);
      } catch (err) {
        console.error("Errore fetch conversazioni:", err);
      }
    };

    fetchConversations();
  }, [user]);

  const handleOpenChat = (convId) => {
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
            <small>{new Date(conv.last_message_time).toLocaleString()}</small>
          </div>
        </div>
      ))}
    </div>
  );
}
