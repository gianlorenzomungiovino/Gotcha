import { createContext, useState, useContext, useEffect } from "react";

const ChatContext = createContext();

// Stato globale per messaggi non letti e reazioni
const initialState = {
  messages: [],
  conversationId: null,
  unreadCount: 0,
  reactions: {}, // { convId: [emoji1, emoji2] }
};

export function ChatProvider({ children }) {
  const [state, setState] = useState(initialState);

  // Carica messaggi non letti da localStorage all'avvio
  useEffect(() => {
    const savedUnread = localStorage.getItem("unreadCount");
    if (savedUnread) {
      setState((prev) => ({ ...prev, unreadCount: parseInt(savedUnread, 10) }));
    }
  }, []);

  // Salva messaggi non letti in localStorage
  useEffect(() => {
    localStorage.setItem("unreadCount", state.unreadCount.toString());
  }, [state.unreadCount]);

  function addMessage(content, sender) {
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, { content, sender }],
    }));
  }

  // Aggiorna count non letti
  function incrementUnread() {
    setState((prev) => ({ ...prev, unreadCount: prev.unreadCount + 1 }));
  }

  function decrementUnread() {
    setState((prev) => ({
      ...prev,
      unreadCount: Math.max(0, prev.unreadCount - 1),
    }));
  }

  // Imposta la conversazione corrente
  function setCurrentConversation(convId) {
    setState((prev) => ({ ...prev, conversationId: convId }));
  }

  // Aggiungi/rimuovi reazione a messaggio
  async function toggleReaction(convId, emoji) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/messages/${convId}/reaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ emoji }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Aggiorna localmente le reazioni (rimuovi l'emoji)
      setState((prev) => ({
        ...prev,
        reactions: {
          ...prev.reactions,
          [convId]: (prev.reactions[convId] || []).filter((e) => e !== emoji),
        },
      }));
    } catch (err) {
      console.error("Errore nel toggle reazione:", err);
    }
  }

  return (
    <ChatContext.Provider
      value={{
        messages: state.messages,
        addMessage,
        conversationId: state.conversationId,
        unreadCount: state.unreadCount,
        reactions: state.reactions,
        incrementUnread,
        decrementUnread,
        setCurrentConversation,
        toggleReaction,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  return useContext(ChatContext);
}
