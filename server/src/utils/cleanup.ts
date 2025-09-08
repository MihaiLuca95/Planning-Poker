import { rooms } from "store";

export const cleanupInactiveRooms = () => {
  const now = Date.now();
  const INACTIVITY_LIMIT = 1000 * 60 * 60; // 1 hour

  for (const [roomId, room] of rooms.entries()) {
    if (now - room.updatedAt > INACTIVITY_LIMIT) {
      rooms.delete(roomId);
      console.log(`Cleaned up inactive room: ${roomId}`);
    }
  }
};
