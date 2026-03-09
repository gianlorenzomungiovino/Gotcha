import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "password") {
      const hasNumber = /\d/.test(value);
      const hasSpecial = /[!@#$%^&*()]/.test(value);
      const hasUpper = /[A-Z]/.test(value);
      const isLong = value.length >= 6;

      if (!hasNumber || !hasSpecial || !hasUpper || !isLong) {
        setMessage(
          "La password deve contenere almeno 6 caratteri, una maiuscola, un numero e un carattere speciale.",
        );
        setIsError(true);
      } else {
        setMessage("");
        setIsError(false);
      }
    }

    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch("http://localhost:5001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      let json;
      try {
        json = await response.json();
      } catch {
        json = {};
      }

      if (!response.ok) {
        throw new Error(json.message || "Errore durante la registrazione.");
      }

      setMessage("Registrazione completata! Vai al login..");
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    }
  };

  return (
    <div className="main-container">
      <form className="form registrazione" onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username.."
          onChange={handleChange}
          value={data.username}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password.."
          onChange={handleChange}
          value={data.password}
          required
        />

        {message && (
          <p className={isError ? "err-msg" : "success-msg"}>{message}</p>
        )}

        <button className="prosegui" disabled={isError} type="submit">
          Avanti
        </button>

        <p>
          Hai già un account?{" "}
          <Link to="/login" style={{ color: "#F7A441" }}>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
