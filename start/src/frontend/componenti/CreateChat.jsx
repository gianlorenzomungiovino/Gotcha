import { useState, useEffect } from "react";
import useAuth from "../../contesti/useAuth";
import { useNavigate } from "react-router-dom";
import { BackButton } from "./BackButton";

export default function CreateChat() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [participants, setParticipants] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Recupera la lista di tutti gli utenti
  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch("http://localhost:3001/auth/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setAllUsers(data);
      } else {
        setMessage("Errore nel recupero degli utenti");
        setIsError(true);
      }
    } catch (error) {
      console.error("Errore fetchUsers:", error);
      setMessage("Errore nella connessione al server");
      setIsError(true);
    }
  };

  // Carica gli utenti all'avvio del componente
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (event) => {
    const { name, value, checked } = event.target;

    if (name === "title") {
      setTitle(value);
    } else if (name === "createPrivate") {
      // Per chat privata, seleziona solo un utente
      setParticipants(checked ? [allUsers.find((u) => u.id === value)] : []);
    } else if (name.startsWith("participant_")) {
      // Gestione checkbox singoli partecipanti per chat di gruppo
      const userId = parseInt(name.split("_")[1], 10);
      const updated = checked
        ? [...participants, allUsers.find((u) => u.id === userId)]
        : participants.filter((p) => p.id !== userId);
      setParticipants(updated);
    } else if (name === "createGroup") {
      // Per chat di gruppo, seleziona tutti gli utenti selezionati
      const selected = Array.from(
        event.target.querySelectorAll('input[name="participant_"]'),
      )
        .filter((el) => el.checked)
        .map((el) =>
          allUsers.find((u) => u.id === parseInt(el.name.split("_")[1], 10)),
        );
      setParticipants(selected);
    }
  };

  const handleCreateChat = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setMessage("Inserisci un titolo per la chat");
      setIsError(true);
      return;
    }

    if (participants.length < 1) {
      setMessage("Seleziona almeno 1 partecipante per creare una chat");
      setIsError(true);
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      let res;

      // Crea chat privata o di gruppo
      if (event.target.createPrivate.checked) {
        // Chat privata 1-to-1 con un altro utente
        const otherUserId = participants[0]?.id;
        res = await fetch("http://localhost:3001/conversations/private", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ otherUserId }),
        });
      } else {
        // Chat di gruppo
        const participantIds = participants.map((p) => p.id);
        res = await fetch("http://localhost:3001/conversations/group", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            participants: participantIds,
          }),
        });
      }

      let json;
      try {
        json = await res.json();
      } catch {
        json = {};
      }

      if (!res.ok) {
        throw new Error(json.error || "Errore nella creazione della chat");
      }

      setMessage("Chat creata con successo!");
      setIsError(false);
    } catch (error) {
      console.error("Errore create chat:", error);
      setMessage(error.message);
      setIsError(true);
    }
  };

  return (
    <div className="main-container">
      <div className="chat-header">
        <div className="header-content">
          <BackButton onClick={() => window.location.href = "/chatlist"} />
          <h2>Crea Nuova Chat</h2>
        </div>
      </div>

      <form onSubmit={handleCreateChat}>
        <label htmlFor="title">Titolo della chat:</label>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Es: Squadra Progetto.."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            handleChange(e);
          }}
          required
          className="input-text"
        />

        <div className="form-group">
          <label>
            <input
              type="radio"
              name="createPrivate"
              value="private"
              checked={participants.length === 1}
              onChange={() => {
                const event = {
                  target: {
                    createPrivate: { checked: true },
                    createGroup: { checked: false },
                    querySelectorAll: () => [],
                  },
                };
                handleChange(event);
              }}
            />
            Chat Privata (1-to-1)
          </label>
        </div>

        <div className="form-group">
          <label>
            <input
              type="radio"
              name="createGroup"
              value="group"
              checked={participants.length > 1}
              onChange={() => {
                const event = {
                  target: {
                    createPrivate: { checked: false },
                    createGroup: { checked: true },
                    querySelectorAll: () =>
                      Array.from(
                        document.querySelectorAll('input[name="participant_"]'),
                      ),
                  },
                };
                handleChange(event);
              }}
            />
            Chat di Gruppo
          </label>
        </div>

        <h3>Seleziona Partecipanti:</h3>
        <p className="participants-hint">
          Clicca sugli utenti per selezionarli/deselezionarli
        </p>

        <div className="participants-list">
          {allUsers.map((u) => (
            <label key={u.id}>
              <input
                type="checkbox"
                name={`participant_${u.id}`}
                checked={participants.some((p) => p.id === u.id)}
                onChange={handleChange}
              />
              {u.username}
            </label>
          ))}
        </div>

        <button type="submit" className="btn-primary">
          Crea Chat
        </button>
      </form>

      {message && (
        <p className={isError ? "err-msg" : "success-msg"}>{message}</p>
      )}

      <div className="users-info">
        <h4>Utenti Disponibili ({allUsers.length})</h4>
        <ul>
          {allUsers.map((u) => (
            <li key={u.id}>{u.username}</li>
          ))}
        </ul>
      </div>

      <p className="note">
        Nota: L'utente loggato {user?.username} sarà automaticamente incluso
        come amministratore della chat.
      </p>
    </div>
  );
}
