import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AxiosInstanceProvider from "./context/AxiosContext";
import WhatsAppWebSocketContextProvider from "./context/WhatsAppWebSocketContext";
import MainScreen from "./pages/MainScreen";
import SetupProfileScreen from "./pages/SetupProfileScreen";
import SignInScreen from "./pages/SignInScreen";

export const AppRouter: React.FC = () => {
  return (
    <AxiosInstanceProvider>
      <WhatsAppWebSocketContextProvider>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/auth"
            element={
              <ProtectedRoute>
                <SignInScreen />
              </ProtectedRoute>
            }
          />
          <Route path="/setup-profile" element={<SetupProfileScreen />} />
        </Routes>
      </WhatsAppWebSocketContextProvider>
    </AxiosInstanceProvider>
  );
};
