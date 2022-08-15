import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AxiosInstanceProvider from "./context/AxiosContext";
import WhatsAppWebSocketContextProvider from "./context/WhatsAppWebSocketContext";
import MainScreen from "./pages/MainScreen";
import SetupProfileScreen from "./pages/SetupProfileScreen";
import SignInScreen from "./pages/SignInScreen";
import StatusScreen from "./pages/StatusScreen";

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
          <Route
            path="/status"
            element={
              <ProtectedRoute>
                <StatusScreen />
              </ProtectedRoute>
            }
          />
        </Routes>
      </WhatsAppWebSocketContextProvider>
    </AxiosInstanceProvider>
  );
};
