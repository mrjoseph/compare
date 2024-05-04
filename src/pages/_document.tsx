import { Html, Head, Main, NextScript } from "next/document";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../theme/theme";


export default function Document() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Html lang="en">
        <Head />
        <AppRouterCacheProvider>
          <Main />
          <NextScript />
        </AppRouterCacheProvider>
      </Html>
    </ThemeProvider>
  );
}