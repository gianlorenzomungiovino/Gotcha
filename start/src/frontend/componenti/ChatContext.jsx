import { createContext, useState, useContext } from "react";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);

  function setCurrentConversation(convId) {
    setConversationId(convId);
    setMessages([]);
  }

  function addMessage(content, sender) {
    setMessages((prevMessages) => [...prevMessages, { content, sender }]);
  }

  function setConversationMessages(msgs) {
    setMessages(msgs || []);
  }

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        conversationId,
        setCurrentConversation,
        setConversationMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  return useContext(ChatContext);
}
