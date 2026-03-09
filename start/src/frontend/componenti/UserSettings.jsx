import useAuth from "../../contesti/useAuth";
import { useNavigate } from "react-router-dom";

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
      <h2>Impostazioni Utente</h2>

      <div
        style={{ padding: "20px", background: "#f9f9f9", borderRadius: "8px" }}
      >
        <h3>Dati del tuo account:</h3>
        <p>
          <strong>Username:</strong> {user?.username}
        </p>
        <p>
          <strong>ID Utente:</strong> {user?.id}
        </p>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          background: "#fff3cd",
          borderRadius: "8px",
          border: "1px solid #ffc107",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0", color: "#856404" }}>Attenzione</h4>
        <p style={{ margin: 0, fontSize: "0.9em", color: "#856404" }}>
          L'eliminazione del tuo account rimuoverà definitivamente il tuo
          profilo dal sistema. Non potrai più accedere alla chat né creare nuove
          conversazioni.
        </p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleDeleteUser}
          className="btn-danger"
          style={{ padding: "10px 20px", fontSize: "1em" }}
        >
          Elimina il mio Account
        </button>
      </div>

      <div style={{ marginTop: "15px" }}>
        <button
          onClick={() => {
            logout();
            navigate("/login", {
              state: { message: "Logout effettuato. Effettuando login..." },
            });
          }}
          className="btn-secondary"
          style={{ padding: "10px 20px", fontSize: "1em" }}
        >
          Disconnetti (Logout)
        </button>
      </div>

      <p style={{ marginTop: "15px", fontSize: "0.85em", color: "#666" }}>
        Oppure torna alla{" "}
        <a href="/chatlist" style={{ color: "#007bff" }}>
          lista delle chat
        </a>
      </p>
    </div>
  );
}
