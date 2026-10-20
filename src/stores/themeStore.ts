import { create } from "zustand";

export type ThemeMode = "light" | "dark";
export type NavLayout = "sidebar" | "menubar";

export const PRESET_COLORS = [
  { label: "Navy", value: "#0B3A5B" },
  { label: "Flame", value: "#d84315" },
  { label: "Crimson", value: "#c62828" },
  { label: "Pink", value: "#ad1457" },
  { label: "Purple", value: "#6a1b9a" },
  { label: "Indigo", value: "#283593" },
  { label: "Blue", value: "#1565c0" },
  { label: "Teal", value: "#00695c" },
  { label: "Green", value: "#2e7d32" },
  { label: "Amber", value: "#f57f17" },
  { label: "Brown", value: "#4e342e" },
  { label: "Steel", value: "#37474f" },
];

export const DEFAULT_COLOR = "#0B3A5B";
export const DEFAULT_NAV_LAYOUT: NavLayout = "sidebar";
const NAV_LAYOUT_KEY = "navLayout_v2";

interface ThemeState {
  mode: ThemeMode;
  primaryColor: string;
  navLayout: NavLayout;
  hydrateTheme: () => void;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
  setPrimaryColor: (color: string) => void;
  setNavLayout: (layout: NavLayout) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: "light",
  primaryColor: DEFAULT_COLOR,
  navLayout: DEFAULT_NAV_LAYOUT,

  hydrateTheme: () => {
    const storedMode = localStorage.getItem("themeMode");
    const storedColor = localStorage.getItem("themePrimaryColor");
    const storedNavLayout = localStorage.getItem(NAV_LAYOUT_KEY);
    const navLayout: NavLayout =
      storedNavLayout === "menubar" ? "menubar" : DEFAULT_NAV_LAYOUT;

    if (!storedNavLayout) {
      localStorage.setItem(NAV_LAYOUT_KEY, DEFAULT_NAV_LAYOUT);
    }

    set({
      mode: storedMode === "dark" ? "dark" : "light",
      primaryColor: storedColor || DEFAULT_COLOR,
      navLayout,
    });
  },

  toggleTheme: () =>
    set((state) => {
      const mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", mode);
      return { mode };
    }),

  setMode: (mode) => {
    localStorage.setItem("themeMode", mode);
    set({ mode });
  },

  setPrimaryColor: (primaryColor) => {
    localStorage.setItem("themePrimaryColor", primaryColor);
    set({ primaryColor });
  },

  setNavLayout: (navLayout) => {
    localStorage.setItem(NAV_LAYOUT_KEY, navLayout);
    set({ navLayout });
  },
}));
