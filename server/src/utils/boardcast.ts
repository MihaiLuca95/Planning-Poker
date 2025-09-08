import { WebSocket } from "ws";
import { Room } from "types";
import { clients } from "store";

export const broadcast = (room: Room) => {
  const payload = {
    type: "room_state",
    room: {
      id: room.id,
      deck: room.deck,
      reveal: room.reveal,
      participants: Object.values(room.participants).map((p) => ({
        id: p.clientId,
        name: p.name,
        voted: p.vote != null,
        value: room.reveal ? p.vote ?? null : null,
      })),
    },
  };

  for (const client of clients.values()) {
    if (client.roomId === room.id && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  }
};
