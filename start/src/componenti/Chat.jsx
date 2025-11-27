import { useChat } from "../hooks/useChat";

export function Chat() {
  const {
    messages,
    chatBoxRef,
    isAtBottom,
    handleScrollBottom,
    handleScrollBtn,
  } = useChat();

  return (
    <>
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
    </>
  );
}
