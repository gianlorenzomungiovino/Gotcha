import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Recupera dati utente dal token
  async function fetchUser() {
    const token = sessionStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        sessionStorage.removeItem("token");
        setUser(null);
        setLoading(false);
        return;
      }

      const json = await res.json();
      setUser(json.user);
    } catch (err) {
      console.error("Errore fetchUser:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // LOGIN
  async function login(username, password) {
    try {
      const res = await fetch("http://localhost:5001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Errore login");

      sessionStorage.setItem("token", json.token);

      await fetchUser();

      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  // LOGOUT
  function logout() {
    sessionStorage.removeItem("token");
    setUser(null);
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, fetchUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
