import { useState } from "react";
import { useChatContext } from "../componenti/ChatContext";
import { useFetch } from "./useFetch";

export function useInputBox() {
  const { addMessage } = useChatContext();
  const [inputValue, setInputValue] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);

  const { data, error } = useFetch();

  // const risposteBot = [
  //   "Ciao",
  //   "Come stai?",
  //   "Tutto bene, grazie e tu?",
  //   "anche io bene, grazie per aver chiesto",
  //   "Spero che tu stia avendo una giornata fantastica! 😊",
  //   "Ah, è sempre bello parlare con te!",
  //   "Suona davvero interessante!",
  //   "Mi piace il tuo entusiasmo!",
  //   "Hai bisogno di qualcosa di specifico?",
  //   "Ciao! Come posso aiutarti oggi?",
  //   "Interessante, raccontami di più!",
  //   "Non sono sicuro di aver capito, potresti ripetere?",
  //   "Che bello sentirti!",
  //   "Grazie per aver condiviso!",
  // ];

  function handleSubmit() {
    const cleanInput = inputValue.trim();

    if (cleanInput) {
      addMessage(cleanInput, "user");
      setInputValue("");

      const randomDelay1 = Math.random() * 3000 + 1500;
      const randomDelay2 = randomDelay1 + Math.random() * 2500 + 1500;
      setTimeout(() => {
        setTimeout(() => {
          if (data) {
            const rispostaSuccessiva =
              data.risposteBot[
                Math.floor(Math.random() * data.risposteBot.length)
              ];
            addMessage(rispostaSuccessiva, "bot");
          } else {
            addMessage("Errore nel caricamento delle risposte del bot.", "bot");
          }
          setIsBotTyping(false);
        }, randomDelay2);
        setIsBotTyping(true);
      }, randomDelay1);
    }
  }

  return { inputValue, setInputValue, isBotTyping, handleSubmit, error };
}
