import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    primary: {
      main: "#24292F",
    },
    secondary: {
      main: "#b0a8b9",
    },
  },
  overrides: {
    MuiListItemIcon: {
      root: {
        minWidth: 40,
      },
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
