import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth()!;
  const location = useLocation();

  if (auth.isUserLoggedIn) {
    return location.pathname === "/auth" ? <Navigate to="/" /> : children;
  } else {
    return location.pathname === "/auth" ? children : <Navigate to="/auth" />;
  }
};

export default ProtectedRoute;
