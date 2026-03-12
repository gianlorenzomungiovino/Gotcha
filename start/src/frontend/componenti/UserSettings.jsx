import useAuth from "../../contesti/useAuth";
import { useNavigate } from "react-router-dom";
import { BackButton } from "./BackButton";

export default function UserSettings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDeleteUser = async () => {
    if (
      !confirm(
        "Sei sicuro di voler eliminare il tuo account? Questa azione non può essere annullata.",
      )
    ) {
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch("http://localhost:3001/auth/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let json;
      try {
        json = await res.json();
      } catch {
        json = {};
      }

      if (res.ok) {
        // Elimina token dal sessionStorage
        sessionStorage.removeItem("token");
        logout();
        navigate("/login", {
          state: {
            message: "Account eliminato con successo. Effettuando login...",
          },
        });
      } else {
        const error = json.error || "Errore nell'eliminazione dell'account";
        alert(error);
      }
    } catch (error) {
      console.error("Errore eliminazione utente:", error);
      alert("Errore nella connessione al server");
    }
  };

  return (
    <div className="main-container">
      <div className="chat-header">
        <div className="header-content">
          <BackButton onClick={() => window.location.href = "/chatlist"} />
          <h2>Impostazioni Utente</h2>
        </div>
      </div>

      <div className="card-info">
        <h3>Dati del tuo account:</h3>
        <p>
          <strong>Username:</strong> {user?.username}
        </p>
        <p>
          <strong>ID Utente:</strong> {user?.id}
        </p>
      </div>

      <div className="card-warning">
        <h4>Attenzione</h4>
        <p>
          L'eliminazione del tuo account rimuoverà definitivamente il tuo
          profilo dal sistema. Non potrai più accedere alla chat né creare nuove
          conversazioni.
        </p>
      </div>

      <div className="action-buttons">
        <button onClick={handleDeleteUser} className="btn-danger">
          Elimina il mio Account
        </button>

        <button
          onClick={() => {
            logout();
            navigate("/login", {
              state: { message: "Logout effettuato. Effettuando login..." },
            });
          }}
          className="btn-secondary"
        >
          Disconnetti (Logout)
        </button>
      </div>
    </div>
  );
}
