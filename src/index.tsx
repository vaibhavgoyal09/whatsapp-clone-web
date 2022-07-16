import React from "react";
import { AppRouter } from "./AppRouter";
import "./css/index.css";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import AuthContextProvider from "./context/AuthContext";

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
