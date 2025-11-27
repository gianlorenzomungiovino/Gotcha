import { useEffect, useRef, useState } from "react";
import { useChatContext } from "../componenti/ChatContext";

export function useChat() {
  const { messages } = useChatContext();
  const chatBoxRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

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
