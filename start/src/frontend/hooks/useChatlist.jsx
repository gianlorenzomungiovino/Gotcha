import { useEffect, useState } from "react";
import useAuth from "../../contesti/useAuth";

const useConversation = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(`http://localhost:3001/conversations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        // Recupera le reazioni per ogni conversazione
        if (data && Array.isArray(data)) {
          const conversationsWithReactions = await Promise.all(
            data.map(async (conv) => {
              try {
                const reactionsRes = await fetch(
                  `http://localhost:3001/messages/${conv.conversation_id}/reaction`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  },
                );
                const reactionsData = await reactionsRes.json();

                return {
                  ...conv,
                  reactions: reactionsData.reactions || [],
                };
              } catch (err) {
                console.error(
                  `Errore fetch reazioni per conversazione ${conv.conversation_id}:`,
                  err,
                );
                return { ...conv, reactions: [] };
              }
            }),
          );

          setConversations(conversationsWithReactions);
        } else {
          setConversations(data);
        }
      } catch (err) {
        console.error("Errore fetch conversazioni:", err);
      }
    };

    fetchConversations();
  }, [user]);

  return conversations;
};

export default useConversation;
