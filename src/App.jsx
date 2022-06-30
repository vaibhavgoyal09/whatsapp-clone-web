import { Routes, Route } from "react-router-dom";
import SignInScreen from "./pages/SignInScreen";
import MainScreen from "./pages/MainScreen";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
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
    </Routes>
  );
};

export default App;
