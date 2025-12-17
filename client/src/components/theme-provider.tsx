import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type ContrastMode = "normal" | "high";

interface ThemeProviderState {
  theme: Theme;
  contrastMode: ContrastMode;
  setTheme: (theme: Theme) => void;
  setContrastMode: (mode: ContrastMode) => void;
  toggleTheme: () => void;
  toggleContrast: () => void;
}

const ThemeContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "light";
    }
    return "light";
  });

  const [contrastMode, setContrastModeState] = useState<ContrastMode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("contrastMode") as ContrastMode) || "normal";
    }
    return "normal";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("high-contrast");
    if (contrastMode === "high") {
      root.classList.add("high-contrast");
    }
    localStorage.setItem("contrastMode", contrastMode);
  }, [contrastMode]);

  const setTheme = (newTheme: Theme) => setThemeState(newTheme);
  const setContrastMode = (mode: ContrastMode) => setContrastModeState(mode);
  const toggleTheme = () => setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  const toggleContrast = () => setContrastModeState((prev) => (prev === "normal" ? "high" : "normal"));

  return (
    <ThemeContext.Provider
      value={{ theme, contrastMode, setTheme, setContrastMode, toggleTheme, toggleContrast }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
