import type { AuthState, User } from "@/utils/types";
import { create } from "zustand";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tokens: null,
  accessToken: null,
  refreshToken: null,
  isAuthModalOpen: false,
  loading: true,
  isAuthenticated: true,
  handleToggleAuthModal: () =>
    set((state) => ({
      isAuthModalOpen: !state.isAuthModalOpen,
    })),
  setUser: (user) =>
    set(() => {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
      return { user };
    }),
  setTokens: (access: string, refresh: string) =>
    set({
      accessToken: access,
      refreshToken: refresh,
    }),
  init: () => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      set({
        user: JSON.parse(savedUser) as User,
        tokens: JSON.parse(savedToken),
        accessToken: JSON.parse(savedToken).accessToken,
        refreshToken: JSON.parse(savedToken).refreshToken,
        isAuthenticated: true,
        loading: false,
      });
    } else {
      set({
        loading: false,
        isAuthenticated: false,
      });
    }
  },

  login: (data) =>
    set(() => {
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", JSON.stringify(data.tokens));

      return {
        user: data.user,
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken,
        isAuthenticated: true,
      };
    }),

  logout: () =>
    set(() => {
      localStorage.removeItem("user");
      localStorage.removeItem("tokens");

      return {
        user: null,
        tokens: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      };
    }),
}));
