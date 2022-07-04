import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AxiosInstanceProvider from "./context/AxiosContext";
import MainScreen from "./pages/MainScreen";
import SetupProfileScreen from "./pages/SetupProfileScreen";
import SignInScreen from "./pages/SignInScreen";

const AppRouter = () => {
  return (
    <AxiosInstanceProvider>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainScreen />
            </ProtectedRoute>
          }
        />
        <Route path="/auth" element={<SignInScreen />} />
        <Route path="/setup-profile" element={<SetupProfileScreen />} />
      </Routes>
    </AxiosInstanceProvider>
  );
};

export default AppRouter;
