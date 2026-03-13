import { useState } from "react";
import { useInputBox } from "../hooks/useInputBox";

export function InputBox() {
  const {
    inputValue,
    setInputValue,
    isOtherUserTyping,
    typingUser,
    handleSubmit,
  } = useInputBox();
  const [files, setFiles] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);

  // Gestione upload file
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    // Preview immagini
    selectedFiles.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          console.log("Image preview:", e.target.result, file.name);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Rimuovi file
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // AI Suggestions (placeholder - da collegare a API AI)
  const handleAiSuggestions = async () => {
    try {
      const response = await fetch("http://localhost:3001/ai/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ context: inputValue }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiSuggestions(data.suggestions || []);
      }
    } catch (err) {
      console.error("AI suggestions error:", err);
    }
  };

  // Rimuovi suggerimento AI
  const removeAiSuggestion = (index) => {
    setAiSuggestions((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="input-container">
      <span id="typing-msg" className={isOtherUserTyping ? "visible" : ""}>
        {typingUser ? `${typingUser} sta scrivendo...` : ""}
      </span>

      <div className="input-btn-box">
        {/* Upload file */}
        <label htmlFor="file-upload" className="file-upload-btn">
          📎
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>

        {/* AI Suggestions */}
        {aiSuggestions.length > 0 && (
          <div className="ai-suggestions">
            {aiSuggestions.map((suggestion, index) => (
              <span
                key={index}
                onClick={() => setInputValue((prev) => prev + suggestion)}
                className="suggestion-chip"
              >
                {suggestion}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAiSuggestion(index);
                  }}
                  className="remove-btn"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <input
          type="text"
          placeholder="Scrivi un messaggio..."
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value);
            // Debounce per AI suggestions (da implementare con setTimeout)
          }}
          autoFocus
        />

        {/* Bottone AI Suggestions */}
        <button
          onClick={handleAiSuggestions}
          className="ai-btn"
          title="AI Suggestions"
        >
          ✨
        </button>

        {/* Invio */}
        <button onClick={handleSubmit}>
          <img src="/send-message-svgrepo-com.svg" alt="Invio" />
        </button>
      </div>

      {/* File upload preview */}
      {files.length > 0 && (
        <div className="file-preview">
          {files.map((file, index) => (
            <div key={index} className="file-item">
              {file.type.startsWith("image/") ? (
                <img src={URL.createObjectURL(file)} alt={file.name} />
              ) : (
                <span>{file.name}</span>
              )}
              <button onClick={() => removeFile(index)}>🗑️</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
