import { Routes, Route } from "react-router-dom";
import SendOtp from "./pages/SendOtp";
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
      <Route path="/auth" element={<SendOtp />} />
    </Routes>
  );
};

export default App;
