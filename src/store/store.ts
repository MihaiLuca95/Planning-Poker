import { create } from "zustand";

interface RoomStore {
  roomUUID: string;
  setRoomUUID: (uuid: string) => void;
  exists: (uuid: string) => boolean;
}

export const useStore = create((set) => ({
  status: false,
  setStatus: (status: boolean) => set(() => ({ status })),
}));

export const useRoomStore = create<RoomStore>((set, get) => ({
  roomUUID: "",
  setRoomUUID: (uuid: string) => set(() => ({ roomUUID: uuid })),
  exists: (uuid: string) => get().roomUUID === uuid,
}));
