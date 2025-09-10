import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#906aff",
    },
    secondary: {
      main: "#ac8fff",
    },
    background: {
      default: "#f1ecff",
    },
  },
  typography: {
    fontFamily: "Inter, Arial, sans-serif",
  },
});

export default theme;
