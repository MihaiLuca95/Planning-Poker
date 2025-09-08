import { v4 as uuidv4 } from "uuid";
import { Client, Message } from "types";
import { rooms, deckValues } from "store";
import { broadcast } from "utils";

export const handleMessage = (client: Client, msg: Message) => {
  const room = client.roomId ? rooms.get(client.roomId) : null;

  switch (msg.type) {
    case "create_room": {
      const roomId = uuidv4();
      const room = {
        id: roomId,
        deck: msg.deck ?? "fibonacci",
        reveal: false,
        participants: {},
        updatedAt: Date.now(),
      };
      rooms.set(roomId, room);   
      client.send(JSON.stringify({ type: "room_created", roomId }));
      break;
    }
    case "join_room": {
      const room = rooms.get(msg.roomId);
      if (!room) {
        client.send(
          JSON.stringify({ type: "error", message: "Room not found" })
        );
        return;
      }
      client.roomId = room.id;
      client.name = msg.name?.slice(0, 40) || "Guest";
      room.participants[client.id] = {
        clientId: client.id,
        name: client.name,
        vote: null,
      };
      if (!room.ownerId) room.ownerId = client.id;
      room.updatedAt = Date.now();
      broadcast(room);
      break;
    }
    case "leave_room": {
      if (room && room.participants[client.id]) {
        delete room.participants[client.id];
        if (Object.keys(room.participants).length === 0) {
          rooms.delete(room.id);
        } else {
          if (room.ownerId === client.id) {
            room.ownerId = Object.keys(room.participants)[0];
          }
          room.updatedAt = Date.now();
          broadcast(room);
        }
      }
      client.roomId = undefined;
      client.name = undefined;
      break;
    }
    case "cast_vote": {
      if (
        room &&
        room.participants[client.id] &&
        deckValues[room.deck].includes(msg.value)
      ) {
        room.participants[client.id].vote = msg.value;
        room.updatedAt = Date.now();
        broadcast(room);
      }
      break;
    }
    case "reveal_votes": {
      if (room && room.ownerId === client.id) {
        room.reveal = true;
        room.updatedAt = Date.now();
        broadcast(room);
      }
      break;
    }
    case "reset_votes": {
      if (room && room.ownerId === client.id) {
        for (const participant of Object.values(room.participants)) {
          participant.vote = null;
        }
        room.reveal = false;
        room.updatedAt = Date.now();
        broadcast(room);
      }
      break;
    }
    case "set_deck": {
      if (room && room.ownerId === client.id && deckValues[msg.deck]) {
        room.deck = msg.deck;
        for (const participant of Object.values(room.participants)) {
          participant.vote = null;
        }
        room.reveal = false;
        room.updatedAt = Date.now();
        broadcast(room);
      }
      break;
    }
    default:
      client.send(
        JSON.stringify({ type: "error", message: "Unknown message type" })
      );
      break;
  }
};
