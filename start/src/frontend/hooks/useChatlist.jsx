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
        setConversations(data);
      } catch (err) {
        console.error("Errore fetch conversazioni:", err);
      }
    };

    fetchConversations();
  }, [user]);

  return conversations;
};

export default useConversation;
