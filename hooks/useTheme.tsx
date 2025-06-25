import React, { createContext, useContext, useState, useMemo } from "react";
import {
  darkTheme,
  lightTheme,
  ThemeModelColors,
  ThemeModelTypography,
} from "../constants/themes/AppThemes";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  theme: typeof lightTheme;
  toggleTheme: () => void;
  mode: ThemeMode;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: React.PropsWithChildren<{}>) {
  const [mode, setMode] = useState<ThemeMode>("light");

  const toggleTheme = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  const theme = mode === "dark" ? darkTheme : lightTheme;

  const value = useMemo(() => ({ theme, toggleTheme, mode }), [mode]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): [
  colors: ThemeModelColors,
  typography: ThemeModelTypography,
  toggleTheme: () => void,
  mode: ThemeMode,
] {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return [
    context.theme.colors,
    context.theme.typography,
    context.toggleTheme,
    context.mode,
  ];
}
