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
      <span id="typing-msg" className={isOtherUserTyping ? "visible" : ""}>
        {typingUser ? `${typingUser} sta scrivendo...` : ""}
      </span>

      <div className="input-btn-box">
        <input
          type="text"
          placeholder="Messaggio"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          autoFocus
        />
        <button onClick={handleSubmit}>
          <img src="/send-message-svgrepo-com.svg" alt="Invio" />
        </button>
      </div>
    </div>
  );
}
