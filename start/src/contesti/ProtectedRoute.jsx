import { Navigate } from "react-router-dom";
import useAuth from "./useAuth";

// eslint-disable-next-line react/prop-types
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Caricamento...</p>;

  if (!user) return <Navigate to="/login" />;

  return children;
}
