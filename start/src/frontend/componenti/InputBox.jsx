import { useInputBox } from "../hooks/useInputBox";

export function InputBox() {
  const {
    inputValue,
    setInputValue,
    isOtherUserTyping,
    typingUser,
    handleSubmit,
  } = useInputBox();

  return (
    <div className="input-container">
      <span
        id="typing-msg"
        style={{
          opacity: isOtherUserTyping ? 0.9 : 0,
          transition: "opacity 0.1s ease-in-out",
          color: "black",
        }}
      >
        {typingUser ? `${typingUser} sta scrivendo...` : ""}
      </span>

      <div className="input-btn-box">
        <input
          className="input-text"
          type="text"
          placeholder="Messaggio"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <button onClick={handleSubmit}>
          <img
            src="\send-message-svgrepo-com.svg"
            alt="Invio"
            style={{ filter: "invert(100%)" }}
          />
        </button>
      </div>
    </div>
  );
}
