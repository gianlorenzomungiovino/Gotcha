import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useChat } from "../hooks/useChat";
import { InputBox } from "./InputBox";
import { BackButton } from "./BackButton";
import { useChatContext } from "./ChatContext";

// Pool di colori per i nomi utente
const USER_COLORS = [
  "#e74c3c", // rosso
  "#e67e22", // arancione
  "#f1c40f", // giallo
  "#2ecc71", // verde
  "#1abc9c", // turchese
  "#3498db", // blu
  "#9b59b6", // viola
  "#e91e63", // rosa
];

// Funzione per ottenere un colore consistente per ogni username
function getUserNameColor(username) {
  if (!username) return "#666";
  // Hash semplice basato sull'username per avere sempre lo stesso colore per lo stesso utente
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = (hash << 5) - hash + username.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  hash = Math.abs(hash);
  return USER_COLORS[hash % USER_COLORS.length];
}

// Componente per le reazioni ai messaggi
function MessageReactions({ reactions, onReaction }) {
  const reactionEmojis = {
    like: "👍",
    love: "❤️",
    laugh: "😂",
    wow: "😮",
    sad: "😢",
    angry: "😠",
    hmmm: "🤔",
  };

  const handleReactionClick = (reaction) => {
    if (!reactions[reaction]) {
      reactions[reaction] = 0;
    }
    onReaction(reaction);
  };

  return (
    <div className="message-reactions">
      {Object.entries(reactions).map(([reaction, count]) => {
        const emoji = reactionEmojis[reaction] || "😊";
        return (
          <button
            key={reaction}
            className={`reaction-btn ${count > 0 ? "active" : ""}`}
            data-reaction={reaction}
            onClick={() => handleReactionClick(reaction)}
          >
            {emoji}
            {count > 0 && <span className="reaction-count">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}

export default function Chat() {
  const { convId } = useParams();
  const {
    messages,
    chatBoxRef,
    isAtBottom,
    handleScrollBottom,
    handleScrollBtn,
  } = useChat(convId);
  const { reactions, toggleReaction } = useChatContext();

  // Recupera le reazioni per questa conversazione
  const [conversationReactions, setConversationReactions] = useState([]);

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `http://localhost:3001/messages/${convId}/reaction`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (res.ok) {
          const data = await res.json();
          setConversationReactions(data.reactions || []);
        }
      } catch (err) {
        console.error("Errore fetch reazioni:", err);
      }
    };

    if (convId) {
      fetchReactions();
    }
  }, [convId]);

  // Recupera le reazioni per ogni messaggio
  const [messageReactions, setMessageReactions] = useState({});

  useEffect(() => {
    const fetchMessageReactions = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(
          `http://localhost:3001/messages/${convId}/reaction`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (res.ok) {
          const data = await res.json();
          // Organizza le reazioni per messaggio
          const reactionsByMessage = {};
          data.reactions?.forEach((r) => {
            if (!reactionsByMessage[r.messageId]) {
              reactionsByMessage[r.messageId] = {};
            }
            reactionsByMessage[r.messageId][r.reaction] =
              (reactionsByMessage[r.messageId][r.reaction] || 0) + 1;
          });
          setMessageReactions(reactionsByMessage);
        }
      } catch (err) {
        console.error("Errore fetch reazioni messaggi:", err);
      }
    };

    if (convId) {
      fetchMessageReactions();
    }
  }, [convId]);

  return (
    <div className="chat-layout">
      <div className="chat-header">
        <BackButton onClick={() => (window.location.href = "/chatlist")} />
        <h3>Chat con {convId}</h3>

        {/* Reazioni alla conversazione */}
        {conversationReactions.length > 0 && (
          <div className="conversation-reactions">
            <span className="reactions-label">Reazioni:</span>
            {conversationReactions.map((emoji) => (
              <span
                key={emoji}
                onClick={() => toggleReaction(convId, emoji)}
                title={`Rimuovi reazione ${emoji}`}
                className="reaction-emoji"
              >
                {emoji}
              </span>
            ))}
          </div>
        )}
      </div>

      <div
        ref={chatBoxRef}
        onScroll={handleScrollBottom}
        className="messages-container"
      >
        {messages.map((msg, index) => (
          <span key={index} className={`message-bubble ${msg.sender}`}>
            {msg.sender === "other" && msg.sender_username && (
              <div
                className="message-username"
                style={{ color: getUserNameColor(msg.sender_username) }}
              >
                {msg.sender_username}
              </div>
            )}
            {msg.text}

            {/* Reazioni al messaggio */}
            {messageReactions[msg.id] && (
              <MessageReactions
                reactions={messageReactions[msg.id]}
                onReaction={(reaction) => toggleReaction(msg.id, reaction)}
              />
            )}

            {/* Read Receipts - doppio check */}
            {msg.sender === "other" && <span className="read-receipt">✓✓</span>}
          </span>
        ))}
      </div>
      {isAtBottom || (
        <button onClick={handleScrollBtn} className="scroll-bottom-btn">
          <img
            id="scroll-bottom-arrow"
            src="/down-arrow-download-svgrepo-com.svg"
          />
        </button>
      )}
      <InputBox />
    </div>
  );
}
