import { ProfileType } from "@/lib/type/profileType";
import { create } from "zustand";

interface TokenType {
  accessToken: string;
  refreshToken: string;
}

interface UserStore {
  token: TokenType;
  setToken: (token: TokenType) => void;
  profile: ProfileType | null;
  setProfile: (profile: ProfileType) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  token: {
    accessToken:
      typeof window !== "undefined"
        ? localStorage.getItem("access_token") || ""
        : "",
    refreshToken:
      typeof window !== "undefined"
        ? localStorage.getItem("refresh_token") || ""
        : "",
  },
  setToken: (token: TokenType) =>
    set({
      token,
    }),
  profile: null,
  setProfile: (profile) =>
    set({
      profile,
    }),
}));
