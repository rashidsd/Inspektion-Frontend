import { ReactNode, useEffect, useMemo } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { useThemeStore } from "../stores/themeStore";
import { buildTheme } from "./theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const mode = useThemeStore((state) => state.mode);
  const primaryColor = useThemeStore((state) => state.primaryColor);
  const hydrateTheme = useThemeStore((state) => state.hydrateTheme);

  useEffect(() => {
    hydrateTheme();
  }, [hydrateTheme]);

  const theme = useMemo(
    () => buildTheme(mode, primaryColor),
    [mode, primaryColor]
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

/** @deprecated Use ThemeProvider — kept for existing index.js import path */
export const AppThemeProvider = ThemeProvider;
