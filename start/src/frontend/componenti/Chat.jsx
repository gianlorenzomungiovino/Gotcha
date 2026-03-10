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
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div ref={chatBoxRef} onScroll={handleScrollBottom} className="msg-box">
        {messages.map((msg, index) => (
          <span
            key={index}
            style={{
              display: "inline-block",
              flexDirection: "column",
              color: "black",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              border: "1px black",
              borderRadius: "7px",
              maxWidth: "66%",
              padding: "2px 15px",
              marginBottom: "1.5rem",
              backgroundColor: msg.sender === "user" ? "lightgreen" : "white",
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              wordWrap: "break-word",
              textAlign: "left",
            }}
          >
            {msg.sender === "other" && msg.sender_username && (
              <div
                style={{
                  fontWeight: "bold",
                  color: getUserNameColor(msg.sender_username),
                  marginBottom: "4px",
                }}
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
        style={{
          transition: "transform 0.3s ease",
          transformOrigin: "center",
          transform: !isAtBottom ? "scale(1)" : "scale(0)",
          pointerEvents: !isAtBottom ? "auto" : "none",
        }}
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
