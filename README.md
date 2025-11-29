Questa app è composta da due componenti principali: Chat.jsx e InputBox.jsx.
Il primo si occupa di renderizzare sia i messaggi scritti tramite l'input box dall'utente sia le risposte del bot.
ChatContext.jsx invece crea un contesto che serve a condividere i dati tra i componenti.

---

<!-- ChatContext.jsx -->

\_ ChatContext.jsx esporta ChatProvider, che wrappa tutti gli altri componenti a cui passa messages (lo stato attuale del messaggio che comprende contenuto e mittente) e addMessage.
Quest'ultima, è una funzione richiamata in InputBox, che prende come parametri il contenuto del messaggio (input dell'utente e le risposte del bot) e tiene traccia di tutti i messaggi tramite lo useState che va poi ad aggiungere di volta in volta all' array inizializzato vuoto:

    setMessages((prevMessages) => [...prevMessages, { content, sender }]);

    prevMessages è lo stato corrente dell'array di messaggi. Tramite spread operator viene creata una copia di questo a cui viene aggiunto un nuovo oggetto che contiene contenuto e mittente.
    Dopo che setMessages è chiamato, React ricalcola il componente e rende visibili i messaggi aggiornati.

ChatProvider infine ritorna il contesto chiamato a monte con la costante ChatContext con l'aggiunta del componente Provider:

    <ChatContext.Provider value={{ messages, addMessage }}>
      {children}
    </ChatContext.Provider>

    La funzione ChatProvider è una sorta di "contenitore" che fornisce i valori definiti nel value a tutti i componenti figli tramite il ChatContext.Provider.
    Il parametro { children } è una prop speciale in React che rappresenta tutto ciò che viene passato come "contenuto" al componente ChatProvider.

Questa sintassi è indispensabile per passare ai componenti children i dati contenuti in value.
Nel componente principale App.jsx viene quindi usato ChatProvider a wrappare tutto:

    <ChatProvider>
      <div className="chat-box">
        <Chat />
      </div>
      <div className="input-box">
        <InputBox />
      </div>
    </ChatProvider>

In aggiunta, la funzione useChatContext è un custom hook che con lo useContext permette ai componenti dove viene usato di accedere direttamente al contenuto del value del Provider.
Cioè invece di scrivere:

    const { messages, addMessage } = useContext(ChatContext);

Si semplifica una sola volta a monte:

    const { messages, addMessage } = useChatContext();

Nello specifico viene usato in Chat per per accedere a { messages } e in InputBox per accedere a { addMessages }.

---

<!-- InputBox.jsx -->

\_ InputBox.jsx è il componente deputato a renderizzare il campo input per la scrittura dei messaggi da parte dell'utente, inviarli con un button e contestualmente attivare le risposte del bot.

Per fare ciò serve accedere alla funzione { addMessage } di ChatContext (che aggiunge i messaggi all'array) e serve tenere traccia del value del campo input e del suo onChange tramite useState.

L'azione comincia all' onClick del button che richiama la funzione handleSubmit.
A monte di questa, tramite il metodo .trim(), viene evitato che venga compiuto il submit del messaggio qualora il value del campo input abbia spazi vuoti.
In caso contrario l'azione può proseguire richimando addMessage che aggiunge come content dell'oggetto l'inputValue trimmato e come sender "user".
A seguito di ciò si pulisce il campo input.

Viene poi mimata una risposta finta di un bot con un ritardo random che va dai 2 ai 6 sec.
Per fare ciò all'interno del setTimeout viene creata una costante rispostaSuccessiva che seleziona un indice casuale dall'array di stringhe risposteBot:

    risposteBot[Math.floor(Math.random() * risposteBot.length)]

    Genera casualmente un numero intero per scegliere l'indice da moltiplicare per la lunghezza dell'array risposteBot.

Fatto questo, la risposta scelta casualmente viene a sua volta aggiunta all'array di messaggi:

    addMessage(rispostaSuccessiva, "bot")

---

<!-- Chat.jsx -->

\_Chat.jsx si occupa di renderizzare i messaggi inviati dall'utente e le risposte del bot rispettivamente disposti a destra e a sinistra dell'interfaccia.

Viene richiamato { messages } da ChatContext e viene usato l'hook useRef inizializzato a null per accedere nativamente all'elemento <div> del DOM di modo che ad ogni nuovo messaggio lo scroll si posizioni automaticamente nel punto più in basso.

L'elemento <div> è il contenitore principale della chat dove al suo interno viene mappato l'array di messaggi messages (creato in ChatContext) generando un tag <span> per ogni messaggio. Con il placeholder msg di messages.map si accede a {msg.sender} per renderizzare il colore di sfondo e l'allineamento orizzontale in modo condizionale a seconda che il sender sia "user" o "bot".
Il contenuto del messaggio {msg.content} viene quindi utilizzato all'interno dello <span>.

Per scrollare automaticamente all'ultimo messaggio in basso viene usato uno useEffect che come dipendenza prende l'array messages (quindi ne monitora ogni cambiamento) e usa ChatBoxRef.current per accedere ak valore dell'elemento DOM:

    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }

    Se chatBoxRef.current esiste ed è associato ad un elemento DOM, la posizione corrente dello scroll verticale (.scrollTop) diventa l'altezza totale del contenuto di un elemento scrollabile, incluso il contenuto non visibile all'interno della viewport (.scrollHeight).

---
