import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./AppRouter";
import './css/index.css';
import { BrowserRouter } from "react-router-dom";
import AuthContextProvider from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuthContextProvider>
  </React.StrictMode>
);
