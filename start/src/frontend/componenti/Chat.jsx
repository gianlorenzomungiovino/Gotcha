import { useParams } from "react-router-dom";
import { useChat } from "../hooks/useChat";
import { InputBox } from "./InputBox";

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

export default function Chat() {
  const { convId } = useParams();
  const {
    messages,
    chatBoxRef,
    isAtBottom,
    handleScrollBottom,
    handleScrollBtn,
  } = useChat(convId);

  return (
    <div className="chat-layout">
      <div
        ref={chatBoxRef}
        onScroll={handleScrollBottom}
        className="messages-container"
      >
        {messages.map((msg, index) => (
          <span
            key={index}
            className={`message-bubble ${msg.sender}`}
          >
            {msg.sender === "other" && msg.sender_username && (
              <div
                className="message-username"
                style={{ color: getUserNameColor(msg.sender_username) }}
              >
                {msg.sender_username}
              </div>
            )}
            {msg.content}
          </span>
        ))}
      </div>
      <button
        onClick={handleScrollBtn}
        className="scroll-bottom-btn"
      >
        <img
          id="scroll-bottom-arrow"
          src="\down-arrow-download-svgrepo-com.svg"
        />
      </button>
      <InputBox />
    </div>
  );
}
