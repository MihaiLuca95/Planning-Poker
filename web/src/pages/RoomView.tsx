import { Navigate, useParams } from "react-router-dom";
import { useRoomStore } from "../store/store";

export const RoomView = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const exists = useRoomStore((state) => state.exists);
  const rooms = useRoomStore((state) => state.roomUUID);
  console.log("rooms: ", rooms);


  if (!uuid || !exists(uuid)) {
    // redirect to Lobby if UUID doesn't exist in store
    return <Navigate to="/" replace />;
  }
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome to Room</h1>
      <p>Room ID:</p>
      <p>You are now in the room. 🎉</p>
    </div>
  );
};
