import { WebSocket } from "ws";

export type Client = WebSocket & { id: string; roomId?: string; name?: string };

export type Participant = {
  clientId: string;
  name: string;
  vote?: string | null;
};

export type Room = {
  id: string;
  deck: "fibonacci";
  reveal: boolean;
  participants: Record<string, Participant>;
  ownerId?: string;
  updatedAt: number;
};

export type Message =
  | { type: "create_room"; deck?: Room["deck"] }
  | { type: "join_room"; roomId: string; name: string }
  | { type: "leave_room" }
  | { type: "cast_vote"; value: string }
  | { type: "reveal_votes" }
  | { type: "reset_votes" }
  | { type: "set_deck"; deck: Room["deck"] };

export type ServerMessage =
  | { type: "room_created"; room: Room }
  | { type: "room_joined"; room: Room }
  | { type: "room_updated"; room: Room }
  | { type: "error"; message: string };
