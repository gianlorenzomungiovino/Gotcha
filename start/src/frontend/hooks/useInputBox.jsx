import { useState, useEffect, useRef } from "react";
import { useChatContext } from "../componenti/ChatContext";
import useAuth from "../../contesti/useAuth";
import io from "socket.io-client";

export function useInputBox() {
  const { addMessage, conversationId } = useChatContext();
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState("");
  const typingUserState = useState(null);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Connessione Socket.IO
  useEffect(() => {
    if (conversationId && user) {
      socketRef.current = io("http://localhost:3001", {
        auth: {
          token: sessionStorage.getItem("token"),
        },
      });

      const socket = socketRef.current;

      // Join conversation room
      socket.emit("join_conversation", conversationId);

      // Listen for typing events
      socket.on("user_typing", (data) => {
        if (data.user_id !== user.id) {
          setIsOtherUserTyping(true);
          typingUserState[1](data.username);
        }
      });

      socket.on("user_stop_typing", (data) => {
        if (data.user_id !== user.id) {
          setIsOtherUserTyping(false);
          typingUserState[1](null);
        }
      });

      // Listen for new messages
      socket.on("new_message", (message) => {
        // Aggiorna i messaggi quando arriva un nuovo messaggio
        const formattedMessage = {
          content: message.text,
          sender: message.sender_id === user.id ? "user" : "bot",
        };
        addMessage(formattedMessage.content, formattedMessage.sender);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [conversationId, user, addMessage]);

  const handleInputChange = (value) => {
    setInputValue(value);

    if (socketRef.current && conversationId) {
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Emit typing event
      socketRef.current.emit("typing", {
        conversation_id: conversationId,
        user_id: user.id,
        username: user.username,
      });

      // Set timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        if (socketRef.current) {
          socketRef.current.emit("stop_typing", {
            conversation_id: conversationId,
            user_id: user.id,
          });
        }
      }, 1000); // Stop typing after 1 second of inactivity
    }
  };

  async function handleSubmit() {
    const cleanInput = inputValue.trim();

    if (!cleanInput || !conversationId) return;

    // Stop typing before sending
    if (socketRef.current) {
      socketRef.current.emit("stop_typing", {
        conversation_id: conversationId,
        user_id: user.id,
      });
    }

    addMessage(cleanInput, "user");
    setInputValue("");

    try {
      const token = sessionStorage.getItem("token");

      // Invia il messaggio al backend
      const response = await fetch(
        `http://localhost:3001/messages/${conversationId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: cleanInput,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Il messaggio verrà ricevuto via socket, non serve ricaricare
    } catch (err) {
      console.error("Errore nell'invio del messaggio:", err);
      addMessage("Errore nell'invio del messaggio.", "bot");
    }
  }

  return {
    inputValue,
    setInputValue: handleInputChange,
    isOtherUserTyping,
    typingUser: typingUserState[1],
    handleSubmit,
  };
}
