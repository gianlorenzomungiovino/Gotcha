import { useEffect, useRef, useState } from "react";
import { useChatContext } from "../componenti/ChatContext";
import useAuth from "../../contesti/useAuth";

export function useChat(convId) {
  const { messages, setConversationMessages, setCurrentConversation } =
    useChatContext();
  const { user } = useAuth();
  const chatBoxRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Carica i messaggi della conversazione
  useEffect(() => {
    if (!convId || !user) {
      console.log("useChat: Missing convId or user", { convId, user });
      return;
    }

    setCurrentConversation(convId);

    const fetchMessages = async () => {
      try {
        const token = sessionStorage.getItem("token");
        console.log(
          "Fetching messages for conversation:",
          convId,
          "with token:",
          token ? "present" : "missing",
          "user:",
          user,
        );

        if (!token) {
          console.error("No token found in sessionStorage");
          return;
        }

        const res = await fetch(`http://localhost:3001/messages/${convId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response status:", res.status);

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Response error:", errorText);
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        console.log("Messages data received:", data);

        // Trasforma i dati dal backend per matchare il formato frontend
        const formattedMessages = data.map((msg) => ({
          content: msg.text,
          sender: msg.sender_id === user?.id ? "user" : "bot",
        }));

        console.log("Formatted messages:", formattedMessages);
        setConversationMessages(formattedMessages);
      } catch (err) {
        console.error("Errore nel caricamento dei messaggi:", err);
      }
    };

    fetchMessages();
  }, [convId, user]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  function handleScrollBottom() {
    if (chatBoxRef.current) {
      const { scrollTop, clientHeight, scrollHeight } = chatBoxRef.current;

      // Condizione: Sei in fondo se la somma di `scrollTop` e `clientHeight` è
      // circa uguale a `scrollHeight` (con una tolleranza di 10px).
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
    }
  }

  function handleScrollBtn() {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }

  return {
    messages,
    chatBoxRef,
    isAtBottom,
    handleScrollBottom,
    handleScrollBtn,
  };
}
