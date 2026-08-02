import { create } from "zustand";

interface UIState {
  isLoading: boolean;
  toast: { type: "success" | "error" | "info"; message: string } | null;
  showWelcomeModal: boolean;
  setLoading: (v: boolean) => void;
  showToast: (toast: { type: "success" | "error" | "info"; message: string }) => void;
  clearToast: () => void;
  setShowWelcome: (v: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  toast: null,
  showWelcomeModal: false,
  setLoading: (v) => set({ isLoading: v }),
  showToast: (toast) => {
    set({ toast });
    setTimeout(() => set({ toast: null }), 3000);
  },
  clearToast: () => set({ toast: null }),
  setShowWelcome: (v) => set({ showWelcomeModal: v }),
}));
