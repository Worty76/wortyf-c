import React from "react";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { render } from "react-dom";
import theme from "./theme";
import { SnackbarProvider } from "notistack";
import ChatProvider from "./context/ChatProvider";
import { SocketProvider } from "./context/SocketProvider";

const root = document.getElementById("root");
render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <BrowserRouter>
          <ChatProvider>
            <SocketProvider>
              <App />
            </SocketProvider>
          </ChatProvider>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>,
  root
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
