import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Login } from "./componenti/login";
import { Register } from "./componenti/Register";
import Chatlist from "./componenti/Chatlist";
import { AuthProvider } from "../contesti/AuthContext";
import { ProtectedRoute } from "../contesti/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/chatlist"
          element={
            <ProtectedRoute>
              <Chatlist />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
