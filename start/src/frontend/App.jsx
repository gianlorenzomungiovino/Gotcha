import { Routes, Route } from "react-router-dom";
import Login from "./componenti/login";
import Register from "./componenti/Register";
import Chatlist from "./componenti/Chatlist";
import Chat from "./componenti/Chat";
import CreateChat from "./componenti/CreateChat";
import UserSettings from "./componenti/UserSettings";
import { AuthProvider } from "../contesti/AuthContext";
import { ProtectedRoute } from "../contesti/ProtectedRoute";
import { ChatProvider } from "./componenti/ChatContext";

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

        <Route
          path="/create-chat"
          element={
            <ProtectedRoute>
              <CreateChat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/:convId"
          element={
            <ProtectedRoute>
              <ChatProvider>
                <Chat />
              </ChatProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <UserSettings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
