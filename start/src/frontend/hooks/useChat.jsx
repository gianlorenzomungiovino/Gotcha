import { useEffect, useRef, useState } from "react";
import { useChatContext } from "../componenti/ChatContext";
import useAuth from "../../contesti/useAuth";

// 🔐 E2EE: Decifra un messaggio con la chiave privata dell'utente
async function decryptMessage(encryptedContent, privateKey) {
  try {
    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", salt: encryptedContent.salt, iv: encryptedContent.iv },
      privateKey,
      encryptedContent.ciphertext,
    );
    return new TextDecoder().decode(decrypted).toString();
  } catch (err) {
    console.error("E2EE Decryption failed:", err);
    return encryptedContent; // Fallback se non cifrato
  }
}

export function useChat(convId) {
  const { messages, setCurrentConversation, incrementUnread } =
    useChatContext();
  const { user } = useAuth();
  const chatBoxRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [decryptedMessages, setDecryptedMessages] = useState([]);

  // Genera chiave privata per E2EE (se non esiste)
  useEffect(() => {
    if (!user) return;

    let privateKey = localStorage.getItem(`e2ee_private_key_${user.id}`);
    if (!privateKey) {
      const cryptoKey = window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"],
      );
      window.crypto.subtle.exportKey("raw", cryptoKey).then((key) => {
        window.crypto.subtle
          .exportKey("raw", key)
          .then((exportedKey) => {
            privateKey = btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
            localStorage.setItem(`e2ee_private_key_${user.id}`, privateKey);
          })
          .catch(console.error);
      });
    }

    // Carica i messaggi della conversazione
  }, [convId, user]);

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

        // 🔐 Decifra i messaggi E2EE (se presenti)
        const privateKey = localStorage.getItem(
          `e2ee_private_key_${user.id}`,
        );

        // Mappa asincrona dei messaggi con Promise.all()
        const formattedMessages = await Promise.all(
          data.map(async (msg) => {
            let content = msg.text;
            if (msg.encrypted && privateKey) {
              content = await decryptMessage(msg, privateKey);
            }
            return {
              content,
              sender: msg.sender_id === user?.id ? "user" : "other",
              sender_username: msg.sender_username,
              encrypted: msg.encrypted || false,
            };
          }),
        );

        console.log("Formatted messages:", formattedMessages);
        setDecryptedMessages(formattedMessages);
      } catch (err) {
        console.error("Errore nel caricamento dei messaggi:", err);
      }
    };

    fetchMessages();
  }, [convId, user]);

  // 📬 Gestione read receipts: quando arriva un nuovo messaggio incrementa non letti
  useEffect(() => {
    if (messages.length > decryptedMessages.length) {
      incrementUnread();
    }
  }, [messages.length, decryptedMessages.length]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [decryptedMessages]); // Usa decryptedMessages invece di messages

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
    messages: decryptedMessages, // Restituisce i messaggi decifrati
    chatBoxRef,
    isAtBottom,
    handleScrollBottom,
    handleScrollBtn,
  };
}
