import { useState } from "react";
import useAuth from "../../contesti/useAuth";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { login, fetchUser } = useAuth();
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const [messaggio, setMessaggio] = useState("");

  const navToChatlist = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await login(data.username, data.password);

      if (!response.success) {
        setMessaggio(response.message);
      } else {
        setMessaggio("login effettuato con successo");

        // Chiamata alla funzione fetchUser per aggiornare il contesto
        await fetchUser();

        navToChatlist("/chatlist");
      }
    } catch (error) {
      setMessaggio(error.message);
    }
  };

  return (
    <div className="main-container">
      <form className="form" onSubmit={handleLogin}>
        <label htmlFor="">Username:</label>
        <input
          type="text"
          name="username"
          onChange={handleChange}
          placeholder="Inserisci il tuo username.."
          required
        />
        <label htmlFor="">Password:</label>
        <input
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="Inserisci la tua Password.."
          required
        />

        <button type="submit">Login</button>
        <p>
          Non sei registrato?{" "}
          <Link to="/register" style={{ color: "#F7A441" }}>
            Registrati
          </Link>
        </p>
        {messaggio && (
          <p className="err-msg" style={{ textAlign: "center" }}>
            {messaggio}
          </p>
        )}
      </form>
    </div>
  );
}
