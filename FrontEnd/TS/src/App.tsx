/*
 * Copyright (c) 2023.
 * File Name: App.tsx
 * Author: Coderthemes
 */
import { useEffect } from "react";
import { StyledEngineProvider, ThemeProvider } from "@mui/material";

import Router from "@src/routes/Router";
import { createTheme } from "@src/theme";
import { useLayoutContext } from "@src/states";
import { configureFakeBackend } from "@src/common/fake-backend";
const App = () => {
  const { settings } = useLayoutContext();
  useEffect(() => {
    configureFakeBackend();
  }, []);

  return (
    <>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={createTheme(settings.theme)}>
          <Router />
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  );
};

export default App;
