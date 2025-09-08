import { WebSocket, WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import { Client } from "types";
import { clients, rooms } from "store";
import { handleMessage } from "./handlers/messageHandler";
import { cleanupInactiveRooms } from "./utils";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;

const wss = new WebSocketServer({ port: PORT }, () => {
  console.log(`WebSocket server started on ws://localhost:${PORT}`);
});

setInterval(cleanupInactiveRooms, 1000 * 60 * 30); // Cleanup every 30 minutes

wss.on("connection", (ws: WebSocket) => {
  const client = ws as Client;
  client.id = uuidv4();
  clients.set(client.id, client);
  console.log(`Client connected: ${client.id}`);

  ws.on("message", (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      handleMessage(client, msg);
    } catch (error) {
      console.error("Failed to process message:", error);
      ws.send(
        JSON.stringify({ type: "error", message: "Invalid message format" })
      );
    }
  });

  ws.on("close", () => {
    clients.delete(client.id);
    if (client.roomId) {
      const room = rooms.get(client.roomId);
      if (room && room.participants[client.id]) {
        delete room.participants[client.id];
        if (Object.keys(room.participants).length === 0) {
          rooms.delete(room.id);
        } else {
          if (room.ownerId === client.id) {
            room.ownerId = Object.keys(room.participants)[0];
          }
          room.updatedAt = Date.now();
          // Broadcast updated room state
          import("./utils").then(({ broadcast }) => broadcast(room));
        }
      }
    }
    console.log(`Client disconnected: ${client.id}`);
  });
});

wss.on("error", (error) => {
  console.error("WebSocket server error:", error);
});
