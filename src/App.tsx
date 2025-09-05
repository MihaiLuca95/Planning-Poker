import { Route, Routes } from "react-router-dom";
import "./App.css";
import { LobbyView, RoomView } from "./pages";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LobbyView />} />
      <Route path="/room/:roomUUID" element={<RoomView />} />
    </Routes>
  );
};

export default App;
