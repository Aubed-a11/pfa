import { create } from "zustand";
import { UserInfo } from "@/types";

interface AuthState {
  user: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: UserInfo, token: string) => void;
  logout: () => void;
  initFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
    set({ user: null, token: null, isAuthenticated: false });
  },

  initFromStorage: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      const userStr = localStorage.getItem("user");
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr) as UserInfo;
          set({ user, token, isAuthenticated: true });
        } catch {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
        }
      }
    }
  },
}));
