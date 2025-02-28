import { create } from "zustand";

export const useThemeStore: any = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",
  setTheme: (theme: any) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));
