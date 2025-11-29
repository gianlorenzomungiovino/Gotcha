import "./App.css";
import { Chat } from "./componenti/Chat";
import { ChatProvider } from "./componenti/ChatContext";
import { InputBox } from "./componenti/InputBox";

function App() {
  return (
    <ChatProvider>
      <div className="chat-box">
        <Chat />
      </div>
      <div className="input-box">
        <InputBox />
      </div>
    </ChatProvider>
  );
}

export default App;
