import { createTheme, lighten, ThemeOptions } from "@mui/material/styles";

const baseOptions: ThemeOptions = {
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: ["Roboto", "system-ui", "Arial", "sans-serif"].join(","),
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: { root: { textTransform: "none", fontWeight: 500 } },
    },
    MuiCard: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined" },
    },
  },
};

export function buildTheme(mode: "light" | "dark", primaryColor: string) {
  const isLight = mode === "light";
  const paperBackground = isLight ? "#ffffff" : "#1e1e1e";
  const textColor = isLight ? "#000000de" : "#ffffffde";
  // Preset brand colors are dark; lighten in dark mode so outlined buttons/links stay readable.
  const primaryMain = isLight ? primaryColor : lighten(primaryColor, 0.4);

  return createTheme({
    ...baseOptions,
    palette: {
      mode,
      primary: { main: primaryMain },
      secondary: { main: isLight ? "#1565c0" : "#42a5f5" },
      background: {
        default: isLight ? "#f4f6f8" : "#121212",
        paper: paperBackground,
      },
      success: { main: isLight ? "#2e7d32" : "#4caf50" },
      warning: { main: isLight ? "#ed6c02" : "#ffa726" },
      error: { main: isLight ? "#d32f2f" : "#f44336" },
      info: { main: isLight ? "#0288d1" : "#29b6f6" },
    },
    components: {
      ...baseOptions.components,
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isLight ? "#f4f6f8" : "#121212",
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          input: {
            "&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus":
              {
                WebkitBoxShadow: `0 0 0 1000px ${paperBackground} inset`,
                WebkitTextFillColor: textColor,
                caretColor: textColor,
                transition: "background-color 5000s ease-in-out 0s",
              },
          },
        },
      },
    },
  });
}
