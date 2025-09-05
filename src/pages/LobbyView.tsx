import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useRoomStore } from "../store/store";

export const LobbyView = () => {
  const navigate = useNavigate();
  const setRoomUUID = useRoomStore((state) => state.setRoomUUID);

  const handleJoinRoom = () => {
    const roomUUID = uuidv4();
    setRoomUUID(roomUUID); // add UUID in store
    navigate(`/room/${roomUUID}`);
  };

  return (
    <div>
      <button onClick={handleJoinRoom}>Join Room</button>
    </div>
  );
};
