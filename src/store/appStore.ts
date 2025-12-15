import type { AppState } from "@/utils/types";
import { create } from "zustand";

export const useAppStore = create<AppState>((set) => ({
  loading: {},
  toast: null,
  setToast: (toast) => set(() => ({ toast })),
  setLoading: (key: string, value: boolean) =>
    set((state) => ({
      loading: {
        ...state.loading,
        [key]: value,
      },
    })),
}));
