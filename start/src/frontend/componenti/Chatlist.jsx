import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useConversation from "../hooks/useChatlist";
import { useChatContext } from "./ChatContext";

export default function Chatlist() {
  const conversations = useConversation();
  const navigate = useNavigate();
  const { unreadCount, clearUnread, toggleReaction } = useChatContext();
  const [swipeDirection, setSwipeDirection] = useState(null);

  const handleOpenChat = (convId) => {
    console.log("Opening chat with conversation ID:", convId);
    navigate(`/chat/${convId}`);
  };

  // Gestione swipe gestures mobile
  const chatItemRefs = useRef({});
  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e, convId) => {
    touchStartX = e.touches[0].clientX;
  };

  const handleTouchMove = (e, convId) => {
    setSwipeDirection((prev) => (prev ? prev : "left")); // Default swipe left per aprire
  };

  const handleTouchEnd = (e, convId) => {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipeGesture(touchStartX, touchEndX, convId);
  };

  const handleSwipeGesture = (start, end, convId) => {
    const diff = start - end;
    const threshold = 50; // Minimo swipe per considerarlo valido

    if (Math.abs(diff) < threshold) return;

    if (diff > 0) {
      // Swipe left -> aprire chat
      console.log("Swipe left detected for convId:", convId);
      navigate(`/chat/${convId}`);
    } else {
      // Swipe right -> ignorare/marche
      console.log("Swipe right detected - ignoring chat");
    }
  };

  return (
    <div className="chat-list">
      <div className="chat-header">
        <h3>Chat Recenti</h3>
        <button
          onClick={() => navigate("/create-chat")}
          className="btn-primary"
        >
          + Nuova Chat
        </button>
        {unreadCount > 0 && (
          <span className="unread-badge" title={`${unreadCount} messaggi non letti`}>
            🔔 {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>

      {conversations.map((conv) => (
        <div
          key={conv.conversation_id}
          className="chat-item"
          onClick={() => handleOpenChat(conv.conversation_id)}
          onTouchStart={(e) => handleTouchStart(e, conv.conversation_id)}
          onTouchMove={(e) => handleTouchMove(e, conv.conversation_id)}
          onTouchEnd={(e) => handleTouchEnd(e, conv.conversation_id)}
          style={{
            touchAction: "none",
            userSelect: "none",
            WebkitUserSelect: "none",
          }}
        >
          <div className="chat-item-header">
            <strong>{conv.other_username}</strong>
            {conv.unread_count > 0 && (
              <span className="unread-indicator" title={`${conv.unread_count} non letti`}>
                •••
              </span>
            )}
          </div>
          <div className="chat-item-last">
            <span>{conv.last_message}</span>
            <small>
              {conv.last_message_time
                ? new Date(conv.last_message_time).toLocaleString()
                : "Nessun messaggio"}
            </small>
          </div>

          {/* Reazioni emoji */}
          {conv.reactions && conv.reactions.length > 0 && (
            <div className="message-reactions">
              {conv.reactions.map((emoji) => (
                <span
                  key={emoji}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleReaction(conv.conversation_id, emoji);
                  }}
                  title={`Rimuovi reazione ${emoji}`}
                >
                  {emoji}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="settings-section">
        <h4>Impostazioni</h4>
        <button onClick={() => navigate("/settings")} className="btn-secondary">
          Impostazioni Account
        </button>
        <button onClick={clearUnread} className="btn-tertiary">
          Segna tutti come letti
        </button>
      </div>
    </div>
  );
}
