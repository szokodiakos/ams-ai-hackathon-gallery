"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { themes, defaultTheme, type Theme } from "@/lib/themes";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: defaultTheme,
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function applyThemeToDOM(theme: Theme) {
  const root = document.documentElement;
  const c = theme.colors;
  root.style.setProperty("--color-bg", c.bg);
  root.style.setProperty("--color-bg-darker", c.bgDarker);
  root.style.setProperty("--color-card", c.card);
  root.style.setProperty("--color-card-border", c.cardBorder);
  root.style.setProperty("--color-card-border-hover", c.cardBorderHover);
  root.style.setProperty("--color-accent1", c.accent1);
  root.style.setProperty("--color-accent2", c.accent2);
  root.style.setProperty("--color-accent3", c.accent3);
  root.style.setProperty("--color-text", c.text);
  root.style.setProperty("--color-text-dim", c.textDim);
  root.style.setProperty("--color-header-bg", c.headerBg);
  root.style.setProperty("--color-header-border", c.headerBorder);
  root.style.setProperty("--color-glow1", c.glow1);
  root.style.setProperty("--color-glow2", c.glow2);

  // Effects as data attributes for CSS
  root.dataset.scanlines = theme.effects.scanlines ? "true" : "false";
  root.dataset.gridBg = theme.effects.gridBg ? "true" : "false";
  root.dataset.starfield = theme.effects.starfield ? "true" : "false";
  root.dataset.crtCurve = theme.effects.crtCurve ? "true" : "false";
  root.dataset.theme = theme.id;
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  const setTheme = useCallback((id: string) => {
    const found = themes.find((t) => t.id === id);
    if (found) {
      setThemeState(found);
      localStorage.setItem("arcade-theme", id);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("arcade-theme");
    const found = saved ? themes.find((t) => t.id === saved) : null;
    const initial = found ?? defaultTheme;
    setThemeState(initial);
    applyThemeToDOM(initial);
  }, []);

  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
