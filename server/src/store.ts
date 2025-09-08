import { Client, Room } from "types";

export const rooms = new Map<string, Room>();
export const clients = new Map<string, Client>();

export const deckValues = {
  fibonacci: ["1", "2", "3", "5", "8", "13", "?", "☕"],
};
