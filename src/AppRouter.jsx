import { Routes, Route } from "react-router-dom";
import SignInScreen from "./pages/SignInScreen";
import MainScreen from "./pages/MainScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import SetupProfileScreen from "./pages/SetupProfileScreen";

const AppRouter = () => {
  return (
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
      <Route path="/setup-profile" element={<SetupProfileScreen/>}/>
    </Routes>
  );
};

export default AppRouter;